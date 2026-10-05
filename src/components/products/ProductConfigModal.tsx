"use client";

import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/hooks/useLanguage";
import type { Locale } from "@/i18n/config";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Addon, ProductVariant, ProductWithOptions } from "@/types/product";
import { Minus, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

interface ProductConfigModalProps {
  onClose: () => void;
  product: ProductWithOptions;
  productName: string;
}

const MIN_QTY = 1;
const MAX_QTY = 99;

function localizedName(
  entity: { name_ru: string; name_tg: string; name_en: string },
  locale: Locale,
): string {
  const field = `name_${locale}` as const;
  return entity[field]?.trim() || entity.name_ru;
}

export function ProductConfigModal({
  onClose,
  product,
  productName,
}: ProductConfigModalProps) {
  const { t, locale } = useLanguage();
  const { addItem, openCart } = useCart();

  const variants = product.variants;
  const addons = product.addons;
  const hasVariants = variants.length > 0;
  const hasAddons = addons.length > 0;

  // Компонент монтируется только при открытии, поэтому начальное состояние
  // (первый вариант по умолчанию) задаётся сразу, без setState в эффекте.
  const [variantId, setVariantId] = useState<string | null>(
    hasVariants ? variants[0].id : null,
  );
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(MIN_QTY);

  // Блокируем прокрутку фона и закрытие по Escape.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const selectedVariant: ProductVariant | null = useMemo(
    () => variants.find((v) => v.id === variantId) ?? null,
    [variants, variantId],
  );

  const selectedAddons: Addon[] = useMemo(
    () => addons.filter((a) => addonIds.includes(a.id)),
    [addons, addonIds],
  );

  const unitPrice = selectedVariant ? selectedVariant.price : product.price;
  const addonsTotal = useMemo(
    () => selectedAddons.reduce((sum, a) => sum + a.price, 0),
    [selectedAddons],
  );
  const lineTotal = (unitPrice + addonsTotal) * quantity;

  if (typeof document === "undefined") return null;

  const toggleAddon = (id: string) => {
    setAddonIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleAdd = () => {
    addItem({
      product,
      variant: selectedVariant,
      addons: selectedAddons,
      quantity,
    });
    onClose();
    openCart();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-config-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
        aria-label={t.cart.close}
      />

      <div className="absolute inset-0 flex items-end sm:items-center sm:justify-center">
        <div
          className={cn(
            "relative z-10 w-full max-w-none touch-manipulation",
            "max-h-[calc(100dvh-24px)] overflow-y-auto overscroll-contain",
            "rounded-t-3xl border border-b-0 border-stone-200 bg-white px-4 pt-4 pb-6 shadow-2xl dark:border-stone-700 dark:bg-stone-900",
            "sm:w-full sm:max-w-md sm:rounded-2xl sm:border sm:p-6",
          )}
        >
          <div
            className="mx-auto mb-4 h-1.5 w-12 shrink-0 rounded-full bg-stone-300 sm:hidden dark:bg-stone-600"
            aria-hidden="true"
          />

          <div className="mb-5 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-gold">
                {t.cart.configTitle}
              </p>
              <h2
                id="product-config-title"
                className="mt-0.5 break-words text-xl font-bold leading-snug text-stone-900 sm:text-lg dark:text-white"
              >
                {productName}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-stone-500 transition-colors hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 dark:hover:bg-stone-800"
              aria-label={t.cart.close}
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Варианты */}
          {hasVariants ? (
            <div className="mb-5">
              <p className="mb-2 text-sm font-semibold text-stone-800 dark:text-stone-200">
                {t.cart.chooseVariant}
              </p>
              <div className="flex flex-col gap-2">
                {variants.map((variant) => {
                  const active = variant.id === variantId;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setVariantId(variant.id)}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
                        active
                          ? "border-gold bg-gold/10"
                          : "border-stone-200 hover:border-gold/40 dark:border-stone-700",
                      )}
                      aria-pressed={active}
                    >
                      <span className="font-medium text-stone-900 dark:text-white">
                        {localizedName(variant, locale)}
                      </span>
                      <span className="font-semibold text-gold">
                        {formatPrice(variant.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Добавки */}
          {hasAddons ? (
            <div className="mb-5">
              <p className="mb-2 text-sm font-semibold text-stone-800 dark:text-stone-200">
                {t.cart.addonsLabel}
              </p>
              <div className="flex flex-col gap-2">
                {addons.map((addon) => {
                  const checked = addonIds.includes(addon.id);
                  return (
                    <label
                      key={addon.id}
                      className={cn(
                        "flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors",
                        checked
                          ? "border-gold bg-gold/10"
                          : "border-stone-200 hover:border-gold/40 dark:border-stone-700",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAddon(addon.id)}
                          className="h-4 w-4 rounded border-stone-300 text-gold focus:ring-gold/50"
                        />
                        <span className="font-medium text-stone-900 dark:text-white">
                          {localizedName(addon, locale)}
                        </span>
                      </span>
                      <span className="text-sm font-semibold text-stone-600 dark:text-stone-300">
                        +{formatPrice(addon.price)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ) : null}

          {!hasVariants && !hasAddons ? (
            <p className="mb-5 text-sm text-stone-500 dark:text-stone-400">
              {t.cart.noOptionsHint}
            </p>
          ) : null}

          {/* Количество */}
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">
              {t.cart.quantity}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(MIN_QTY, q - 1))}
                disabled={quantity <= MIN_QTY}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-700 transition-colors hover:border-gold/40 disabled:opacity-40 dark:border-stone-700 dark:text-stone-200"
                aria-label={t.cart.decrease}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-lg font-bold text-stone-900 dark:text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(MAX_QTY, q + 1))}
                disabled={quantity >= MAX_QTY}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-700 transition-colors hover:border-gold/40 disabled:opacity-40 dark:border-stone-700 dark:text-stone-200"
                aria-label={t.cart.increase}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleAdd}
          >
            {t.cart.addForTotal(formatPrice(lineTotal))}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
