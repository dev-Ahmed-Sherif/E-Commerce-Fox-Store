"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserRound } from "lucide-react";

import { authClient } from "@/lib/customer-auth-client";
import { useTranslations } from "@/i18n/locale-provider";

export default function UserMenu() {
  const t = useTranslations();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="h-9 w-9 animate-pulse rounded-full bg-muted" aria-hidden />
    );
  }

  if (!session?.user) {
    return (
      <Link
        href="/sign-in"
        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-muted"
      >
        <UserRound className="h-5 w-5 text-fox-crimson" />
        <span className="hidden sm:inline">{t.nav.login}</span>
      </Link>
    );
  }

  const initials =
    session.user.name
      ?.split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") ||
    session.user.email?.[0]?.toUpperCase() ||
    "?";

  const onSignOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1">
      <Link
        href="/profile"
        className="hidden rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-muted sm:inline"
      >
        {t.nav.profile}
      </Link>
      <Link
        href="/profile"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-fox-crimson/15 text-xs font-semibold text-fox-crimson ring-1 ring-fox-crimson/30"
        title={session.user.name || session.user.email || t.nav.profile}
      >
        {session.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt=""
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          initials
        )}
      </Link>
      <button
        type="button"
        onClick={onSignOut}
        className="hidden rounded-xl px-2 py-2 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground md:inline"
      >
        {t.nav.logout}
      </button>
    </div>
  );
}
