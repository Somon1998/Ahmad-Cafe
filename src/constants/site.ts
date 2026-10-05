import { IMAGES } from "@/constants/images";

export const SITE = {
  name: "AHMAD CAFE",
  shortName: "Ahmad Cafe",
  tagline: "Свежая еда и шаурма",
  description:
    "Ahmad Cafe — свежая еда, сочная шаурма и пицца. Готовим блюда свежими каждый день и доставляем по городу.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  phone: "+992 93 999 9029",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "992939999029",
  telegram: "https://t.me/Karimzoda_IT_frontend",
  instagram: "https://www.instagram.com/ahmad.cafe.1",
  telegramHandle: "@Karimzoda_IT_frontend",
  instagramHandle: "@ahmad.cafe.1",
  address: "г. Душанбе, ул. Павла Ханжина 36",
  workingHours: "Ежедневно: 10:00 — 23:00",
  mapEmbedUrl:
    "https://www.google.com/maps?q=38.5089426,68.7321371&z=17&output=embed",
} as const;

export const NAV_LINKS = [
  { href: "/#hero", label: "Главная" },
  { href: "/#menu", label: "Меню" },
  { href: "/#about", label: "О нас" },
  { href: "/#offers", label: "Акции" },
  { href: "/#gallery", label: "Галерея" },
  { href: "/#contact", label: "Контакты" },
] as const;

export const FOOTER_LINKS = [
  { href: "/menu", label: "Полное меню" },
  { href: "/#about", label: "О кафе" },
  { href: "/#contact", label: "Контакты" },
  { href: "/admin/login", label: "Админ" },
] as const;

export const BENEFITS = [
  {
    title: "Свежие продукты",
    description: "Готовим только из свежих ингредиентов каждый день.",
    icon: "leaf",
  },
  {
    title: "Быстрая подача",
    description: "Ваш заказ готов за считанные минуты — без долгого ожидания.",
    icon: "clock",
  },
  {
    title: "Вкусная еда",
    description: "Проверенные рецепты и щедрые порции с характером.",
    icon: "flame",
  },
  {
    title: "Доступные цены",
    description: "Премиальный вкус по честной цене для каждого гостя.",
    icon: "wallet",
  },
] as const;

export const OFFERS = [
  {
    id: "combo-1",
    title: "Комбо «Улица»",
    description: "Хот-дог + напиток со скидкой 15% только сегодня.",
    badge: "−15%",
    gradient: "from-[#a11d16] to-[#5a0f0a]",
  },
  {
    id: "combo-2",
    title: "Шаурма XL",
    description: "Двойная порция мяса и соуса по специальной цене.",
    badge: "Хит",
    gradient: "from-[#c8951f] to-[#a11d16]",
  },
  {
    id: "combo-3",
    title: "Шашлык-вечер",
    description: "С 18:00 — шашлык + гарнир в подарок при заказе от 50 сом.",
    badge: "Вечер",
    gradient: "from-red-700 to-amber-800",
  },
] as const;

export const GALLERY_IMAGES = IMAGES.gallery;

export const HERO_IMAGE = IMAGES.hero;
