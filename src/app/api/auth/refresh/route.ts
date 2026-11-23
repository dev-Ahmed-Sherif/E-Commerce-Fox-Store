import { NextResponse } from "next/server";

import { refreshSession } from "@/lib/auth/session";

export async function POST() {
  const user = await refreshSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ user });
}
