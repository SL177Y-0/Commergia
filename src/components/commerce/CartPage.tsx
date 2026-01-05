"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartActions } from "@/lib/atoms/cart";
import ProductCard from "@/components/view/ProductCard";
import { useStorefrontQuery } from "@/hooks/useStorefront";
import { SEARCH_PRODUCTS_QUERY } from "@/graphql/search";
import { Product } from "@/types/shopify-graphql";

function formatPrice(amount: string, currencyCode: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "narrowSymbol",
  }).format(Number(amount));
}

type SearchProductsResponse = {
  products: {
    edges: Array<{ node: Product }>;
  };
};

export default function CartPage() {
  const { cart, updateItem, removeItem } = useCartActions();
  const [destinationCountry, setDestinationCountry] = useState<"US" | "IN" | "OTHER">("US");
  const [zipCode, setZipCode] = useState("");
  const [recentlyViewedHandles, setRecentlyViewedHandles] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("recently_viewed_handles");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as string[];
      setRecentlyViewedHandles(parsed.slice(0, 4));
    } catch {
      setRecentlyViewedHandles([]);
    }
  }, []);

  const recentlyViewedQueryString = useMemo(() => {
    if (!recentlyViewedHandles.length) return "";
    return recentlyViewedHandles.map((handle) => `handle:${handle}`).join(" OR ");
  }, [recentlyViewedHandles]);

  const recentlyViewedQuery = useStorefrontQuery<SearchProductsResponse>(
    ["recently-viewed", recentlyViewedQueryString],
    {
      query: SEARCH_PRODUCTS_QUERY,
      variables: {
        query: recentlyViewedQueryString,
        first: 4,
        sortKey: "RELEVANCE",
        reverse: false,
      },
      enabled: Boolean(recentlyViewedQueryString),
    }
  );

  const subtotal = Number(cart.cost.subtotalAmount.amount || 0);
  const shippingEstimate =
    subtotal > 150 ? 0 : destinationCountry === "IN" ? 199 : destinationCountry === "US" ? 9.99 : 14.99;
  const taxRate = destinationCountry === "IN" ? 0.18 : destinationCountry === "US" ? 0.08 : 0.1;
  const taxEstimate = subtotal * taxRate;
  const estimatedTotal = subtotal + shippingEstimate + taxEstimate;

  if (cart.lines.edges.length === 0) {
    return (
      <div className="mx-auto my-12 max-w-2xl rounded-xl border border-dashed border-gray-300 p-10 text-center">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-gray-600">Browse collections and add items to continue.</p>
        <Button asChild className="mt-5">
          <Link href="/collections/men">Continue shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto my-8 grid max-w-7xl gap-8 px-4 md:grid-cols-[1fr_320px] md:px-6">
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">Cart</h1>
        {cart.lines.edges.map(({ node }) => {
          const image = node.merchandise.product.images.edges[0]?.node;
          const lineTotal = (Number(node.merchandise.price.amount) * node.quantity).toFixed(2);

          return (
            <article key={node.id} className="grid grid-cols-[110px_1fr] gap-4 rounded-xl border border-gray-200 p-4">
              <div className="relative h-[110px] w-[110px] overflow-hidden rounded-md bg-gray-100">
                {image?.url ? (
                  <Image src={image.url} alt={image.altText || node.merchandise.product.title} fill className="object-cover" />
                ) : null}
              </div>

              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-semibold">{node.merchandise.product.title}</h2>
                    <p className="text-xs text-gray-500">{node.merchandise.title}</p>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatPrice(lineTotal, node.merchandise.price.currencyCode)}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => updateItem(node.merchandise.id, node.quantity - 1)}>
                    -
                  </Button>
                  <span className="min-w-7 text-center text-sm">{node.quantity}</span>
                  <Button size="sm" variant="outline" onClick={() => updateItem(node.merchandise.id, node.quantity + 1)}>
                    +
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => removeItem(node.merchandise.id)}>
                    Remove
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <aside className="h-fit rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold">Summary</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span className="font-medium">
              {formatPrice(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Shipping</span>
            <span>
              {cart.cost.totalAmount.currencyCode} {shippingEstimate.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Tax</span>
            <span>
              {cart.cost.totalAmount.currencyCode} {taxEstimate.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-gray-100 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Estimator</p>
          <div className="mt-2 space-y-2 text-sm">
            <label className="block">
              <span className="mb-1 block text-xs text-gray-500">Country</span>
              <select
                className="h-9 w-full rounded-md border border-gray-300 bg-white px-2"
                value={destinationCountry}
                onChange={(event) => setDestinationCountry(event.target.value as "US" | "IN" | "OTHER")}
              >
                <option value="US">United States</option>
                <option value="IN">India</option>
                <option value="OTHER">Other</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-gray-500">ZIP / Postal code</span>
              <input
                className="h-9 w-full rounded-md border border-gray-300 px-2"
                value={zipCode}
                onChange={(event) => setZipCode(event.target.value)}
                placeholder="Optional"
              />
            </label>
          </div>
        </div>

        <div className="mt-4 border-t border-gray-200 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Total</span>
            <span className="text-base font-bold">
              {cart.cost.totalAmount.currencyCode} {estimatedTotal.toFixed(2)}
            </span>
          </div>
          <Button asChild className="mt-4 w-full">
            <Link href="/checkout">Proceed to checkout</Link>
          </Button>
          <Button asChild variant="outline" className="mt-2 w-full">
            <Link href="/collections/men">Continue shopping</Link>
          </Button>
        </div>
      </aside>

      {recentlyViewedQuery.data?.products.edges?.length ? (
        <section className="md:col-span-2">
          <h2 className="mb-4 text-xl font-semibold">Recently Viewed</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentlyViewedQuery.data.products.edges.map((edge) => (
              <ProductCard key={edge.node.id} product={edge.node} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
