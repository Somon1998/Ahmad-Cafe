"use client";

import { CartContext } from "@/components/providers/CartProvider";
import { useContext } from "react";

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
