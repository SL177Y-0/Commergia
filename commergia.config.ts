export const siteConfig = {
  name: "Commergia",
  author: "SL177Y",
  description: "Multi-Channel Commerce Engine",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://commergia.sl177y.com",
  ogImage: "/og-image.png",
  links: {
    github: "https://github.com/SL177Y-0/commergia",
  },
  currencies: {
    primary: "USD",
    secondary: "INR",
  },
  shopify: {
    storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "",
    storefrontToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "",
    apiVersion: "2025-01",
  },
  wordpress: {
    graphqlUrl: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "",
  },
} as const;

export type SiteConfig = typeof siteConfig;
