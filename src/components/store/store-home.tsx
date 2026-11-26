"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import type { DemoCategory, DemoProduct } from "@/lib/demo-data";
import { useLocale, useTranslations } from "@/i18n/locale-provider";
import {
  FadeItem,
  StaggerChildren,
} from "@/components/shared/page-transition";
import FoxLogo from "@/components/brand/fox-logo";

type StoreHomeProps = {
  categories: DemoCategory[];
  products: DemoProduct[];
};

export default function StoreHome({ categories, products }: StoreHomeProps) {
  const t = useTranslations();
  const { locale } = useLocale();

  return (
    <main className="pb-24">
      <section className="relative min-h-[88vh] overflow-hidden">
        <div className="absolute inset-0 bg-fox-hero" />
        <div className="absolute inset-0 fox-grain opacity-50" />
        <motion.div
          className="absolute -start-20 top-24 h-72 w-72 rounded-full bg-fox-crimson/30 blur-3xl"
          animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -end-16 bottom-10 h-80 w-80 rounded-full bg-fox-amber/20 blur-3xl"
          animate={{ opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <FoxLogo href={undefined} size="lg" showWordmark />
            <h1 className="mt-8 font-display text-4xl font-bold leading-tight text-white md:text-6xl">
              {t.store.heroTitle}
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/80 md:text-lg">
              {t.store.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#featured"
                className="rounded-xl bg-fox-crimson px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fox-crimson/30 transition hover:bg-fox-crimson/90"
              >
                {t.nav.shop}
              </Link>
              <Link
                href="#collections"
                className="rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                {t.store.browseCategories}
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="fox-laser-line absolute bottom-0 h-px w-full" />
      </section>

      <section id="collections" className="mx-auto max-w-6xl px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl font-bold"
        >
          {t.store.browseCategories}
        </motion.h2>
        <StaggerChildren className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <FadeItem key={category.id}>
              <Link
                href={`/category/${category.id}`}
                className="group relative block overflow-hidden rounded-2xl"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={category.imageUrl}
                    alt={locale === "ar" ? category.nameAr : category.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-display text-xl font-semibold text-white">
                    {locale === "ar" ? category.nameAr : category.name}
                  </p>
                  <p className="text-sm text-white/70">
                    {locale === "ar"
                      ? category.billboardLabelAr
                      : category.billboardLabel}
                  </p>
                  {category.images && category.images.length > 0 && (
                    <div className="flex gap-1.5 mt-2 overflow-x-auto">
                      {category.images.slice(0, 3).map((img) => (
                        <div
                          key={img.id}
                          className="w-10 h-10 shrink-0 rounded-md overflow-hidden border border-white/30"
                        >
                          <Image
                            src={img.url}
                            alt={locale === "ar" ? category.nameAr : category.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                      ))}
                      {category.images.length > 3 && (
                        <div className="w-10 h-10 shrink-0 rounded-md border-2 border-dashed border-white/30 flex items-center justify-center">
                          <span className="text-xs text-white/60">+{category.images.length - 3}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            </FadeItem>
          ))}
        </StaggerChildren>
      </section>

      <section id="featured" className="mx-auto max-w-6xl px-6 pb-20">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl font-bold"
        >
          {t.store.featured}
        </motion.h2>

        {products.length === 0 ? (
          <p className="mt-8 text-muted-foreground">{t.store.noProducts}</p>
        ) : (
          <StaggerChildren className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <FadeItem key={product.id}>
                <article className="group overflow-hidden rounded-2xl border border-border bg-card/80 transition hover:-translate-y-1 hover:border-fox-crimson/40 hover:shadow-xl">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.imageUrl}
                      alt={locale === "ar" ? product.nameAr : product.name}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="space-y-2 p-5">
                    <h3 className="font-display text-lg font-semibold">
                      {locale === "ar" ? product.nameAr : product.name}
                    </h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {locale === "ar"
                        ? product.descriptionAr
                        : product.description}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-display text-lg font-bold text-fox-crimson">
                        {product.price > 0
                          ? `${product.price} EGP`
                          : t.store.madeToOrder}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">
                        {t.store.viewProduct}
                      </span>
                    </div>
                  </div>
                </article>
              </FadeItem>
            ))}
          </StaggerChildren>
        )}
      </section>
    </main>
  );
}
