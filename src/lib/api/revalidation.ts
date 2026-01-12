import { revalidatePath } from "next/cache";

export function revalidatePaths(paths: string[]) {
  const unique = Array.from(new Set(paths.filter(Boolean)));
  unique.forEach((path) => revalidatePath(path));
  return unique;
}

export function getShopifyRevalidationPaths(topic: string | null, payload: Record<string, unknown>) {
  const paths = ["/"];

  const handle = typeof payload.handle === "string" ? payload.handle : "";
  const collectionHandle = typeof payload.collection_handle === "string" ? payload.collection_handle : "";

  if (topic?.startsWith("products/")) {
    paths.push("/collections");
    if (handle) paths.push(`/product/${handle}`);
  }

  if (topic?.startsWith("collections/")) {
    paths.push("/collections");
    if (handle) paths.push(`/collections/${handle}`);
    if (collectionHandle) paths.push(`/collections/${collectionHandle}`);
  }

  return paths;
}

export function getWordPressRevalidationPaths(payload: Record<string, unknown>) {
  const paths = ["/blog"];
  const slug = typeof payload.slug === "string" ? payload.slug : "";
  if (slug) {
    paths.push(`/blog/${slug}`);
  }
  return paths;
}
