import { describe, expect, it } from "vitest";
import { calculateCartTotals, calculateLineItemCost, CartState } from "@/lib/atoms/cart";

function createLine(amount: string, quantity: number, id: string): CartState["lines"]["edges"][number] {
  return {
    node: {
      id,
      quantity,
      cost: {
        totalAmount: {
          amount: "0.00",
          currencyCode: "USD",
        },
      },
      merchandise: {
        id: `${id}-merch`,
        title: "Variant",
        selectedOptions: {},
        price: {
          amount,
          currencyCode: "USD",
        },
        product: {
          id: `${id}-product`,
          title: "Product",
          vendor: "Commergia",
          description: "Desc",
          handle: `${id}-handle`,
          images: { edges: [] },
        },
      },
    },
  };
}

describe("cart atom helpers", () => {
  it("calculates line item cost", () => {
    expect(calculateLineItemCost(12.5, 3, "USD")).toEqual({
      amount: "37.50",
      currencyCode: "USD",
    });
  });

  it("calculates cart totals and quantity", () => {
    const lines: CartState["lines"] = {
      edges: [createLine("10.00", 2, "a"), createLine("15.50", 1, "b")],
    };

    const totals = calculateCartTotals(lines);

    expect(totals.subtotalAmount.amount).toBe("35.50");
    expect(totals.totalAmount.amount).toBe("35.50");
    expect(totals.totalQuantity).toBe(3);
    expect(totals.updatedEdges[0].node.cost.totalAmount.amount).toBe("20.00");
  });
});
