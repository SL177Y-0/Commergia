"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/commerce/SearchBar";
import ProductCard from "@/components/view/ProductCard";
import { useStorefrontQuery } from "@/hooks/useStorefront";
import { SEARCH_PRODUCTS_QUERY } from "@/graphql/search";
import { Product } from "@/types/shopify-graphql";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SearchProductsResponse = {
  products: {
    edges: Array<{ node: Product }>;
  };
};

type SortType = "RELEVANCE" | "PRICE" | "CREATED_AT";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").trim();

  const [sortKey, setSortKey] = useState<SortType>("RELEVANCE");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [collectionFilter, setCollectionFilter] = useState("");

  const searchQuery = useMemo(() => {
    if (!query) return "";
    return `title:*${query}* OR product_type:*${query}* OR tag:*${query}*`;
  }, [query]);

  const results = useStorefrontQuery<SearchProductsResponse>(["search", query, sortKey], {
    query: SEARCH_PRODUCTS_QUERY,
    variables: {
      query: searchQuery,
      first: 24,
      sortKey,
      reverse: sortKey !== "RELEVANCE",
    },
    enabled: Boolean(query),
  });

  const filteredResults = useMemo(() => {
    const products = results.data?.products.edges || [];

    return products.filter(({ node }) => {
      const price = Number(node.priceRange.minVariantPrice.amount);
      const min = minPrice ? Number(minPrice) : null;
      const max = maxPrice ? Number(maxPrice) : null;

      if (min !== null && price < min) return false;
      if (max !== null && price > max) return false;

      if (inStockOnly) {
        const firstVariant = node.variants?.edges?.[0]?.node;
        if (!firstVariant?.availableForSale) return false;
      }

      if (collectionFilter && node.productType !== collectionFilter) {
        return false;
      }

      return true;
    });
  }, [results.data, minPrice, maxPrice, inStockOnly, collectionFilter]);

  const availableCollections = useMemo(() => {
    const values = new Set<string>();
    (results.data?.products.edges || []).forEach(({ node }) => {
      if (node.productType) {
        values.add(node.productType);
      }
    });
    return Array.from(values).sort();
  }, [results.data]);

  return (
    <div className="my-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Search</h1>
        <p className="mt-1 text-sm text-gray-600">Find products across all collections.</p>
      </div>

      <SearchBar />

      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide">Filters</h2>

          <div className="mt-4 space-y-3 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(event) => setInStockOnly(event.target.checked)}
              />
              In stock only
            </label>

            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Min"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
              />
              <Input
                placeholder="Max"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
              />
            </div>

            {availableCollections.length ? (
              <label className="block">
                <span className="mb-1 block text-xs uppercase tracking-wide text-gray-500">Collection</span>
                <select
                  className="h-9 w-full rounded-md border border-gray-300 bg-white px-2 text-sm"
                  value={collectionFilter}
                  onChange={(event) => setCollectionFilter(event.target.value)}
                >
                  <option value="">All collections</option>
                  {availableCollections.map((collection) => (
                    <option key={collection} value={collection}>
                      {collection}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>
        </aside>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={sortKey === "RELEVANCE" ? "default" : "outline"}
              onClick={() => setSortKey("RELEVANCE")}
            >
              Relevance
            </Button>
            <Button
              size="sm"
              variant={sortKey === "PRICE" ? "default" : "outline"}
              onClick={() => setSortKey("PRICE")}
            >
              Price
            </Button>
            <Button
              size="sm"
              variant={sortKey === "CREATED_AT" ? "default" : "outline"}
              onClick={() => setSortKey("CREATED_AT")}
            >
              Newest
            </Button>
          </div>

          {!query ? <p className="text-sm text-gray-600">Enter a query to start searching.</p> : null}

          {query && filteredResults.length === 0 ? (
            <p className="text-sm text-gray-600">
              No products found for &quot;{query}&quot;.
            </p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredResults.map((edge) => (
              <ProductCard key={edge.node.id} product={edge.node} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
