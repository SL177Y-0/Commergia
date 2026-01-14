import type { Metadata } from "next";
import { siteConfig } from "../../../commergia.config";

export function createPageMetadata(input: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `${siteConfig.url}${input.path}`;

  return {
    title: `${input.title} | ${siteConfig.name}`,
    description: input.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${input.title} | ${siteConfig.name}`,
      description: input.description,
      url,
      images: [siteConfig.ogImage],
      type: "website",
    },
  };
}
