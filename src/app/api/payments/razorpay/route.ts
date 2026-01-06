import { createRazorpayOrder } from "@/lib/integrations/razorpay";
import { razorpayOrderRequestSchema } from "@/lib/api/validation";
import { apiError, apiSuccess, getApiContext, handleApiException, parseBody } from "@/lib/api/response";

function toMinorUnits(amount: number) {
  return Math.round(amount * 100);
}

export async function POST(request: Request) {
  const context = getApiContext(request);

  try {
    const parsed = await parseBody(request, razorpayOrderRequestSchema, context);
    if (!parsed.ok) {
      return parsed.response;
    }

    if (parsed.data.currency !== "INR") {
      return apiError(context, 400, "INVALID_CURRENCY", "Razorpay orders currently support INR only.");
    }

    const idempotencyKey = parsed.data.idempotencyKey || request.headers.get("x-idempotency-key") || undefined;
    const notes = {
      ...(parsed.data.meta
        ? Object.fromEntries(Object.entries(parsed.data.meta).map(([key, value]) => [key, String(value)]))
        : {}),
      ...(idempotencyKey ? { idempotencyKey } : {}),
    };

    const order = await createRazorpayOrder({
      amountMinor: toMinorUnits(parsed.data.amount),
      currency: "INR",
      receipt: parsed.data.receipt,
      notes,
    });

    return apiSuccess(context, {
      gateway: "razorpay",
      ...order,
      idempotencyKey: idempotencyKey || null,
    });
  } catch (error) {
    return handleApiException(error, context);
  }
}
