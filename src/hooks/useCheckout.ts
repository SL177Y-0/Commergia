"use client";

import { useCheckoutAtom } from "@/lib/atoms/checkout";

export function useCheckout() {
  return useCheckoutAtom();
}
