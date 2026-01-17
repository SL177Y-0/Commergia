"use client";

import { useMemo } from "react";

export function useCurrency(preferredCurrency?: string) {
  const currency = preferredCurrency || "USD";

  const formatCurrency = useMemo(() => {
    return (amount: number | string, currencyCode = currency) =>
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currencyCode,
        currencyDisplay: "narrowSymbol",
      }).format(Number(amount));
  }, [currency]);

  return {
    currency,
    formatCurrency,
  };
}
