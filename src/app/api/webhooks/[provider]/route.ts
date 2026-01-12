import { env } from "@/lib/env";
import { getWordPressRevalidationPaths, getShopifyRevalidationPaths, revalidatePaths } from "@/lib/api/revalidation";
import { verifyShopifyWebhookSignature, verifyWordPressWebhookSignature } from "@/lib/api/signature";
import { constructStripeWebhookEvent } from "@/lib/integrations/stripe";
import { apiError, apiSuccess, getApiContext, handleApiException } from "@/lib/api/response";

type ProviderParams = {
  params: Promise<{ provider: string }>;
};

export async function POST(request: Request, { params }: ProviderParams) {
  const context = getApiContext(request);

  try {
    const { provider } = await params;
    const normalizedProvider = provider.toLowerCase();
    const body = await request.text();

    if (normalizedProvider === "stripe") {
      const signature = request.headers.get("stripe-signature");
      if (!signature) {
        return apiError(context, 400, "MISSING_SIGNATURE", "stripe-signature header is required.");
      }
      let event = null;
      try {
        event = constructStripeWebhookEvent(body, signature);
      } catch {
        return apiError(context, 400, "INVALID_SIGNATURE", "Stripe webhook signature verification failed.");
      }
      if (!event) {
        return apiError(
          context,
          503,
          "WEBHOOK_NOT_CONFIGURED",
          "Stripe webhook verification is not configured. Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET."
        );
      }

      return apiSuccess(context, {
        provider: "stripe",
        eventType: event.type,
        eventId: event.id,
        revalidated: revalidatePaths(["/account/orders"]),
      });
    }

    if (normalizedProvider === "shopify") {
      const signature = request.headers.get("x-shopify-hmac-sha256");
      const topic = request.headers.get("x-shopify-topic");
      if (!env.SHOPIFY_WEBHOOK_SECRET) {
        return apiError(
          context,
          503,
          "WEBHOOK_NOT_CONFIGURED",
          "SHOPIFY_WEBHOOK_SECRET is required for webhook verification."
        );
      }
      if (!signature) {
        return apiError(context, 400, "MISSING_SIGNATURE", "x-shopify-hmac-sha256 header is required.");
      }
      const isValid = verifyShopifyWebhookSignature(body, signature, env.SHOPIFY_WEBHOOK_SECRET);
      if (!isValid) {
        return apiError(context, 401, "INVALID_SIGNATURE", "Shopify webhook signature verification failed.");
      }

      const payload = (JSON.parse(body || "{}") || {}) as Record<string, unknown>;
      const revalidated = revalidatePaths(getShopifyRevalidationPaths(topic, payload));

      return apiSuccess(context, {
        provider: "shopify",
        topic,
        received: true,
        revalidated,
      });
    }

    if (normalizedProvider === "wordpress") {
      const signature = request.headers.get("x-wordpress-signature");
      if (!env.WORDPRESS_WEBHOOK_SECRET) {
        return apiError(
          context,
          503,
          "WEBHOOK_NOT_CONFIGURED",
          "WORDPRESS_WEBHOOK_SECRET is required for webhook verification."
        );
      }
      if (!signature) {
        return apiError(context, 400, "MISSING_SIGNATURE", "x-wordpress-signature header is required.");
      }
      const isValid = verifyWordPressWebhookSignature(body, signature, env.WORDPRESS_WEBHOOK_SECRET);
      if (!isValid) {
        return apiError(context, 401, "INVALID_SIGNATURE", "WordPress webhook signature verification failed.");
      }

      const payload = (JSON.parse(body || "{}") || {}) as Record<string, unknown>;
      const revalidated = revalidatePaths(getWordPressRevalidationPaths(payload));
      return apiSuccess(context, {
        provider: "wordpress",
        received: true,
        revalidated,
      });
    }

    return apiError(context, 404, "UNSUPPORTED_PROVIDER", `Unsupported webhook provider: ${provider}`);
  } catch (error) {
    return handleApiException(error, context);
  }
}
