"use client";

import { useEffect } from "react";
import { useWishlistActions } from "@/lib/atoms/wishlist";

export function useWishlist() {
  const actions = useWishlistActions();

  useEffect(() => {
    actions.initialize();
    // initialize runs once on mount to hydrate localStorage wishlist.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return actions;
}
