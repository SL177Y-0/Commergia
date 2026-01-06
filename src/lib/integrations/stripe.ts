import Stripe from "stripe";
import { env } from "@/lib/env";

let stripeClient: Stripe | null = null;

function getStripeClient() {
  if (!env.STRIPE_SECRET_KEY) {
    return null;
  }

  if (!stripeClient) {
    stripeClient = new Stripe(env.STRIPE_SECRET_KEY);
  }

  return stripeClient;
}

type CreateStripeIntentInput = {
  amountMinor: number;
  currency: string;
  receiptEmail?: string;
  metadata?: Record<string, string>;
  idempotencyKey?: string;
};

export async function createStripeIntent(input: CreateStripeIntentInput) {
  const stripe = getStripeClient();

  if (!stripe) {
    const suffix = Date.now();
    return {
      mock: true,
      id: `pi_mock_${suffix}`,
      clientSecret: `pi_mock_secret_${suffix}`,
      status: "requires_payment_method",
      amount: input.amountMinor,
      currency: input.currency.toLowerCase(),
    };
  }

  const intent = await stripe.paymentIntents.create(
    {
      amount: input.amountMinor,
      currency: input.currency.toLowerCase(),
      receipt_email: input.receiptEmail,
      metadata: input.metadata,
      automatic_payment_methods: { enabled: true },
    },
    input.idempotencyKey ? { idempotencyKey: input.idempotencyKey } : undefined
  );

  return {
    mock: false,
    id: intent.id,
    clientSecret: intent.client_secret || "",
    status: intent.status,
    amount: intent.amount,
    currency: intent.currency,
  };
}

export function constructStripeWebhookEvent(payload: string, signature: string) {
  const stripe = getStripeClient();
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
    return null;
  }

  return stripe.webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET);
}
