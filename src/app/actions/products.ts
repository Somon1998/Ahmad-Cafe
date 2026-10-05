"use server";

import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/lib/supabase/products-server";
import { validateProductForm } from "@/lib/supabase/products";
import { requireAdmin } from "@/lib/supabase/auth";
import type { ProductFormData } from "@/types/product";
import { revalidatePath } from "next/cache";

export async function createProductAction(data: ProductFormData) {
  await requireAdmin();
  const validationError = validateProductForm(data);
  if (validationError) return { error: validationError };

  const result = await createProduct(data);
  if (!result.error) {
    revalidatePath("/");
    revalidatePath("/menu");
    revalidatePath("/admin/products");
  }
  return result;
}

export async function updateProductAction(id: string, data: ProductFormData) {
  await requireAdmin();
  const validationError = validateProductForm(data);
  if (validationError) return { error: validationError };

  const result = await updateProduct(id, data);
  if (!result.error) {
    revalidatePath("/");
    revalidatePath("/menu");
    revalidatePath("/admin/products");
  }
  return result;
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  const result = await deleteProduct(id);
  if (result.success) {
    revalidatePath("/");
    revalidatePath("/menu");
    revalidatePath("/admin/products");
  }
  return result;
}

export async function submitCreateProduct(
  data: ProductFormData,
): Promise<{ error: string | null }> {
  const result = await createProductAction(data);
  return { error: result.error };
}

export async function submitUpdateProduct(
  id: string,
  data: ProductFormData,
): Promise<{ error: string | null }> {
  const result = await updateProductAction(id, data);
  return { error: result.error };
}
