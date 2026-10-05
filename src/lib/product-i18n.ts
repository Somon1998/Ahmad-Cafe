import type { Locale } from "@/i18n/config";
import type { Product } from "@/types/product";

type ProductNameField = "name_ru" | "name_tg" | "name_en";
type ProductDescriptionField =
  | "description_ru"
  | "description_tg"
  | "description_en";

const NAME_FIELDS: Record<Locale, ProductNameField> = {
  ru: "name_ru",
  tg: "name_tg",
  en: "name_en",
};

const DESCRIPTION_FIELDS: Record<Locale, ProductDescriptionField> = {
  ru: "description_ru",
  tg: "description_tg",
  en: "description_en",
};

function pickNonEmpty(...values: (string | null | undefined)[]): string {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return "";
}

/** Название для отображения: выбранный язык → русский → legacy `name`. */
export function getProductName(product: Product, locale: Locale): string {
  const localized = product[NAME_FIELDS[locale]];
  const localizedTrimmed = localized?.trim();
  if (localizedTrimmed) return localizedTrimmed;

  return pickNonEmpty(product.name_ru, product.name);
}

/** Описание для отображения: выбранный язык → русский → legacy `description`. */
export function getProductDescription(
  product: Product,
  locale: Locale,
): string | null {
  const localized = product[DESCRIPTION_FIELDS[locale]];
  const localizedTrimmed = localized?.trim();
  if (localizedTrimmed) return localizedTrimmed;

  const fallback = pickNonEmpty(product.description_ru, product.description);
  return fallback || null;
}

/** Основное название в админке (русский). */
export function getProductAdminName(product: Product): string {
  return pickNonEmpty(product.name_ru, product.name);
}
