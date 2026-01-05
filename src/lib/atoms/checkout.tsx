"use client";

import { atom, useAtom } from "jotai";

type CheckoutState = {
  step: "information" | "shipping" | "payment" | "confirmation";
  information: Record<string, string>;
  shippingMethod: string;
};

const checkoutAtom = atom<CheckoutState>({
  step: "information",
  information: {},
  shippingMethod: "standard",
});

export function useCheckoutAtom() {
  const [checkout, setCheckout] = useAtom(checkoutAtom);

  return {
    checkout,
    setStep: (step: CheckoutState["step"]) => setCheckout((previous) => ({ ...previous, step })),
    setInformation: (information: Record<string, string>) =>
      setCheckout((previous) => ({ ...previous, information })),
    setShippingMethod: (shippingMethod: string) =>
      setCheckout((previous) => ({ ...previous, shippingMethod })),
    reset: () =>
      setCheckout({
        step: "information",
        information: {},
        shippingMethod: "standard",
      }),
  };
}
