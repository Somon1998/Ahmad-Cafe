"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { useLanguage } from "@/hooks/useLanguage";
import { getProductAdminName } from "@/lib/product-i18n";
import type { Product, ProductFormData } from "@/types/product";

interface AdminEditProductPageProps {
  product: Product;
  onSubmit: (data: ProductFormData) => Promise<{ error: string | null }>;
}

export function AdminEditProductPage({
  product,
  onSubmit,
}: AdminEditProductPageProps) {
  const { t } = useLanguage();

  return (
    <>
      <AdminHeader
        title={t.admin.productForm.editTitle}
        description={getProductAdminName(product)}
      />
      <ProductForm product={product} onSubmit={onSubmit} />
    </>
  );
}
