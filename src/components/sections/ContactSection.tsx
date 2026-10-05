"use client";

import { SITE } from "@/constants/site";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/hooks/useLanguage";
import {
  InstagramIcon,
  TelegramIcon,
  WhatsAppIcon,
} from "@/components/ui/BrandIcons";
import { getWhatsAppGeneralLink } from "@/lib/whatsapp";
import { Clock, MapPin, Phone } from "lucide-react";

export function ContactSection() {
  const { t, locale } = useLanguage();

  return (
    <section id="contact" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t.contact.eyebrow}
          title={t.contact.title}
          subtitle={t.contact.subtitle}
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="space-y-6 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm dark:border-stone-700 dark:bg-stone-900">
              <ContactItem
                icon={MapPin}
                title={t.contact.address}
                value={SITE.address}
              />
              <ContactItem
                icon={Phone}
                title={t.contact.phone}
                value={SITE.phone}
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              />
              <ContactItem
                icon={WhatsAppIcon}
                title={t.common.whatsapp}
                value={t.contact.whatsappWrite}
                href={getWhatsAppGeneralLink(locale)}
                external
              />
              <ContactItem
                icon={TelegramIcon}
                title="Telegram"
                value={SITE.telegramHandle}
                href={SITE.telegram}
                external
              />
              <ContactItem
                icon={InstagramIcon}
                title="Instagram"
                value={SITE.instagramHandle}
                href={SITE.instagram}
                external
              />
              <ContactItem
                icon={Clock}
                title={t.contact.workingHours}
                value={t.site.workingHours}
              />
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="overflow-hidden rounded-2xl border border-stone-200 shadow-lg dark:border-stone-700">
              <iframe
                title={t.contact.mapTitle}
                src={SITE.mapEmbedUrl}
                className="h-[400px] w-full min-h-[320px] border-0 lg:h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ContactItem({
  icon: Icon,
  title,
  value,
  href,
  external,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <div className="flex gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm font-medium text-stone-500">{title}</p>
        <p className="font-semibold text-stone-900 dark:text-white">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="block transition-opacity hover:opacity-80"
      >
        {content}
      </a>
    );
  }

  return content;
}
