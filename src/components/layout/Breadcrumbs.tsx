"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { breadcrumbSchema } from "@/lib/seo/schema";

function segmentToLabel(segment: string) {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  if (!pathname || pathname === "/") {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://commergia.sl177y.com";
  const breadcrumbItems = [
    { name: "Home", url: `${siteUrl}/` },
    ...segments.map((segment, index) => ({
      name: segmentToLabel(segment),
      url: `${siteUrl}/${segments.slice(0, index + 1).join("/")}`,
    })),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbItems)) }}
      />
      <nav aria-label="Breadcrumb" className="mx-auto w-full max-w-7xl px-4 pt-4 text-xs text-gray-600 md:px-6">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
          </li>
          {segments.map((segment, index) => {
            const href = `/${segments.slice(0, index + 1).join("/")}`;
            const isLast = index === segments.length - 1;

            return (
              <li className="flex items-center gap-1" key={href}>
                <span>/</span>
                {isLast ? (
                  <span className="font-medium text-gray-900">{segmentToLabel(segment)}</span>
                ) : (
                  <Link href={href} className="hover:text-gray-900">
                    {segmentToLabel(segment)}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
