"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { t } = useLanguage();
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <button
        type="button"
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 dark:border-stone-700",
          className,
        )}
        aria-label={t.theme.toggle}
        disabled
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white/80 text-stone-700 transition-all duration-300 hover:scale-105 hover:border-gold hover:text-gold dark:border-stone-700 dark:bg-stone-800/80 dark:text-stone-200 dark:hover:border-gold dark:hover:text-gold",
        className,
      )}
      aria-label={theme === "dark" ? t.theme.light : t.theme.dark}
      suppressHydrationWarning
    >
      {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
}
