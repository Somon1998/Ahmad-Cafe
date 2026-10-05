import { createClientSafe } from "@/lib/supabase/client";
import { SUPABASE_CONFIG_HINT } from "@/lib/supabase/env";
import type { Product } from "@/types/product";

const TABLE = "products";

export async function getProductsClient(): Promise<{
  products: Product[];
  error: string | null;
}> {
  try {
    const supabase = createClientSafe();
    if (!supabase) {
      return {
        products: [],
        error: `Supabase не настроен. ${SUPABASE_CONFIG_HINT}`,
      };
    }

    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return { products: [], error: "Не удалось загрузить меню." };
    }
    return { products: (data ?? []) as Product[], error: null };
  } catch {
    return {
      products: [],
      error: `Supabase не настроен. ${SUPABASE_CONFIG_HINT}`,
    };
  }
}
