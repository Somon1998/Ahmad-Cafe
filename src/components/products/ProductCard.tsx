"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { IMAGES } from "@/constants/images";
import { useLanguage } from "@/hooks/useLanguage";
import { formatPrice } from "@/lib/utils";
import {
  getProductDescription,
  getProductName,
} from "@/lib/product-i18n";
import { ProductConfigModal } from "@/components/products/ProductConfigModal";
import type { ProductWithOptions } from "@/types/product";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

interface ProductCardProps {
  product: ProductWithOptions;
  index?: number;
}

interface ProductDescriptionProps {
  text: string;
  showMoreLabel: string;
  showLessLabel: string;
}

const PLACEHOLDER = IMAGES.placeholder;

function ProductDescription({
  text,
  showMoreLabel,
  showLessLabel,
}: ProductDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    if (expanded) return;

    const el = descriptionRef.current;
    if (!el) return;

    setCanExpand(el.scrollHeight > el.clientHeight + 1);
  }, [text, expanded]);

  return (
    <div className="mt-2 min-w-0 flex-1">
      <p
        ref={descriptionRef}
        className={cn(
          "break-words text-sm leading-relaxed text-stone-600 dark:text-stone-400",
          !expanded && "line-clamp-5",
        )}
      >
        {text}
      </p>
      {(canExpand || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-1.5 text-left text-sm font-medium text-gold transition-colors hover:text-gold-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 dark:hover:text-gold-strong"
        >
          {expanded ? showLessLabel : showMoreLabel}
        </button>
      )}
    </div>
  );
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { t, locale } = useLanguage();
  const [configOpen, setConfigOpen] = useState(false);
  const imageSrc = product.image_url ?? PLACEHOLDER;
  const orderDisabled = !product.is_available;
  const displayName = getProductName(product, locale);
  const displayDescription = getProductDescription(product, locale);
  const descriptionKey = `${product.id}-${locale}`;

  // Цена для карточки: если есть варианты — минимальная цена (с префиксом «от»
  // при нескольких вариантах). Иначе — базовая цена товара.
  const variantPrices = product.variants.map((v) => v.price);
  const basePrice =
    variantPrices.length > 0 ? Math.min(...variantPrices) : product.price;
  const priceLabel =
    product.variants.length > 1
      ? `${t.product.priceFrom} ${formatPrice(basePrice)}`
      : formatPrice(basePrice);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition-all duration-300 hover:border-gold/40 hover:shadow-xl hover:shadow-gold/10 dark:border-gold/15 dark:bg-surface dark:hover:border-gold/40",
        !product.is_available && "opacity-80",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-800">
        <Image
          src={imageSrc}
          alt={displayName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <Badge variant="default">{t.categories[product.category]}</Badge>
        </div>
        <div className="absolute right-3 top-3">
          <Badge variant={product.is_available ? "success" : "danger"}>
            {product.is_available
              ? t.product.available
              : t.product.unavailable}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 break-words text-lg font-bold leading-snug text-stone-900 dark:text-white">
          {displayName}
        </h3>
        {displayDescription ? (
          <ProductDescription
            key={descriptionKey}
            text={displayDescription}
            showMoreLabel={t.product.showMore}
            showLessLabel={t.product.showLess}
          />
        ) : (
          <div className="flex-1" />
        )}
        <div className="mt-4 shrink-0 border-t border-stone-100 pt-4 dark:border-stone-800">
          <span className="text-xl font-bold text-gold">{priceLabel}</span>
          {orderDisabled ? (
            <Button
              size="sm"
              variant="outline"
              disabled
              className="mt-3 w-full"
            >
              {t.product.unavailableShort}
            </Button>
          ) : (
            <div className="mt-3">
              <Button
                size="sm"
                variant="primary"
                onClick={() => setConfigOpen(true)}
                className="w-full"
              >
                <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                {t.cart.addToCart}
              </Button>
              {configOpen ? (
                <ProductConfigModal
                  onClose={() => setConfigOpen(false)}
                  product={product}
                  productName={displayName}
                />
              ) : null}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-700">
      <div className="aspect-[4/3] bg-stone-200 dark:bg-stone-800" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 rounded bg-stone-200 dark:bg-stone-700" />
        <div className="h-4 w-full rounded bg-stone-200 dark:bg-stone-700" />
        <div className="h-4 w-5/6 rounded bg-stone-200 dark:bg-stone-700" />
        <div className="h-4 w-4/6 rounded bg-stone-200 dark:bg-stone-700" />
        <div className="h-10 w-full rounded bg-stone-200 dark:bg-stone-700" />
      </div>
    </div>
  );
}
