import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Cairo, Outfit } from "next/font/google";

import { defaultLocale, isLocale, localeDirection, LOCALE_COOKIE } from "@/i18n/config";
import { LocaleProvider } from "@/i18n/locale-provider";
import ThemeProvider from "@/providers/theme-provider";
import { ToastProvider } from "@/providers/toast-provider";

import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Fox Store | فوكس ستور",
    template: "%s | Fox Store",
  },
  description:
    "فوكس لأعمال الليزر والديكورات والأنتيكات — Fox Works EG laser craft, décor & antiques.",
  icons: {
    icon: "/fox-store-logo.jpg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jar = await cookies();
  const localeCookie = jar.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(localeCookie) ? localeCookie : defaultLocale;

  return (
    <html
      lang={locale}
      dir={localeDirection[locale]}
      suppressHydrationWarning
      className={`${outfit.variable} ${cairo.variable}`}
    >
      <body className="min-h-screen font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LocaleProvider initialLocale={locale}>
            {children}
            <ToastProvider />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
