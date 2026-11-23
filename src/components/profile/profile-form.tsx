"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "@/i18n/locale-provider";

export type ProfileFormValues = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
};

export default function ProfileForm({
  initial,
}: {
  initial: ProfileFormValues;
}) {
  const t = useTranslations();
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  const set =
    (key: keyof ProfileFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((v) => ({ ...v, [key]: e.target.value }));
    };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          address: values.address,
          city: values.city,
          country: values.country,
        }),
      });
      if (!res.ok) {
        setMessage({ type: "err", text: t.common.error });
      } else {
        setMessage({ type: "ok", text: t.common.success });
      }
    } catch {
      setMessage({ type: "err", text: t.common.error });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-xl space-y-5 rounded-3xl border border-border/70 bg-background/90 p-6 shadow-xl backdrop-blur sm:p-8"
    >
      <div className="space-y-2">
        <Label htmlFor="email">{t.customerAuth.email}</Label>
        <Input id="email" type="email" value={values.email} disabled readOnly />
        <p className="text-xs text-muted-foreground">{t.customerAuth.emailHint}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">{t.customerAuth.firstName}</Label>
          <Input
            id="firstName"
            value={values.firstName}
            onChange={set("firstName")}
            autoComplete="given-name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">{t.customerAuth.lastName}</Label>
          <Input
            id="lastName"
            value={values.lastName}
            onChange={set("lastName")}
            autoComplete="family-name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">{t.customerAuth.phone}</Label>
        <Input
          id="phone"
          type="tel"
          value={values.phone}
          onChange={set("phone")}
          autoComplete="tel"
          placeholder="+20…"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">{t.customerAuth.address}</Label>
        <Input
          id="address"
          value={values.address}
          onChange={set("address")}
          autoComplete="street-address"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city">{t.customerAuth.city}</Label>
          <Input
            id="city"
            value={values.city}
            onChange={set("city")}
            autoComplete="address-level2"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">{t.customerAuth.country}</Label>
          <Input
            id="country"
            value={values.country}
            onChange={set("country")}
            autoComplete="country-name"
          />
        </div>
      </div>

      {message && (
        <p
          className={
            message.type === "ok" ? "text-sm text-emerald-600" : "text-sm text-destructive"
          }
          role="status"
        >
          {message.text}
        </p>
      )}

      <Button
        type="submit"
        className="w-full bg-fox-crimson hover:bg-fox-crimson/90"
        disabled={saving}
      >
        {saving ? t.common.loading : t.customerAuth.saveProfile}
      </Button>
    </motion.form>
  );
}
