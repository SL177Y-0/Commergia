"use client";

import { atom, useAtom } from "jotai";

export type CurrencyCode = "USD" | "INR";

const currencyAtom = atom<CurrencyCode>("USD");

export function useCurrencyAtom() {
  const [currency, setCurrency] = useAtom(currencyAtom);

  return {
    currency,
    setCurrency: (next: CurrencyCode) => {
      setCurrency(next);
      if (typeof document !== "undefined") {
        document.cookie = `preferredCurrency=${next};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
      }
    },
  };
}
