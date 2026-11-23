import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import prismadb from "@/lib/prismadb";
import { issueTokens } from "@/lib/auth/session";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

const DEMO_EMAIL = "admin@foxstore.eg";
const DEMO_PASSWORD = "foxadmin123";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
    }

    const { email, password } = parsed.data;

    // Demo admin (works without MongoDB for design & local testing)
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const tokens = await issueTokens({
        id: "demo-admin",
        email: DEMO_EMAIL,
        name: "Fox Admin",
        role: "ADMIN",
      });
      return NextResponse.json({
        user: tokens.user,
        message: "Logged in",
      });
    }

    try {
      const user = await prismadb.user.findUnique({
        where: { email },
        include: { role: true },
      });
      if (!user) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const tokens = await issueTokens({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role?.name ?? "CUSTOMER",
      });

      return NextResponse.json({ user: tokens.user, message: "Logged in" });
    } catch {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
