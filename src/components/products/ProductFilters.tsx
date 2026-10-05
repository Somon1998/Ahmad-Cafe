"use client";

import { MENU_FILTERS, type MenuFilter } from "@/constants/categories";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProductFiltersProps {
  active: MenuFilter;
  onChange: (filter: MenuFilter) => void;
}

export function ProductFilters({ active, onChange }: ProductFiltersProps) {
  const { t } = useLanguage();

  return (
    <div
      className="flex flex-wrap justify-center gap-2"
      role="tablist"
      aria-label={t.menu.filterAria}
    >
      {MENU_FILTERS.map((filter) => {
        const isActive = active === filter.value;
        const label = t.categories[filter.value];
        return (
          <button
            key={filter.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(filter.value)}
            className={cn(
              "relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
              isActive
                ? "text-white"
                : "text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800",
            )}
          >
            {isActive ? (
              <motion.span
                layoutId="menu-filter-pill"
                className="brand-gradient absolute inset-0 rounded-full shadow-lg shadow-gold/25"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            ) : null}
            <span className="relative z-10">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
