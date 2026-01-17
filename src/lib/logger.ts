type LogLevel = "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

function write(level: LogLevel, message: string, context?: LogContext) {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(context || {}),
  };

  const serialized = JSON.stringify(payload);
  if (level === "error") {
    console.error(serialized);
    return;
  }

  if (level === "warn") {
    console.warn(serialized);
    return;
  }

  console.info(serialized);
}

export function logInfo(message: string, context?: LogContext) {
  write("info", message, context);
}

export function logWarn(message: string, context?: LogContext) {
  write("warn", message, context);
}

export function logError(message: string, error?: unknown, context?: LogContext) {
  write("error", message, {
    error: error instanceof Error ? error.message : error,
    ...(context || {}),
  });
}
