import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useCheckoutAtom } from "@/lib/atoms/checkout";

describe("checkout atom", () => {
  it("updates step, information, shipping method and resets", () => {
    const { result } = renderHook(() => useCheckoutAtom());

    act(() => {
      result.current.setStep("shipping");
      result.current.setInformation({ email: "shopper@example.com" });
      result.current.setShippingMethod("express");
    });

    expect(result.current.checkout.step).toBe("shipping");
    expect(result.current.checkout.information.email).toBe("shopper@example.com");
    expect(result.current.checkout.shippingMethod).toBe("express");

    act(() => {
      result.current.reset();
    });

    expect(result.current.checkout.step).toBe("information");
    expect(result.current.checkout.shippingMethod).toBe("standard");
  });
});
