"use client";

import Link from "next/link";
import ProductCard from "@/components/view/ProductCard";
import { useWishlist } from "@/hooks/useWishlist";
import { useStorefrontQuery } from "@/hooks/useStorefront";
import { SEARCH_PRODUCTS_QUERY } from "@/graphql/search";
import { Product } from "@/types/shopify-graphql";

type SearchProductsResponse = {
  products: {
    edges: Array<{ node: Product }>;
  };
};

export default function AccountWishlistPage() {
  const { wishlist } = useWishlist();

  const queryString = wishlist.length
    ? wishlist.map((handle) => `handle:${handle}`).join(" OR ")
    : "";

  const products = useStorefrontQuery<SearchProductsResponse>(["wishlist-products", queryString], {
    query: SEARCH_PRODUCTS_QUERY,
    variables: {
      query: queryString,
      first: 30,
      sortKey: "RELEVANCE",
      reverse: false,
    },
    enabled: Boolean(queryString),
  });

  return (
    <div className="my-8 space-y-5">
      <h1 className="text-2xl font-semibold">Wishlist</h1>

      {!wishlist.length ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <p className="text-sm text-gray-600">There are no wishlist items.</p>
          <Link className="mt-4 inline-flex rounded-md bg-gray-900 px-4 py-2 text-sm text-white" href="/collections/men">
            Browse products
          </Link>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.data?.products.edges.map((edge) => (
          <ProductCard key={edge.node.id} product={edge.node} />
        ))}
      </div>
    </div>
  );
}
