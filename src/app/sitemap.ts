import type { MetadataRoute } from "next";
import { siteConfig } from "../../commergia.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/contact",
    "/faq",
    "/blog",
    "/search",
    "/cart",
    "/checkout",
    "/account",
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1 : 0.7,
  }));
}
