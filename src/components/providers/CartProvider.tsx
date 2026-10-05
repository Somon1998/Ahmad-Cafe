"use client";

import { getCartQuantity, getCartSubtotal } from "@/lib/cart";
import {
  addCartItem,
  clearCart,
  getCartServerSnapshot,
  getCartSnapshot,
  removeCartItem,
  subscribeCart,
  updateCartQuantity,
} from "@/lib/cart-store";
import type { AddToCartInput, CartItem } from "@/types/cart";
import {
  createContext,
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

interface CartContextValue {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  isOpen: boolean;
  addItem: (input: AddToCartInput) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
  children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  // Источник истины — localStorage через внешнее хранилище.
  // На сервере и при гидратации возвращается пустая корзина (без рассинхрона).
  const items = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getCartServerSnapshot,
  );

  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((input: AddToCartInput) => {
    addCartItem(input);
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    updateCartQuantity(key, quantity);
  }, []);

  const removeItem = useCallback((key: string) => {
    removeCartItem(key);
  }, []);

  const clear = useCallback(() => clearCart(), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalQuantity = useMemo(() => getCartQuantity(items), [items]);
  const subtotal = useMemo(() => getCartSubtotal(items), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalQuantity,
      subtotal,
      isOpen,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      openCart,
      closeCart,
    }),
    [
      items,
      totalQuantity,
      subtotal,
      isOpen,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      openCart,
      closeCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
