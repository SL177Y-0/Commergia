import { CodegenConfig } from "@graphql-codegen/cli";
import "dotenv/config";

const schemaEndpoint =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_API_URL ||
  (process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
    ? `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2025-01/graphql.json`
    : "");

if (!schemaEndpoint) {
  throw new Error(
    "Codegen requires NEXT_PUBLIC_SHOPIFY_STORE_API_URL or NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN in environment."
  );
}

const config: CodegenConfig = {
  schema: [
    {
      [schemaEndpoint]: {
        headers: {
          "X-Shopify-Storefront-Access-Token":
            process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
          "Content-Type": "application/json",
        },
      },
    },
  ],
  documents: ["src/**/*.{ts,tsx}"],
  generates: {
    "./src/types/shopify-graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-query",
      ],
      config: {
        fetcher: {
          endpoint: schemaEndpoint,
          fetchParams: {
            headers: {
              "X-Shopify-Storefront-Access-Token":
                process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
            },
          },
        },
      },
    },
  },
};

export default config;
