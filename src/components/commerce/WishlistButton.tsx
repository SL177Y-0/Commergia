"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";

type WishlistButtonProps = {
  handle: string;
  className?: string;
};

export default function WishlistButton({ handle, className }: WishlistButtonProps) {
  const { has, toggle } = useWishlist();
  const active = has(handle);

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("rounded-full", className)}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(handle);
      }}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={cn("h-4 w-4", active ? "fill-current text-red-500" : "text-gray-600")} />
    </Button>
  );
}
