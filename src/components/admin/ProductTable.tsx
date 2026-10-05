"use client";

import { IMAGES } from "@/constants/images";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/hooks/useLanguage";
import { getProductAdminName } from "@/lib/product-i18n";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductTableProps {
  products: Product[];
  onDelete: (product: Product) => void;
}

const PLACEHOLDER = IMAGES.placeholder;

export function ProductTable({ products, onDelete }: ProductTableProps) {
  const { t } = useLanguage();

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 p-12 text-center dark:border-stone-700">
        <p className="font-medium text-stone-700 dark:text-stone-300">
          {t.admin.products.empty}
        </p>
        <Link href="/admin/products/new" className="mt-4 inline-block">
          <Button>{t.admin.products.addFirst}</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-800 md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-600 dark:bg-stone-900 dark:text-stone-400">
            <tr>
              <th className="px-4 py-3 font-semibold">
                {t.admin.products.table.dish}
              </th>
              <th className="px-4 py-3 font-semibold">
                {t.admin.products.table.category}
              </th>
              <th className="px-4 py-3 font-semibold">
                {t.admin.products.table.price}
              </th>
              <th className="px-4 py-3 font-semibold">
                {t.admin.products.table.status}
              </th>
              <th className="px-4 py-3 font-semibold">
                {t.admin.products.table.actions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
            {products.map((product) => {
              const adminName = getProductAdminName(product);
              return (
              <tr key={product.id} className="bg-white dark:bg-stone-950">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={product.image_url ?? PLACEHOLDER}
                        alt={adminName}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <span className="font-medium text-stone-900 dark:text-white">
                      {adminName}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {t.categories[product.category]}
                </td>
                <td className="px-4 py-3 font-semibold text-gold">
                  {formatPrice(product.price)}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant={product.is_available ? "success" : "danger"}
                  >
                    {product.is_available
                      ? t.product.available
                      : t.product.unavailableShort}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Button size="sm" variant="outline">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      className="!border-red-300 !text-red-600"
                      onClick={() => onDelete(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {products.map((product) => {
          const adminName = getProductAdminName(product);
          return (
          <div
            key={product.id}
            className="rounded-2xl border border-stone-200 p-4 dark:border-stone-800"
          >
            <div className="flex gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={product.image_url ?? PLACEHOLDER}
                  alt={adminName}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1">
                <p className="font-bold">{adminName}</p>
                <p className="text-sm text-stone-500">
                  {t.categories[product.category]} · {formatPrice(product.price)}
                </p>
                <Badge
                  variant={product.is_available ? "success" : "danger"}
                  className="mt-2"
                >
                  {product.is_available
                    ? t.product.available
                    : t.product.unavailableShort}
                </Badge>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Link
                href={`/admin/products/${product.id}/edit`}
                className="flex-1"
              >
                <Button variant="outline" size="sm" className="w-full">
                  {t.common.edit}
                </Button>
              </Link>
              <Button
                size="sm"
                variant="outline"
                className="!text-red-600"
                onClick={() => onDelete(product)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
        })}
      </div>
    </>
  );
}
