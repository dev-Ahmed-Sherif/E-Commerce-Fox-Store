"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

import FoxLogo from "@/components/brand/fox-logo";
import LanguageToggle from "@/components/shared/language-toggle";
import ModeToggle from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "@/i18n/locale-provider";

export default function DashboardLoginForm() {
  const t = useTranslations();
  const router = useRouter();
  const search = useSearchParams();
  const [email, setEmail] = useState("admin@foxstore.eg");
  const [password, setPassword] = useState("foxadmin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        setError(t.dashboard.loginError);
        setLoading(false);
        return;
      }
      const from = search.get("from") || "/dashboard";
      router.push(from);
      router.refresh();
    } catch {
      setError(t.common.error);
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
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
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-background/95 p-8 shadow-2xl backdrop-blur"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <FoxLogo href={undefined} size="lg" />
          <h1 className="mt-4 font-display text-2xl font-bold">
            {t.dashboard.loginTitle}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.dashboard.loginSubtitle}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t.dashboard.email}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t.dashboard.password}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <Button
            type="submit"
            className="w-full bg-fox-crimson hover:bg-fox-crimson/90"
            disabled={loading}
          >
            {loading ? t.common.loading : t.dashboard.loginCta}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
