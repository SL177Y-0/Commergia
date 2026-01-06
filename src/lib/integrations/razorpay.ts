import Razorpay from "razorpay";
import { hmacSha256, safeCompare } from "@/lib/api/signature";
import { env } from "@/lib/env";

let razorpayClient: Razorpay | null = null;

function getRazorpayClient() {
  if (!env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    return null;
  }

  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    });
  }

  return razorpayClient;
}

type CreateRazorpayOrderInput = {
  amountMinor: number;
  currency: "INR" | "USD";
  receipt?: string;
  notes?: Record<string, string>;
};

export async function createRazorpayOrder(input: CreateRazorpayOrderInput) {
  const client = getRazorpayClient();
  if (!client) {
    const suffix = Date.now();
    return {
      mock: true,
      id: `order_mock_${suffix}`,
      amount: input.amountMinor,
      currency: input.currency,
      receipt: input.receipt || `rcpt_${suffix}`,
      keyId: env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
    };
  }

  const order = await client.orders.create({
    amount: input.amountMinor,
    currency: input.currency,
    receipt: input.receipt,
    notes: input.notes,
  });

  return {
    mock: false,
    id: order.id,
    amount: order.amount,
    currency: order.currency,
    receipt: order.receipt,
    keyId: env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  };
}

export function verifyRazorpayPaymentSignature(input: {
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  if (!env.RAZORPAY_KEY_SECRET) {
    return false;
  }

  const payload = `${input.orderId}|${input.paymentId}`;
  const expected = hmacSha256(payload, env.RAZORPAY_KEY_SECRET, "hex");
  return safeCompare(expected, input.signature);
}
