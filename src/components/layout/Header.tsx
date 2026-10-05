"use client";

import { CartButton } from "@/components/cart/CartButton";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SITE } from "@/constants/site";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-40 w-full transition-all duration-500",
          scrolled
            ? "border-b border-gold/20 bg-white/90 py-3 shadow-sm backdrop-blur-xl dark:border-gold/15 dark:bg-stone-950/90"
            : "bg-transparent py-5",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5"
            aria-label={`${SITE.name}${t.header.homeAria}`}
          >
            <Image
              src="/images/ahmad-cafe-favicon.png"
              alt={SITE.name}
              width={52}
              height={52}
              priority
              className="h-9 w-9 shrink-0 object-contain transition-transform group-hover:scale-105 sm:h-12 sm:w-12"
            />
            <span className="flex flex-col leading-tight">
              <span className="text-lg font-bold tracking-wide text-stone-900 dark:text-white">
                {SITE.name}
              </span>
              <span className="hidden text-xs text-gold sm:block">
                {t.header.tagline}
              </span>
            </span>
          </Link>

          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label={t.header.mainNav}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-gold/10 hover:text-gold dark:text-stone-300 dark:hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher className="hidden lg:inline-flex" />
            <ThemeToggle />
            <CartButton />
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-stone-700 lg:hidden dark:border-gold/25 dark:text-stone-200"
              onClick={() => setMenuOpen(true)}
              aria-label={t.header.openMenu}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
