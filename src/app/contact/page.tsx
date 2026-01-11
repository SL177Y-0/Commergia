import ContactForm from "@/components/content/ContactForm";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Contact",
  description: "Contact Commergia support, partnerships, and enterprise onboarding team.",
  path: "/contact",
});

export default function ContactPage() {
  const mapEmbedUrl = process.env.NEXT_PUBLIC_CONTACT_MAP_EMBED_URL;

  return (
    <div className="my-8 grid gap-8 md:grid-cols-2">
      <section>
        <h1 className="text-3xl font-bold">Contact</h1>
        <p className="mt-3 text-sm text-gray-600">Send us a message for support, partnerships, or enterprise onboarding.</p>

        <div className="mt-6 space-y-2 text-sm text-gray-700">
          <p>Email: support@commergia.com</p>
          <p>Phone: +1 (212) 555-0199</p>
          <p>Address: 210 Commerce Ave, New York, NY</p>
        </div>

        {mapEmbedUrl ? (
          <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
            <iframe
              title="Commergia office location"
              src={mapEmbedUrl}
              className="h-64 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        ) : null}
      </section>

      <section className="rounded-xl border border-gray-200 p-5">
        <ContactForm />
      </section>
    </div>
  );
}
