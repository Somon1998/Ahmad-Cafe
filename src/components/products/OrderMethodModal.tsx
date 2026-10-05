"use client";

import {
  InstagramIcon,
  TelegramIcon,
  WhatsAppIcon,
} from "@/components/ui/BrandIcons";
import { SITE } from "@/constants/site";
import { useLanguage } from "@/hooks/useLanguage";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { getWhatsAppOrderLink } from "@/lib/whatsapp";
import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface OrderMethodModalProps {
  open: boolean;
  onClose: () => void;
  productName: string;
  price: number;
}

const ORDER_METHODS = [
  {
    id: "whatsapp" as const,
    Icon: WhatsAppIcon,
    href: (name: string, price: number, locale: Locale) =>
      getWhatsAppOrderLink(name, price, locale),
    className:
      "bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white focus-visible:ring-[#25D366]/50",
  },
  {
    id: "telegram" as const,
    Icon: TelegramIcon,
    href: () => SITE.telegram,
    className:
      "bg-sky-500/10 text-sky-600 hover:bg-sky-500 hover:text-white focus-visible:ring-sky-500/50 dark:text-sky-400",
  },
  {
    id: "instagram" as const,
    Icon: InstagramIcon,
    href: () => SITE.instagram,
    className:
      "bg-pink-500/10 text-pink-600 hover:bg-gradient-to-br hover:from-purple-600 hover:to-orange-500 hover:text-white focus-visible:ring-pink-500/50 dark:text-pink-400",
  },
] as const;

export function OrderMethodModal({
  open,
  onClose,
  productName,
  price,
}: OrderMethodModalProps) {
  const { t, locale } = useLanguage();

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const labels = {
    whatsapp: t.orderModal.whatsapp,
    telegram: t.orderModal.telegram,
    instagram: t.orderModal.instagram,
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-method-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
        aria-label={t.orderModal.close}
      />

      {/* Layout wrapper */}
      <div className="absolute inset-0 flex items-end sm:items-center sm:justify-center">
        {/* Panel */}
        <div
          className={cn(
            "relative z-10 mb-0 w-full max-w-none touch-manipulation",
            "max-h-[calc(100dvh-24px)] overflow-y-auto overscroll-contain",
            "rounded-t-3xl border border-b-0 border-stone-200 bg-white px-4 pt-4 pb-6 shadow-2xl dark:border-stone-700 dark:bg-stone-900",
            "sm:w-full sm:max-w-md sm:rounded-2xl sm:border sm:p-6",
          )}
        >
          {/* Drag handle (mobile only) */}
          <div
            className="mx-auto mb-4 h-1.5 w-12 shrink-0 rounded-full bg-stone-300 sm:hidden dark:bg-stone-600"
            aria-hidden="true"
          />

          {/* Header */}
          <div className="mb-5 flex items-start justify-between gap-3">
            <h2
              id="order-method-title"
              className="text-xl font-bold leading-snug text-stone-900 sm:text-lg dark:text-white"
            >
              {t.orderModal.title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-stone-500 transition-colors hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 dark:hover:bg-stone-800"
              aria-label={t.orderModal.close}
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Order method buttons */}
          <div className="flex flex-col gap-4">
            {ORDER_METHODS.map(({ id, Icon, href, className }) => (
              <a
                key={id}
                href={href(productName, price, locale)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className={cn(
                  "flex min-h-[64px] w-full items-center gap-4 rounded-2xl px-4 text-base font-semibold transition-colors duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-900",
                  className,
                )}
                aria-label={labels[id]}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/80 dark:bg-stone-950/40">
                  <Icon className="h-8 w-8" />
                </span>
                <span>{labels[id]}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
