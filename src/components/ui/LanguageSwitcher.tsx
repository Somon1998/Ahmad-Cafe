"use client";

import { LOCALES, LOCALE_LABELS, type Locale } from "@/i18n/config";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  compact?: boolean;
}

export function LanguageSwitcher({
  className,
  compact = false,
}: LanguageSwitcherProps) {
  const { locale, setLocale, t, ready } = useLanguage();

  if (!ready) {
    return (
      <div
        className={cn(
          "h-10 w-[88px] rounded-full border border-stone-200 dark:border-stone-700",
          className,
        )}
        aria-hidden
      />
    );
  }

  return (
    <div
      role="group"
      aria-label={t.lang.switcherLabel}
      className={cn(
        "inline-flex rounded-full border border-stone-200 bg-white/80 p-0.5 dark:border-stone-700 dark:bg-stone-800/80",
        className,
      )}
    >
      {LOCALES.map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code as Locale)}
            aria-pressed={active}
            aria-label={t.lang[code]}
            title={t.lang[code]}
            className={cn(
              "rounded-full px-2.5 py-1.5 text-xs font-semibold transition-colors",
              compact && "px-2 py-1 text-[11px]",
              active
                ? "brand-gradient text-white shadow-sm"
                : "text-stone-600 hover:text-gold dark:text-stone-300 dark:hover:text-gold",
            )}
          >
            {LOCALE_LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}
