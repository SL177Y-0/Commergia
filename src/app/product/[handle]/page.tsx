"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import ProductCarousel from "@/components/view/ProductCarousel";
import ProductPrice from "@/components/view/ProductCard/ProductPrice";
import ProductOptions from "@/components/view/ProductOptions";
import ProductCard from "@/components/view/ProductCard";
import ProductReviews from "@/components/commerce/ProductReviews";
import SocialShareBar from "@/components/content/SocialShareBar";
import StickyAddToCart from "@/components/layout/StickyAddToCart";
import WishlistButton from "@/components/commerce/WishlistButton";
import { useStorefrontQuery } from "@/hooks/useStorefront";
import { useIntersection } from "@/hooks/useIntersection";
import { useCartActions } from "@/lib/atoms/cart";
import { GET_PRODUCT_BY_HANDLE_QUERY, GET_RECOMMENDED_PRODUCTS_QUERY } from "@/graphql/products";
import { GET_TRENDING_PRODUCTS_QUERY } from "@/graphql/search";
import { productSchema } from "@/lib/seo/schema";
import {
  GetProductByHandleQuery,
  ImageEdge,
  Product,
  ProductOption,
  ProductPriceRange,
  ProductVariant,
} from "@/types/shopify-graphql";

type RecommendedProductsResponse = {
  productRecommendations: Product[];
};

type TrendingProductsResponse = {
  products: {
    edges: Array<{ node: Product }>;
  };
};

const ProductPage = () => {
  const params = useParams();
  const handle = String(params.handle || "");
  const { addItem } = useCartActions();

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>();
  const [currentUrl, setCurrentUrl] = useState(
    `https://commergia.sl177y.com/product/${handle}`
  );

  const addToCartAnchorRef = useRef<HTMLDivElement>(null);
  const isPrimaryAddVisible = useIntersection(addToCartAnchorRef, "-40px");

  const { data, isLoading } = useStorefrontQuery<GetProductByHandleQuery>(["product", handle], {
    query: GET_PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
  });

  const productId = data?.product?.id;

  const recommendedQuery = useStorefrontQuery<RecommendedProductsResponse>(["product-recommendations", productId], {
    query: GET_RECOMMENDED_PRODUCTS_QUERY,
    variables: { productId },
    enabled: Boolean(productId),
  });

  const fallbackRecommendationsQuery = useStorefrontQuery<TrendingProductsResponse>(
    ["product-recommendations-fallback", handle],
    {
      query: GET_TRENDING_PRODUCTS_QUERY,
      variables: { first: 4 },
      enabled: Boolean(handle),
    }
  );

  useEffect(() => {
    const firstVariant = data?.product?.variants?.edges?.[0]?.node;
    const firstOptions = firstVariant?.selectedOptions.reduce<Record<string, string>>((acc, option) => {
      acc[option.name] = option.value;
      return acc;
    }, {});

    if (firstVariant && firstOptions) {
      setSelectedVariant(firstVariant as ProductVariant);
      setSelectedOptions(firstOptions);
    }
  }, [data?.product?.id, data?.product?.variants?.edges]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, [handle]);

  useEffect(() => {
    if (typeof window === "undefined" || !handle) return;
    const key = "recently_viewed_handles";
    const raw = localStorage.getItem(key);
    const items = raw ? ((JSON.parse(raw) as string[]) || []) : [];
    const next = Array.from(new Set([handle, ...items])).slice(0, 8);
    localStorage.setItem(key, JSON.stringify(next));
  }, [handle]);

  const handleSelectOptions = (options: Record<string, string>) => {
    const variant = data?.product?.variants?.edges.find((candidate) => {
      return Object.keys(options).every((key) => {
        return candidate.node.selectedOptions.some(
          (option) => option.name === key && option.value === options[key]
        );
      });
    });

    setSelectedVariant(variant?.node as ProductVariant);
    setSelectedOptions(options);
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      addItem(selectedVariant.id, 1);
    }
  };

  if (isLoading) {
    return (
      <div className="my-10 grid grid-cols-2 gap-4 md:grid-cols-3">
        <Skeleton className="col-span-2 h-[300px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (!data?.product) {
    return <p className="my-10 text-sm text-gray-600">Product not found.</p>;
  }

  const recommendedProducts = recommendedQuery.data?.productRecommendations?.length
    ? recommendedQuery.data.productRecommendations
    : (fallbackRecommendationsQuery.data?.products.edges.map((edge) => edge.node) || []).filter(
        (product) => product.handle !== handle
      );

  const productJsonLd = productSchema({
    name: data.product.title,
    description: data.product.description,
    url: currentUrl,
    image: data.product.featuredImage?.url || undefined,
    price: data.product.priceRange?.minVariantPrice?.amount || undefined,
    currency: data.product.priceRange?.minVariantPrice?.currencyCode || "USD",
  });

  return (
    <div className="my-8 space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <div className="grid gap-6 md:grid-cols-3">
        <ProductCarousel images={data.product.images?.edges as ImageEdge[]} />

        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">{data.product.title}</h1>
              <p className="text-xs uppercase tracking-wide text-gray-500">{data.product.vendor}</p>
            </div>
            <WishlistButton handle={handle} />
          </div>

          <p className="text-sm text-gray-600">{data.product.description}</p>

          <ProductOptions
            selectedOptions={selectedOptions}
            setSelectedOptions={handleSelectOptions}
            options={data.product.options as ProductOption[]}
          />

          <ProductPrice priceRange={data.product.priceRange as ProductPriceRange} />

          <div ref={addToCartAnchorRef}>
            <Button disabled={!selectedVariant} onClick={handleAddToCart}>
              Add to cart
            </Button>
          </div>

          <SocialShareBar
            title={data.product.title}
            url={currentUrl}
          />
        </div>
      </div>

      <ProductReviews />

      {recommendedProducts.length ? (
        <section>
          <h2 className="mb-4 text-xl font-semibold">You may also like</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product as Product} />
            ))}
          </div>
        </section>
      ) : null}

      <StickyAddToCart
        visible={!isPrimaryAddVisible}
        title={data.product.title}
        disabled={!selectedVariant}
        onAdd={handleAddToCart}
      />
    </div>
  );
};

export default ProductPage;
