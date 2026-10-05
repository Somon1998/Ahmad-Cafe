"use client";

import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/hooks/useLanguage";
import { Clock, Flame, Leaf, Wallet } from "lucide-react";
import { useMemo } from "react";

const ICONS = {
  leaf: Leaf,
  clock: Clock,
  flame: Flame,
  wallet: Wallet,
} as const;

export function AboutSection() {
  const { t } = useLanguage();

  const benefits = useMemo(
    () => [
      { key: "fresh" as const, icon: "leaf" as const, ...t.about.benefits.fresh },
      { key: "fast" as const, icon: "clock" as const, ...t.about.benefits.fast },
      { key: "tasty" as const, icon: "flame" as const, ...t.about.benefits.tasty },
      {
        key: "affordable" as const,
        icon: "wallet" as const,
        ...t.about.benefits.affordable,
      },
    ],
    [t],
  );

  return (
    <section
      id="about"
      className="scroll-mt-24 bg-stone-100/80 py-20 dark:bg-stone-900/50 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t.about.eyebrow}
          title={t.about.title}
          subtitle={t.about.subtitle}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, i) => {
            const Icon = ICONS[benefit.icon];
            return (
              <Reveal key={benefit.key} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-lg dark:border-gold/15 dark:bg-surface dark:hover:border-gold/40">
                  <span className="brand-gradient-br mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg shadow-gold/25">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                    {benefit.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
