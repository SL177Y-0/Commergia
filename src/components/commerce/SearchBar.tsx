"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/hooks/useSearch";
import { useStorefrontQuery } from "@/hooks/useStorefront";
import { PREDICTIVE_SEARCH_QUERY } from "@/graphql/search";

type SearchBarProps = {
  compact?: boolean;
};

type PredictiveResponse = {
  predictiveSearch?: {
    products: Array<{ id: string; handle: string; title: string }>;
  };
};

export default function SearchBar({ compact = false }: SearchBarProps) {
  const router = useRouter();
  const [open, setOpen] = useState(!compact);
  const { query, setQuery, addHistory, suggestions } = useSearch();

  const predictive = useStorefrontQuery<PredictiveResponse>(["predictive-search", query], {
    query: PREDICTIVE_SEARCH_QUERY,
    variables: {
      query,
      limit: 6,
    },
    enabled: Boolean(query.trim().length >= 2),
  });

  const mergedSuggestions = useMemo(() => {
    const predictiveItems = (predictive.data?.predictiveSearch?.products || []).map((item) => ({
      label: item.title,
      href: `/product/${item.handle}`,
    }));

    const historyItems = suggestions.map((item) => ({
      label: item,
      href: `/search?q=${encodeURIComponent(item)}`,
    }));

    return [...predictiveItems, ...historyItems].slice(0, 8);
  }, [predictive.data, suggestions]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const submit = (value = query) => {
    if (!value.trim()) return;
    addHistory(value.trim());
    router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    setOpen(false);
  };

  const suggestionList = (
    <div className="mt-3 rounded-md border border-gray-200">
      {mergedSuggestions.length === 0 ? (
        <p className="p-3 text-xs text-gray-500">No suggestions yet.</p>
      ) : (
        <ul>
          {mergedSuggestions.map((item) => (
            <li key={item.href}>
              <button
                className="w-full border-b border-gray-100 px-3 py-2 text-left text-sm hover:bg-gray-50 last:border-b-0"
                onClick={() => {
                  if (item.href.startsWith("/search")) {
                    const q = decodeURIComponent(item.href.split("?q=")[1] || "");
                    submit(q);
                    return;
                  }

                  router.push(item.href);
                  setOpen(false);
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  if (!compact) {
    return (
      <div className="w-full rounded-lg border border-gray-300 bg-white p-2">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                submit();
              }
            }}
            placeholder="Search products"
            className="border-0 shadow-none focus-visible:ring-0"
          />
          <Button size="sm" onClick={() => submit()}>
            Search
          </Button>
        </div>
        {suggestionList}
      </div>
    );
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Search className="mr-2 h-4 w-4" />
        Search
        <span className="ml-2 rounded border border-gray-300 px-1.5 py-0.5 text-[10px]">Ctrl+K</span>
      </Button>

      {open && (
        <>
          <button
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setOpen(false)}
            aria-label="Close search"
          />
          <div className="fixed left-1/2 top-20 z-50 w-[92%] max-w-2xl -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-4 shadow-2xl">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    submit();
                  }
                }}
                placeholder="Search products, collections, blog"
              />
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            {suggestionList}
            <p className="mt-3 text-xs text-gray-500">Press Enter to view full results.</p>
          </div>
        </>
      )}
    </>
  );
}
