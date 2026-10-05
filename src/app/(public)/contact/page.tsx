import { ContactSection } from "@/components/sections/ContactSection";
import { SITE } from "@/constants/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Контакты",
  description: `Контакты ${SITE.name} — адрес, телефон, WhatsApp и часы работы.`,
};

export default function ContactPage() {
  return (
    <div className="pt-28">
      <ContactSection />
    </div>
  );
}
