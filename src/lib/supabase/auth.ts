import { checkIsAdminByEmail } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export { checkIsAdminByEmail } from "@/lib/supabase/admin";

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireAuth(redirectTo = "/admin/login") {
  const user = await getUser();
  if (!user) {
    redirect(redirectTo);
  }
  return user;
}

/** Только email из таблицы admin_users в Supabase (см. supabase/schema.sql). */
export async function requireAdmin(redirectTo = "/admin/login") {
  const user = await requireAuth(redirectTo);
  const supabase = await createClient();
  const isAdmin = await checkIsAdminByEmail(supabase, user.email);

  if (!isAdmin) {
    redirect(redirectTo);
  }

  return user;
}
