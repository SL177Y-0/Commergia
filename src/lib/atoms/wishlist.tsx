"use client";

import { atom, useAtom } from "jotai";

const STORAGE_KEY = "wishlist_handles";

const wishlistAtom = atom<string[]>([]);
const initializedAtom = atom(false);

function dedupe(items: string[]) {
  return Array.from(new Set(items));
}

export function useWishlistActions() {
  const [wishlist, setWishlist] = useAtom(wishlistAtom);
  const [initialized, setInitialized] = useAtom(initializedAtom);

  const persist = (next: string[]) => {
    const normalized = dedupe(next);
    setWishlist(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  };

  const initialize = () => {
    if (initialized) return;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setInitialized(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as string[];
      setWishlist(dedupe(parsed));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setInitialized(true);
    }
  };

  const toggle = (handle: string) => {
    if (wishlist.includes(handle)) {
      persist(wishlist.filter((item) => item !== handle));
      return;
    }
    persist([...wishlist, handle]);
  };

  const has = (handle: string) => wishlist.includes(handle);

  return {
    wishlist,
    initialize,
    toggle,
    has,
  };
}
