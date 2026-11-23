"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import useCart from "@/hooks/use-cart";
import ModeToggle from "@/components/mode-toggle";
import LanguageToggle from "@/components/shared/language-toggle";
import UserMenu from "@/components/store/layout/user-menu";
import { useTranslations } from "@/i18n/locale-provider";

const NavbarActions = () => {
  const cart = useCart();
  const t = useTranslations();

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <LanguageToggle />
      <ModeToggle />
      <UserMenu />
      <Link
        href="/cart"
        className="relative inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-muted"
        aria-label={t.nav.cart}
      >
        <ShoppingCart className="h-5 w-5 text-fox-crimson" />
        <span className="hidden sm:inline">{t.nav.cart}</span>
        {cart.items.length > 0 && (
          <span className="absolute -top-1 end-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-fox-crimson px-1 text-[10px] font-bold text-white">
            {cart.items.length}
          </span>
        )}
      </Link>
    </div>
  );
};

export default NavbarActions;
