import { MenuSection } from "@/components/sections/MenuSection";
import { SITE } from "@/constants/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Меню",
  description: `Полное меню ${SITE.name} — хот-доги, шаурма, шашлык и напитки.`,
};

export default function MenuPage() {
  return (
    <div className="pt-28">
      <MenuSection showAllLink={false} />
    </div>
  );
}
