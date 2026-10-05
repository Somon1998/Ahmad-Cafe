"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toast, type ToastType } from "@/components/ui/Toast";
import { useLanguage } from "@/hooks/useLanguage";
import { createClientSafe } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LoginFormProps {
  configError?: string | null;
  accessDenied?: boolean;
}

export function LoginForm({ configError, accessDenied }: LoginFormProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClientSafe();

    if (!supabase) {
      setToast({
        message: t.admin.login.supabaseNotConfigured,
        type: "error",
      });
      return;
    }

    if (!email.trim() || !password) {
      setToast({
        message: t.admin.login.credentialsRequired,
        type: "error",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setLoading(false);
      setToast({
        message: t.admin.login.invalidCredentials,
        type: "error",
      });
      return;
    }

    const { data: adminRow, error: adminError } = await supabase
      .from("admin_users")
      .select("email")
      .maybeSingle();

    if (adminError || !adminRow) {
      await supabase.auth.signOut();
      setLoading(false);
      setToast({
        message: t.admin.login.accessDenied,
        type: "error",
      });
      return;
    }

    setLoading(false);

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <>
      {accessDenied ? (
        <p
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100"
        >
          {t.admin.login.accessDenied}
        </p>
      ) : null}
      {configError ? (
        <p
          role="alert"
          className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100"
        >
          {configError}
        </p>
      ) : null}
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label={t.admin.login.email}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label={t.admin.login.password}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" isLoading={loading}>
          {t.admin.login.submit}
        </Button>
      </form>
      {toast ? (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      ) : null}
    </>
  );
}
