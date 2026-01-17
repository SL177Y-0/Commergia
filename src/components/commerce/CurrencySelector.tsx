"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCurrencyAtom } from "@/lib/atoms/currency";

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrencyAtom();

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.cookie.includes("preferredCurrency=INR")) {
      setCurrency("INR");
    }
    // run once for hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center gap-1 rounded-md border border-gray-200 p-1">
      <Button
        size="sm"
        variant={currency === "USD" ? "default" : "ghost"}
        className="h-7 px-2 text-xs"
        onClick={() => setCurrency("USD")}
      >
        USD
      </Button>
      <Button
        size="sm"
        variant={currency === "INR" ? "default" : "ghost"}
        className="h-7 px-2 text-xs"
        onClick={() => setCurrency("INR")}
      >
        INR
      </Button>
    </div>
  );
}
