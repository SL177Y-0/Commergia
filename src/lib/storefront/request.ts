import { DocumentNode, print } from "graphql";
import { GraphQLClient, RequestDocument } from "graphql-request";
import { mockStorefrontRequest, isMockStorefrontEnabled } from "@/lib/mocks/storefront";

const endpoint = process.env.NEXT_PUBLIC_SHOPIFY_STORE_API_URL || "";
const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";

const client = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": accessToken,
  },
});

function toQueryText(query: RequestDocument) {
  if (typeof query === "string") return query;
  return print(query as DocumentNode);
}

export async function requestStorefront<T>(
  query: RequestDocument,
  variables?: Record<string, unknown>
): Promise<T> {
  if (isMockStorefrontEnabled()) {
    return mockStorefrontRequest<T>(toQueryText(query), variables);
  }

  if (!endpoint || !accessToken) {
    throw new Error("Shopify Storefront API environment variables are missing");
  }

  return client.request<T>(query, variables);
}
