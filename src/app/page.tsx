"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/view/ProductCard";
import AllCollections from "@/components/view/AllCollections";
import NewsletterSignup from "@/components/content/NewsletterSignup";
import InstagramFeed from "@/components/content/InstagramFeed";
import { useStorefrontQuery } from "@/hooks/useStorefront";
import { GET_TRENDING_PRODUCTS_QUERY } from "@/graphql/search";
import { Product } from "@/types/shopify-graphql";

type TrendingProductsResponse = {
  products: {
    edges: Array<{ node: Product }>;
  };
};

export default function Home() {
  const trending = useStorefrontQuery<TrendingProductsResponse>(["trending-products"], {
    query: GET_TRENDING_PRODUCTS_QUERY,
    variables: { first: 8 },
  });

  return (
    <div className="pb-12">
      <section className="relative mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-gray-900 text-white">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 py-16 text-center md:py-24">
          <p className="text-xs uppercase tracking-[0.24em] text-gray-300">Commergia Spring 2026</p>
          <h1 className="mt-3 text-4xl font-black leading-tight md:text-6xl">
            The unified multi-channel storefront.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-200 md:text-base">
            Built from Shopify fashion UX patterns and WordPress commerce workflows, re-engineered into one Next.js platform.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button asChild>
              <Link href="/collections/men">Shop now</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10">
              <Link href="/about">Brand story</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl font-semibold">Featured Collections</h2>
          <Link className="text-sm font-medium underline underline-offset-4" href="/collections/men">
            Explore all
          </Link>
        </div>
        <AllCollections />
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-semibold">Trending Products</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {trending.data?.products.edges.map((edge) => (
            <ProductCard key={edge.node.id} product={edge.node} />
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-gray-500">Promotion</p>
          <h2 className="mt-2 text-3xl font-bold">Seasonal edits, elevated essentials.</h2>
          <p className="mt-3 text-sm text-gray-600">
            Ported from the Shopify fashion theme merchandising blocks and adapted for a headless storefront stack.
          </p>
          <Button asChild className="mt-5">
            <Link href="/collections/women">Shop the drop</Link>
          </Button>
        </div>
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-5">
          <h3 className="text-base font-semibold">Subscribe for launch offers</h3>
          <p className="mt-2 text-sm text-gray-600">Get first access to new arrivals, limited bundles, and campaign pricing.</p>
          <div className="mt-4 max-w-sm">
            <NewsletterSignup tone="light" />
          </div>
        </div>
      </section>

      <InstagramFeed />
    </div>
  );
}
