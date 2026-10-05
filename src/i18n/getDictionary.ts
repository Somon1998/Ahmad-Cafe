import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { en } from "@/i18n/dictionaries/en";
import { ru } from "@/i18n/dictionaries/ru";
import { tg } from "@/i18n/dictionaries/tg";

const dictionaries: Record<Locale, Dictionary> = {
  ru,
  tg,
  en,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
