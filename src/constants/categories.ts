import type { ProductCategory } from "@/types/product";

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "hotdog",
  "shaurma",
  "shashlik",
  "drinks",
  "other",
];

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  hotdog: "Хот-доги",
  shaurma: "Шаурма",
  shashlik: "Шашлык",
  drinks: "Напитки",
  other: "Прочее",
};

export type MenuFilter = "all" | ProductCategory;

export const MENU_FILTERS: { value: MenuFilter; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "hotdog", label: "Хот-доги" },
  { value: "shaurma", label: "Шаурма" },
  { value: "shashlik", label: "Шашлык" },
  { value: "drinks", label: "Напитки" },
];
