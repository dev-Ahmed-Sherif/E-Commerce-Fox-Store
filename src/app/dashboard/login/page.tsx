import { Suspense } from "react";

import DashboardLoginForm from "@/components/dashboard/login-form";

export default function DashboardLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-fox-hero text-white">
          …
        </div>
      }
    >
      <DashboardLoginForm />
    </Suspense>
  );
}
