import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { ZodError, ZodType } from "zod";
import { logError } from "@/lib/logger";

export type ApiContext = {
  correlationId: string;
};

export function getApiContext(request: Request): ApiContext {
  const headerCorrelationId = request.headers.get("x-correlation-id");
  return {
    correlationId: headerCorrelationId || randomUUID(),
  };
}

export function apiSuccess<TData>(context: ApiContext, data: TData, status = 200) {
  return NextResponse.json(
    {
      ok: true,
      correlationId: context.correlationId,
      data,
    },
    {
      status,
      headers: {
        "x-correlation-id": context.correlationId,
      },
    }
  );
}

export function apiError(
  context: ApiContext,
  status: number,
  code: string,
  message: string,
  details?: unknown
) {
  return NextResponse.json(
    {
      ok: false,
      correlationId: context.correlationId,
      error: {
        code,
        message,
        details,
      },
    },
    {
      status,
      headers: {
        "x-correlation-id": context.correlationId,
      },
    }
  );
}

type ParseResult<TData> =
  | {
      ok: true;
      data: TData;
    }
  | {
      ok: false;
      response: NextResponse;
    };

export async function parseBody<TData>(
  request: Request,
  schema: ZodType<TData>,
  context: ApiContext
): Promise<ParseResult<TData>> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return {
      ok: false,
      response: apiError(context, 400, "INVALID_JSON", "Request body must be valid JSON"),
    };
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      response: apiError(context, 400, "VALIDATION_ERROR", "Invalid request payload", parsed.error.flatten()),
    };
  }

  return {
    ok: true,
    data: parsed.data,
  };
}

export function handleApiException(error: unknown, context: ApiContext, fallbackMessage = "Internal server error") {
  if (error instanceof ZodError) {
    return apiError(context, 400, "VALIDATION_ERROR", "Invalid request payload", error.flatten());
  }

  logError("API route failed", error, { correlationId: context.correlationId });

  return apiError(
    context,
    500,
    "INTERNAL_SERVER_ERROR",
    error instanceof Error ? error.message : fallbackMessage
  );
}
