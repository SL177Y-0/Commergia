import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useWishlistActions } from "@/lib/atoms/wishlist";

describe("wishlist atom", () => {
  it("hydrates from localStorage and toggles handles", () => {
    localStorage.setItem("wishlist_handles", JSON.stringify(["shirt", "shoe", "shirt"]));

    const { result } = renderHook(() => useWishlistActions());

    act(() => {
      result.current.initialize();
    });

    expect(result.current.wishlist).toEqual(["shirt", "shoe"]);
    expect(result.current.has("shirt")).toBe(true);

    act(() => {
      result.current.toggle("shirt");
    });
    expect(result.current.has("shirt")).toBe(false);

    act(() => {
      result.current.toggle("hat");
    });
    expect(result.current.has("hat")).toBe(true);
  });
});
