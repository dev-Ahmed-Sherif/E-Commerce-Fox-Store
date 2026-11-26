"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import type { DemoCategory, DemoProduct } from "@/lib/demo-data";
import PageTransition, {
  FadeItem,
  StaggerChildren,
} from "@/components/shared/page-transition";
import { useLocale, useTranslations } from "@/i18n/locale-provider";

export default function CategoryView({
  category,
  products,
}: {
  category: DemoCategory | null;
  products: DemoProduct[];
}) {
  const t = useTranslations();
  const { locale } = useLocale();

  if (!category) {
    return (
      <div className="px-6 py-20 text-center text-muted-foreground">
        {t.store.noProducts}
      </div>
    );
  }

  return (
    <PageTransition className="mx-auto max-w-6xl px-6 pb-24 pt-8">
      <div className="relative mb-10 overflow-hidden rounded-3xl">
        <div className="relative aspect-[21/9] min-h-[220px]">
          <Image
            src={category.imageUrl}
            alt={locale === "ar" ? category.nameAr : category.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-end p-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-3xl font-bold text-white md:text-5xl">
              {locale === "ar" ? category.nameAr : category.name}
            </h1>
            <p className="mt-2 text-white/75">
              {locale === "ar"
                ? category.billboardLabelAr
                : category.billboardLabel}
            </p>
          </motion.div>
        </div>
      </div>

      {category.images && category.images.length > 0 && (
        <div className="mb-10 overflow-hidden rounded-2xl border border-border bg-muted/30">
          <div className="flex gap-2 overflow-x-auto px-6 pt-6 pb-2">
            {category.images.map((img) => (
              <div
                key={img.id}
                className="w-24 h-24 shrink-0 rounded-lg overflow-hidden border border-border"
              >
                <Image
                  src={img.url}
                  alt={locale === "ar" ? category.nameAr : category.name}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 80px, 96px"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <p className="text-muted-foreground">{t.store.noProducts}</p>
      ) : (
        <StaggerChildren className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <FadeItem key={product.id}>
              <article className="overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:border-fox-crimson/40 hover:shadow-lg">
                <div className="relative aspect-square">
                  <Image
                    src={product.imageUrl}
                    alt={locale === "ar" ? product.nameAr : product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                </div>
                <div className="space-y-2 p-5">
                  <h2 className="font-display text-lg font-semibold">
                    {locale === "ar" ? product.nameAr : product.name}
                  </h2>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {locale === "ar"
                      ? product.descriptionAr
                      : product.description}
                  </p>
                  <p className="font-display text-lg font-bold text-fox-crimson">
                    {product.price > 0
                      ? `${product.price} EGP`
                      : t.store.madeToOrder}
                  </p>
                </div>
              </article>
            </FadeItem>
          ))}
        </StaggerChildren>
      )}
    </PageTransition>
  );
}
