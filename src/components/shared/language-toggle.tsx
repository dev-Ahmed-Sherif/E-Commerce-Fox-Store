"use client";

import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/locale-provider";
import type { Locale } from "@/i18n/config";

export default function LanguageToggle() {
  const { locale, setLocale, t } = useLocale();

  const next: Locale = locale === "ar" ? "en" : "ar";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLocale(next)}
      className="font-medium tracking-wide"
      aria-label={t.language.label}
    >
      {locale === "ar" ? "EN" : "عر"}
    </Button>
  );
}
