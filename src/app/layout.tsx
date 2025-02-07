import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

import Footer from "@/components/store/layout/footer";
import Navbar from "@/components/store/layout/navbar";

import StoreModalProvider from "@/providers/modal-store-provider";
import ModalProvider from "@/providers/modal-provider";

import "./globals.css";
import { ToastProvider } from "@/providers/toast-provider";
// import { ThemeProvider } from "@/providers/theme-provider";
import ThemeProvider from "@/providers/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "فوكس افضل مكان للانتيكات والطباعه بالليزر فى أسوان",
  description: "Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          // defaultTheme="dark"
          enableSystem
        >
          {/* <ModalProvider /> */}
          <NextSSRPlugin
            /**
             * The `extractRouterConfig` will extract **only** the route configs
             * from the router to prevent additional information from being
             * leaked to the client. The data passed to the client is the same
             * as if you were to fetch `/api/uploadthing` directly.
             */
            routerConfig={extractRouterConfig(ourFileRouter)}
          />
          <StoreModalProvider />
          <Navbar />
          {children}
          <Footer />
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
    // <ClerkProvider>
    // </ClerkProvider>
  );
}
