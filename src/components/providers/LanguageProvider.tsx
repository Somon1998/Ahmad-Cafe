"use client";

import {
  DEFAULT_LOCALE,
  LOCALE_CHANGE_EVENT,
  LOCALE_STORAGE_KEY,
  isLocale,
  type Locale,
} from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import type { Dictionary } from "@/i18n/types";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
  ready: boolean;
}

export const LanguageContext = createContext<LanguageContextValue | null>(
  null,
);

function getStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored && isLocale(stored)) return stored;
  return null;
}

function getLocaleSnapshot(): Locale {
  return getStoredLocale() ?? DEFAULT_LOCALE;
}

function subscribeToLocale(onStoreChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === LOCALE_STORAGE_KEY) onStoreChange();
  };
  const onLocaleChange = () => onStoreChange();

  window.addEventListener("storage", onStorage);
  window.addEventListener(LOCALE_CHANGE_EVENT, onLocaleChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(LOCALE_CHANGE_EVENT, onLocaleChange);
  };
}

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const locale = useSyncExternalStore(
    subscribeToLocale,
    getLocaleSnapshot,
    () => DEFAULT_LOCALE,
  );

  const ready = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const t = useMemo(() => getDictionary(locale), [locale]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    localStorage.setItem(LOCALE_STORAGE_KEY, next);
    document.documentElement.lang = next;
    window.dispatchEvent(new Event(LOCALE_CHANGE_EVENT));
  }, []);

  const value = useMemo(
    () => ({ locale, setLocale, t, ready }),
    [locale, setLocale, t, ready],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
