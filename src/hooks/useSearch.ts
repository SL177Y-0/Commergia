"use client";

import { useMemo } from "react";
import { useSearchAtom } from "@/lib/atoms/search";

export function useSearch() {
  const { search, setQuery, addHistory } = useSearchAtom();

  const suggestions = useMemo(() => {
    if (!search.query.trim()) return search.history;
    return search.history.filter((item) =>
      item.toLowerCase().includes(search.query.toLowerCase())
    );
  }, [search.history, search.query]);

  return {
    query: search.query,
    setQuery,
    addHistory,
    suggestions,
    history: search.history,
  };
}
