"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/shopify-graphql";

type ProductQuickViewProps = {
  product: Product;
  onClose: () => void;
};

export default function ProductQuickView({ product, onClose }: ProductQuickViewProps) {
  return (
    <>
      <button className="fixed inset-0 z-40 bg-black/50" onClick={onClose} aria-label="Close quick view" />
      <div className="fixed left-1/2 top-24 z-50 w-[94%] max-w-2xl -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-5 shadow-2xl">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative h-72 overflow-hidden rounded-lg bg-gray-100">
            {product.featuredImage?.url ? (
              <Image src={product.featuredImage.url} alt={product.featuredImage.altText || product.title} fill className="object-cover" />
            ) : null}
          </div>

          <div>
            <h2 className="text-xl font-semibold">{product.title}</h2>
            <p className="mt-2 text-sm text-gray-600">{product.vendor}</p>
            <p className="mt-2 text-sm text-gray-700">{product.description?.slice(0, 160)}</p>
            <div className="mt-6 flex gap-2">
              <Button asChild>
                <a href={`/product/${product.handle}`}>View product</a>
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
