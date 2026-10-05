import { AdminNewProductPage } from "@/components/admin/AdminNewProductPage";
import { submitCreateProduct } from "@/app/actions/products";
import { requireAdmin } from "@/lib/supabase/auth";

export default async function NewProductPage() {
  await requireAdmin();

  return <AdminNewProductPage onSubmit={submitCreateProduct} />;
}
