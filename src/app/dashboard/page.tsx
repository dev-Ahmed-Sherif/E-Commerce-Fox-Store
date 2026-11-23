"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Layers3, Package, Sparkles } from "lucide-react";

import PageTransition, {
  FadeItem,
  StaggerChildren,
} from "@/components/shared/page-transition";
import { useTranslations } from "@/i18n/locale-provider";

type Stats = {
  products: number;
  categories: number;
  featured: number;
};

export default function DashboardOverviewPage() {
  const t = useTranslations();
  const [stats, setStats] = useState<Stats>({
    products: 0,
    categories: 0,
    featured: 0,
  });

  useEffect(() => {
    fetch("/api/dashboard/catalog")
      .then((r) => r.json())
      .then((data) => {
        if (data.stats) setStats(data.stats);
      })
      .catch(() => undefined);
  }, []);

  const cards = [
    {
      label: t.dashboard.totalCategories,
      value: stats.categories,
      icon: Layers3,
      href: "/dashboard/categories",
      tone: "from-fox-crimson/20 to-transparent",
    },
    {
      label: t.dashboard.totalProducts,
      value: stats.products,
      icon: Package,
      href: "/dashboard/products",
      tone: "from-fox-amber/25 to-transparent",
    },
    {
      label: t.dashboard.featured,
      value: stats.featured,
      icon: Sparkles,
      href: "/dashboard/products",
      tone: "from-foreground/10 to-transparent",
    },
  ];

  return (
    <PageTransition>
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-bold tracking-tight"
        >
          {t.dashboard.welcome}
        </motion.h1>
        <p className="mt-2 text-muted-foreground">{t.dashboard.manageStore}</p>
      </div>

      <StaggerChildren className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <FadeItem key={card.label}>
              <Link href={card.href} className="block">
                <div
                  className={`relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-fox-crimson/40 hover:shadow-lg`}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.tone}`}
                  />
                  <div className="relative flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {card.label}
                      </p>
                      <p className="mt-3 font-display text-4xl font-bold">
                        {card.value}
                      </p>
                    </div>
                    <span className="rounded-xl bg-fox-crimson/10 p-3 text-fox-crimson">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                </div>
              </Link>
            </FadeItem>
          );
        })}
      </StaggerChildren>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-8 rounded-2xl border border-dashed border-fox-crimson/40 bg-fox-crimson-soft/40 p-6 dark:bg-fox-crimson/10"
      >
        <h2 className="font-display text-lg font-semibold">
          {t.dashboard.manageStore}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {t.brand.tagline} — {t.store.footerAbout}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/dashboard/categories"
            className="rounded-xl bg-fox-crimson px-4 py-2 text-sm font-medium text-white"
          >
            {t.dashboard.categories}
          </Link>
          <Link
            href="/dashboard/products"
            className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium"
          >
            {t.dashboard.products}
          </Link>
        </div>
      </motion.div>
    </PageTransition>
  );
}
