import { PRODUCT_IMAGES_BUCKET } from "@/constants/storage";

const PUBLIC_OBJECT_PREFIX = `/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/`;

/** Пустое значение или публичный URL из bucket product-images. */
export function validateImageUrl(
  url: string | null | undefined,
): string | null {
  if (url == null || url.trim() === "") {
    return null;
  }

  const trimmed = url.trim();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");

  if (!supabaseUrl) {
    return "Некорректный URL изображения.";
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return "Некорректный URL изображения.";
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return "Некорректный URL изображения.";
  }

  const base = new URL(supabaseUrl);
  if (parsed.origin !== base.origin) {
    return "Разрешены только изображения из Supabase Storage.";
  }

  if (!parsed.pathname.startsWith(PUBLIC_OBJECT_PREFIX)) {
    return "Разрешены только изображения из bucket product-images.";
  }

  const filePath = parsed.pathname.slice(PUBLIC_OBJECT_PREFIX.length);
  if (!filePath || filePath.includes("..")) {
    return "Некорректный путь к изображению.";
  }

  return null;
}

export function isProductStorageImageUrl(url: string): boolean {
  return validateImageUrl(url) === null && url.trim().length > 0;
}

export function extractProductImagePath(imageUrl: string): string | null {
  if (validateImageUrl(imageUrl) !== null) {
    return null;
  }

  try {
    const parsed = new URL(imageUrl.trim());
    return parsed.pathname.slice(PUBLIC_OBJECT_PREFIX.length) || null;
  } catch {
    return null;
  }
}
