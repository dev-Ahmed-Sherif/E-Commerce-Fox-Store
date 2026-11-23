import { headers } from "next/headers";

import { auth } from "@/lib/customer-auth";
import prismadb from "@/lib/prismadb";

export type ProfileFields = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  email: string;
};

async function getCustomerSessionUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user ?? null;
}

function splitName(name?: string | null) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "",
  };
}

export async function getOrCreateCustomerProfile() {
  const user = await getCustomerSessionUser();
  if (!user) return null;

  const { firstName, lastName } = splitName(user.name);
  const defaults = {
    email: user.email || "",
    firstName,
    lastName,
    phone: "",
  };

  try {
    const existing = await prismadb.customerProfile.findUnique({
      where: { userId: user.id },
    });

    if (existing) {
      return existing;
    }

    return await prismadb.customerProfile.create({
      data: {
        userId: user.id,
        ...defaults,
        address: "",
        city: "",
        country: "",
      },
    });
  } catch {
    // DB unavailable — return session-backed ephemeral profile shape
    return {
      id: "local",
      userId: user.id,
      ...defaults,
      address: "",
      city: "",
      country: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

export async function updateCustomerProfile(fields: Partial<ProfileFields>) {
  const user = await getCustomerSessionUser();
  if (!user) return null;

  const { firstName, lastName } = splitName(user.name);
  const email = fields.email || user.email || "";

  try {
    return await prismadb.customerProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        email,
        firstName: fields.firstName ?? firstName,
        lastName: fields.lastName ?? lastName,
        phone: fields.phone ?? "",
        address: fields.address ?? "",
        city: fields.city ?? "",
        country: fields.country ?? "",
      },
      update: {
        ...(fields.firstName !== undefined && { firstName: fields.firstName }),
        ...(fields.lastName !== undefined && { lastName: fields.lastName }),
        ...(fields.phone !== undefined && { phone: fields.phone }),
        ...(fields.address !== undefined && { address: fields.address }),
        ...(fields.city !== undefined && { city: fields.city }),
        ...(fields.country !== undefined && { country: fields.country }),
        email,
      },
    });
  } catch {
    return null;
  }
}
