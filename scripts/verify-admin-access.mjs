/**
 * Проверка доступа администратора через Supabase Auth + admin_users.
 *
 * Использование:
 *   node scripts/verify-admin-access.mjs email@example.com пароль
 *
 * Требует NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY в .env.local
 * (читает файл вручную, без dotenv).
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  const raw = readFileSync(path, "utf8");
  const env = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i === -1) continue;
    env[trimmed.slice(0, i)] = trimmed.slice(i + 1).trim();
  }
  return env;
}

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error(
    "Укажите email и пароль: node scripts/verify-admin-access.mjs user@mail.com secret",
  );
  process.exit(1);
}

const env = loadEnvLocal();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error("В .env.local нужны NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(url, anonKey);

const { error: signInError } = await supabase.auth.signInWithPassword({
  email: email.trim(),
  password,
});

if (signInError) {
  console.error("Вход не удался:", signInError.message);
  process.exit(1);
}

const { data: adminRow, error: adminError } = await supabase
  .from("admin_users")
  .select("email")
  .maybeSingle();

await supabase.auth.signOut();

if (adminError) {
  console.error("Ошибка проверки admin_users:", adminError.message);
  process.exit(1);
}

if (!adminRow) {
  console.log("FAIL: пользователь вошёл в Auth, но email нет в admin_users (или RLS не видит строку).");
  process.exit(1);
}

console.log("OK: доступ администратора для", adminRow.email);
