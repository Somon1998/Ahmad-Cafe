import { createClient } from "@/lib/supabase/server";
import { extractProductImagePath } from "@/lib/supabase/image-url";
import { PRODUCT_IMAGES_BUCKET } from "@/constants/storage";

export async function deleteProductImageServer(
  imageUrl: string,
): Promise<{ success: boolean; error: string | null }> {
  const filePath = extractProductImagePath(imageUrl);
  if (!filePath) {
    return { success: false, error: "Некорректный URL изображения." };
  }

  try {
    const supabase = await createClient();
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
