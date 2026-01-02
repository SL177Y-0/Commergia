import { env } from "@/lib/env";
import { logInfo } from "@/lib/logger";
import { getResendClient } from "@/lib/integrations/resend";
import { emailRequestSchema } from "@/lib/api/validation";
import { apiError, apiSuccess, getApiContext, handleApiException, parseBody } from "@/lib/api/response";

export async function POST(request: Request) {
  const context = getApiContext(request);

  try {
    const parsed = await parseBody(request, emailRequestSchema, context);
    if (!parsed.ok) {
      return parsed.response;
    }

    const resend = getResendClient();
    if (!resend) {
      return apiError(
        context,
        503,
        "EMAIL_PROVIDER_NOT_CONFIGURED",
        "Transactional email is not configured. Set RESEND_API_KEY."
      );
    }

    const to = Array.isArray(parsed.data.to) ? parsed.data.to : [parsed.data.to];

    if (!parsed.data.html && !parsed.data.text) {
      return apiError(context, 400, "VALIDATION_ERROR", "Either html or text content is required.");
    }

    const fallbackText = parsed.data.html?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() || "";

    const emailPayload = {
      from: env.RESEND_FROM_EMAIL,
      to,
      subject: parsed.data.subject,
      text: parsed.data.text || fallbackText,
    };

    if (parsed.data.html) {
      Object.assign(emailPayload, { html: parsed.data.html });
    }

    if (parsed.data.replyTo) {
      Object.assign(emailPayload, { replyTo: parsed.data.replyTo });
    }

    const result = await resend.emails.send(emailPayload);

    logInfo("Transactional email queued", {
      correlationId: context.correlationId,
      to,
      emailId: result.data?.id,
    });

    return apiSuccess(context, {
      queued: true,
      provider: "resend",
      id: result.data?.id || null,
      to,
    });
  } catch (error) {
    return handleApiException(error, context);
  }
}
