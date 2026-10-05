"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_DELIVERY_PRICE,
  getDeliveryPriceClient,
} from "@/lib/supabase/settings-client";

/**
 * Читает стоимость доставки из app_settings.
 * До загрузки возвращает значение по умолчанию (10), чтобы UI не «прыгал».
 * Значение используется только для отображения; итог пересчитает сервер (Этап 5).
 */
export function useDeliveryPrice() {
  const [deliveryPrice, setDeliveryPrice] = useState(DEFAULT_DELIVERY_PRICE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const price = await getDeliveryPriceClient();
      if (cancelled) return;
      setDeliveryPrice(price);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { deliveryPrice, loading };
}
