/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestDocument } from "graphql-request";
import { requestStorefront } from "@/lib/storefront/request";

export const fetchGraphQL = async <T = any>(
  query: RequestDocument,
  variables?: Record<string, any>
): Promise<T> => {
  try {
    return await requestStorefront<T>(query, variables);
  } catch (error) {
    console.error("GraphQL Request Error:", error);
    throw error;
  }
};
