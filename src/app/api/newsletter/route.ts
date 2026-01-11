import { env } from "@/lib/env";
import { logInfo } from "@/lib/logger";
import { getResendClient } from "@/lib/integrations/resend";
import { newsletterRequestSchema } from "@/lib/api/validation";
import { apiSuccess, getApiContext, handleApiException, parseBody } from "@/lib/api/response";

export async function POST(request: Request) {
  const context = getApiContext(request);

  try {
    const parsed = await parseBody(request, newsletterRequestSchema, context);
    if (!parsed.ok) {
      return parsed.response;
    }

    const resend = getResendClient();
    if (resend) {
      await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: parsed.data.email,
        subject: "Welcome to Commergia newsletter",
        text: "You are now subscribed to Commergia updates, product drops, and promotions.",
      });
    }

    logInfo("Newsletter subscription accepted", {
      correlationId: context.correlationId,
      email: parsed.data.email,
      provider: resend ? "resend" : "none",
    });

    return apiSuccess(context, {
      subscribed: true,
      email: parsed.data.email,
      provider: resend ? "resend" : "local",
    });
  } catch (error) {
    return handleApiException(error, context);
  }
}
