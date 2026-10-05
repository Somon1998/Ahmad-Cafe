"use client";

import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/hooks/useLanguage";
import { ShoppingCart } from "lucide-react";

export function CartButton() {
  const { t } = useLanguage();
  const { totalQuantity, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-stone-700 transition-colors hover:bg-gold/10 hover:text-gold dark:border-gold/25 dark:text-stone-200"
      aria-label={t.cart.openAria}
    >
      <ShoppingCart className="h-5 w-5" aria-hidden="true" />
      {totalQuantity > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold leading-none text-white shadow">
          {totalQuantity > 99 ? "99+" : totalQuantity}
        </span>
      ) : null}
    </button>
  );
}
