"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import DashboardSidebar from "@/components/dashboard/sidebar";

export default function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname.startsWith("/dashboard/login");

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="sticky top-0 hidden h-screen shrink-0 md:block">
        <DashboardSidebar />
      </div>
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <div className="border-b border-border md:hidden">
          <div className="max-h-64 overflow-auto">
            <DashboardSidebar />
          </div>
        </div>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
