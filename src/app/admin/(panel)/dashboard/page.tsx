import { AdminDashboardContent } from "@/components/admin/AdminDashboardContent";
import { getAllProducts } from "@/lib/supabase/products-server";
import { requireAdmin } from "@/lib/supabase/auth";

export default async function AdminDashboardPage() {
  await requireAdmin();

  let products: Awaited<ReturnType<typeof getAllProducts>> = [];
  let loadError = false;

  try {
    products = await getAllProducts();
  } catch {
    loadError = true;
  }

  return (
    <AdminDashboardContent products={products} loadError={loadError} />
  );
}
