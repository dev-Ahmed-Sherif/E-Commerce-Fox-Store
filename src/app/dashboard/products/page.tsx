"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Plus, Trash2, Star } from "lucide-react";

import PageTransition from "@/components/shared/page-transition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { DemoCategory, DemoProduct } from "@/lib/demo-data";
import { useTranslations } from "@/i18n/locale-provider";

const emptyForm = {
  id: "",
  name: "",
  nameAr: "",
  description: "",
  price: "",
  quantity: "",
  categoryId: "",
  isFeatured: true,
  isArchived: false,
  imageUrl: "",
};

export default function DashboardProductsPage() {
  const t = useTranslations();
  const [items, setItems] = useState<DemoProduct[]>([]);
  const [categories, setCategories] = useState<DemoCategory[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/dashboard/catalog");
    if (!res.ok) return;
    const data = await res.json();
    setItems(data.products || []);
    setCategories(data.categories || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setForm({
      ...emptyForm,
      categoryId: categories[0]?.id || "",
    });
    setOpen(true);
  };

  const openEdit = (item: DemoProduct) => {
    setForm({
      id: item.id,
      name: item.name,
      nameAr: item.nameAr,
      description: item.description,
      price: String(item.price),
      quantity: String(item.quantity),
      categoryId: item.categoryId,
      isFeatured: item.isFeatured,
      isArchived: item.isArchived,
      imageUrl: item.imageUrl,
    });
    setOpen(true);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch("/api/dashboard/catalog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entity: "product",
        action: "upsert",
        data: {
          ...(form.id ? { id: form.id } : {}),
          name: form.name,
          nameAr: form.nameAr,
          description: form.description,
          price: Number(form.price),
          quantity: Number(form.quantity || 0),
          categoryId: form.categoryId,
          isFeatured: form.isFeatured,
          isArchived: form.isArchived,
          imageUrl: form.imageUrl || undefined,
        },
      }),
    });
    setOpen(false);
    await load();
  };

  const onDelete = async (id: string) => {
    if (!confirm(t.common.confirmDelete)) return;
    await fetch("/api/dashboard/catalog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity: "product", action: "delete", id }),
    });
    await load();
  };

  const toggleFeatured = async (item: DemoProduct) => {
    await fetch("/api/dashboard/catalog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entity: "product",
        action: "upsert",
        data: { ...item, isFeatured: !item.isFeatured },
      }),
    });
    await load();
  };

  const filtered = items.filter((item) => {
    const q = query.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) || item.nameAr.includes(query)
    );
  });

  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name || "—";

  return (
    <PageTransition>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">
            {t.dashboard.products}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.dashboard.showOnHome}
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-fox-crimson hover:bg-fox-crimson/90"
        >
          <Plus className="me-2 h-4 w-4" />
          {t.dashboard.addProduct}
        </Button>
      </div>

      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.dashboard.search}
        className="mb-4 max-w-sm"
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-12 gap-2 border-b border-border bg-muted/40 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <div className="col-span-4">{t.dashboard.name}</div>
          <div className="col-span-2 hidden md:block">
            {t.dashboard.category}
          </div>
          <div className="col-span-2">{t.dashboard.price}</div>
          <div className="col-span-2">{t.dashboard.featured}</div>
          <div className="col-span-2 text-end">{t.dashboard.actions}</div>
        </div>
        <AnimatePresence initial={false}>
          {filtered.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">
              {t.dashboard.emptyProducts}
            </p>
          ) : (
            filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-12 items-center gap-2 border-b border-border px-4 py-3 last:border-0"
              >
                <div className="col-span-4">
                  <p className="font-medium">{item.name}</p>
                  <p className="font-arabic text-xs text-muted-foreground">
                    {item.nameAr}
                  </p>
                </div>
                <div className="col-span-2 hidden text-sm md:block">
                  {categoryName(item.categoryId)}
                </div>
                <div className="col-span-2 font-display font-semibold">
                  {item.price > 0 ? `${item.price} EGP` : t.store.madeToOrder}
                </div>
                <div className="col-span-2">
                  <button
                    type="button"
                    onClick={() => toggleFeatured(item)}
                    className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs"
                  >
                    <Star
                      className={`h-3.5 w-3.5 ${
                        item.isFeatured
                          ? "fill-fox-amber text-fox-amber"
                          : "text-muted-foreground"
                      }`}
                    />
                    {item.isFeatured
                      ? t.dashboard.visible
                      : t.dashboard.hidden}
                  </button>
                </div>
                <div className="col-span-2 flex justify-end gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openEdit(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.form
              onSubmit={onSubmit}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              className="max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl"
            >
              <h2 className="font-display text-xl font-semibold">
                {form.id ? t.dashboard.editProduct : t.dashboard.addProduct}
              </h2>
              <div className="space-y-2">
                <Label>{t.dashboard.name}</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>{t.dashboard.nameAr}</Label>
                <Input
                  value={form.nameAr}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, nameAr: e.target.value }))
                  }
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label>{t.dashboard.description}</Label>
                <Input
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>{t.dashboard.price}</Label>
                  <Input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, price: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.dashboard.quantity}</Label>
                  <Input
                    type="number"
                    min="0"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, quantity: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t.dashboard.category}</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, categoryId: e.target.value }))
                  }
                  required
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} / {c.nameAr}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, imageUrl: e.target.value }))
                  }
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.isFeatured}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, isFeatured: Boolean(v) }))
                  }
                />
                {t.dashboard.showOnHome}
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.isArchived}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, isArchived: Boolean(v) }))
                  }
                />
                {t.dashboard.archived}
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  {t.dashboard.cancel}
                </Button>
                <Button
                  type="submit"
                  className="bg-fox-crimson hover:bg-fox-crimson/90"
                >
                  {t.dashboard.save}
                </Button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
