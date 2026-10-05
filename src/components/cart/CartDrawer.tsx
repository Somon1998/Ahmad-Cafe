"use client";

import { IMAGES } from "@/constants/images";
import { useCart } from "@/hooks/useCart";
import { useDeliveryPrice } from "@/hooks/useDeliveryPrice";
import { useLanguage } from "@/hooks/useLanguage";
import { getItemLineTotal, localizeText } from "@/lib/cart";
import { cn, formatPrice } from "@/lib/utils";
import type { CartItem } from "@/types/cart";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

const PLACEHOLDER = IMAGES.placeholder;

export function CartDrawer() {
  const { t, locale } = useLanguage();
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clear,
    subtotal,
  } = useCart();
  const { deliveryPrice } = useDeliveryPrice();

  const hasItems = items.length > 0;
  const total = subtotal + (hasItems ? deliveryPrice : 0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm"
            onClick={closeCart}
            aria-label={t.cart.close}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-[min(420px,92vw)] flex-col bg-white shadow-2xl dark:bg-stone-950"
            role="dialog"
            aria-modal="true"
            aria-label={t.cart.title}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4 dark:border-stone-800">
              <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900 dark:text-white">
                <ShoppingCart className="h-5 w-5 text-gold" aria-hidden="true" />
                {t.cart.title}
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="flex h-10 w-10 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
                aria-label={t.cart.close}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Body */}
            {hasItems ? (
              <ul className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4">
                {items.map((item) => (
                  <CartLine
                    key={item.key}
                    item={item}
                    localeName={localizeText(item.productName, locale)}
                    variantName={
                      item.variantName
                        ? localizeText(item.variantName, locale)
                        : null
                    }
                    onIncrease={() =>
                      updateQuantity(item.key, item.quantity + 1)
                    }
                    onDecrease={() =>
                      updateQuantity(item.key, item.quantity - 1)
                    }
                    onRemove={() => removeItem(item.key)}
                    addonNames={item.addons.map((a) =>
                      localizeText(a.name, locale),
                    )}
                    decreaseLabel={t.cart.decrease}
                    increaseLabel={t.cart.increase}
                    removeLabel={t.cart.remove}
                  />
                ))}
              </ul>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
                  <ShoppingCart className="h-8 w-8 text-gold" aria-hidden="true" />
                </span>
                <p className="text-lg font-semibold text-stone-800 dark:text-stone-100">
                  {t.cart.empty}
                </p>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  {t.cart.emptyHint}
                </p>
              </div>
            )}

            {/* Footer */}
            {hasItems ? (
              <div className="border-t border-stone-200 px-5 py-4 dark:border-stone-800">
                <dl className="space-y-1.5 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-stone-600 dark:text-stone-400">
                      {t.cart.subtotal}
                    </dt>
                    <dd className="font-medium text-stone-900 dark:text-white">
                      {formatPrice(subtotal)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-stone-600 dark:text-stone-400">
                      {t.cart.delivery}
                    </dt>
                    <dd className="font-medium text-stone-900 dark:text-white">
                      {formatPrice(deliveryPrice)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-stone-100 pt-2 dark:border-stone-800">
                    <dt className="text-base font-bold text-stone-900 dark:text-white">
                      {t.cart.total}
                    </dt>
                    <dd className="text-lg font-bold text-gold">
                      {formatPrice(total)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 flex flex-col gap-2">
                  <button
                    type="button"
                    disabled
                    className="w-full cursor-not-allowed rounded-full bg-stone-200 py-3 text-sm font-semibold text-stone-500 dark:bg-stone-800 dark:text-stone-400"
                    title={t.cart.checkoutSoon}
                  >
                    {t.cart.checkoutSoon}
                  </button>
                  <button
                    type="button"
                    onClick={clear}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-stone-200 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:border-red-300 hover:text-red-600 dark:border-stone-700 dark:text-stone-300"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    {t.cart.clear}
                  </button>
                </div>
              </div>
            ) : null}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

interface CartLineProps {
  item: CartItem;
  localeName: string;
  variantName: string | null;
  addonNames: string[];
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
  decreaseLabel: string;
  increaseLabel: string;
  removeLabel: string;
}

function CartLine({
  item,
  localeName,
  variantName,
  addonNames,
  onIncrease,
  onDecrease,
  onRemove,
  decreaseLabel,
  increaseLabel,
  removeLabel,
}: CartLineProps) {
  const imageSrc = item.image_url ?? PLACEHOLDER;
  const lineTotal = getItemLineTotal(item);

  return (
    <li className="flex gap-3 rounded-2xl border border-stone-200 p-3 dark:border-stone-800">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-800">
        <Image
          src={imageSrc}
          alt={localeName}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 break-words text-sm font-semibold text-stone-900 dark:text-white">
            {localeName}
          </p>
          <button
            type="button"
            onClick={onRemove}
            className="shrink-0 rounded-lg p-1 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
            aria-label={removeLabel}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {variantName ? (
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {variantName}
          </p>
        ) : null}
        {addonNames.length > 0 ? (
          <p className="mt-0.5 line-clamp-2 text-xs text-stone-500 dark:text-stone-400">
            + {addonNames.join(", ")}
          </p>
        ) : null}

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onDecrease}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full border border-stone-200 text-stone-700 transition-colors hover:border-gold/40 dark:border-stone-700 dark:text-stone-200",
              )}
              aria-label={decreaseLabel}
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-bold text-stone-900 dark:text-white">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={onIncrease}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-stone-200 text-stone-700 transition-colors hover:border-gold/40 dark:border-stone-700 dark:text-stone-200"
              aria-label={increaseLabel}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className="text-sm font-bold text-gold">
            {formatPrice(lineTotal)}
          </span>
        </div>
      </div>
    </li>
  );
}
