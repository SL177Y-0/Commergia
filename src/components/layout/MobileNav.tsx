import { useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { megaMenuColumns } from "@/lib/site-data";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
    );
    focusables?.[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <button className="fixed inset-0 z-40 bg-black/50" aria-label="Close menu" onClick={onClose} />
      <aside
        ref={panelRef}
        className="fixed left-0 top-0 z-50 h-full w-[86%] max-w-sm overflow-y-auto bg-white p-5 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={onClose} aria-label="Close navigation">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-6">
          <div className="space-y-2">
            <Link className="block text-sm font-medium" href="/" onClick={onClose}>
              Home
            </Link>
            <Link className="block text-sm font-medium" href="/collections/men" onClick={onClose}>
              Men
            </Link>
            <Link className="block text-sm font-medium" href="/collections/women" onClick={onClose}>
              Women
            </Link>
            <Link className="block text-sm font-medium" href="/search" onClick={onClose}>
              Search
            </Link>
            <Link className="block text-sm font-medium" href="/faq" onClick={onClose}>
              FAQ
            </Link>
            <Link className="block text-sm font-medium" href="/contact" onClick={onClose}>
              Contact
            </Link>
          </div>

          <div className="space-y-4 border-t border-gray-200 pt-4">
            {megaMenuColumns.map((column) => (
              <div key={`mobile-${column.title}`}>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {column.title}
                </h3>
                <ul className="mt-2 space-y-2">
                  {column.items.map((item) => (
                    <li key={`mobile-${column.title}-${item.label}`}>
                      <Link className="text-sm text-gray-700" href={item.href} onClick={onClose}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
}
