import { revalidatePath } from "next/cache";
import { z } from "zod";
import { env } from "@/lib/env";
import { apiError, apiSuccess, getApiContext, handleApiException, parseBody } from "@/lib/api/response";

const revalidateRequestSchema = z.object({
  path: z.string().min(1).default("/"),
  secret: z.string().optional(),
});

export async function POST(request: Request) {
  const context = getApiContext(request);

  try {
    const requestUrl = new URL(request.url);
    const querySecret = requestUrl.searchParams.get("secret");
    const queryPath = requestUrl.searchParams.get("path");

    let bodySecret: string | undefined;
    let bodyPath: string | undefined;

    if (request.headers.get("content-type")?.includes("application/json")) {
      const parsed = await parseBody(request, revalidateRequestSchema, context);
      if (!parsed.ok) {
        return parsed.response;
      }
      bodySecret = parsed.data.secret;
      bodyPath = parsed.data.path;
    }

    const secret = querySecret || bodySecret;
    const path = queryPath || bodyPath || "/";

    if (!env.REVALIDATION_SECRET || secret !== env.REVALIDATION_SECRET) {
      return apiError(context, 401, "UNAUTHORIZED", "Invalid revalidation secret.");
    }

    revalidatePath(path);
    return apiSuccess(context, { revalidated: true, path });
  } catch (error) {
    return handleApiException(error, context);
  }
}
