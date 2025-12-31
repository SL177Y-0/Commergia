"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/shopify-graphql";
import ProductPrice from "./ProductPrice";
import WishlistButton from "@/components/commerce/WishlistButton";
import ProductQuickView from "@/components/commerce/ProductQuickView";
import { useCartActions } from "@/lib/atoms/cart";

const ProductCard = ({ product }: { product: Product }) => {
  const router = useRouter();
  const { addItem } = useCartActions();
  const [openQuickView, setOpenQuickView] = useState(false);

  const firstVariantId = product.variants?.edges?.[0]?.node?.id;

  return (
    <>
      <article
        role="button"
        className="group flex flex-col gap-2"
        onClick={() => router.push(`/product/${product.handle}`)}
      >
        <div className="relative h-[300px] w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
          {product.featuredImage?.url ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText ?? product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : null}

          <div className="absolute right-2 top-2">
            <WishlistButton handle={product.handle} className="bg-white/85" />
          </div>
        </div>

        <h2 className="line-clamp-2 text-sm font-semibold">{product.title}</h2>
        <ProductPrice priceRange={product.priceRange} />

        <div className="mt-1 grid grid-cols-2 gap-2">
          <Button
            size="sm"
            onClick={(event) => {
              event.stopPropagation();
              if (firstVariantId) {
                addItem(firstVariantId, 1);
              }
            }}
            disabled={!firstVariantId}
          >
            Add to cart
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(event) => {
              event.stopPropagation();
              setOpenQuickView(true);
            }}
          >
            Quick view
          </Button>
        </div>
      </article>

      {openQuickView ? (
        <ProductQuickView product={product} onClose={() => setOpenQuickView(false)} />
      ) : null}
    </>
  );
};

export default ProductCard;
