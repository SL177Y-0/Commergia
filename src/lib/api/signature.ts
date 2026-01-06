import { createHmac, timingSafeEqual } from "node:crypto";

export function hmacSha256(input: string, secret: string, encoding: "hex" | "base64" = "hex") {
  return createHmac("sha256", secret).update(input).digest(encoding);
}

export function safeCompare(actual: string, expected: string) {
  const left = Buffer.from(actual);
  const right = Buffer.from(expected);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

export function verifyShopifyWebhookSignature(payload: string, signature: string, secret: string) {
  const expected = hmacSha256(payload, secret, "base64");
  return safeCompare(signature, expected);
}

export function verifyWordPressWebhookSignature(payload: string, signature: string, secret: string) {
  const normalizedSignature = signature.replace(/^sha256=/, "");
  const expected = hmacSha256(payload, secret, "hex");
  return safeCompare(normalizedSignature, expected);
}
