import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/customer-auth";
import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";

const bodySchema = z.object({
  productIds: z.array(z.string().min(1)).min(1),
});

function storefrontOrigin() {
  const raw =
    process.env.NEXT_PUBLIC_FRONTEND_URL ||
    process.env.BETTER_AUTH_URL ||
    "http://localhost:3000";
  // FRONTEND_URL may be ".../store" — cart lives at /cart on this app
  return raw.replace(/\/store\/?$/, "");
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const json = await req.json().catch(() => null);
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Product ids required" }, { status: 400 });
    }

    const { productIds } = parsed.data;
    const storeId = params.storeId;

    const products = await prismadb.product.findMany({
      where: {
        id: { in: productIds },
        storeId,
        isArchived: false,
      },
    });

    if (products.length === 0) {
      return NextResponse.json({ error: "No products found" }, { status: 404 });
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const customerUserId = session?.user?.id ?? null;

    let phone = "";
    let address = "";
    if (customerUserId) {
      const profile = await prismadb.customerProfile.findUnique({
        where: { userId: customerUserId },
      });
      if (profile) {
        phone = profile.phone || "";
        address = [profile.address, profile.city, profile.country]
          .filter(Boolean)
          .join(", ");
      }
    }

    // Count duplicates so quantity matches cart productIds list
    const qtyById = productIds.reduce<Record<string, number>>((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

    const order = await prismadb.order.create({
      data: {
        storeId,
        isPaid: false,
        phone,
        address,
        ...(customerUserId ? { customerUserId } : {}),
        orderItems: {
          create: products.map((product) => {
            const quantity = qtyById[product.id] || 1;
            return {
              productId: product.id,
              quantity,
              unitPrice: product.price,
              totalPrice: product.price * quantity,
            };
          }),
        },
      },
    });

    const origin = storefrontOrigin();
    const sessionStripe = await stripe.checkout.sessions.create({
      line_items: products.map((product) => ({
        quantity: qtyById[product.id] || 1,
        price_data: {
          currency: "egp",
          product_data: { name: product.name },
          unit_amount: Math.round(product.price * 100),
        },
      })),
      mode: "payment",
      billing_address_collection: "required",
      phone_number_collection: { enabled: true },
      success_url: `${origin}/cart?success=1`,
      cancel_url: `${origin}/cart?canceled=1`,
      metadata: {
        orderId: order.id,
      },
    });

    return NextResponse.json({ url: sessionStripe.url });
  } catch (error) {
    console.error("[CHECKOUT_POST]", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
