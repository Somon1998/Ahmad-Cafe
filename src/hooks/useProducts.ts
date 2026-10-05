"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/types/product";
import { getProductsClient } from "@/lib/supabase/products-client";

export function useProducts(onlyAvailable = false) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { products: data, error: fetchError } = await getProductsClient();
    const filtered = onlyAvailable
      ? data.filter((p) => p.is_available)
      : data;
    setProducts(filtered);
    setError(fetchError ? "fetch_error" : null);
    setLoading(false);
  }, [onlyAvailable]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const { products: data, error: fetchError } = await getProductsClient();
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

  return { products, loading, error, refetch };
}
