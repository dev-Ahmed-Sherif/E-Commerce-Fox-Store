import { headers } from "next/headers";

import { auth } from "@/lib/customer-auth";
import prismadb from "@/lib/prismadb";

export type OrderProductLine = {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl: string | null;
};

export type CustomerOrderSummary = {
  id: string;
  isPaid: boolean;
  createdAt: string;
  phone: string;
  address: string;
  products: OrderProductLine[];
};

const orderInclude = {
  orderItems: {
    include: {
      product: {
        include: {
          images: {
            take: 1,
            orderBy: { createdAt: "asc" as const },
          },
        },
      },
    },
  },
} as const;

function mapOrder(
  order: {
    id: string;
    isPaid: boolean;
    createdAt: Date;
    phone: string;
    address: string;
    orderItems: Array<{
      id: string;
      productId: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      product: {
        name: string;
        price: number;
        images: Array<{ url: string }>;
      };
    }>;
  }
): CustomerOrderSummary {
  return {
    id: order.id,
    isPaid: order.isPaid,
    createdAt: order.createdAt.toISOString(),
    phone: order.phone,
    address: order.address,
    products: order.orderItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice || item.product.price,
      totalPrice:
        item.totalPrice ||
        (item.unitPrice || item.product.price) * item.quantity,
      imageUrl: item.product.images[0]?.url ?? null,
    })),
  };
}

/**
 * Current = most recent unpaid (pending / in-progress) order for this customer.
 * Last = most recent paid (completed) order for this customer.
 */
export async function getCurrentAndLastOrders(customerUserId: string): Promise<{
  current: CustomerOrderSummary | null;
  last: CustomerOrderSummary | null;
}> {
  try {
    const [currentRaw, lastRaw] = await Promise.all([
      prismadb.order.findFirst({
        where: { customerUserId, isPaid: false },
        orderBy: { createdAt: "desc" },
        include: orderInclude,
      }),
      prismadb.order.findFirst({
        where: { customerUserId, isPaid: true },
        orderBy: { createdAt: "desc" },
        include: orderInclude,
      }),
    ]);

    return {
      current: currentRaw ? mapOrder(currentRaw) : null,
      last: lastRaw ? mapOrder(lastRaw) : null,
    };
  } catch {
    return { current: null, last: null };
  }
}

export async function getCustomerOrdersForSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user?.id;
  if (!userId) return { current: null, last: null };

  return getCurrentAndLastOrders(userId);
}
