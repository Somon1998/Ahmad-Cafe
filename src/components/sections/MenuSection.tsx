"use client";

import type { MenuFilter } from "@/constants/categories";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/hooks/useLanguage";
import { useMenu } from "@/hooks/useMenu";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface MenuSectionProps {
  showAllLink?: boolean;
  limit?: number;
}

export function MenuSection({ showAllLink = true, limit }: MenuSectionProps) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<MenuFilter>("all");
  const { products, loading, error } = useMenu(true);
  const displayProducts = limit ? products.slice(0, limit) : products;

  return (
    <section id="menu" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t.menu.eyebrow}
          title={t.menu.title}
          subtitle={t.menu.subtitle}
        />
        <div className="mb-10">
          <ProductFilters active={filter} onChange={setFilter} />
        </div>
        <ProductGrid
          products={displayProducts}
          filter={filter}
          loading={loading}
          error={error}
        />
        {showAllLink && limit ? (
          <div className="mt-12 text-center">
            <Link href="/menu">
              <Button variant="outline" size="lg">
                {t.menu.fullMenu}
              </Button>
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
