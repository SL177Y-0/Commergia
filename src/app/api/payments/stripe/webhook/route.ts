import { revalidatePaths } from "@/lib/api/revalidation";
import { constructStripeWebhookEvent } from "@/lib/integrations/stripe";
import { apiError, apiSuccess, getApiContext, handleApiException } from "@/lib/api/response";

export async function POST(request: Request) {
  const context = getApiContext(request);

  try {
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return apiError(context, 400, "MISSING_SIGNATURE", "stripe-signature header is required.");
    }

    const payload = await request.text();
    let event = null;
    try {
      event = constructStripeWebhookEvent(payload, signature);
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

    const revalidated = revalidatePaths(["/account/orders"]);

    return apiSuccess(context, {
      received: true,
      provider: "stripe",
      eventId: event.id,
      eventType: event.type,
      revalidated,
    });
  } catch (error) {
    return handleApiException(error, context);
  }
}
