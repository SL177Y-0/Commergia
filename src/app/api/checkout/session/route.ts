import { cookies } from "next/headers";
import { z } from "zod";
import { apiSuccess, getApiContext, handleApiException, parseBody } from "@/lib/api/response";

const checkoutSessionSchema = z.object({
  information: z.record(z.string(), z.string()).optional(),
  shippingMethod: z.string().optional(),
  currency: z.enum(["USD", "INR"]).optional(),
});

const CHECKOUT_SESSION_COOKIE = "checkout_session";

function parseSessionCookie(raw: string | undefined) {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as z.infer<typeof checkoutSessionSchema>;
  } catch {
    return {};
  }
}

export async function GET(request: Request) {
  const context = getApiContext(request);

  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(CHECKOUT_SESSION_COOKIE)?.value;
    return apiSuccess(context, {
      session: parseSessionCookie(raw),
    });
  } catch (error) {
    return handleApiException(error, context);
  }
}

export async function POST(request: Request) {
  const context = getApiContext(request);

  try {
    const parsed = await parseBody(request, checkoutSessionSchema, context);
    if (!parsed.ok) {
      return parsed.response;
    }

    const cookieStore = await cookies();
    const current = parseSessionCookie(cookieStore.get(CHECKOUT_SESSION_COOKIE)?.value);
    const next = {
      ...current,
      ...parsed.data,
      information: {
        ...(current.information || {}),
        ...(parsed.data.information || {}),
      },
    };

    cookieStore.set(CHECKOUT_SESSION_COOKIE, JSON.stringify(next), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return apiSuccess(context, { persisted: true, session: next });
  } catch (error) {
    return handleApiException(error, context);
  }
}
