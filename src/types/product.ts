export type ProductCategory =
  | "hotdog"
  | "shaurma"
  | "shashlik"
  | "drinks"
  | "other";

export interface Product {
  id: string;
  /** Legacy: синхронизируется с name_ru при сохранении */
  name: string;
  /** Legacy: синхронизируется с description_ru при сохранении */
  description: string | null;
  name_ru: string;
  name_tg: string;
  name_en: string;
  description_ru: string | null;
  description_tg: string | null;
  description_en: string | null;
  price: number;
  category: ProductCategory;
  image_url: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  name_ru: string;
  name_tg: string;
  name_en: string;
  description_ru: string;
  description_tg: string;
  description_en: string;
  price: number;
  category: ProductCategory;
  is_available: boolean;
  image_url?: string | null;
}

/**
 * Вариант / размер товара (например «маленький 15» / «большой 30»).
 * Один товар может иметь несколько вариантов с разными ценами.
 * Цена заказа берётся из variant.price на сервере (клиент цену не присылает).
 */
export interface ProductVariant {
  id: string;
  product_id: string;
  name_ru: string;
  name_tg: string;
  name_en: string;
  price: number;
  is_available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/**
 * Добавка (сыр, сосиска, чипсы, халапеньо, кукуруза — по 5 сомони).
 * Хранится глобально и переиспользуется между товарами через product_addons.
 */
export interface Addon {
  id: string;
  name_ru: string;
  name_tg: string;
  name_en: string;
  price: number;
  is_available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/** Связь many-to-many: какие добавки разрешены для конкретного товара. */
export interface ProductAddonLink {
  product_id: string;
  addon_id: string;
}

/** Товар вместе с его вариантами и доступными добавками (для меню и корзины). */
export interface ProductWithOptions extends Product {
  variants: ProductVariant[];
  addons: Addon[];
}

/** Данные формы варианта в админке (Этап 6). */
export interface ProductVariantFormData {
  name_ru: string;
  name_tg: string;
  name_en: string;
  price: number;
  is_available: boolean;
  sort_order: number;
}

/** Данные формы добавки в админке (Этап 6). */
export interface AddonFormData {
  name_ru: string;
  name_tg: string;
  name_en: string;
  price: number;
  is_available: boolean;
  sort_order: number;
}
