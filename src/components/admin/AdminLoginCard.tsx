"use client";

import { LoginForm } from "@/components/admin/LoginForm";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { IMAGES } from "@/constants/images";
import { SITE } from "@/constants/site";
import { useLanguage } from "@/hooks/useLanguage";
import Image from "next/image";
import Link from "next/link";

interface AdminLoginCardProps {
  showConfigError: boolean;
  showAccessDenied?: boolean;
}

export function AdminLoginCard({
  showConfigError,
  showAccessDenied,
}: AdminLoginCardProps) {
  const { t } = useLanguage();
  const configError = showConfigError ? t.admin.configError : null;

  return (
    <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-xl dark:border-stone-800 dark:bg-stone-900">
      <div className="mb-6 flex justify-center">
        <LanguageSwitcher />
      </div>
      <div className="mb-8 text-center">
        <Image
          src={IMAGES.logo}
          alt={SITE.name}
          width={64}
          height={64}
          className="mx-auto mb-4 h-16 w-16 object-contain"
        />
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
          {t.admin.loginTitle}
        </h1>
        <p className="mt-2 text-sm text-stone-500">{SITE.shortName}</p>
      </div>
      <LoginForm
        configError={configError}
        accessDenied={showAccessDenied}
      />
      <p className="mt-6 text-center text-sm text-stone-500">
        <Link href="/" className="text-gold hover:underline">
          {t.admin.backToSite}
        </Link>
      </p>
    </div>
  );
}
