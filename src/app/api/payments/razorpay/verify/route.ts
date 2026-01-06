import { env } from "@/lib/env";
import { verifyRazorpayPaymentSignature } from "@/lib/integrations/razorpay";
import { razorpayVerifySchema } from "@/lib/api/validation";
import { apiError, apiSuccess, getApiContext, handleApiException, parseBody } from "@/lib/api/response";

export async function POST(request: Request) {
  const context = getApiContext(request);

  try {
    const parsed = await parseBody(request, razorpayVerifySchema, context);
    if (!parsed.ok) {
      return parsed.response;
    }

    if (!env.RAZORPAY_KEY_SECRET) {
      return apiError(
        context,
        503,
        "PAYMENT_NOT_CONFIGURED",
        "Razorpay verification is not configured. Set RAZORPAY_KEY_SECRET."
      );
    }

    const verified = verifyRazorpayPaymentSignature({
      paymentId: parsed.data.razorpayPaymentId,
      orderId: parsed.data.razorpayOrderId,
      signature: parsed.data.razorpaySignature,
    });

    if (!verified) {
      return apiError(context, 400, "INVALID_SIGNATURE", "Razorpay signature verification failed.");
    }

    return apiSuccess(context, {
      verified: true,
      orderId: parsed.data.razorpayOrderId,
      paymentId: parsed.data.razorpayPaymentId,
    });
  } catch (error) {
    return handleApiException(error, context);
  }
}
