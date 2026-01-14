export function productSchema(input: {
  name: string;
  description: string;
  url: string;
  image?: string;
  price?: string;
  currency?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    url: input.url,
    image: input.image ? [input.image] : undefined,
    offers: input.price
      ? {
          "@type": "Offer",
          priceCurrency: input.currency || "USD",
          price: input.price,
          availability: "https://schema.org/InStock",
        }
      : undefined,
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function articleSchema(input: {
  headline: string;
  description: string;
  datePublished: string;
  authorName: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    datePublished: input.datePublished,
    author: {
      "@type": "Person",
      name: input.authorName,
    },
    mainEntityOfPage: input.url,
  };
}
