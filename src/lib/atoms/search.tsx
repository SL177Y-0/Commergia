"use client";

import { atom, useAtom } from "jotai";

type SearchState = {
  query: string;
  history: string[];
};

const searchAtom = atom<SearchState>({
  query: "",
  history: [],
});

export function useSearchAtom() {
  const [search, setSearch] = useAtom(searchAtom);

  const setQuery = (query: string) => {
    setSearch((previous) => ({
      ...previous,
      query,
    }));
  };

  const addHistory = (query: string) => {
    if (!query.trim()) return;
    setSearch((previous) => ({
      ...previous,
      history: Array.from(new Set([query, ...previous.history])).slice(0, 12),
    }));
  };

  return {
    search,
    setQuery,
    addHistory,
  };
}
