import { ProductsPageClient } from "@/components/admin/ProductsPageClient";
import { deleteProductAction } from "@/app/actions/products";
import { getAllProducts } from "@/lib/supabase/products-server";
import { requireAdmin } from "@/lib/supabase/auth";

export default async function AdminProductsPage() {
  await requireAdmin();

  let products: Awaited<ReturnType<typeof getAllProducts>> = [];
  let loadError = false;

  try {
    products = await getAllProducts();
  } catch {
    loadError = true;
  }

  return (
    <ProductsPageClient
      products={products}
      loadError={loadError}
      deleteAction={deleteProductAction}
    />
  );
}
