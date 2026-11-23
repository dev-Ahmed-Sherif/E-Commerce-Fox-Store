"use client";

import AuthShell from "@/components/auth/auth-shell";
import CustomerAuthForm from "@/components/auth/customer-auth-form";
import { useTranslations } from "@/i18n/locale-provider";

export default function SignUpPage() {
  const t = useTranslations();

  return (
    <AuthShell
      title={t.customerAuth.signUpTitle}
      subtitle={t.customerAuth.signUpSubtitle}
    >
      <CustomerAuthForm mode="sign-up" />
    </AuthShell>
  );
}
