import Link from "next/link";
import NewsletterSignup from "@/components/content/NewsletterSignup";

const quickLinks = [
  { label: "Shop", href: "/collections/men" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const customerLinks = [
  { label: "Account", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Wishlist", href: "/account/wishlist" },
  { label: "Track Order", href: "/account/orders" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-950 text-gray-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4 md:px-6">
        <div>
          <p className="text-xl font-black uppercase tracking-wider">Commergia</p>
          <p className="mt-4 text-sm text-gray-300">
            Unified multi-channel commerce platform built from Shopify storefront patterns and WordPress commerce workflows.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide">Quick links</h3>
          <ul className="mt-4 space-y-2 text-sm text-gray-300">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link className="hover:text-white" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide">Customer</h3>
          <ul className="mt-4 space-y-2 text-sm text-gray-300">
            {customerLinks.map((link) => (
              <li key={link.href}>
                <Link className="hover:text-white" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide">Newsletter</h3>
          <div className="mt-4">
            <NewsletterSignup />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-4 text-xs text-gray-400 md:flex-row md:items-center md:px-6">
          <p>Copyright 2026 Commergia by SL177Y</p>
          <div className="flex items-center gap-4">
            <Link href="/contact">Contact</Link>
            <Link href="/faq">Shipping</Link>
            <Link href="/faq">Terms</Link>
            <Link href="/faq">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
