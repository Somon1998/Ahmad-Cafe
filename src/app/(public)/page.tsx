import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { HeroSection } from "@/components/sections/HeroSection";
import { MenuSection } from "@/components/sections/MenuSection";
import { OffersSection } from "@/components/sections/OffersSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MenuSection limit={6} showAllLink />
      <AboutSection />
      <OffersSection />
      <GallerySection />
      <ContactSection />
    </>
  );
}
