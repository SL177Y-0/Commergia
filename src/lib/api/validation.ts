import { z } from "zod";

export function validateJsonBody<T>(payload: unknown, schema: z.ZodType<T>): T {
  return schema.parse(payload);
}

export const paymentRequestSchema = z.object({
  amount: z.coerce.number().positive(),
  currency: z.enum(["USD", "INR"]),
  meta: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  idempotencyKey: z.string().min(8).max(128).optional(),
});

export const contactRequestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(5),
});

export const newsletterRequestSchema = z.object({
  email: z.string().email(),
});

export const emailRequestSchema = z.object({
  to: z.union([z.string().email(), z.array(z.string().email()).min(1)]),
  subject: z.string().min(1),
  html: z.string().min(1).optional(),
  text: z.string().min(1).optional(),
  replyTo: z.string().email().optional(),
});

export const stripeIntentRequestSchema = paymentRequestSchema.extend({
  receiptEmail: z.string().email().optional(),
});

export const razorpayOrderRequestSchema = paymentRequestSchema.extend({
  receipt: z.string().max(40).optional(),
});

export const razorpayVerifySchema = z.object({
  razorpayPaymentId: z.string().min(1),
  razorpayOrderId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

export const shippingRatesRequestSchema = z.object({
  originZip: z.string().min(3).default("10001"),
  destinationZip: z.string().min(3).optional(),
  destination: z.string().min(2).optional(),
  weight: z.coerce.number().positive().default(1),
  cod: z.boolean().default(false),
});
