/** Значения-заглушки из .env.example — считаются «Supabase не настроен». */
const PLACEHOLDER_VALUES = new Set([
  "https://your-project-id.supabase.co",
  "your-anon-public-key",
]);

export type SupabaseEnv = {
  url: string;
  anonKey: string;
};

function trimEnv(value: string | undefined): string | undefined {
  if (value == null) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/** Прямой доступ к process.env — Next.js инлайнит NEXT_PUBLIC_* только так, не через process.env[name]. */
function readSupabaseUrl(): string | undefined {
  return trimEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

function readSupabaseAnonKey(): string | undefined {
  return trimEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function isPlaceholderSupabaseValue(value: string): boolean {
  if (PLACEHOLDER_VALUES.has(value)) return true;
  if (value.includes("your-project-id")) return true;
  if (value === "your-anon-public-key") return true;
  return false;
}

/**
 * Возвращает URL и anon key, если Supabase реально настроен в .env.local.
 * Поддерживаются JWT (eyJ...) и publishable-ключи (sb_publishable_...).
 */
export function getSupabaseEnv(): SupabaseEnv | null {
  const url = readSupabaseUrl();
  const anonKey = readSupabaseAnonKey();

  if (!url || !anonKey) return null;
  if (isPlaceholderSupabaseValue(url) || isPlaceholderSupabaseValue(anonKey)) {
    return null;
  }

  try {
    new URL(url);
  } catch {
    return null;
  }

  return { url, anonKey };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseEnv() !== null;
}

export const SUPABASE_CONFIG_HINT =
  "Скопируйте .env.example в .env.local и укажите NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY из Supabase → Project Settings → API.";
