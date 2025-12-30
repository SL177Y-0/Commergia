"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, ShoppingBag, User } from "lucide-react";
import { parseCookies, destroyCookie } from "nookies";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/view/Logo";
import MegaMenu from "@/components/layout/MegaMenu";
import MobileNav from "@/components/layout/MobileNav";
import SearchBar from "@/components/commerce/SearchBar";
import CurrencySelector from "@/components/commerce/CurrencySelector";
import { useCartActions } from "@/lib/atoms/cart";
import { useUIActions } from "@/lib/atoms/ui";

export default function Header() {
  const router = useRouter();
  const { cart, initializeCart } = useCartActions();
  const { openCartDrawer } = useUIActions();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [customerAccessToken, setCustomerAccessToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!cart?.id) {
      initializeCart();
    }
    // initializeCart comes from a hook action object and is recreated on render.
    // We intentionally trigger this effect only when cart id changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart?.id]);

  useEffect(() => {
    const cookies = parseCookies();
    setCustomerAccessToken(cookies.customerAccessToken);
  }, []);

  const handleLogout = () => {
    destroyCookie(null, "customerAccessToken", { path: "/" });
    setCustomerAccessToken(undefined);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 md:px-6">
        <button className="inline-flex md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden md:flex md:flex-1 md:items-center md:gap-6">
          <MegaMenu />
          <Link className="text-sm font-medium uppercase tracking-wide text-gray-800" href="/collections/men">
            Men
          </Link>
          <Link className="text-sm font-medium uppercase tracking-wide text-gray-800" href="/collections/women">
            Women
          </Link>
          <Link className="text-sm font-medium uppercase tracking-wide text-gray-800" href="/blog">
            Blog
          </Link>
          <Link className="text-sm font-medium uppercase tracking-wide text-gray-800" href="/about">
            About
          </Link>
        </div>

        <div className="mx-auto md:mx-0 md:flex-none">
          <Logo />
        </div>

        <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
          <div className="hidden md:block">
            <SearchBar compact />
          </div>
          <div className="hidden md:block">
            <CurrencySelector />
          </div>

          <Button variant="ghost" size="icon" onClick={openCartDrawer} aria-label="Open cart drawer">
            <ShoppingBag className="h-4 w-4" />
          </Button>

          {cart?.totalQuantity > 0 && (
            <Badge className="-ml-3 -mt-4 h-5 min-w-5 rounded-full px-1 text-[10px]" variant="default">
              {cart.totalQuantity}
            </Badge>
          )}

          {customerAccessToken ? (
            <>
              <Button variant="ghost" size="icon" onClick={() => router.push("/account")} aria-label="Account">
                <User className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => router.push("/auth")}>
              Login
            </Button>
          )}
        </div>
      </div>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
