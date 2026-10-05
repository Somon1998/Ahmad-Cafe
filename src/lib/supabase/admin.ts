import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Проверка, что текущая сессия принадлежит admin_users.
 * RLS возвращает строку только если lower(email) совпадает с JWT (без учёта регистра в БД).
 */
export async function checkIsAdminByEmail(
  supabase: SupabaseClient,
  email: string | undefined | null,
): Promise<boolean> {
  if (!email?.trim()) return false;

  const { data, error } = await supabase
    .from("admin_users")
    .select("email")
    .maybeSingle();

  return !error && !!data;
}
