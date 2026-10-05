import { AdminLoginCard } from "@/components/admin/AdminLoginCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const showConfigError = params.error === "config";
  const showAccessDenied = params.error === "forbidden";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-stone-100 via-gold/5 to-stone-100 px-4 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      <AdminLoginCard
        showConfigError={showConfigError}
        showAccessDenied={showAccessDenied}
      />
    </div>
  );
}
