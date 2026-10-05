"use client";

import type { ProductWithOptions } from "@/types/product";
import type { MenuFilter } from "@/constants/categories";
import { useLanguage } from "@/hooks/useLanguage";
import { AnimatePresence } from "framer-motion";
import { ProductCard, ProductCardSkeleton } from "./ProductCard";

interface ProductGridProps {
  products: ProductWithOptions[];
  filter: MenuFilter;
  loading?: boolean;
  error?: string | null;
}

function filterProducts(
  products: ProductWithOptions[],
  filter: MenuFilter,
): ProductWithOptions[] {
  if (filter === "all") return products;
  return products.filter((p) => p.category === filter);
}

export function ProductGrid({
  products,
  filter,
  loading,
  error,
}: ProductGridProps) {
  const { t } = useLanguage();
  const filtered = filterProducts(products, filter);

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/50">
        <p className="font-medium text-red-800 dark:text-red-200">
          {t.menu.loadError}
        </p>
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {t.menu.loadErrorHint}
        </p>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 p-12 text-center dark:border-stone-700">
        <p className="text-lg font-medium text-stone-700 dark:text-stone-300">
          {t.menu.emptyTitle}
        </p>
        <p className="mt-2 text-sm text-stone-500">{t.menu.emptyHint}</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </AnimatePresence>
  );
}
