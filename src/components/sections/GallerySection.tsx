"use client";

import { IMAGES } from "@/constants/images";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo } from "react";

const GALLERY_KEYS = [
  "shawarma",
  "pizza",
  "process",
  "facade",
  "interior",
  "delivery",
] as const;

export function GallerySection() {
  const { t } = useLanguage();

  const galleryImages = useMemo(
    () =>
      IMAGES.gallery.map((img, i) => ({
        src: img.src,
        alt: t.gallery.alts[GALLERY_KEYS[i]],
      })),
    [t],
  );

  return (
    <section
      id="gallery"
      className="scroll-mt-24 bg-stone-100/80 py-20 dark:bg-stone-900/50 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t.gallery.eyebrow}
          title={t.gallery.title}
          subtitle={t.gallery.subtitle}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 md:grid-cols-3">
          {galleryImages.map((img, i) => (
            <Reveal key={img.src} delay={i * 0.05} className={cnSpan(i)}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-md"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function cnSpan(index: number): string {
  if (index === 0) return "sm:col-span-2 sm:row-span-2 md:col-span-1 md:row-span-1";
  if (index === 4) return "sm:col-span-2 md:col-span-1";
  return "";
}
