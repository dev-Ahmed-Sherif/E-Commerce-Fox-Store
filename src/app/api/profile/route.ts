import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/customer-auth";
import {
  getOrCreateCustomerProfile,
  updateCustomerProfile,
} from "@/lib/profile";

const updateSchema = z.object({
  firstName: z.string().max(80).optional(),
  lastName: z.string().max(80).optional(),
  phone: z.string().max(40).optional(),
  address: z.string().max(200).optional(),
  city: z.string().max(80).optional(),
  country: z.string().max(80).optional(),
});

async function requireCustomer() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user ?? null;
}

export async function GET() {
  const user = await requireCustomer();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getOrCreateCustomerProfile();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ profile });
}

export async function PUT(req: Request) {
  const user = await requireCustomer();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const profile = await updateCustomerProfile(parsed.data);
  if (!profile) {
    return NextResponse.json(
      { error: "Could not save profile. Check database connection." },
      { status: 503 }
    );
  }

  return NextResponse.json({ profile, message: "Saved" });
}
