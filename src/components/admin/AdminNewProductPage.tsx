"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { useLanguage } from "@/hooks/useLanguage";
import type { ProductFormData } from "@/types/product";

interface AdminNewProductPageProps {
  onSubmit: (data: ProductFormData) => Promise<{ error: string | null }>;
}

export function AdminNewProductPage({ onSubmit }: AdminNewProductPageProps) {
  const { t } = useLanguage();

  return (
    <>
      <AdminHeader
        title={t.admin.productForm.newTitle}
        description={t.admin.productForm.newDescription}
      />
      <ProductForm onSubmit={onSubmit} />
    </>
  );
}
