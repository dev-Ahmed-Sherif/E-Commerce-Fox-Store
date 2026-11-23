"use client";

import { motion } from "framer-motion";

import FoxLogo from "@/components/brand/fox-logo";
import LanguageToggle from "@/components/shared/language-toggle";
import ModeToggle from "@/components/mode-toggle";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-fox-hero opacity-90" />
      <div className="pointer-events-none absolute inset-0 fox-grain opacity-40" />
      <div className="absolute end-4 top-4 z-10 flex gap-2">
        <LanguageToggle />
        <ModeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <FoxLogo href="/" size="lg" />
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">
            {title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {children}
      </motion.div>
    </div>
  );
}
