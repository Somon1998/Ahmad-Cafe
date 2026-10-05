"use client";

import { HERO_IMAGE } from "@/constants/site";
import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Image from "next/image";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden pt-24"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-gold/15 blur-[120px]" />
        <div className="absolute -right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-brandred/15 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent dark:from-gold/5" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pb-28">
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold-strong dark:text-gold"
          >
            <Sparkles className="h-4 w-4" />
            {t.site.tagline}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl dark:text-white"
          >
            {t.hero.titleLine1}{" "}
            <span className="text-gold">
              {t.hero.titleHighlight}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mx-auto mt-6 max-w-xl text-lg text-stone-600 lg:mx-0 dark:text-stone-400"
          >
            {t.site.description}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-lg lg:max-w-none"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-gold/30 to-brandred/25 blur-2xl" />
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-gold/30 shadow-2xl shadow-gold/20">
            <Image
              src={HERO_IMAGE}
              alt={t.hero.imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-4 -left-4 rounded-2xl border border-gold/30 bg-white/90 px-4 py-3 shadow-xl backdrop-blur dark:border-gold/20 dark:bg-stone-900/90"
          >
            <p className="text-xs text-stone-500 dark:text-stone-400">{t.hero.todayInMenu}</p>
            <p className="font-bold text-gold">{t.hero.dishesCount}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
