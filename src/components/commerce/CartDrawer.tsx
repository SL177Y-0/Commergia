"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartActions } from "@/lib/atoms/cart";
import { useUIActions } from "@/lib/atoms/ui";

function formatPrice(amount: string, currencyCode: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "narrowSymbol",
  }).format(Number(amount));
}

export default function CartDrawer() {
  const router = useRouter();
  const { cart, updateItem, removeItem } = useCartActions();
  const { isCartDrawerOpen, closeCartDrawer } = useUIActions();
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isCartDrawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
    );
    focusables?.[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCartDrawer();
        return;
      }

      if (event.key !== "Tab" || !focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isCartDrawerOpen, closeCartDrawer]);

  if (!isCartDrawerOpen) return null;

  return (
    <>
      <button className="fixed inset-0 z-40 bg-black/50" onClick={closeCartDrawer} aria-label="Close cart" />
      <aside
        ref={panelRef}
        className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-gray-200 bg-white p-5 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Cart ({cart.totalQuantity || 0})</h2>
          <Button variant="ghost" size="icon" onClick={closeCartDrawer}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {cart.lines.edges.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
            Your cart is empty.
          </div>
        ) : (
          <div className="space-y-4">
            {cart.lines.edges.map(({ node }) => {
              const image = node.merchandise.product.images.edges[0]?.node;
              return (
                <div className="grid grid-cols-[72px_1fr] gap-3 rounded-lg border border-gray-200 p-3" key={node.id}>
                  <div className="relative h-[72px] w-[72px] overflow-hidden rounded-md bg-gray-100">
                    {image?.url ? (
                      <Image src={image.url} alt={image.altText || node.merchandise.product.title} fill className="object-cover" />
                    ) : null}
                  </div>

                  <div>
                    <p className="text-sm font-medium">{node.merchandise.product.title}</p>
                    <p className="text-xs text-gray-500">{node.merchandise.title}</p>
                    <p className="mt-1 text-sm font-semibold">
                      {formatPrice(node.merchandise.price.amount, node.merchandise.price.currencyCode)}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => updateItem(node.merchandise.id, node.quantity - 1)}>
                        -
                      </Button>
                      <span className="min-w-6 text-center text-sm">{node.quantity}</span>
                      <Button size="sm" variant="outline" onClick={() => updateItem(node.merchandise.id, node.quantity + 1)}>
                        +
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => removeItem(node.merchandise.id)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 space-y-2 border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-semibold">
              {formatPrice(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button className="w-full" variant="outline" onClick={() => {
              closeCartDrawer();
              router.push("/cart");
            }}>
              View Cart
            </Button>
            <Button className="w-full" onClick={() => {
              closeCartDrawer();
              router.push("/checkout");
            }}>
              Checkout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
