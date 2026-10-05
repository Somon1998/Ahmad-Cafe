"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/hooks/useLanguage";
import type { Product } from "@/types/product";
import type { ProductCategory } from "@/types/product";
import { CheckCircle, Package, XCircle } from "lucide-react";
import Link from "next/link";

interface AdminDashboardContentProps {
  products: Product[];
  loadError: boolean;
}

export function AdminDashboardContent({
  products,
  loadError,
}: AdminDashboardContentProps) {
  const { t } = useLanguage();

  const available = products.filter((p) => p.is_available).length;
  const unavailable = products.length - available;

  const byCategory = products.reduce(
    (acc, p) => {
      acc[p.category] = (acc[p.category] ?? 0) + 1;
      return acc;
    },
    {} as Record<ProductCategory, number>,
  );

  return (
    <>
      <AdminHeader
        title={t.admin.dashboard.title}
        description={t.admin.dashboard.description}
        action={
          <Link href="/admin/products/new">
            <Button>{t.admin.dashboard.addProduct}</Button>
          </Link>
        }
      />

      {loadError ? (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {t.admin.dashboard.loadError}
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold">
              <Package className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm text-stone-500">
                {t.admin.dashboard.totalProducts}
              </p>
              <p className="text-3xl font-bold">{products.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <CheckCircle className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm text-stone-500">
                {t.admin.dashboard.available}
              </p>
              <p className="text-3xl font-bold">{available}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-600">
              <XCircle className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm text-stone-500">
                {t.admin.dashboard.unavailable}
              </p>
              <p className="text-3xl font-bold">{unavailable}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-lg font-bold">{t.admin.dashboard.byCategory}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(byCategory).map(([cat, count]) => (
            <Card key={cat} className="!p-4">
              <p className="text-sm text-stone-500">
                {t.categories[cat as ProductCategory]}
              </p>
              <p className="text-xl font-bold">{count}</p>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
