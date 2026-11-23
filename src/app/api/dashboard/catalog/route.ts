import { NextResponse } from "next/server";

import { getSession, isAdminRole } from "@/lib/auth/session";
import { demoStore } from "@/lib/demo-data";

async function requireAdmin() {
  const user = await getSession();
  if (!user || !isAdminRole(user.role)) return null;
  return user;
}

export async function GET() {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    categories: demoStore.getCategories(),
    products: demoStore.getProducts(),
    stats: demoStore.stats(),
  });
}

export async function POST(req: Request) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { entity, action, data, id } = body as {
    entity: "category" | "product";
    action: "upsert" | "delete";
    data?: Record<string, unknown>;
    id?: string;
  };

  if (entity === "category") {
    if (action === "delete" && id) {
      demoStore.deleteCategory(id);
      return NextResponse.json({ ok: true });
    }
    if (action === "upsert" && data) {
      const item = demoStore.upsertCategory(
        data as Parameters<typeof demoStore.upsertCategory>[0]
      );
      return NextResponse.json({ item });
    }
  }

  if (entity === "product") {
    if (action === "delete" && id) {
      demoStore.deleteProduct(id);
      return NextResponse.json({ ok: true });
    }
    if (action === "upsert" && data) {
      const item = demoStore.upsertProduct(
        data as Parameters<typeof demoStore.upsertProduct>[0]
      );
      return NextResponse.json({ item });
    }
  }

  return NextResponse.json({ error: "Bad request" }, { status: 400 });
}
