import { env } from "@/lib/env";
import { logInfo } from "@/lib/logger";
import { getResendClient } from "@/lib/integrations/resend";
import { contactRequestSchema } from "@/lib/api/validation";
import { apiError, apiSuccess, getApiContext, handleApiException, parseBody } from "@/lib/api/response";

export async function POST(request: Request) {
  const context = getApiContext(request);

  try {
    const parsed = await parseBody(request, contactRequestSchema, context);
    if (!parsed.ok) {
      return parsed.response;
    }

    const resend = getResendClient();
    if (!resend) {
      return apiError(
        context,
        503,
        "EMAIL_PROVIDER_NOT_CONFIGURED",
        "Contact delivery is not configured. Set RESEND_API_KEY."
      );
    }

    const to = env.CONTACT_TO_EMAIL || parsed.data.email;

    const result = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to,
      subject: `[Contact] ${parsed.data.subject}`,
      replyTo: parsed.data.email,
      text: `${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`,
      html: `
        <p><strong>Name:</strong> ${parsed.data.name}</p>
        <p><strong>Email:</strong> ${parsed.data.email}</p>
        <p><strong>Subject:</strong> ${parsed.data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${parsed.data.message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    logInfo("Contact email queued", {
      correlationId: context.correlationId,
      emailId: result.data?.id,
      to,
    });

    return apiSuccess(context, {
      accepted: true,
      provider: "resend",
      id: result.data?.id || null,
    });
  } catch (error) {
    return handleApiException(error, context);
  }
}
