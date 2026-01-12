import { env } from "@/lib/env";
import { getWordPressRevalidationPaths, revalidatePaths } from "@/lib/api/revalidation";
import { verifyWordPressWebhookSignature } from "@/lib/api/signature";
import { apiError, apiSuccess, getApiContext, handleApiException } from "@/lib/api/response";

export async function POST(request: Request) {
  const context = getApiContext(request);

  try {
    const signature = request.headers.get("x-wordpress-signature");
    const body = await request.text();

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
  } catch (error) {
    return handleApiException(error, context);
  }
}
