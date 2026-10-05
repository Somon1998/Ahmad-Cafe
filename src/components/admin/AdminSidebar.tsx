"use client";

import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { IMAGES } from "@/constants/images";
import { SITE } from "@/constants/site";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Package,
  Plus,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

export function AdminSidebar() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const links = useMemo(
    () => [
      { href: "/admin/dashboard", label: t.admin.nav.dashboard, icon: LayoutDashboard },
      { href: "/admin/products", label: t.admin.nav.products, icon: Package },
      { href: "/admin/products/new", label: t.admin.nav.add, icon: Plus },
    ],
    [t],
  );

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-full flex-col border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950 lg:fixed lg:inset-y-0 lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-2 border-b border-stone-200 px-6 py-5 dark:border-stone-800">
        <Image
          src={IMAGES.logo}
          alt={SITE.name}
          width={36}
          height={36}
          className="h-9 w-9 shrink-0 object-contain"
        />
        <span className="font-bold text-stone-900 dark:text-white">
          {t.admin.sidebarTitle}
        </span>
      </div>

      <div className="border-b border-stone-200 p-4 dark:border-stone-800 lg:border-b-0">
        <LanguageSwitcher className="w-full justify-center" />
      </div>

      <nav className="flex flex-1 flex-row gap-1 overflow-x-auto p-3 lg:flex-col lg:overflow-visible">
        {links.map((link) => {
          const Icon = link.icon;
          const active =
            pathname === link.href ||
            (link.href === "/admin/products" &&
              pathname.startsWith("/admin/products") &&
              pathname !== "/admin/products/new");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "bg-gold/10 text-gold dark:text-gold"
                  : "text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800",
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-stone-200 p-3 dark:border-stone-800">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <LogOut className="h-4 w-4" />
          {t.admin.logout}
        </button>
      </div>
    </aside>
  );
}
