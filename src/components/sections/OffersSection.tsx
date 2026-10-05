"use client";

import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/hooks/useLanguage";
import { getWhatsAppGeneralLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useMemo } from "react";

const OFFER_GRADIENTS = [
  "from-[#a11d16] to-[#5a0f0a]", // глубокий красный
  "from-[#c8951f] to-[#a11d16]", // золото → красный (бренд)
  "from-[#8a6410] to-[#2a1c06]", // тёмное золото → charcoal
] as const;

export function OffersSection() {
  const { t, locale } = useLanguage();

  const offers = useMemo(
    () => [
      { id: "street", ...t.offers.items.street, gradient: OFFER_GRADIENTS[0] },
      { id: "xl", ...t.offers.items.xl, gradient: OFFER_GRADIENTS[1] },
      { id: "evening", ...t.offers.items.evening, gradient: OFFER_GRADIENTS[2] },
    ],
    [t],
  );

  return (
    <section id="offers" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t.offers.eyebrow}
          title={t.offers.title}
          subtitle={t.offers.subtitle}
        />

        <div className="grid gap-6 md:grid-cols-3">
          {offers.map((offer, i) => (
            <Reveal key={offer.id} delay={i * 0.1}>
              <motion.a
                href={getWhatsAppGeneralLink(locale)}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -6 }}
                className={cn(
                  "group relative block overflow-hidden rounded-2xl p-8 text-white shadow-xl",
                  `bg-gradient-to-br ${offer.gradient}`,
                )}
              >
                <span className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-sm font-bold backdrop-blur">
                  {offer.badge}
                </span>
                <h3 className="text-2xl font-bold">{offer.title}</h3>
                <p className="mt-3 text-white/90">{offer.description}</p>
                <span className="mt-6 inline-block text-sm font-semibold underline-offset-4 group-hover:underline">
                  {t.offers.orderPromo}
                </span>
                <div className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/10 blur-2xl transition-transform group-hover:scale-150" />
              </motion.a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
