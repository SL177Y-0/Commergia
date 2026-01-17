"use client";

import { atom, useAtom } from "jotai";

const cartDrawerOpenAtom = atom(false);

export function useUIActions() {
  const [isCartDrawerOpen, setCartDrawerOpen] = useAtom(cartDrawerOpenAtom);

  return {
    isCartDrawerOpen,
    openCartDrawer: () => setCartDrawerOpen(true),
    closeCartDrawer: () => setCartDrawerOpen(false),
    toggleCartDrawer: () => setCartDrawerOpen((prev) => !prev),
  };
}
