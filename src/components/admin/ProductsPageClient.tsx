"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { DeleteProductDialog } from "@/components/admin/DeleteProductDialog";
import { ProductTable } from "@/components/admin/ProductTable";
import { Button } from "@/components/ui/Button";
import { Toast, type ToastType } from "@/components/ui/Toast";
import { useLanguage } from "@/hooks/useLanguage";
import { getProductAdminName } from "@/lib/product-i18n";
import type { Product } from "@/types/product";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProductsPageClientProps {
  products: Product[];
  loadError?: boolean;
  deleteAction: (
    id: string,
  ) => Promise<{
    success: boolean;
    error: string | null;
    warning?: string | null;
  }>;
}

export function ProductsPageClient({
  products,
  loadError,
  deleteAction,
}: ProductsPageClientProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  async function confirmDelete() {
    if (!toDelete) return;
    setIsDeleting(true);
    const { success, error, warning } = await deleteAction(toDelete.id);
    setIsDeleting(false);
    setToDelete(null);

    if (!success) {
      setToast({
        message: error ?? t.admin.products.deleteError,
        type: "error",
      });
      return;
    }

    const message = warning
      ? `${t.admin.products.deleted}. ${warning}`
      : t.admin.products.deleted;
    setToast({ message, type: "success" });
    router.refresh();
  }

  return (
    <>
      <AdminHeader
        title={t.admin.products.title}
        description={t.admin.products.description}
        action={
          <Link href="/admin/products/new">
            <Button>
              <Plus className="h-4 w-4" />
              {t.admin.products.add}
            </Button>
          </Link>
        }
      />
      {loadError ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/50"
        >
          <p className="font-medium text-red-800 dark:text-red-200">
            {t.admin.products.loadError}
          </p>
          <p className="mt-2 text-sm text-red-700/80 dark:text-red-300/80">
            {t.admin.products.loadErrorHint}
          </p>
        </div>
      ) : (
        <ProductTable products={products} onDelete={setToDelete} />
      )}
      <DeleteProductDialog
        open={!!toDelete}
        productName={toDelete ? getProductAdminName(toDelete) : ""}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
      {toast ? (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      ) : null}
    </>
  );
}
