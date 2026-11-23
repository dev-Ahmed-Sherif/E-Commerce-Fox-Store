"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import type { CustomerOrderSummary } from "@/lib/orders";
import { currencyFormatter } from "@/lib/utils";
import { useTranslations } from "@/i18n/locale-provider";

function OrderProductList({
  order,
  emptyLabel,
}: {
  order: CustomerOrderSummary | null;
  emptyLabel: string;
}) {
  if (!order || order.products.length === 0) {
    return (
      <p className="text-sm text-muted-foreground" role="status">
        {emptyLabel}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {order.products.map((item) => (
        <li
          key={item.id}
          className="flex items-center gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0"
        >
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                —
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{item.name}</p>
            <p className="text-xs text-muted-foreground">
              ×{item.quantity} · {currencyFormatter.format(item.unitPrice)}
            </p>
          </div>
          <p className="shrink-0 text-sm font-semibold">
            {currencyFormatter.format(item.totalPrice)}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default function ProfileOrders({
  current,
  last,
}: {
  current: CustomerOrderSummary | null;
  last: CustomerOrderSummary | null;
}) {
  const t = useTranslations();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.08 }}
      className="mx-auto mt-8 w-full max-w-xl space-y-6"
    >
      <section className="rounded-3xl border border-border/70 bg-background/90 p-6 shadow-xl backdrop-blur sm:p-8">
        <div className="mb-4">
          <h2 className="font-display text-xl font-bold tracking-tight">
            {t.customerAuth.currentOrder}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.customerAuth.currentOrderHint}
          </p>
        </div>
        <OrderProductList
          order={current}
          emptyLabel={t.customerAuth.noCurrentOrder}
        />
      </section>

      <section className="rounded-3xl border border-border/70 bg-background/90 p-6 shadow-xl backdrop-blur sm:p-8">
        <div className="mb-4">
          <h2 className="font-display text-xl font-bold tracking-tight">
            {t.customerAuth.lastOrder}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.customerAuth.lastOrderHint}
          </p>
        </div>
        <OrderProductList
          order={last}
          emptyLabel={t.customerAuth.noLastOrder}
        />
      </section>
    </motion.div>
  );
}
