import type { Addon, ProductVariant, ProductWithOptions } from "@/types/product";

/**
 * Локализованный текст (снапшот на момент добавления в корзину).
 * Храним все три языка, чтобы корзина корректно переключала язык
 * без повторного запроса в БД.
 */
export interface LocalizedText {
  ru: string;
  tg: string;
  en: string;
}

/**
 * Добавка внутри позиции корзины (снапшот названия и цены).
 * ВАЖНО (безопасность): price здесь — только для UI-расчётов.
 * На Этапе 5 сервер заново возьмёт цену добавки из БД и не будет
 * доверять клиентскому значению.
 */
export interface CartItemAddon {
  addonId: string;
  name: LocalizedText;
  price: number;
}

/**
 * Позиция корзины.
 *
 * Уникальность позиции (key) определяется комбинацией:
 *   productId + variantId + отсортированный набор addonId.
 * Две одинаковые конфигурации складываются в одну позицию (растёт quantity),
 * разный набор добавок или другой вариант — это разные позиции.
 *
 * unitPrice — цена одной единицы выбранного варианта (или базовая цена товара,
 * если у товара пока нет вариантов). Это UI-снапшот, серверу не доверяется.
 */
export interface CartItem {
  key: string;
  productId: string;
  productName: LocalizedText;
  image_url: string | null;
  variantId: string | null;
  variantName: LocalizedText | null;
  unitPrice: number;
  addons: CartItemAddon[];
  quantity: number;
}

/**
 * Вход для добавления в корзину.
 * Провайдер сам построит CartItem (снапшоты, key, клэмп количества).
 */
export interface AddToCartInput {
  product: ProductWithOptions;
  variant: ProductVariant | null;
  addons: Addon[];
  quantity: number;
}
