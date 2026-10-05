"use client";

import { SITE } from "@/constants/site";
import { useLanguage } from "@/hooks/useLanguage";
import { getWhatsAppGeneralLink } from "@/lib/whatsapp";
import {
  InstagramIcon,
  TelegramIcon,
  WhatsAppIcon,
} from "@/components/ui/BrandIcons";
import { Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

export function Footer() {
  const { t, locale } = useLanguage();
  const year = new Date().getFullYear();

  const footerLinks = useMemo(
    () => [
      { href: "/menu", label: t.nav.fullMenu },
      { href: "/#about", label: t.nav.aboutCafe },
      { href: "/#contact", label: t.nav.contact },
      { href: "/admin/login", label: t.nav.admin },
    ],
    [t],
  );

  return (
    <footer className="border-t border-gold/20 bg-stone-50 dark:border-gold/15 dark:bg-stone-950">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/images/ahmad-cafe-favicon.png"
                alt={SITE.name}
                width={48}
                height={48}
                className="h-11 w-11 shrink-0 object-contain"
              />
              <span className="text-lg font-bold tracking-wide text-stone-900 dark:text-white">
                {SITE.name}
              </span>
            </Link>
            <p className="mt-4 text-sm text-stone-600 dark:text-stone-400">
              {t.footer.description}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-white">
              {t.footer.navigation}
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-600 transition-colors hover:text-gold dark:text-stone-400 dark:hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-white">
              {t.footer.contacts}
            </h3>
            <ul className="space-y-3 text-sm text-stone-600 dark:text-stone-400">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a href={`tel:${SITE.phone.replace(/\s/g, "")}`}>{SITE.phone}</a>
              </li>
              <li>{SITE.address}</li>
              <li>{t.site.workingHours}</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-white">
              {t.footer.socials}
            </h3>
            <div className="flex gap-3">
              <a
                href={getWhatsAppGeneralLink(locale)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] transition-colors hover:bg-[#25D366] hover:text-white"
                aria-label={t.common.whatsapp}
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
              <a
                href={SITE.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/10 text-sky-600 transition-colors hover:bg-sky-500 hover:text-white"
                aria-label="Telegram"
              >
                <TelegramIcon className="h-5 w-5" />
              </a>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500/10 text-pink-600 transition-colors hover:bg-gradient-to-br hover:from-purple-600 hover:to-orange-500 hover:text-white"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-stone-200 pt-8 text-center text-sm text-stone-500 dark:border-stone-800">
          © {year} {SITE.shortName}. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
