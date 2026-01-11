import FAQAccordion from "@/components/content/FAQAccordion";
import { createPageMetadata } from "@/lib/seo/metadata";
import { faqSchema } from "@/lib/seo/schema";
import { faqItems } from "@/lib/site-data";

export const metadata = createPageMetadata({
  title: "FAQ",
  description: "Frequently asked questions on shipping, returns, payments, and account support.",
  path: "/faq",
});

export default function FAQPage() {
  return (
    <div className="my-8 space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqItems)) }} />
      <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
      <p className="text-sm text-gray-600">Shipping, returns, payments, and account support.</p>
      <FAQAccordion />
    </div>
  );
}
