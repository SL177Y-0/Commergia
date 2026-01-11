import Link from "next/link";
import { aboutTimeline } from "@/lib/site-data";
import { Button } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "About",
  description: "Commergia merges Shopify UX patterns, WordPress content systems, and typed Next.js runtime.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="my-8 space-y-10">
      <section className="rounded-2xl border border-gray-200 bg-gray-50 p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-gray-500">About Commergia</p>
        <h1 className="mt-2 text-4xl font-bold">Engineering commerce without platform silos.</h1>
        <p className="mt-4 max-w-3xl text-sm text-gray-600">
          Commergia merges three proven ecosystems into one modern storefront stack: Shopify experience patterns, WordPress content systems, and a typed Next.js runtime.
        </p>
        <Button asChild className="mt-6">
          <Link href="/contact">Contact us</Link>
        </Button>
      </section>

      <section className="rounded-2xl border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold">Timeline</h2>
        <div className="mt-5 space-y-4">
          {aboutTimeline.map((item) => (
            <article className="grid gap-2 border-l-2 border-gray-200 pl-4 md:grid-cols-[90px_1fr]" key={item.year}>
              <p className="text-sm font-semibold">{item.year}</p>
              <p className="text-sm text-gray-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
