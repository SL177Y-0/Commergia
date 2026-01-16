export type MenuColumn = {
  title: string;
  items: { label: string; href: string }[];
};

export const megaMenuColumns: MenuColumn[] = [
  {
    title: "Mens",
    items: [
      { label: "Shirts", href: "/collections/men" },
      { label: "Jeans", href: "/collections/men" },
      { label: "Dress Pants", href: "/collections/men" },
      { label: "Shoes", href: "/collections/men" },
      { label: "Jackets", href: "/collections/men" },
    ],
  },
  {
    title: "Womens",
    items: [
      { label: "Dresses", href: "/collections/women" },
      { label: "Leggings", href: "/collections/women" },
      { label: "Skirts", href: "/collections/women" },
      { label: "Coats", href: "/collections/women" },
      { label: "Sweatshirts", href: "/collections/women" },
    ],
  },
  {
    title: "Accessories",
    items: [
      { label: "Watches", href: "/collections/accessories" },
      { label: "Bracelets", href: "/collections/accessories" },
      { label: "Necklaces", href: "/collections/accessories" },
      { label: "Purses", href: "/collections/accessories" },
    ],
  },
];

export const faqItems = [
  {
    question: "Order status",
    answer:
      "Track your order from your account dashboard. We also send status updates by email after each fulfillment event.",
  },
  {
    question: "Shipping and delivery",
    answer:
      "Standard delivery is 3-7 business days. Express options are available at checkout for eligible regions.",
  },
  {
    question: "Payments",
    answer:
      "Commergia supports Stripe for USD and Razorpay for INR, with secure card processing and webhook-based confirmation.",
  },
  {
    question: "Returns and exchanges",
    answer:
      "Returns can be requested within 14 days from delivery for unused items in original condition.",
  },
  {
    question: "Privacy",
    answer:
      "We use strictly required cookies for auth/cart and optional analytics to improve shopping experiences.",
  },
];

export const aboutTimeline = [
  { year: "2023", text: "WordPress + WooCommerce logic foundation established." },
  { year: "2025", text: "Next.js storefront + Shopify GraphQL architecture created." },
  { year: "2026", text: "Commergia unified platform release." },
];

export type BlogPostFallback = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  contentHtml: string;
};

export const fallbackPosts: BlogPostFallback[] = [
  {
    slug: "launching-commergia",
    title: "Launching Commergia",
    excerpt: "How we merged Shopify UX, WooCommerce business patterns, and a modern Next.js stack.",
    date: "2026-02-18",
    author: "SL177Y",
    contentHtml:
      "<p>Commergia combines headless storefront speed with practical ecommerce operations. This release focuses on shell architecture, checkout flow scaffolding, and account fundamentals.</p>",
  },
  {
    slug: "checkout-architecture",
    title: "Checkout Architecture Decisions",
    excerpt: "Why multi-step checkout and gateway routing were designed this way.",
    date: "2026-02-17",
    author: "SL177Y",
    contentHtml:
      "<p>The checkout flow is split into information, shipping, and payment for better validation and lower abandonment.</p>",
  },
];

export const blogCategories = ["Architecture", "Checkout", "Operations", "Marketing"];

export const instagramCards = [
  {
    id: "ig-1",
    caption: "Minimal tailoring",
    image: "/legacy/shopify/slider-1.jpg",
  },
  {
    id: "ig-2",
    caption: "Streetwear capsule",
    image: "/legacy/shopify/slider-2.jpg",
  },
  {
    id: "ig-3",
    caption: "Seasonal accessories",
    image: "/legacy/shopify/category-1.jpg",
  },
  {
    id: "ig-4",
    caption: "Studio essentials",
    image: "/legacy/shopify/category-2.jpg",
  },
];
