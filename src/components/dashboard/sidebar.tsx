"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Layers3,
  Package,
  LogOut,
  Store,
} from "lucide-react";

import FoxLogo from "@/components/brand/fox-logo";
import { useTranslations } from "@/i18n/locale-provider";
import { cn } from "@/lib/utils";
import LanguageToggle from "@/components/shared/language-toggle";
import ModeToggle from "@/components/mode-toggle";

const links = [
  { href: "/dashboard", icon: LayoutDashboard, key: "overview" as const },
  {
    href: "/dashboard/categories",
    icon: Layers3,
    key: "categories" as const,
  },
  { href: "/dashboard/products", icon: Package, key: "products" as const },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/dashboard/login");
    router.refresh();
  };

  return (
    <aside className="flex h-full w-64 flex-col border-e border-sidebar-border bg-sidebar fox-grain">
      <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5">
        <FoxLogo href="/dashboard" size="sm" />
        <div>
          <p className="font-display text-sm font-bold text-fox-crimson">
            {t.dashboard.title}
          </p>
          <p className="text-xs text-muted-foreground">{t.brand.tagline}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {links.map((link) => {
          const active =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href} className="block">
              <motion.span
                whileHover={{ x: 4 }}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-fox-crimson text-white shadow-sm"
                    : "text-sidebar-foreground/80 hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" />
                {t.dashboard[link.key]}
              </motion.span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-sidebar-border p-3">
        <div className="flex items-center justify-between px-1">
          <LanguageToggle />
          <ModeToggle />
        </div>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"
        >
          <Store className="h-4 w-4" />
          {t.nav.home}
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"
        >
          <LogOut className="h-4 w-4" />
          {t.nav.logout}
        </button>
      </div>
    </aside>
  );
}
