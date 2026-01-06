import { createStripeIntent } from "@/lib/integrations/stripe";
import { stripeIntentRequestSchema } from "@/lib/api/validation";
import { apiError, apiSuccess, getApiContext, handleApiException, parseBody } from "@/lib/api/response";

function toMinorUnits(amount: number) {
  return Math.round(amount * 100);
}

export async function POST(request: Request) {
  const context = getApiContext(request);

  try {
    const parsed = await parseBody(request, stripeIntentRequestSchema, context);
    if (!parsed.ok) {
      return parsed.response;
    }

    if (parsed.data.currency !== "USD") {
      return apiError(context, 400, "INVALID_CURRENCY", "Stripe intents currently support USD only.");
    }

    const headerIdempotency = request.headers.get("x-idempotency-key") || undefined;
    const idempotencyKey = parsed.data.idempotencyKey || headerIdempotency;

    const metadata =
      parsed.data.meta &&
      Object.fromEntries(Object.entries(parsed.data.meta).map(([key, value]) => [key, String(value)]));

    const intent = await createStripeIntent({
      amountMinor: toMinorUnits(parsed.data.amount),
      currency: parsed.data.currency,
      receiptEmail: parsed.data.receiptEmail,
      metadata,
      idempotencyKey,
    });

    return apiSuccess(context, {
      gateway: "stripe",
      ...intent,
      idempotencyKey: idempotencyKey || null,
    });
  } catch (error) {
    return handleApiException(error, context);
  }
}
