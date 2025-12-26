import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SHOPIFY_STORE_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN: z.string().optional(),
  NEXT_PUBLIC_WORDPRESS_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_CONTACT_MAP_EMBED_URL: z.string().url().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  SHOPIFY_WEBHOOK_SECRET: z.string().optional(),
  WORDPRESS_WEBHOOK_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().optional(),
  CONTACT_TO_EMAIL: z.string().optional(),
  NEWSLETTER_SIGNUP_SECRET: z.string().optional(),
  SHIPROCKET_EMAIL: z.string().optional(),
  SHIPROCKET_PASSWORD: z.string().optional(),
  REVALIDATION_SECRET: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.warn("Invalid environment configuration", parsedEnv.error.flatten().fieldErrors);
}

const envValues = {
  NEXT_PUBLIC_SHOPIFY_STORE_API_URL: process.env.NEXT_PUBLIC_SHOPIFY_STORE_API_URL || "",
  NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "",
  NEXT_PUBLIC_WORDPRESS_API_URL: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "",
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://commergia.sl177y.com",
  NEXT_PUBLIC_CONTACT_MAP_EMBED_URL: process.env.NEXT_PUBLIC_CONTACT_MAP_EMBED_URL || "",
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
  NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "",
  SHOPIFY_WEBHOOK_SECRET: process.env.SHOPIFY_WEBHOOK_SECRET || "",
  WORDPRESS_WEBHOOK_SECRET: process.env.WORDPRESS_WEBHOOK_SECRET || "",
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || "Commergia <onboarding@resend.dev>",
  CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL || "",
  NEWSLETTER_SIGNUP_SECRET: process.env.NEWSLETTER_SIGNUP_SECRET || "",
  SHIPROCKET_EMAIL: process.env.SHIPROCKET_EMAIL || "",
  SHIPROCKET_PASSWORD: process.env.SHIPROCKET_PASSWORD || "",
  REVALIDATION_SECRET: process.env.REVALIDATION_SECRET || "",
} as const;

type EnvKey = keyof typeof envValues;

export const env = envValues;

export function hasEnv(key: EnvKey) {
  return Boolean(envValues[key]);
}

export function requireEnv(key: EnvKey) {
  const value = envValues[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}
