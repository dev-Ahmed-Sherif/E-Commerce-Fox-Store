# Fox Store — Basic Business Test Plan

**Version:** 1.0  
**Date:** 24 November 2026  
**Application:** Fox Store / FoxWorksEG (Next.js 14 + MongoDB + Better Auth + Stripe)  
**Test focus:** revenue-critical storefront, accounts, catalog administration, role access and checkout  
**Primary environment:** local development (`npm run dev`) with local MongoDB  
**Secondary environment:** Vercel preview after a successful deployment

---

## 1. Objectives

Prove that the basic business journeys work end to end:

1. A visitor can discover the catalog and understand products.
2. An administrator can sign in and manage categories and products.
3. A customer can create an account, sign in and maintain a profile.
4. Admin and customer access are separated correctly.
5. Roles are stored and resolved from the `Role` collection.
6. A customer can pay for an order and the order becomes paid.
7. Arabic/English, RTL and light/dark mode do not break the journeys.

The output of this plan is a pass/fail/blocked report with evidence, not just a checklist.

---

## 2. Scope

### In scope

- Storefront home, category pages and navigation.
- Product presentation, localization and visibility rules.
- Cart state, totals and checkout entry point.
- Customer sign-up, sign-in, sign-out and profile.
- Admin login, dashboard guard, category/product CRUD.
- Admin/customer API authorization.
- `Role` collection, `User.roleId` relation and admin role enforcement.
- Checkout session creation, Stripe test payment and webhook processing.
- Arabic RTL layout, theme switching and responsive behavior.
- Local MongoDB persistence and seed idempotency.

### Out of scope for this cycle

- Multi-store tenant isolation in the legacy `/api/[storeId]/*` APIs.
- Payment-provider certification, refunds, disputes or tax.
- Shipping, inventory reservation, coupons, emails and SMS.
- Load, stress, penetration and accessibility certification.
- Google OAuth and UploadThing (covered as P2 smoke checks only).
- Vercel production performance tuning.

---

## 3. Test readiness assessment

| Area | Readiness | Notes |
|------|-----------|-------|
| Storefront browsing | Ready | Uses demo catalog; no database required |
| Language/theme | Ready | Arabic default, RTL, system theme |
| Customer auth/profile | Ready with local Mongo | Better Auth collections must be reachable |
| Admin demo login | Ready | Hard-coded demo admin; no database required |
| Admin catalog CRUD | Ready locally, not persistent | Writes to in-memory `demo-data.ts` |
| Role table | Ready at database level | No admin UI for roles/users yet |
| Cart UI | **Blocked** | No add-to-cart control is rendered on the storefront |
| Cart rendering | **Blocked** | Cart expects legacy `images[]`, `color`, `size` shape |
| Checkout | **Blocked** | Checkout reads Prisma products; storefront uses demo data |
| Stripe webhook | Ready after checkout fixture | Requires Stripe CLI and a valid order |

**Rule of engagement:** execute all ready areas first. Do not mark cart/checkout as failed until the blockers in section 9 are fixed; mark those cases **BLOCKED** and attach this plan.

---

## 4. Environments and setup

### 4.1 Prerequisites

- Node.js 20+ and npm.
- MongoDB running locally on `127.0.0.1:27017`.
- Chrome/Edge desktop; optional Safari or a mobile browser for responsive checks.
- Stripe test-mode keys only for payment cases.
- Stripe CLI only for webhook cases.

### 4.2 Test environment file

Use a local database. Do not run destructive payment tests against Atlas.

```dotenv
DATABASE_URL="mongodb://localhost:27017/fox-store"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_FRONTEND_URL="http://localhost:3000"

# Checkout only; <storeId> must be a store that exists in MongoDB
NEXT_PUBLIC_API_URL="http://localhost:3000/api/<storeId>"

# Payment tests only
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_Secret_Key="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

If `.env` still points at Atlas, either temporarily change `DATABASE_URL` or start the dev server with a local override:

```powershell
$env:DATABASE_URL = "mongodb://localhost:27017/fox-store"
npm run dev
```

### 4.3 Setup commands

```bash
npm ci
npm run db:seed
npm run db:migrate-roles
npm run dev
```

Health checks before testing:

```bash
npx prisma validate
npx tsc --noEmit --incremental false
npm run build
```

### 4.4 Stripe webhook forwarding

In a separate terminal:

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

Use the printed `whsec_...` value for `STRIPE_WEBHOOK_SECRET`, then restart the dev server.

---

## 5. Test data

| Data | Value / rule |
|------|--------------|
| Demo admin | `admin@foxstore.eg` / `foxadmin123` |
| Customer account | `qa+<timestamp>@foxstore.test` / `TestPass123!` |
| Roles | `SUPER`, `ADMIN`, `SUBADMIN`, `CUSTOMER`, `USER` |
| Categories | Six demo categories: weddings, marriage contract, graduation, laser décor, models, practical gifts |
| Products | Twelve demo products; all prices are `0` = “made to order” |
| Admin category | Name `QA Category`, Arabic `تصنيف اختبار`, image `/catalog/letter-decor.jpg` |
| Admin product | Name `QA Product`, Arabic `منتج اختبار`, price `100`, quantity `5` |
| Stripe card | `4242 4242 4242 4242`, any future expiry, any CVC |
| Checkout fixture | A `Store` and `Product` created in MongoDB; product `_id` must be a real ObjectId string |

> Demo product IDs such as `prod-fans` are **not** MongoDB ObjectIds and cannot be used by the Prisma checkout route. Checkout requires a database-backed fixture.

---

## 6. Entry and exit criteria

### Entry criteria

- `npm ci` finishes without `ERESOLVE`.
- `npm run build` succeeds.
- Local MongoDB is reachable.
- `Role` collection contains five roles.
- App loads at `http://localhost:3000`.
- No open blocker that prevents the selected test area.

### Exit criteria

- All P0 cases pass, except explicitly blocked cart/checkout cases.
- All P1 cases pass or have an accepted defect.
- No open Critical or High defects.
- Every blocked case has a documented blocker and reproduction.
- Evidence (screenshots, console/network logs, DB queries) is attached to the report.
- Business owner signs off on the release recommendation.

---

## 7. Execution schedule

| Phase | Work | Estimate |
|-------|------|----------|
| 0 | Environment, seed, build and smoke | 0.5 day |
| 1 | Storefront and catalog browsing | 0.5 day |
| 2 | Customer accounts and profile | 0.5 day |
| 3 | Admin dashboard and roles | 0.5 day |
| 4 | Cart/checkout and Stripe (after blockers) | 1 day |
| 5 | Localization, theme, responsive, regression | 0.5 day |
| 6 | Report and sign-off | 0.5 day |

Total: approximately **4 working days**, or **2 days** for the P0/P1 subset.

---

## 8. Business scenarios

These are the acceptance-level stories. Detailed test cases follow.

| ID | Scenario | Current readiness |
|----|----------|-------------------|
| BIZ-01 | A visitor opens the store, sees collections and opens a category page | Ready |
| BIZ-02 | A visitor switches to English/light mode and the store remains usable | Ready |
| BIZ-03 | An admin signs in, adds a product and sees it on the home page | Ready locally |
| BIZ-04 | An admin hides a category from the home page | Ready locally |
| BIZ-05 | A customer registers, signs in, saves a profile and signs out | Ready with local Mongo |
| BIZ-06 | An unauthenticated user cannot open `/dashboard` or admin APIs | Ready |
| BIZ-07 | A customer cannot use an admin API | Ready |
| BIZ-08 | A customer pays for a cart and the order becomes paid | **Blocked** |
| BIZ-09 | A customer sees the paid order in `/profile` | **Blocked** |

### 8.1 Quick business smoke — 30 minutes

Run this before the full plan to decide whether the build is demo-ready:

1. `npm ci && npm run build && npm run dev` — all succeed.
2. Open `/`, switch AR → EN, then light → dark, and reload — state persists.
3. Open one category, confirm only that category’s products appear.
4. Sign in as the demo admin, create a visible category and a featured product,
   then reload `/` — both appear.
5. Sign up a new customer, save a profile, sign out, sign in again — profile
   values persist.
6. Open `/dashboard` and `/api/dashboard/catalog` while signed out — redirect
   and HTTP 401 respectively.
7. Record cart/checkout as **BLOCKED** until BLK-01, BLK-02 and BLK-03 are fixed.

If steps 1–6 pass, the storefront, admin and customer-account demos are safe to
show. They do not prove that a customer can buy anything.

---

## 9. Known blockers and required fixes

These are not test failures; they block specific tests until fixed.

| ID | Blocker | Impact | Workaround |
|----|---------|--------|------------|
| BLK-01 | Storefront product cards have no add-to-cart button; `product-card.tsx` exists but is not rendered | Cannot populate cart through the UI | Add the cart action to `store-home.tsx` / `category-view.tsx` |
| BLK-02 | `CartItem` expects `images[0].url`, `color.name`, `size.name`; demo products expose `imageUrl` only | Adding a demo product would crash the cart page | Adapt cart/cart item to the demo product shape or normalize data |
| BLK-03 | Checkout queries Prisma products, while storefront uses `demo-data.ts` | Demo products return `404 No products found` | Seed a real Store/Product fixture and point `NEXT_PUBLIC_API_URL` at its store |
| BLK-04 | Dashboard catalog is in memory | Changes reset on restart and may not appear across processes | Accept for local CRUD tests; move to Prisma for persistence |
| BLK-05 | Search writes `?name=` but no page filters by it | Search does not return filtered results | Treat as known gap or implement filtering |
| BLK-06 | No product detail page; `ProductCard` links to `/store/product/:id` which does not exist | Product discovery stops at the grid | Add a detail route or remove the dead link |
| BLK-07 | Checkout button is always enabled, including with an empty cart | Empty checkout can hit the API and redirect oddly | Disable when `items.length === 0`; handle API errors |
| BLK-08 | Atlas cluster was unreachable from the test machine | Customer auth, profiles and orders fail if `.env` points Atlas | Use `DATABASE_URL_LOCAL` / local MongoDB |
| BLK-09 | No test IDs and no automated test runner | Slower automation and brittle selectors | Add `data-testid` and Playwright/Vitest in a later cycle |
| BLK-10 | Demo admin credentials are hard-coded | Production security risk | Remove/gate before public launch |

---

## 10. Detailed test cases

Priority: **P0** = release blocker, **P1** = important, **P2** = optional/next cycle.  
Type: **M** = manual, **A** = API/DB check, **E** = end-to-end automation candidate.

### 10.1 Environment and smoke

| ID | P | Type | Case | Steps | Expected |
|----|---|------|------|-------|----------|
| ENV-01 | P0 | M/A | Clean install and build | `npm ci`; `npm run build` | Both exit 0; build reports 24 pages; no `ERESOLVE` |
| ENV-02 | P0 | M/A | Dev server health | `npm run dev`; open `/`, `/cart`, `/dashboard/login` | HTTP 200, no uncaught console errors |
| ENV-03 | P0 | A | Role seed is idempotent | `npm run db:seed` twice; query `Role` count | Count remains 5; names `SUPER`, `ADMIN`, `SUBADMIN`, `CUSTOMER`, `USER` |
| ENV-04 | P0 | A | Schema/client validity | `npx prisma validate`; `npx tsc --noEmit --incremental false` | Valid; TypeScript exit 0 |
| SMK-01 | P0 | M | Home smoke | Open `/` | Hero, collections and featured products render; no broken images |
| SMK-02 | P0 | M | Navigation smoke | Click Home, each category, Cart, Sign in, Dashboard | All routes load without a 404/500 |

### 10.2 Storefront and catalog

| ID | P | Type | Case | Steps | Expected |
|----|---|------|------|-------|----------|
| ST-01 | P0 | M | Home collections only | Compare home categories with `demoStore.getHomeCategories()` | Only `showOnHome` categories appear |
| ST-02 | P0 | M | Category page filters products | Open `/category/cat-weddings` | Only wedding products; other categories excluded |
| ST-03 | P0 | M | Archived product visibility | In dashboard archive a product; reload its category | Product no longer visible; direct URL not available |
| ST-04 | P1 | M | Unknown category | Open `/category/does-not-exist` | Empty-state message, no crash |
| ST-05 | P0 | M | Localized product content | Toggle AR/EN on home and category | Names/descriptions switch; no missing-key text |
| ST-06 | P1 | M | Arabic default | Fresh browser, open `/` | `html lang=ar`, `dir=rtl`, Arabic copy |
| ST-07 | P0 | M | Language persistence | Toggle to EN; reload; navigate categories | Stays EN and LTR via `fox_locale` cookie |
| ST-08 | P0 | M | Theme switch | Toggle dark/light; reload | Theme persists; text remains readable; brand colors applied |
| ST-09 | P1 | M | Responsive storefront | Widths 375, 768, 1440; open home/category/cart | No horizontal scroll; navbar actions usable |
| ST-10 | P2 | M | Search behavior | Type in navbar search on `/` | URL gets `?name=`; record whether results filter (current known gap: they do not) |
| ST-11 | P1 | M | Cart empty state | Open `/cart` with no cart storage | “No Items added to cart”; order total 0 |
| ST-12 | P1 | M | Footer/contact links | Click Facebook/WhatsApp/phone | Open correct FoxWorksEG destinations |

### 10.3 Customer accounts and profile

| ID | P | Type | Case | Steps | Expected |
|----|---|------|------|-------|----------|
| AUTH-01 | P0 | M | Customer sign-up | `/sign-up` with new email and 8+ char password | Redirects to `/profile`; session established |
| AUTH-02 | P0 | A | Customer persisted | Query `customer_user` for the test email | Exactly one user; no duplicate |
| AUTH-03 | P1 | M | Duplicate sign-up | Repeat AUTH-01 with same email | Error shown; no second user |
| AUTH-04 | P0 | M | Sign-in valid | Sign out; `/sign-in` with test credentials | Redirects to `/profile` |
| AUTH-05 | P1 | M | Sign-in invalid | Wrong password | Error shown; no session |
| AUTH-06 | P0 | M | Profile guard | Signed out, open `/profile` | Redirect to `/sign-in?from=/profile` |
| AUTH-07 | P0 | M | Profile save | Fill first/last name, phone, address, city, country; save; reload | Values persist; API returns 200 |
| AUTH-08 | P1 | A | Profile storage | Query `CustomerProfile` by Better Auth user id | One profile with saved values |
| AUTH-09 | P1 | M | Sign-out | Click sign out | Redirect to home; `/profile` guarded again |
| AUTH-10 | P2 | M | Google sign-in | Click Google (if credentials configured) | Google consent, callback, profile page |
| AUTH-11 | P1 | M | Validation | Submit empty/invalid email/password | Inline or API error; no crash |

### 10.4 Admin dashboard and roles

| ID | P | Type | Case | Steps | Expected |
|----|---|------|------|-------|----------|
| ADM-01 | P0 | M | Dashboard guard | Signed out, open `/dashboard` | Redirect to `/dashboard/login?from=/dashboard` |
| ADM-02 | P0 | M | Demo admin login | Sign in with demo credentials | Redirect to `/dashboard`; overview visible |
| ADM-03 | P1 | M | Login page redirect | Signed in, open `/dashboard/login` | Redirect to `/dashboard` |
| ADM-04 | P1 | M | Invalid admin login | Wrong credentials | Error; no cookies; stays on login |
| ADM-05 | P0 | M | Overview stats | Compare cards with catalog counts | Categories/products/featured match current demo store |
| ADM-06 | P0 | M | Create category | Add QA category with AR/EN names and image URL | New row; category appears on home if visible |
| ADM-07 | P1 | M | Edit category | Change name/Arabic/image; save; reload | Changes persist in the running server |
| ADM-08 | P0 | M | Toggle category visibility | Toggle “show on home”; reload `/` | Category disappears/appears on home |
| ADM-09 | P1 | M | Delete category | Delete QA category; confirm | Row gone; its products gone from dashboard/catalog |
| ADM-10 | P0 | M | Create product | Add QA product with category, price 100, qty 5, image URL | Row visible; storefront shows it in the category |
| ADM-11 | P0 | M | Toggle featured | Toggle featured on QA product; reload `/` | Product appears/removes from featured section |
| ADM-12 | P1 | M | Archive product | Toggle archived; reload category | Product excluded from storefront |
| ADM-13 | P1 | M | Delete product | Delete QA product | Row gone; storefront no longer lists it |
| ADM-14 | P1 | M | Catalog reset on restart | Make changes; restart dev server; reload dashboard | Changes are lost (current in-memory behavior); record as known limitation |
| ADM-15 | P0 | M | Admin logout | Click logout | Redirect to login; `/dashboard` guarded |
| ROLE-01 | P0 | A | Role relation | Query a Prisma user with `include: { role: true }` | `user.role.name` resolves, e.g. `ADMIN` |
| ROLE-02 | P1 | A | Admin role enforcement | Create/fixture a `CUSTOMER` user; call admin API | 401/403; `ADMIN`/`SUPER`/`SUBADMIN` allowed |
| ROLE-03 | P2 | A | Role uniqueness | Insert duplicate `Role.name` | Unique index rejects it |

### 10.5 Cart and checkout — blocked until BLK-01/02/03 are fixed

| ID | P | Type | Case | Steps | Expected |
|----|---|------|------|-------|----------|
| CART-01 | P0 | M | Add product to cart | Open home/category; click add-to-cart | Item added; navbar badge increments; toast shown |
| CART-02 | P0 | M | Cart rendering | Open `/cart` after adding | Image, name, color/size, price render without error |
| CART-03 | P1 | M | Remove item | Click remove on cart line | Item removed; total updates |
| CART-04 | P1 | M | Cart persistence | Reload page / new tab | Cart persists via `cart-storage` localStorage |
| CART-05 | P1 | M | Empty checkout guard | Empty cart; click Checkout | Button disabled or clear validation message |
| CHK-01 | P0 | M | Checkout with demo product | Add demo product; checkout | Currently 404 `No products found`; expected Stripe test session |
| CHK-02 | P0 | A | Create order and session | POST `/api/[storeId]/checkout` with fixture product ids | 200 with Stripe URL; unpaid `Order` created |
| CHK-03 | P0 | M | Stripe payment | Pay with `4242 4242 4242 4242` | Redirect `/cart?success=1`; cart cleared |
| CHK-04 | P0 | A | Webhook marks paid | `stripe listen` forwards `checkout.session.completed` | Order `isPaid=true`; phone/address copied |
| CHK-05 | P1 | M | Cancel payment | Cancel on Stripe page | Redirect `?canceled=1`; order remains unpaid |
| CHK-06 | P1 | A | Invalid webhook | POST `/api/webhook` without valid signature | 400; no order update |

### 10.6 Access control and security

| ID | P | Type | Case | Steps | Expected |
|----|---|------|------|-------|----------|
| SEC-01 | P0 | A | Admin API unauthenticated | `GET /api/dashboard/catalog` without cookies | 401 |
| SEC-02 | P0 | A | Admin API authenticated | Login as demo admin; repeat | 200 with categories/products/stats |
| SEC-03 | P0 | A | Customer cannot use admin API | Login as customer; call admin API | 401 |
| SEC-04 | P0 | A | `/api/auth/me` guard | No cookie; then admin login | 401, then 200 with `role: ADMIN` |
| SEC-05 | P0 | A | Profile API guard | No customer session | 401 |
| SEC-06 | P1 | M | Cookie flags | Inspect Set-Cookie in dev/prod | Access/refresh HttpOnly, SameSite=Lax, Secure in production |
| SEC-07 | P1 | M | Direct URL guard | Open `/dashboard`, `/profile` signed out | Redirected; no dashboard/profile content flashes |
| SEC-08 | P2 | M | Secret exposure | Inspect built client bundle | No Stripe secret, Mongo URI or JWT secrets |

### 10.7 Data integrity and persistence

| ID | P | Type | Case | Steps | Expected |
|----|---|------|------|-------|----------|
| DB-01 | P0 | A | Collections and indexes | `db push`; list collections/indexes | Role, User, CustomerProfile and catalog collections exist; unique/indexes present |
| DB-02 | P1 | A | Customer profile persistence | Save profile; query DB; reload page | Values persist across requests |
| DB-03 | P1 | A | Order/customer link | Create order as signed-in customer | `Order.customerUserId` matches Better Auth user id |
| DB-04 | P1 | M | Current/last orders | Pay one order; open `/profile` | Paid order appears in “last”; unpaid order in “current” |
| DB-05 | P2 | A | Line totals | Inspect `OrderItem` after checkout | `unitPrice × quantity = totalPrice`; order total consistent |

---

## 11. Execution record template

Use this table in the test report.

| Test ID | Result (Pass/Fail/Blocked) | Evidence | Defect ID | Notes |
|---------|----------------------------|----------|-----------|-------|
| ENV-01 | | terminal log | | |
| ST-01 | | screenshot | | |
| AUTH-01 | | network log | | |
| ADM-06 | | screenshot + API log | | |
| CHK-02 | | blocked: BLK-03 | | |

### Defect severity

| Severity | Definition | Example |
|----------|------------|---------|
| Critical | Business journey impossible; data loss or security breach | Cannot complete checkout; customer data exposed |
| High | Major journey broken with no workaround | Admin cannot create products |
| Medium | Journey works but with significant friction | Search does not filter |
| Low | Cosmetic or minor usability issue | Alignment on mobile |

---

## 12. Automation plan (next cycle)

Do not block this manual cycle on automation. Recommended order:

1. Add Playwright and `data-testid` attributes to:
   - Navbar links, cart badge, language/theme toggles.
   - Product cards/add-to-cart buttons.
   - Login/sign-up forms.
   - Dashboard category/product forms.
2. Add a fixture script that creates:
   - An admin user with an `ADMIN` role.
   - A store, billboard, category, size, color and product with known ObjectIds.
   - A customer account.
3. Automate the smoke suite:
   - Home loads and shows collections.
   - Category page loads.
   - Language/theme persists.
   - Customer sign-up/sign-in.
   - Admin login and catalog create/toggle.
   - Admin API 401/200.
4. Add API tests for `/api/auth/*`, `/api/dashboard/catalog`, `/api/profile` and `/api/[storeId]/checkout`.
5. Add CI steps:

```bash
npm ci
npm run db:seed
npx prisma validate
npx tsc --noEmit
npm run build
npx playwright test
```

Suggested first automation target: **8 critical tests** covering login, catalog visibility, customer profile and access control. Cart/checkout automation comes only after BLK-01–03.

---

## 13. Release recommendation

| Gate | Status |
|------|--------|
| Storefront browse and localization | Ready to test |
| Admin demo catalog | Ready to test locally; not production-persistent |
| Customer accounts/profile | Ready with local Mongo |
| Role table enforcement | Ready at DB/API level |
| Cart and checkout | **Not ready** — blockers BLK-01/02/03 |
| Production security | Not ready — demo credentials, in-memory catalog |

**Recommendation:** run the P0/P1 storefront, account, admin and access-control cases now. Fix BLK-01, BLK-02 and BLK-03 before declaring the store ready for business; without them a customer cannot actually buy a product.

---

## 14. Sign-off

| Role | Name | Date | Decision |
|------|------|------|----------|
| QA / tester | | | |
| Developer | | | |
| Business owner | | | |

**Decision:** ☐ Go ☐ Go with known issues ☐ No-go
