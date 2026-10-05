import { createClientSafe } from "@/lib/supabase/client";

/** Значение по умолчанию, если Supabase недоступен или настройка не найдена.
 *  Совпадает с миграцией Этапа 3 (app_settings.delivery_price = 10). */
export const DEFAULT_DELIVERY_PRICE = 10;

/**
 * Читает стоимость доставки из app_settings (key = 'delivery_price').
 *
 * Хранение: value — JSONB-число ('10'::jsonb), supabase-js возвращает его
 * уже как JS number. Публичная RLS-политика разрешает читать только
 * строку delivery_price (остальные настройки — админ).
 *
 * При любой ошибке/отсутствии значения возвращаем DEFAULT_DELIVERY_PRICE,
 * чтобы UI корзины не ломался. Финальная сумма всё равно пересчитывается
 * сервером на Этапе 5.
 */
export async function getDeliveryPriceClient(): Promise<number> {
  try {
    const supabase = createClientSafe();
    if (!supabase) return DEFAULT_DELIVERY_PRICE;

    const { data, error } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "delivery_price")
      .maybeSingle();

    if (error || !data) return DEFAULT_DELIVERY_PRICE;

    const price = Number(data.value);
    return Number.isFinite(price) && price >= 0
      ? price
      : DEFAULT_DELIVERY_PRICE;
  } catch {
    return DEFAULT_DELIVERY_PRICE;
  }
}
