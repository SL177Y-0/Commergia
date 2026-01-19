import { describe, expect, it } from "vitest";
import { hmacSha256, verifyShopifyWebhookSignature, verifyWordPressWebhookSignature } from "@/lib/api/signature";

describe("signature helpers", () => {
  it("verifies shopify base64 signatures", () => {
    const payload = JSON.stringify({ id: 1, handle: "shirt" });
    const secret = "shopify-secret";
    const signature = hmacSha256(payload, secret, "base64");

    expect(verifyShopifyWebhookSignature(payload, signature, secret)).toBe(true);
    expect(verifyShopifyWebhookSignature(payload, "invalid", secret)).toBe(false);
  });

  it("verifies wordpress hex signatures", () => {
    const payload = JSON.stringify({ slug: "launching-commergia" });
    const secret = "wordpress-secret";
    const signature = hmacSha256(payload, secret, "hex");

    expect(verifyWordPressWebhookSignature(payload, signature, secret)).toBe(true);
    expect(verifyWordPressWebhookSignature(payload, `sha256=${signature}`, secret)).toBe(true);
  });
});
