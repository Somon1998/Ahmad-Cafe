"use client";

import { LanguageContext } from "@/components/providers/LanguageProvider";
import { useContext } from "react";

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
