import { PRODUCT_IMAGES_BUCKET } from "@/constants/storage";
import { extractProductImagePath } from "@/lib/supabase/image-url";
import { createClient } from "@/lib/supabase/client";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Допустимы только JPEG, PNG и WebP.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "Размер файла не должен превышать 5 МБ.";
  }
  return null;
}

function buildFileName(file: File): string {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const id = crypto.randomUUID();
  return `${id}.${ext}`;
}

export async function uploadProductImage(
  file: File,
): Promise<{ url: string | null; error: string | null }> {
  const validationError = validateImageFile(file);
  if (validationError) {
    return { url: null, error: validationError };
  }

  const supabase = createClient();
  const fileName = buildFileName(file);

  const { error: uploadError } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    return { url: null, error: "Не удалось загрузить изображение." };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(fileName);

  return { url: publicUrl, error: null };
}

export async function deleteProductImage(
  imageUrl: string,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const filePath = extractProductImagePath(imageUrl);
    if (!filePath) {
      return { success: false, error: "Некорректный URL изображения." };
    }

    const supabase = createClient();
    const { error } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .remove([filePath]);

    if (error) {
      return { success: false, error: "Не удалось удалить изображение." };
    }
    return { success: true, error: null };
  } catch {
    return { success: false, error: "Ошибка при удалении изображения." };
  }
}
