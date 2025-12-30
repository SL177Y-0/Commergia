"use client";

import { Button } from "@/components/ui/button";

type StickyAddToCartProps = {
  visible: boolean;
  title: string;
  disabled?: boolean;
  onAdd: () => void;
};

export default function StickyAddToCart({ visible, title, disabled, onAdd }: StickyAddToCartProps) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 p-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{title}</p>
        </div>
        <Button className="shrink-0" onClick={onAdd} disabled={disabled}>
          Add to cart
        </Button>
      </div>
    </div>
  );
}
