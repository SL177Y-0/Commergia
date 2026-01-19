import { describe, expect, it } from "vitest";
import {
  paymentRequestSchema,
  contactRequestSchema,
  shippingRatesRequestSchema,
  razorpayVerifySchema,
} from "@/lib/api/validation";

describe("API validation schemas", () => {
  it("validates payment payload", () => {
    const parsed = paymentRequestSchema.parse({
      amount: "25.5",
      currency: "USD",
      meta: { source: "checkout" },
    });

    expect(parsed.amount).toBe(25.5);
    expect(parsed.currency).toBe("USD");
  });

  it("rejects invalid contact payload", () => {
    const result = contactRequestSchema.safeParse({
      name: "A",
      email: "invalid",
      subject: "",
      message: "hi",
    });

    expect(result.success).toBe(false);
  });

  it("normalizes shipping payload with defaults", () => {
    const parsed = shippingRatesRequestSchema.parse({
      destinationZip: "94105",
    });

    expect(parsed.originZip).toBe("10001");
    expect(parsed.weight).toBe(1);
    expect(parsed.cod).toBe(false);
  });

  it("requires razorpay signature payload values", () => {
    const result = razorpayVerifySchema.safeParse({
      razorpayPaymentId: "",
      razorpayOrderId: "",
      razorpaySignature: "",
    });

    expect(result.success).toBe(false);
  });
});
