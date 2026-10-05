import type { Locale } from "@/i18n/config";
import type {
  AddToCartInput,
  CartItem,
  CartItemAddon,
  LocalizedText,
} from "@/types/cart";
import type { Addon, ProductVariant, ProductWithOptions } from "@/types/product";

/** Ключ localStorage для корзины (версионируем на случай смены формата). */
export const CART_STORAGE_KEY = "ahmad-cart-v1";

/** Минимальное и максимальное количество единиц в одной позиции.
 *  Верхняя граница согласована с CHECK order_items.quantity <= 100 в БД. */
export const MIN_ITEM_QUANTITY = 1;
export const MAX_ITEM_QUANTITY = 99;

/** Приводит количество к целому числу в допустимом диапазоне. */
export function clampQuantity(value: number): number {
  if (!Number.isFinite(value)) return MIN_ITEM_QUANTITY;
  const int = Math.floor(value);
  if (int < MIN_ITEM_QUANTITY) return MIN_ITEM_QUANTITY;
  if (int > MAX_ITEM_QUANTITY) return MAX_ITEM_QUANTITY;
  return int;
}

/** Локализация текста: выбранный язык → русский (fallback). */
export function localizeText(text: LocalizedText, locale: Locale): string {
  return text[locale]?.trim() || text.ru;
}

function toLocalized(ru: string, tg: string, en: string): LocalizedText {
  const baseRu = ru.trim();
  return {
    ru: baseRu,
    tg: tg.trim() || baseRu,
    en: en.trim() || baseRu,
  };
}

function productLocalizedName(product: ProductWithOptions): LocalizedText {
  const ru = (product.name_ru || product.name || "").trim();
  return {
    ru,
    tg: (product.name_tg || "").trim() || ru,
    en: (product.name_en || "").trim() || ru,
  };
}

function variantLocalizedName(variant: ProductVariant): LocalizedText {
  return toLocalized(variant.name_ru, variant.name_tg, variant.name_en);
}

function addonLocalizedName(addon: Addon): LocalizedText {
  return toLocalized(addon.name_ru, addon.name_tg, addon.name_en);
}

/**
 * Уникальный ключ позиции: productId + variantId + отсортированные addonId.
 * Сортировка addonId гарантирует, что порядок выбора добавок не влияет
 * на определение "одинаковой" позиции.
 */
export function buildLineKey(
  productId: string,
  variantId: string | null,
  addonIds: string[],
): string {
  const addonsPart = [...addonIds].sort().join(",");
  return `${productId}::${variantId ?? "base"}::${addonsPart}`;
}

/** Строит позицию корзины из выбора пользователя (снапшоты + ключ). */
export function buildCartItem(input: AddToCartInput): CartItem {
  const { product, variant, addons, quantity } = input;

  const cartAddons: CartItemAddon[] = addons.map((addon) => ({
    addonId: addon.id,
    name: addonLocalizedName(addon),
    price: addon.price,
  }));

  const key = buildLineKey(
    product.id,
    variant?.id ?? null,
    cartAddons.map((a) => a.addonId),
  );

  return {
    key,
    productId: product.id,
    productName: productLocalizedName(product),
    image_url: product.image_url,
    variantId: variant?.id ?? null,
    variantName: variant ? variantLocalizedName(variant) : null,
    unitPrice: variant ? variant.price : product.price,
    addons: cartAddons,
    quantity: clampQuantity(quantity),
  };
}

/** Сумма добавок для одной единицы позиции. */
export function getAddonsUnitTotal(item: CartItem): number {
  return item.addons.reduce((sum, addon) => sum + addon.price, 0);
}

/** Цена одной единицы позиции с добавками. */
export function getItemUnitTotal(item: CartItem): number {
  return item.unitPrice + getAddonsUnitTotal(item);
}

/** Итог по позиции: (цена варианта + добавки) * количество. */
export function getItemLineTotal(item: CartItem): number {
  return getItemUnitTotal(item) * item.quantity;
}

/** Подытог корзины = сумма line_total по всем позициям (только для UI). */
export function getCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + getItemLineTotal(item), 0);
}

/** Общее количество единиц (для бейджа в шапке). */
export function getCartQuantity(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

// ---------------------------------------------------------------------------
// Безопасное чтение корзины из localStorage
// ---------------------------------------------------------------------------

function isLocalizedText(value: unknown): value is LocalizedText {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.ru === "string" &&
    typeof v.tg === "string" &&
    typeof v.en === "string"
  );
}

function isCartItemAddon(value: unknown): value is CartItemAddon {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.addonId === "string" &&
    typeof v.price === "number" &&
    Number.isFinite(v.price) &&
    isLocalizedText(v.name)
  );
}

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.key === "string" &&
    typeof v.productId === "string" &&
    isLocalizedText(v.productName) &&
    (v.image_url === null || typeof v.image_url === "string") &&
    (v.variantId === null || typeof v.variantId === "string") &&
    (v.variantName === null || isLocalizedText(v.variantName)) &&
    typeof v.unitPrice === "number" &&
    Number.isFinite(v.unitPrice) &&
    Array.isArray(v.addons) &&
    v.addons.every(isCartItemAddon) &&
    typeof v.quantity === "number"
  );
}

/**
 * Разбирает и валидирует корзину из строки localStorage.
 * Любые повреждённые/чужие данные безопасно отбрасываются (возврат []).
 * Количество нормализуется, ключ пересчитывается для целостности.
 */
export function parseStoredCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];

    return data.filter(isCartItem).map((item) => ({
      ...item,
      quantity: clampQuantity(item.quantity),
      key: buildLineKey(
        item.productId,
        item.variantId,
        item.addons.map((a) => a.addonId),
      ),
    }));
  } catch {
    return [];
  }
}
