export const LOCALES = ["ru", "tg", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ru";

export const LOCALE_STORAGE_KEY = "cafe-locale";

export const LOCALE_CHANGE_EVENT = "cafe-locale-change";

export const LOCALE_LABELS: Record<Locale, string> = {
  ru: "Рус",
  tg: "Тҷ",
  en: "En",
};

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}
