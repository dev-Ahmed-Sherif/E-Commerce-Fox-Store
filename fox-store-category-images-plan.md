# Fox Store — Category Images Plan

## Goal
Give each **Category** its own images — matching how **Product** has an `Image[]` array.
Every category now stores its own `imageUrl` + `images[]`, so the storefront can
display category thumbnails independently of the billboard.

---

## What Changed

### 1. Prisma Schema (`prisma/schema.prisma`)
- Added `imageUrl String?` to `Category` (direct single-image fallback)
- Added `images Image[] @relation("CategoryToImage")` to `Category`
- Modified `Image` model to support both `productId` (optional) and `categoryId` (optional)
  so the same `Image` model handles both Product and Category images

### 2. Types (`src/types.ts`)
- `Category` now includes:
  - `imageUrl: string` — main category image
  - `images: Image[]` — full gallery

### 3. Demo Data (`src/lib/demo-data.ts`)
- `DemoCategory` type now includes `images: { id: string; url: string; order: number }[]`
- Each of the 6 demo categories has 1–3 images
- `DemoProduct` already had `imageUrl`; categories now mirror it

### 4. Storefront
- `src/components/store/store-home.tsx` — category card uses `category.imageUrl`
- `src/components/store/category-view.tsx` — category hero uses `category.imageUrl`

### 5. Dashboard (no change needed)
- `src/components/dashboard/categories/page.tsx` already uses `DemoCategory` which now
  includes `imageUrl` and `images`. The form already has an `imageUrl` field and submits
  it via `/api/dashboard/catalog`.

---

## API Surface (No change needed for demo mode)

- `GET /api/dashboard/catalog` → returns `categories[]` (Demo categories, now with images)
- `POST /api/dashboard/catalog` → `entity: "category", action: "upsert"` supports `imageUrl`
- `GET /api/[storeId]/categories` → DB categories (real MongoDB)
  - **To wire fully**: add `imageUrl` and `images` to the `category.findMany()` projection
  - **To wire fully**: add `Image` query support for `category.images`

---

## Next Steps (Prioritized)

1. **Wire real database** — Update `GET /api/[storeId]/categories` to return `imageUrl`
   and `images[]` from Prisma (not just `name` + `billboardId`)
2. **Add category image upload in dashboard** — Replace the plain text `imageUrl` input
   with UploadThing file picker for categories (like products already have)
3. **Storefront category gallery tab** — Show multiple category images in a gallery
   alongside the main hero image
4. **Category image in category page** — Add a horizontal thumbnail strip below the
   hero that scrolls through multiple category images
5. **Dashboard product ↔ category image sync** — When an admin assigns a product to a
   category, optionally link the product's main image as the category image
6. **DB migration for existing categories** — Seed `imageUrl` and `images` for any
   existing categories in MongoDB (if the database has rows)

---

## Files Modified

| File | Change |
|------|--------|
| `prisma/schema.prisma` | Category: `imageUrl`, `images[]`; Image: `categoryId` |
| `src/types.ts` | `Category` now has `imageUrl` + `images` |
| `src/lib/demo-data.ts` | `DemoCategory` now has `images`; each category has 1–3 images |

---

## Files to Update Next

| File | Purpose |
|------|---------|
| `src/app/api/[storeId]/categories/route.ts` | Real DB: return `imageUrl` + `images` |
| `src/components/dashboard/categories/page.tsx` | Image upload widget (optional) |
| `src/components/store/category-view.tsx` | Gallery tab for multiple images |
| `src/components/store/main-nav.tsx` | Highlight active category with image |
