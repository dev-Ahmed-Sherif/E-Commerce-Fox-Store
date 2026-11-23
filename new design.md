# Fox Store — New Design Summary

Redesign for **[FoxWorksEG](https://www.facebook.com/FoxWorksEG)** (فوكس لأعمال الليزر والديكورات والأنتيكات), built on the existing Next.js e-commerce codebase.

## Brand

- New circular logo: `public/fox-store-logo.jpg` (also used as `logo.jpg` / favicon)
- Palette: **crimson**, charcoal, warm amber on sand/wood neutrals
- Fonts: **Outfit** (Latin) + **Cairo** (Arabic)
- Atmosphere: soft crimson/amber gradients + subtle grain (laser-craft feel)

## Multi-language (AR / EN)

- Dictionaries: `src/i18n/dictionaries/ar.json`, `en.json`
- `LocaleProvider` + cookie `fox_locale`
- Default language: **Arabic** (`dir="rtl"`)
- Language toggle in store navbar and dashboard
- Switching language updates `html[lang]` / `dir`

## Dark / light mode

- `next-themes` with `defaultTheme="system"` (follows device)
- Mode toggle in store + dashboard
- Brand CSS variables for both themes in `src/app/globals.css`

## Security — access / refresh tokens

| Piece | Path |
|--------|------|
| JWT sign/verify (`jose`) | `src/lib/auth/tokens.ts` |
| HttpOnly cookies | `src/lib/auth/cookies.ts` |
| Session + refresh rotation | `src/lib/auth/session.ts` |
| Login / refresh / logout / me | `src/app/api/auth/*/route.ts` |
| Dashboard route guard | `src/middleware.ts` |

- Access token ~15m, refresh ~7d, both **httpOnly**
- Demo admin (no DB required): `admin@foxstore.eg` / `foxadmin123`
- Also supports Prisma `User` + bcrypt when MongoDB is available

## Dashboard (designed first)

| Route | Purpose |
|--------|---------|
| `/dashboard/login` | Animated admin login |
| `/dashboard` | Overview stats |
| `/dashboard/categories` | CRUD + home visibility toggle |
| `/dashboard/products` | CRUD + featured-on-home toggle |

- Sidebar with brand logo, i18n, theme, logout
- Catalog API: `POST/GET /api/dashboard/catalog` (auth required)
- In-memory demo catalog: `src/lib/demo-data.ts` (works without MongoDB)

## Store pages

- Route group: `src/app/(store)/`
- Home: full-bleed Fox hero, collections, featured products + Framer Motion
- Category pages: hero billboard + product grid with animations
- Navbar / footer rebuilt for FoxWorksEG (Facebook + WhatsApp)
- Cart route kept under the store layout

## Animations

- Framer Motion page transitions, staggered grids, logo hover, hero glow
- CSS helpers: `fox-fade-up`, laser line, grain overlay

## Key new files

```
public/fox-store-logo.jpg
src/i18n/**
src/lib/auth/**
src/lib/demo-data.ts
src/components/brand/fox-logo.tsx
src/components/dashboard/**
src/components/store/store-home.tsx
src/components/shared/**
src/app/dashboard/**
src/app/(store)/**
src/app/api/auth/**
src/app/api/dashboard/catalog/route.ts
new design.md
```

## How to try it

```bash
npm install
npm run dev
```

1. Open `/` — store home (AR by default; toggle language / theme)
2. Open `/dashboard/login` — sign in with demo admin
3. Manage categories/products and home visibility from the dashboard

## Env tips (optional)

```
ACCESS_TOKEN_SECRET=...
REFRESH_TOKEN_SECRET=...
ACCESS_TOKEN_COOKIE=fox_access_token
REFRESH_TOKEN_COOKIE=fox_refresh_token
DATABASE_URL=...   # for real Prisma users
```
