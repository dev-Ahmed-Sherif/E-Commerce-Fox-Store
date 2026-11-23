import { headers } from "next/headers";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import FoxLogo from "@/components/brand/fox-logo";
import ProfileForm from "@/components/profile/profile-form";
import ProfileOrders from "@/components/profile/profile-orders";
import LanguageToggle from "@/components/shared/language-toggle";
import ModeToggle from "@/components/mode-toggle";
import { auth } from "@/lib/customer-auth";
import { getCurrentAndLastOrders } from "@/lib/orders";
import { getOrCreateCustomerProfile } from "@/lib/profile";
import { getDictionary } from "@/i18n/get-dictionary";
import { LOCALE_COOKIE, defaultLocale, isLocale } from "@/i18n/config";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) redirect("/sign-in");

  const jar = await cookies();
  const localeCookie = jar.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(localeCookie) ? localeCookie : defaultLocale;
  const t = getDictionary(locale);

  const profile = await getOrCreateCustomerProfile();
  if (!profile) redirect("/sign-in");

  const { current, last } = await getCurrentAndLastOrders(session.user.id);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-fox-hero opacity-70" />
      <div className="pointer-events-none absolute inset-0 fox-grain opacity-30" />

      <header className="relative z-10 flex items-center justify-between px-4 py-6 sm:px-8">
        <FoxLogo href="/" size="md" showWordmark />
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-muted"
          >
            {t.nav.home}
          </Link>
          <LanguageToggle />
          <ModeToggle />
        </div>
      </header>

      <main className="relative z-10 px-4 pb-16 pt-4 sm:px-8">
        <div className="mx-auto mb-8 max-w-xl text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight">
            {t.customerAuth.profileTitle}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t.customerAuth.profileSubtitle}
          </p>
        </div>

        <ProfileForm
          initial={{
            email: profile.email,
            firstName: profile.firstName,
            lastName: profile.lastName,
            phone: profile.phone,
            address: profile.address,
            city: profile.city,
            country: profile.country,
          }}
        />

        <ProfileOrders current={current} last={last} />
      </main>
    </div>
  );
}
