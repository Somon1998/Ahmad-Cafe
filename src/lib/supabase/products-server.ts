import type { Product, ProductFormData } from "@/types/product";
import {
  isProductStorageImageUrl,
  validateImageUrl,
} from "@/lib/supabase/image-url";
import { buildProductDbPayload } from "@/lib/supabase/products";
import { deleteProductImageServer } from "@/lib/supabase/storage-server";
import { createClient } from "@/lib/supabase/server";

function normalizeImageUrl(imageUrl: string | null | undefined): string | null {
  if (imageUrl == null || imageUrl.trim() === "") return null;
  return imageUrl.trim();
}

const TABLE = "products";

export async function getAvailableProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("is_available", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as Product;
}

export async function createProduct(
  payload: ProductFormData,
): Promise<{ product: Product | null; error: string | null }> {
  const imageError = validateImageUrl(payload.image_url);
  if (imageError) {
    return { product: null, error: imageError };
  }

  const dbPayload = buildProductDbPayload(payload);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      ...dbPayload,
      image_url: normalizeImageUrl(dbPayload.image_url),
    })
    .select()
    .single();

  if (error) {
    return { product: null, error: "Не удалось создать блюдо. Проверьте данные." };
  }
  return { product: data as Product, error: null };
}

export async function updateProduct(
  id: string,
  payload: ProductFormData,
): Promise<{ product: Product | null; error: string | null }> {
  const imageError = validateImageUrl(payload.image_url);
  if (imageError) {
    return { product: null, error: imageError };
  }

  const dbPayload = buildProductDbPayload(payload);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .update({
      ...dbPayload,
      image_url: normalizeImageUrl(dbPayload.image_url),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { product: null, error: "Не удалось обновить блюдо." };
  }
  return { product: data as Product, error: null };
}

export async function deleteProduct(
  id: string,
): Promise<{ success: boolean; error: string | null; warning: string | null }> {
  const product = await getProductById(id);
  let warning: string | null = null;

  if (product?.image_url && isProductStorageImageUrl(product.image_url)) {
    const imageResult = await deleteProductImageServer(product.image_url);
    if (!imageResult.success) {
      warning =
        imageResult.error ??
        "Блюдо удалено, но файл изображения остался в Storage.";
      console.warn(
        `[deleteProduct] Не удалось удалить изображение для ${id}:`,
        imageResult.error,
      );
    }
  }

  const supabase = await createClient();
  const { error } = await supabase.from(TABLE).delete().eq("id", id);

  if (error) {
    return { success: false, error: "Не удалось удалить блюдо.", warning: null };
  }
  return { success: true, error: null, warning };
}
