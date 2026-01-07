"use client";

import { useEffect, useState } from "react";

type ShippingRate = {
  id: string;
  label: string;
  amount: number;
};

export function useShipping(weight = 1) {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/shipping/rates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ weight, destination: "US" }),
        });

        if (!response.ok) return;
        const payload = (await response.json()) as { rates: ShippingRate[] };
        setRates(payload.rates || []);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [weight]);

  return {
    rates,
    isLoading,
  };
}
