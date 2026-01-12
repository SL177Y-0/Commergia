import { env } from "@/lib/env";
import { revalidatePaths, getShopifyRevalidationPaths } from "@/lib/api/revalidation";
import { verifyShopifyWebhookSignature } from "@/lib/api/signature";
import { apiError, apiSuccess, getApiContext, handleApiException } from "@/lib/api/response";

export async function POST(request: Request) {
  const context = getApiContext(request);

  try {
    const topic = request.headers.get("x-shopify-topic");
    const signature = request.headers.get("x-shopify-hmac-sha256");
    const body = await request.text();

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
    const paths = getShopifyRevalidationPaths(topic, payload);
    const revalidated = revalidatePaths(paths);

    return apiSuccess(context, {
      provider: "shopify",
      topic,
      received: true,
      revalidated,
    });
  } catch (error) {
    return handleApiException(error, context);
  }
}
