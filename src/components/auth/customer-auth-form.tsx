"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/customer-auth-client";
import { useTranslations } from "@/i18n/locale-provider";

type Mode = "sign-in" | "sign-up";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.3-1.9 3l3.1 2.4c1.8-1.7 2.9-4.1 2.9-7 0-.7-.1-1.3-.2-1.9H12z"
      />
      <path
        fill="#34A853"
        d="M6.6 14.3l-.9.7-2.5 1.9C4.8 19.7 8.1 22 12 22c2.7 0 5-.9 6.7-2.4l-3.1-2.4c-.9.6-2 1-3.6 1-2.8 0-5.1-1.9-5.9-4.4z"
      />
      <path
        fill="#4A90E2"
        d="M3.2 7.1C2.4 8.7 2 10.3 2 12s.4 3.3 1.2 4.9l3.4-2.6C6.2 13.4 6 12.7 6 12s.2-1.4.6-2.1L3.2 7.1z"
      />
      <path
        fill="#FBBC05"
        d="M12 5.8c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 2.7 14.7 2 12 2 8.1 2 4.8 4.3 3.2 7.1l3.4 2.6C7 7.7 9.2 5.8 12 5.8z"
      />
    </svg>
  );
}

export default function CustomerAuthForm({ mode }: { mode: Mode }) {
  const t = useTranslations();
  const router = useRouter();
  const isSignUp = mode === "sign-up";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error: signUpError } = await authClient.signUp.email({
          name: name.trim() || email.split("@")[0],
          email: email.trim(),
          password,
          callbackURL: "/profile",
        });
        if (signUpError) {
          setError(signUpError.message || t.common.error);
          return;
        }
      } else {
        const { error: signInError } = await authClient.signIn.email({
          email: email.trim(),
          password,
          callbackURL: "/profile",
        });
        if (signInError) {
          setError(signInError.message || t.customerAuth.invalidCredentials);
          return;
        }
      }

      router.push("/profile");
      router.refresh();
    } catch {
      setError(t.common.error);
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/profile",
      });
    } catch {
      setError(t.common.error);
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-border/70 bg-background/90 p-6 shadow-xl backdrop-blur sm:p-8"
    >
      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        disabled={loading}
        onClick={onGoogle}
      >
        <GoogleIcon className="h-5 w-5" />
        {t.customerAuth.continueWithGoogle}
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wide">
          <span className="bg-background px-3 text-muted-foreground">
            {t.customerAuth.orEmail}
          </span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {isSignUp && (
          <div className="space-y-2">
            <Label htmlFor="name">{t.customerAuth.name}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              placeholder={t.customerAuth.namePlaceholder}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">{t.customerAuth.email}</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t.customerAuth.password}</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isSignUp ? "new-password" : "current-password"}
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
          {loading
            ? t.common.loading
            : isSignUp
              ? t.customerAuth.createAccount
              : t.customerAuth.signIn}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isSignUp ? t.customerAuth.haveAccount : t.customerAuth.noAccount}{" "}
        <Link
          href={isSignUp ? "/sign-in" : "/sign-up"}
          className="font-medium text-fox-crimson hover:underline"
        >
          {isSignUp ? t.customerAuth.signIn : t.customerAuth.signUp}
        </Link>
      </p>
    </motion.div>
  );
}
