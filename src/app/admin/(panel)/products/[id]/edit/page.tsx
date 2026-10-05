import { AdminEditProductPage } from "@/components/admin/AdminEditProductPage";
import { submitUpdateProduct } from "@/app/actions/products";
import { getProductById } from "@/lib/supabase/products-server";
import { requireAdmin } from "@/lib/supabase/auth";
import { notFound } from "next/navigation";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  await requireAdmin();
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const onSubmit = submitUpdateProduct.bind(null, id);

  return <AdminEditProductPage product={product} onSubmit={onSubmit} />;
}
