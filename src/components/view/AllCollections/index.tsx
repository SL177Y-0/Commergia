"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { GET_COLLECTIONS_QUERY } from "@/graphql/collections";
import { useStorefrontQuery } from "@/hooks/useStorefront";
import { GetCollectionsQuery } from "@/types/shopify-graphql";

export default function AllCollections() {
  const router = useRouter();
  const { data, isLoading } = useStorefrontQuery<GetCollectionsQuery>(["collections"], {
    query: GET_COLLECTIONS_QUERY,
  });

  if (isLoading) {
    return (
      <div className="grid w-full grid-cols-1 gap-6 my-10 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-[260px] w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-1 gap-6 my-10 sm:grid-cols-2 lg:grid-cols-3">
      {data?.collections.edges.map((collection) => (
        <button
          onClick={() => router.push(`/collections/${collection.node.handle}`)}
          key={collection.node.id}
          className="group rounded-xl border border-gray-200 p-3 text-left"
        >
          <div className="relative h-[220px] w-full overflow-hidden rounded-lg bg-gray-100">
            {collection.node.image?.url ? (
              <Image
                src={collection.node.image.url}
                alt={collection.node.image.altText || collection.node.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : null}
          </div>
          <h2 className="mt-3 text-base font-semibold">{collection.node.title}</h2>
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{collection.node.description}</p>
        </button>
      ))}
    </div>
  );
}
