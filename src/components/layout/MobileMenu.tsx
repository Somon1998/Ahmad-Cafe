"use client";

import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { SITE } from "@/constants/site";
import { useLanguage } from "@/hooks/useLanguage";
import { getWhatsAppGeneralLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo } from "react";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { t, locale } = useLanguage();

  const navLinks = useMemo(
    () => [
      { href: "/#hero", label: t.nav.home },
      { href: "/#menu", label: t.nav.menu },
      { href: "/#about", label: t.nav.about },
      { href: "/#offers", label: t.nav.offers },
      { href: "/#gallery", label: t.nav.gallery },
      { href: "/#contact", label: t.nav.contact },
    ],
    [t],
  );

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-label={t.mobileMenu.closeOverlay}
          />
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className={cn(
              "fixed right-0 top-0 z-50 flex h-full w-[min(320px,85vw)] flex-col bg-white p-6 shadow-2xl dark:bg-stone-950 lg:hidden",
            )}
            aria-label={t.mobileMenu.mobileNav}
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Image
                  src="/images/ahmad-cafe-favicon.png"
                  alt={SITE.name}
                  width={44}
                  height={44}
                  className="h-9 w-9 shrink-0 object-contain"
                />
                <span className="text-lg font-bold tracking-wide">
                  {SITE.name}
                </span>
              </span>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 hover:bg-stone-100 dark:hover:bg-stone-800"
                aria-label={t.mobileMenu.close}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <LanguageSwitcher className="mb-6 w-full justify-center" />

            <ul className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="block rounded-xl px-4 py-3 text-lg font-medium text-stone-700 hover:bg-gold/10 hover:text-gold dark:text-stone-200 dark:hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <a
              href={getWhatsAppGeneralLink(locale)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 font-semibold text-white"
            >
              <MessageCircle className="h-5 w-5" />
              {t.common.orderWhatsApp}
            </a>
          </motion.nav>
        </>
      ) : null}
    </AnimatePresence>
  );
}
