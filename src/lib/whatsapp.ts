import type { Locale } from "@/i18n/config";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { SITE } from "@/constants/site";

export function getWhatsAppNumber(): string {
  return SITE.whatsapp.replace(/\D/g, "");
}

export function buildWhatsAppUrl(message: string): string {
  const phone = getWhatsAppNumber();
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

export function buildOrderMessage(
  productName: string,
  price: number,
  locale: Locale = DEFAULT_LOCALE,
): string {
  return getDictionary(locale).whatsapp.order(productName, price);
}

export function buildGeneralOrderMessage(
  locale: Locale = DEFAULT_LOCALE,
): string {
  return getDictionary(locale).whatsapp.general;
}

export function getWhatsAppOrderLink(
  productName: string,
  price: number,
  locale: Locale = DEFAULT_LOCALE,
): string {
  return buildWhatsAppUrl(buildOrderMessage(productName, price, locale));
}

export function getWhatsAppGeneralLink(
  locale: Locale = DEFAULT_LOCALE,
): string {
  return buildWhatsAppUrl(buildGeneralOrderMessage(locale));
}
