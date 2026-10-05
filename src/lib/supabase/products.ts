import { validateImageUrl } from "@/lib/supabase/image-url";
import type { ProductFormData } from "@/types/product";

export function validateProductForm(data: ProductFormData): string | null {
  if (!data.name_ru.trim()) return "Введите название блюда на русском.";
  if (data.name_ru.trim().length < 2) return "Русское название слишком короткое.";
  if (!Number.isFinite(data.price) || data.price < 0) {
    return "Укажите корректную цену (0 или больше).";
  }
  if (!data.category) return "Выберите категорию.";

  const imageError = validateImageUrl(data.image_url);
  if (imageError) return imageError;

  return null;
}

/** Подготовка полей для insert/update: legacy name/description + локали. */
export function buildProductDbPayload(payload: ProductFormData) {
  const nameRu = payload.name_ru.trim();
  const nameTg = payload.name_tg.trim() || nameRu;
  const nameEn = payload.name_en.trim() || nameRu;
  const descriptionRu = payload.description_ru.trim() || null;
  const descriptionTg =
    payload.description_tg.trim() || descriptionRu;
  const descriptionEn =
    payload.description_en.trim() || descriptionRu;

  return {
    name: nameRu,
    description: descriptionRu,
    name_ru: nameRu,
    name_tg: nameTg,
    name_en: nameEn,
    description_ru: descriptionRu,
    description_tg: descriptionTg,
    description_en: descriptionEn,
    price: payload.price,
    category: payload.category,
    image_url: payload.image_url,
    is_available: payload.is_available,
  };
}
