"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { megaMenuColumns } from "@/lib/site-data";

export default function MegaMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onDocumentClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocumentClick);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="text-sm font-medium uppercase tracking-wide text-gray-800"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        Shop
      </button>

      <div
        role="menu"
        aria-label="Shop categories"
        className={`absolute left-1/2 top-full z-40 mt-3 w-[760px] -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-6 shadow-xl transition-all duration-150 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="grid grid-cols-3 gap-8">
          {megaMenuColumns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-900">{column.title}</h3>
              <ul className="space-y-2">
                {column.items.map((item) => (
                  <li key={`${column.title}-${item.label}`}>
                    <Link
                      className="text-sm text-gray-600 hover:text-gray-900 focus-visible:outline-none focus-visible:underline"
                      href={item.href}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
