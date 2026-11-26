# Fox Store — Smoke and Admin CRUD Test Report

**Report:** 01  
**Date:** 24 November 2026  
**Test plan:** [TEST_PLAN.md](../TEST_PLAN.md), sections 1 and 2  
**Environment:** Local development, Microsoft Edge headless, local MongoDB  
**Overall result:** **37 passed, 0 failed, 1 known limitation confirmed**

---

## 1. Scope

Executed:

1. Environment and smoke checks (`ENV-01`–`ENV-04`, `SMK-01`–`SMK-02`).
2. Admin login, dashboard guard, catalog API and category/product CRUD
   (`ADM-01`–`ADM-15`).
3. Supporting access-control checks (`SEC-01`, `SEC-04`, `SEC-06`, `SEC-07`).
4. A real browser click-through of the admin category and product forms
   (`UI-01`–`UI-06`).

Not executed in this pass:

- Customer accounts/profile (`AUTH-*`).
- Cart and checkout (`CART-*`, `CHK-*`) — blocked by BLK-01/02/03.
- Stripe and webhook tests.
- Role fixture tests requiring a dedicated `CUSTOMER` admin user.

---

## 2. Environment

| Item | Value |
|------|-------|
| App | Fox Store / FoxWorksEG |
| Framework | Next.js 14.2.7 |
| Node.js | 24.19.0 |
| Database | MongoDB `localhost:27017/fox-store` |
| Browser | Microsoft Edge, headless |
| Admin account | `admin@foxstore.eg` (demo) |
| Roles in DB | `SUPER`, `ADMIN`, `SUBADMIN`, `CUSTOMER`, `USER` |

The `.env` file still points at Atlas, but the Atlas cluster was unreachable.
The dev server was started with a local `DATABASE_URL` override; this is the
same local database used by the test plan.

---

## 3. Build and setup results

| Check | Command | Result |
|-------|---------|--------|
| Clean install | `npm ci --no-audit --no-fund` | **PASS** — 575 packages installed |
| Prisma schema | `npx prisma validate` | **PASS** — schema valid |
| TypeScript | `npx tsc --noEmit --incremental false` | **PASS** — exit 0 |
| Production build | `npm run build` | **PASS** — 24 pages generated |
| Dev server | `npm run dev` | **PASS** — ready on port 3000 |
| Role seed idempotency | `npm run db:seed` twice | **PASS** — still 5 roles |

Build warnings observed:

- `next@14.2.7` reports a security advisory; upgrade to a patched Next.js
  release before production.
- Prisma CLI `5.22.0` and `@prisma/client` `6.3.1` version mismatch warning.
- Three existing React Hook `exhaustive-deps` ESLint warnings
  (`use-origin`, `locale-provider`, `modal-provider`).
- `caniuse-lite` is outdated.

None of these warnings blocked the build.

---

## 4. Results summary

| Area | Passed | Failed | Blocked / limitation |
|------|--------|--------|----------------------|
| Environment and smoke | 6 | 0 | 0 |
| Admin dashboard and catalog | 20 | 0 | 1 (`ADM-14`) |
| Supporting access control | 5 | 0 | 0 |
| Browser UI click-through | 6 | 0 | 0 |
| **Total** | **37** | **0** | **1** |

Raw output is in `test-evidence/smoke-admin-results.txt` and
`test-evidence/ui-admin-results.txt`.

---

## 5. Environment and smoke checks

| ID | Case | Result | Evidence |
|----|------|--------|----------|
| ENV-01 | Clean install and production build | PASS | 575 packages; 24 pages |
| ENV-02 | Dev server health (`/`, `/cart`, `/dashboard/login`) | PASS | HTTP 200 |
| ENV-03 | Role seed is idempotent | PASS | 5 roles after two runs |
| ENV-04 | Schema and TypeScript validity | PASS | validate + tsc exit 0 |
| SMK-01 | Home hero, collections and featured products | PASS | English copy rendered |
| SMK-02 | Primary navigation routes | PASS | `/category`, `/cart`, `/sign-in`, `/sign-up`, `/dashboard/login` all 200 |

Additional page checks:

- `/category/cat-weddings` returns 200 and contains the wedding product.
- `/category/does-not-exist` returns 200 with the “No products yet” empty state.
- Unauthenticated `/dashboard` redirects to
  `/dashboard/login?from=%2Fdashboard`.
- Unauthenticated `/profile` redirects to `/sign-in?from=%2Fprofile`.

---

## 6. Admin dashboard and catalog CRUD

| ID | Case | Result | Notes |
|----|------|--------|-------|
| ADM-01 | Unauthenticated dashboard guard | PASS | 307 to login with `from` |
| ADM-02 | Demo admin login | PASS | 200; role `ADMIN` |
| ADM-02a | Authenticated `/dashboard` | PASS | 200 |
| ADM-02b | `/dashboard/categories` and `/dashboard/products` | PASS | Both 200 |
| ADM-02c | Dashboard headings render | PASS | “Add category”, “Add product” |
| ADM-03 | Authenticated login page redirect | PASS | 307 to `/dashboard` |
| ADM-04 | Wrong password rejected | PASS | 401 |
| ADM-05 | Overview catalog counts | PASS | 6 categories, 12 products, 7 featured |
| ADM-06 | Create category | PASS | New row and home-visible category |
| ADM-07 | Edit category | PASS | Updated billboard label persisted in-process |
| ADM-08 | Hide category from home | PASS | Category removed from home |
| ADM-09 | Delete category cascades products | PASS | Product removed with category |
| ADM-10 | Create product | PASS | New row; appears in its category |
| ADM-10a | Featured product on home | PASS | New product appears in featured section |
| ADM-11 | Unfeature product | PASS | Product removed from home |
| ADM-12 | Archive product | PASS | Product removed from category page |
| ADM-13 | Delete product/category and restore counts | PASS | Back to 6/12 |
| ADM-14 | Catalog persistence across restart | **CONFIRMED LIMITATION** | 7 → 6 categories after restart |
| ADM-15 | Logout clears cookies | PASS | Access and refresh cookies expired |

### Browser UI click-through

| ID | Case | Result |
|----|------|--------|
| UI-01 | Login through `/dashboard/login` redirects to dashboard | PASS |
| UI-02 | Create category through the dashboard modal | PASS |
| UI-03 | Create product through the dashboard modal | PASS |
| UI-04 | Created category appears on the storefront home | PASS |
| UI-05 | Created featured product appears on the home page | PASS |
| UI-06 | No browser page errors | PASS |

Screenshot: `test-evidence/admin-catalog-test.png` — the products table with the
QA product, its QA category, `123 EGP` price and “Visible” featured state.

---

## 7. Access-control checks executed

| ID | Case | Result |
|----|------|--------|
| SEC-01 | Admin catalog API without cookie returns 401 | PASS |
| SEC-04a | `/api/auth/me` without cookie returns 401 | PASS |
| SEC-04b | `/api/auth/me` with admin cookie returns `ADMIN` | PASS |
| SEC-06 | Admin auth cookies are HttpOnly | PASS |
| SEC-07 | Unauthenticated `/profile` is redirected | PASS |

Not executed in this pass: customer-session denial against the admin API
(`SEC-03`) and full refresh-token rotation.

---

## 8. ADM-14 — confirmed persistence limitation

Steps:

1. Created `QA Persistence Marker` as a category.
2. Confirmed the catalog returned 7 categories with the marker present.
3. Restarted the dev server.
4. Signed in again and queried the catalog.

Result:

- Before restart: 7 categories, marker present.
- After restart: 6 categories, 12 products, marker absent.

This confirms **BLK-04** in the test plan: dashboard catalog edits are stored in
the in-memory module from `src/lib/demo-data.ts`. They reset on restart and are
not reliable across server instances. The test data was cleaned up by the
restart; the catalog is back to its baseline 6 categories / 12 products.

Evidence: `test-evidence/persistence-check.txt`.

---

## 9. Findings and recommendations

### Critical / before production

1. **Persist the admin catalog.** Replace the in-memory `demo-data.ts` writes
   with Prisma/MongoDB. Until then, admin changes are session-only and disappear
   on restart.
2. **Upgrade Next.js 14.2.7.** npm reports a security advisory for this version.
3. **Remove or gate the hard-coded demo admin** before public deployment.

### Recommended

4. Align the Prisma CLI with `@prisma/client` (`prisma@6.3.1`) to remove the
   version-mismatch warning.
5. Fix the three React Hook dependency warnings.
6. Add a persistent store/catalog fixture so the cart and checkout tests
   (BLK-01/02/03) can run.
7. Keep the `TEST_PLAN.md` cart/checkout section marked blocked until those
   blockers are fixed.

### Passing business behavior

- Admin login, dashboard guard and logout work.
- Category and product create/edit/visibility/archive/delete work in-process.
- Category deletion cascades to its products.
- Storefront reflects admin changes within the same server process.
- The real browser forms create and display category/product records correctly.
- Baseline catalog and role seed remain intact after cleanup.

---

## 10. Next test sessions

1. Customer accounts and profile (`AUTH-01`–`AUTH-11`) against local Mongo.
2. Cart and checkout after BLK-01/02/03 are fixed.
3. Stripe test payment and webhook (`CHK-02`–`CHK-06`).
4. Role enforcement with a fixture `CUSTOMER`/`ADMIN` admin user
   (`ROLE-01`–`ROLE-03`, `SEC-03`).

---

## 11. Sign-off

| Role | Name | Date | Decision |
|------|------|------|----------|
| QA / tester | Automated smoke + UI run | 24 Nov 2026 | Pass with known limitation |
| Developer | — | — | Fix ADM-14 persistence before production |

**Recommendation:** storefront and admin demo flows are **Go for demo**; catalog
administration is **not Go for production** until the in-memory catalog is
replaced with database persistence.
