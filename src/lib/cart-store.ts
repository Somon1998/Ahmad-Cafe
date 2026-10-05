import {
  buildCartItem,
  CART_STORAGE_KEY,
  clampQuantity,
  parseStoredCart,
} from "@/lib/cart";
import type { AddToCartInput, CartItem } from "@/types/cart";

/**
 * Внешнее хранилище корзины поверх localStorage.
 *
 * Используется через React.useSyncExternalStore — так корзина:
 *   - переживает перезагрузку (источник истины = localStorage);
 *   - синхронизируется между вкладками (событие storage);
 *   - не вызывает setState внутри эффектов (правило react-hooks).
 *
 * getSnapshot возвращает СТАБИЛЬНУЮ ссылку (кэш по «сырой» строке),
 * иначе useSyncExternalStore уйдёт в бесконечный цикл.
 */

type Listener = () => void;

const listeners = new Set<Listener>();
const EMPTY: CartItem[] = [];

let cachedRaw: string | null = null;
let cachedItems: CartItem[] = EMPTY;

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeCart(listener: Listener): () => void {
  listeners.add(listener);

  const onStorage = (e: StorageEvent) => {
    if (e.key === CART_STORAGE_KEY) emit();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function getCartSnapshot(): CartItem[] {
  if (typeof window === "undefined") return EMPTY;

  const raw = localStorage.getItem(CART_STORAGE_KEY);
  if (raw === cachedRaw) return cachedItems;

  cachedRaw = raw;
  cachedItems = parseStoredCart(raw);
  return cachedItems;
}

/** Для SSR и первого (гидратационного) рендера — всегда пустая корзина. */
export function getCartServerSnapshot(): CartItem[] {
  return EMPTY;
}

function write(items: CartItem[]) {
  try {
    const raw = JSON.stringify(items);
    localStorage.setItem(CART_STORAGE_KEY, raw);
    cachedRaw = raw;
  } catch {
    // localStorage недоступен (приватный режим) — держим корзину в памяти.
    cachedRaw = null;
  }
  cachedItems = items;
  emit();
}

export function addCartItem(input: AddToCartInput) {
  const items = getCartSnapshot();
  const newItem = buildCartItem(input);
  const index = items.findIndex((item) => item.key === newItem.key);

  if (index === -1) {
    write([...items, newItem]);
    return;
  }

  const next = [...items];
  next[index] = {
    ...next[index],
    quantity: clampQuantity(next[index].quantity + newItem.quantity),
  };
  write(next);
}

export function updateCartQuantity(key: string, quantity: number) {
  const items = getCartSnapshot();
  const next =
    quantity < 1
      ? items.filter((item) => item.key !== key)
      : items.map((item) =>
          item.key === key
            ? { ...item, quantity: clampQuantity(quantity) }
            : item,
        );
  write(next);
}

export function removeCartItem(key: string) {
  write(getCartSnapshot().filter((item) => item.key !== key));
}

export function clearCart() {
  write([]);
}
