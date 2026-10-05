"use client";

import { useEffect, useState } from "react";
import type { ProductWithOptions } from "@/types/product";
import { getMenuClient } from "@/lib/supabase/menu-client";

/**
 * Загружает меню (товары + варианты + добавки) на клиенте.
 * onlyAvailable — показывать только доступные товары (для публичного меню).
 */
export function useMenu(onlyAvailable = false) {
  const [products, setProducts] = useState<ProductWithOptions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const { products: data, error: fetchError } = await getMenuClient();
      if (cancelled) return;

      const filtered = onlyAvailable
        ? data.filter((p) => p.is_available)
        : data;
      setProducts(filtered);
      setError(fetchError ? "fetch_error" : null);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [onlyAvailable]);

  return { products, loading, error };
}
