"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  defaultLocale,
  isLocale,
  localeDirection,
  LOCALE_COOKIE,
  type Locale,
} from "./config";
import { getDictionary, type Dictionary } from "./get-dictionary";

type LocaleContextValue = {
  locale: Locale;
  dir: "rtl" | "ltr";
  dictionary: Dictionary;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function writeLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;samesite=lax`;
}

export function LocaleProvider({
  children,
  initialLocale = defaultLocale,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${LOCALE_COOKIE}=`));
    const cookieLocale = match?.split("=")[1];
    if (isLocale(cookieLocale) && cookieLocale !== locale) {
      setLocaleState(cookieLocale);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeDirection[locale];
    writeLocaleCookie(locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  const value = useMemo<LocaleContextValue>(() => {
    const dictionary = getDictionary(locale);
    return {
      locale,
      dir: localeDirection[locale],
      dictionary,
      t: dictionary,
      setLocale,
    };
  }, [locale, setLocale]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}

export function useTranslations() {
  return useLocale().t;
}
