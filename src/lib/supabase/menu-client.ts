import { createClientSafe } from "@/lib/supabase/client";
import { SUPABASE_CONFIG_HINT } from "@/lib/supabase/env";
import type {
  Addon,
  Product,
  ProductVariant,
  ProductWithOptions,
} from "@/types/product";

const TABLE = "products";

/**
 * Строка ответа Supabase: товар + вложенные варианты и добавки (через связь).
 * RLS для анонимного клиента возвращает только доступные (is_available=true)
 * варианты и добавки, поэтому дополнительная фильтрация — лишь подстраховка.
 */
interface ProductRow extends Product {
  variants: ProductVariant[] | null;
  product_addons: { addon: Addon | null }[] | null;
}

function bySortOrder<T extends { sort_order: number }>(a: T, b: T): number {
  return a.sort_order - b.sort_order;
}

/**
 * Загружает меню вместе с вариантами и добавками одним запросом
 * (вложенный select через внешние ключи product_variants / product_addons).
 *
 * Данные read-only: клиент цены НЕ отправляет обратно, на Этапе 5 сервер
 * заново пересчитает всё из БД.
 */
export async function getMenuClient(): Promise<{
  products: ProductWithOptions[];
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
      .select(
        `*,
         variants:product_variants(*),
         product_addons(addon:addons(*))`,
      )
      .order("created_at", { ascending: false });

    if (error) {
      return { products: [], error: "Не удалось загрузить меню." };
    }

    const rows = (data ?? []) as ProductRow[];

    const products: ProductWithOptions[] = rows.map((row) => {
      const { variants, product_addons, ...product } = row;

      const parsedVariants = (variants ?? [])
        .filter((v) => v.is_available)
        .sort(bySortOrder);

      const parsedAddons = (product_addons ?? [])
        .map((link) => link.addon)
        .filter((addon): addon is Addon => addon !== null && addon.is_available)
        .sort(bySortOrder);

      return {
        ...(product as Product),
        variants: parsedVariants,
        addons: parsedAddons,
      };
    });

    return { products, error: null };
  } catch {
    return {
      products: [],
      error: `Supabase не настроен. ${SUPABASE_CONFIG_HINT}`,
    };
  }
}
