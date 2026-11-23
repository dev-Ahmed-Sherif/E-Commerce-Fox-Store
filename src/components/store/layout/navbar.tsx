"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import type { Category } from "@/types";
import Container from "@/components/ui/container";
import FoxLogo from "@/components/brand/fox-logo";
import NavbarActions from "@/components/store/layout/navbar-actions";
import SearchInput from "@/components/store/searchInput";
import { useLocale, useTranslations } from "@/i18n/locale-provider";

type NavbarProps = {
  categories: Category[] | any;
};

const Navbar = ({ categories }: NavbarProps) => {
  const t = useTranslations();
  const { locale } = useLocale();
  const headerRef = useRef<HTMLElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const measure = () => setHeight(header.offsetHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => observer.disconnect();
  }, [categories]);

  return (
    <>
      <motion.header
        ref={headerRef}
        initial={{ y: -18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45 }}
        className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl"
      >
        <Container>
          <div className="relative flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <FoxLogo href="/" size="md" showWordmark />
            <div className="hidden flex-1 justify-center md:flex">
              <Suspense fallback={null}>
                <SearchInput />
              </Suspense>
            </div>
            <NavbarActions />
          </div>
          {Array.isArray(categories) && categories.length > 0 && (
            <nav className="flex gap-2 overflow-x-auto px-4 pb-3 sm:px-6 lg:px-8">
              <Link
                href="/"
                className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                {t.nav.home}
              </Link>
              {categories.map((category: any) => (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  {locale === "ar" && category.nameAr
                    ? category.nameAr
                    : category.name}
                </Link>
              ))}
            </nav>
          )}
        </Container>
      </motion.header>
      <div aria-hidden style={{ height }} />
    </>
  );
};

export default Navbar;
