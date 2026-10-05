/** Локальные изображения в public/images (без внешних 404).
 *  hero — реальное фото шаурмы Ahmad Cafe. gallery-* — плейсхолдеры,
 *  замените их на реальные фото (сохраняя имена файлов), логотип уже реальный. */
export const IMAGES = {
  logo: "/images/ahmad-cafe-logo.png",
  hero: "/images/hero-shawarma.jpg",
  placeholder: "/images/placeholder.jpg",
  gallery: [
    {
      src: "/images/gallery-shawarma.jpg",
      alt: "Сочная шаурма Ahmad Cafe",
    },
    {
      src: "/images/gallery-pizza.jpg",
      alt: "Свежая пицца Ahmad Cafe",
    },
    {
      src: "/images/gallery-process.jpg",
      alt: "Приготовление свежих блюд",
    },
    {
      src: "/images/gallery-facade.jpg",
      alt: "Фасад кафе Ahmad Cafe",
    },
    {
      src: "/images/gallery-interior.jpg",
      alt: "Интерьер кафе Ahmad Cafe",
    },
    {
      src: "/images/gallery-delivery.jpg",
      alt: "Доставка блюд по городу",
    },
  ],
} as const;
