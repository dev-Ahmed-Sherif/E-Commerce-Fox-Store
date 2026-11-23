"use client";

import AuthShell from "@/components/auth/auth-shell";
import CustomerAuthForm from "@/components/auth/customer-auth-form";
import { useTranslations } from "@/i18n/locale-provider";

export default function SignInPage() {
  const t = useTranslations();

  return (
    <AuthShell
      title={t.customerAuth.signInTitle}
      subtitle={t.customerAuth.signInSubtitle}
    >
      <CustomerAuthForm mode="sign-in" />
    </AuthShell>
  );
}
