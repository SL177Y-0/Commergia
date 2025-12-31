"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ProductCard from "@/components/view/ProductCard";
import ProductFilters, { CollectionFilterState } from "@/components/commerce/ProductFilters";
import { GET_COLLECTION_BY_HANDLE_WITH_PAGINATION_QUERY } from "@/graphql/collections";
import { useStorefrontQuery } from "@/hooks/useStorefront";
import { GetCollectionByHandleQuery, Product } from "@/types/shopify-graphql";

const initialFilters: CollectionFilterState = {
  inStockOnly: false,
  minPrice: "",
  maxPrice: "",
  color: "",
  size: "",
  sort: "BEST_SELLING",
  reverse: false,
  viewMode: "grid",
};

export default function CollectionPage() {
  const params = useParams();
  const handle = String(params.handle || "");

  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const [previousCursors, setPreviousCursors] = useState<string[]>([]);
  const [filters, setFilters] = useState<CollectionFilterState>(initialFilters);

  const graphqlFilters = useMemo(() => {
    const output: Array<Record<string, unknown>> = [];

    if (filters.inStockOnly) {
      output.push({ available: true });
    }

    if (filters.minPrice || filters.maxPrice) {
      output.push({
        price: {
          min: filters.minPrice ? Number(filters.minPrice) : undefined,
          max: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        },
      });
    }

    if (filters.color) {
      output.push({
        variantOption: {
          name: "Color",
          value: filters.color,
        },
      });
    }

    if (filters.size) {
      output.push({
        variantOption: {
          name: "Size",
          value: filters.size,
        },
      });
    }

    return output;
  }, [filters]);

  const query = useStorefrontQuery<GetCollectionByHandleQuery>(["collection", handle, currentCursor, filters], {
    query: GET_COLLECTION_BY_HANDLE_WITH_PAGINATION_QUERY,
    variables: {
      handle,
      first: 12,
      after: currentCursor,
      sortKey: filters.sort,
      reverse: filters.reverse,
      filters: graphqlFilters,
    },
  });

  const collection = query.data?.collection;
  const pageInfo = collection?.products?.pageInfo;
  const products = useMemo(() => collection?.products?.edges?.map((edge) => edge.node as Product) || [], [
    collection?.products?.edges,
  ]);

  const availableColors = useMemo(() => {
    const values = new Set<string>();
    products.forEach((product) => {
      product.options?.forEach((option) => {
        if (option.name.toLowerCase() !== "color") return;
        option.optionValues?.forEach((value) => {
          if (value.name) values.add(value.name);
        });
      });
    });
    return Array.from(values).sort();
  }, [products]);

  const availableSizes = useMemo(() => {
    const values = new Set<string>();
    products.forEach((product) => {
      product.options?.forEach((option) => {
        if (option.name.toLowerCase() !== "size") return;
        option.optionValues?.forEach((value) => {
          if (value.name) values.add(value.name);
        });
      });
    });
    return Array.from(values).sort();
  }, [products]);

  const handleNextPage = () => {
    if (!pageInfo?.hasNextPage || !pageInfo.endCursor) return;

    if (currentCursor) {
      setPreviousCursors((previous) => [...previous, currentCursor]);
    }
    setCurrentCursor(pageInfo.endCursor);
  };

  const handlePreviousPage = () => {
    const previousCursor = previousCursors[previousCursors.length - 1] || null;
    setPreviousCursors((previous) => previous.slice(0, -1));
    setCurrentCursor(previousCursor);
  };

  if (query.isLoading) {
    return (
      <div className="my-10 space-y-6">
        <Skeleton className="h-9 w-80" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <Skeleton className="h-[320px]" />
          <Skeleton className="h-[320px] md:col-span-3" />
        </div>
      </div>
    );
  }

  return (
    <div className="my-8 grid gap-6 md:grid-cols-4">
      <div>
        <ProductFilters
          value={filters}
          colors={availableColors}
          sizes={availableSizes}
          onChange={(next) => {
            setFilters(next);
            setCurrentCursor(null);
            setPreviousCursors([]);
          }}
        />
      </div>

        <div className="space-y-4 md:col-span-3">
          <div>
            <h1 className="text-2xl font-bold">{collection?.title || "Collection"}</h1>
            <p className="mt-1 text-sm text-gray-600">{collection?.description || "Explore products"}</p>
          </div>

          {filters.viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((product) => {
                const image = product.featuredImage?.url || product.images?.edges?.[0]?.node?.url;
                return (
                  <article key={product.id} className="grid grid-cols-[120px_1fr_auto] gap-4 rounded-xl border border-gray-200 p-4">
                    <div className="relative h-[120px] w-[120px] overflow-hidden rounded-lg bg-gray-100">
                      {image ? <Image src={image} alt={product.title} fill className="object-cover" /> : null}
                    </div>

                    <div>
                      <h2 className="text-base font-semibold">{product.title}</h2>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{product.vendor}</p>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <p className="text-sm font-semibold">
                        {product.priceRange?.minVariantPrice?.currencyCode}{" "}
                        {Number(product.priceRange?.minVariantPrice?.amount || 0).toFixed(2)}
                      </p>
                      <Link
                        href={`/product/${product.handle}`}
                        className="inline-flex rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                      >
                        Quick View
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePreviousPage}
                className={!pageInfo?.hasPreviousPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={handleNextPage}
                className={!pageInfo?.hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
