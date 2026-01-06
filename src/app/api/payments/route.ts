import { createRazorpayOrder } from "@/lib/integrations/razorpay";
import { createStripeIntent } from "@/lib/integrations/stripe";
import { paymentRequestSchema } from "@/lib/api/validation";
import { apiSuccess, getApiContext, handleApiException, parseBody } from "@/lib/api/response";

function toMinorUnits(amount: number) {
  return Math.round(amount * 100);
}

export async function POST(request: Request) {
  const context = getApiContext(request);

  try {
    const parsed = await parseBody(request, paymentRequestSchema, context);
    if (!parsed.ok) {
      return parsed.response;
    }

    const idempotencyKey = parsed.data.idempotencyKey || request.headers.get("x-idempotency-key") || undefined;
    const metadata =
      parsed.data.meta &&
      Object.fromEntries(Object.entries(parsed.data.meta).map(([key, value]) => [key, String(value)]));

    if (parsed.data.currency === "INR") {
      const order = await createRazorpayOrder({
        amountMinor: toMinorUnits(parsed.data.amount),
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
        notes: {
          ...(metadata || {}),
          ...(idempotencyKey ? { idempotencyKey } : {}),
        },
      });

      return apiSuccess(context, {
        gateway: "razorpay",
        ...order,
        idempotencyKey: idempotencyKey || null,
      });
    }

    const intent = await createStripeIntent({
      amountMinor: toMinorUnits(parsed.data.amount),
      currency: parsed.data.currency,
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
