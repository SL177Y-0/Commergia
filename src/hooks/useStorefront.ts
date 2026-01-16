import { QueryKey, useMutation, useQuery } from "@tanstack/react-query";
import { RequestDocument } from "graphql-request";
import { requestStorefront } from "@/lib/storefront/request";

interface QueryVariables {
  query: RequestDocument;
  variables?: Record<string, unknown>;
  enabled?: boolean;
}

interface MutationVariables {
  query: RequestDocument;
  variables: Record<string, unknown>;
}

export function useStorefrontQuery<TData = unknown>(
  queryKey: QueryKey,
  { query, variables, enabled = true, ...options }: QueryVariables
) {
  return useQuery({
    queryKey,
    queryFn: async () => requestStorefront<TData>(query, variables),
    enabled,
    ...options,
  });
}

export function useStorefrontMutation<
  TData = unknown,
  TVariables extends MutationVariables = MutationVariables
>() {
  const mutation = useMutation<TData, Error, TVariables>({
    mutationFn: async ({ query, variables }) => requestStorefront<TData>(query, variables),
  });

  return {
    mutate: mutation.mutateAsync,
    mutateSync: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
    data: mutation.data,
  };
}
