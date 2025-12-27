# Commergia — Deployment & Operations Manual
### by SL177Y | February 2026

---

## 1. PREREQUISITES

| Requirement | Version | Purpose |
|---|---|---|
| Node.js | v20.10+ LTS | Runtime |
| npm | v10+ | Package management |
| Git | v2.40+ | Version control |
| Shopify Partner Account | — | Storefront API access token |
| WordPress Instance | v6.4+ | Content layer (WPGraphQL plugin required) |
| Stripe Account | — | USD payment processing |
| Razorpay Account | — | INR payment processing |
| Vercel Account | Pro recommended | Frontend hosting |
| Resend Account | — | Transactional emails |

---

## 2. LOCAL DEVELOPMENT SETUP

### Step 1: Clone & Install
```bash
git clone https://github.com/SL177Y-0/commergia.git
cd commergia
npm install
```

### Step 2: Environment Configuration
```bash
cp .env.example .env.local
# Edit .env.local with your actual API keys (see MERGER_PLAN.md Section 5)
```

### Step 3: Generate GraphQL Types
```bash
npm run codegen
```
This runs `@graphql-codegen/cli` against your Shopify Storefront API schema and generates TypeScript types in `src/types/shopify-graphql.ts`.

### Step 4: Start Development Server
```bash
npm run dev
# Open http://localhost:3000
```

### Step 5: Verify Core Functionality
- [ ] Homepage loads with collections from Shopify
- [ ] Products display with images from `cdn.shopify.com`
- [ ] Cart add/remove works (check browser localStorage for `cartId`)
- [ ] Auth page renders login/signup forms

---

## 3. TESTING

### Unit Tests (Vitest)
```bash
npm run test               # Run all unit tests
```

### E2E Tests (Playwright)
```bash
npx playwright install --with-deps    # First time only — install browsers
npm run test:e2e                      # Run all E2E specs
```

### Full Test Suite
```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

**Test files are in `tests/unit/` and `tests/e2e/` — see MERGER_PLAN.md Phase 9 for the complete list.**

---

## 4. BUILD & PRODUCTION

### Production Build
```bash
npm run build              # Runs next build — optimizes images, generates static pages
npm run start              # Starts production server on port 3000
```

### Build Verification
After `npm run build`, check:
- [ ] No TypeScript errors (`tsc --noEmit` passes)
- [ ] No ESLint warnings (`npm run lint` passes)
- [ ] Build completes without errors
- [ ] Static pages generated for all ISR routes

---

## 5. DEPLOYMENT TO VERCEL (RECOMMENDED)

### Step 1: Connect Repository
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your `commergia` GitHub repository
3. Framework Preset: **Next.js** (auto-detected)
4. Root Directory: **`./`**

### Step 2: Configure Environment Variables
In Vercel Dashboard → Settings → Environment Variables, add ALL variables from `.env.example`:

| Variable | Scope | Notes |
|---|---|---|
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | All | Your `.myshopify.com` domain |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | All | Public storefront token |
| `SHOPIFY_ADMIN_ACCESS_TOKEN` | Production | Private — server-side only |
| `STRIPE_SECRET_KEY` | Production | Private — never expose to client |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | All | Public key for Stripe Elements |
| `RAZORPAY_KEY_SECRET` | Production | Private |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | All | Public key for Razorpay checkout |
| `RESEND_API_KEY` | Production | For transactional emails |
| `REVALIDATION_SECRET` | Production | For on-demand ISR webhook |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Production | GA4 tracking |
| `NEXT_PUBLIC_SITE_URL` | Production | Your production domain |

### Step 3: Build Settings
- **Build Command:** `npm run build`
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install`
- **Node.js Version:** 20.x

### Step 4: Deploy
Click **Deploy**. Vercel will:
1. Install dependencies
2. Run `next build` (ISR pages pre-rendered, static assets optimized)
3. Deploy to Vercel Edge Network (global CDN)
4. Assign a `.vercel.app` URL

### Step 5: Custom Domain (Optional)
1. Go to Vercel Dashboard → Domains
2. Add `commergia.sl177y.com` (or your domain)
3. Update DNS records as instructed by Vercel
4. SSL certificate auto-provisioned

---

## 6. DEPLOYMENT TO DOCKER (SELF-HOSTED ALTERNATIVE)

### Build Docker Image
```bash
docker build -t commergia:latest .
```

### Run Container
```bash
docker run -p 3000:3000 --env-file .env.local commergia:latest
```

### Docker Compose (Full Stack)
```bash
docker-compose up -d
# Commergia available at http://localhost:3000
```

---

## 7. CI/CD PIPELINE (GitHub Actions)

The CI pipeline is defined in `.github/workflows/ci.yml` and runs automatically on:
- **Push** to `main` or `develop`
- **Pull Request** to `main`

### Pipeline Stages:
```
lint-and-type-check → unit-tests → e2e-tests → deploy (main only)
```

### Required GitHub Secrets:
| Secret | Purpose |
|---|---|
| `VERCEL_TOKEN` | Vercel API token for auto-deploy |
| `VERCEL_ORG_ID` | Your Vercel organization ID |
| `VERCEL_PROJECT_ID` | Your Vercel project ID |
| All `.env` variables | For E2E tests in CI |

### How to get Vercel secrets:
```bash
npm i -g vercel
vercel login
vercel link        # Links to your project, creates .vercel/project.json
# Copy orgId and projectId from .vercel/project.json
```

---

## 8. WORDPRESS CONTENT LAYER SETUP

### Step 1: Install WPGraphQL Plugin
In your WordPress admin:
1. Go to Plugins → Add New
2. Search "WPGraphQL"
3. Install and Activate
4. Verify at `https://your-wp-site.com/graphql`

### Step 2: Configure Permalinks
1. Go to Settings → Permalinks
2. Select "Post name" (`/%postname%/`)
3. Save

### Step 3: Set Environment Variable
```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wp-site.com/graphql
```

### Step 4: Create Content
- Create blog posts in WordPress as usual
- They will be fetched by Commergia's `/blog` page via WPGraphQL
- ISR revalidation every 300 seconds (5 minutes)

### Step 5: Webhook for Instant Updates (Optional)
Configure a WordPress webhook (via WP Webhooks plugin) to hit:
```
POST https://commergia.sl177y.com/api/webhooks/wordpress
Header: x-webhook-secret: YOUR_REVALIDATION_SECRET
```
This triggers on-demand ISR revalidation for the blog.

---

## 9. SHOPIFY STOREFRONT API SETUP

### Step 1: Create Headless Channel
1. In Shopify Admin → Settings → Apps and sales channels
2. Develop apps → Create an app
3. Name it "Commergia Storefront"

### Step 2: Configure Storefront API Scopes
Enable these scopes:
- `unauthenticated_read_product_listings`
- `unauthenticated_read_product_inventory`
- `unauthenticated_read_collection_listings`
- `unauthenticated_write_checkouts`
- `unauthenticated_read_checkouts`
- `unauthenticated_read_content`
- `unauthenticated_read_customer_tags`

### Step 3: Install and Get Token
1. Install the app
2. Copy the **Storefront API access token**
3. Set in `.env.local`:
```env
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STORE_API_URL=https://your-store.myshopify.com/api/2025-01/graphql.json
```

### Step 4: Webhook Setup (for ISR)
In Shopify Admin → Settings → Notifications → Webhooks:
- **Product update** → `https://commergia.sl177y.com/api/webhooks/shopify`
- **Product create** → same URL
- **Order paid** → same URL

---

## 10. POST-DEPLOYMENT VERIFICATION

Run this checklist after every production deployment:

### Performance
- [ ] Run Lighthouse audit on `/` — score > 90 Performance
- [ ] Run Lighthouse audit on `/product/[any-handle]` — score > 90
- [ ] Verify TTFB < 1s on first visit
- [ ] Verify no layout shift on mobile (CLS < 0.1)

### Functionality
- [ ] Homepage loads all collections from Shopify
- [ ] Search returns relevant products
- [ ] Product page shows images, variants, price, add-to-cart
- [ ] Cart drawer opens on add-to-cart
- [ ] Cart page shows line items with quantity controls
- [ ] Checkout flow progresses through all 3 steps
- [ ] Blog page loads posts from WordPress
- [ ] Contact form submits successfully
- [ ] Login/Register/Logout works

### SEO
- [ ] `/sitemap.xml` returns valid XML with all product + blog URLs
- [ ] `/robots.txt` exists and references sitemap
- [ ] Product pages have JSON-LD Product schema (validate at schema.org validator)
- [ ] FAQ page has JSON-LD FAQPage schema
- [ ] All pages have unique `<title>` and `<meta description>`
- [ ] OpenGraph tags render correctly (test at ogp.me or Twitter Card Validator)

### Security
- [ ] All API routes return proper CORS headers
- [ ] Webhook routes validate signatures
- [ ] No API keys exposed in client-side JavaScript (check Network tab)
- [ ] CSP headers present (check with securityheaders.com)

---

## 11. MONITORING & MAINTENANCE

### Vercel Analytics
Enable **Vercel Web Analytics** and **Speed Insights** in the Vercel dashboard for real-time Core Web Vitals monitoring.

### Error Tracking
Consider adding Sentry (`@sentry/nextjs`) for production error tracking:
```bash
npx @sentry/wizard@latest -i nextjs
```

### Content Updates
- **Products:** Update in Shopify Admin → Webhook triggers ISR → New data in <30s
- **Blog Posts:** Publish in WordPress → Webhook triggers ISR → New post in <30s
- **Code Changes:** Push to `main` → CI runs tests → Auto-deploy to Vercel

### Rollback
If a deployment causes issues:
1. Go to Vercel Dashboard → Deployments
2. Find the last working deployment
3. Click "..." → "Promote to Production"
4. The previous version is live instantly

---

> **Commergia by SL177Y — Operational since February 2026**

---

## 12. ENVIRONMENT MATRIX

| Variable | Local | Staging | Production | Notes |
|---|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | staging domain | production domain | Canonical/OG base URL |
| `NEXT_PUBLIC_SHOPIFY_STORE_API_URL` | Required | Required | Required | Storefront endpoint |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Required | Required | Required | Public storefront token |
| `STRIPE_SECRET_KEY` | Optional | Required | Required | Stripe server API |
| `STRIPE_WEBHOOK_SECRET` | Optional | Required | Required | Stripe webhook verify |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Optional | Required | Required | Razorpay checkout key |
| `RAZORPAY_KEY_SECRET` | Optional | Required | Required | Razorpay verification |
| `SHIPROCKET_EMAIL` | Optional | Required | Required | Shipping rates/tracking |
| `SHIPROCKET_PASSWORD` | Optional | Required | Required | Shipping rates/tracking |
| `RESEND_API_KEY` | Optional | Required | Required | Email delivery |
| `RESEND_FROM_EMAIL` | Optional | Required | Required | Sender identity |
| `CONTACT_TO_EMAIL` | Optional | Required | Required | Contact form inbox |
| `SHOPIFY_WEBHOOK_SECRET` | Optional | Required | Required | Shopify webhook verify |
| `WORDPRESS_WEBHOOK_SECRET` | Optional | Required | Required | WordPress webhook verify |
| `REVALIDATION_SECRET` | Optional | Required | Required | ISR revalidation guard |

---

## 13. ROLLBACK RUNBOOK

1. Identify the last healthy deployment in Vercel Deployments history.
2. Promote the previous deployment to production.
3. Verify health endpoints and critical flows:
   - `/`, `/collections/[handle]`, `/product/[handle]`
   - `/api/payments`, `/api/shipping/rates`, `/api/webhooks/[provider]`
4. Invalidate CDN cache if needed from Vercel dashboard.
5. Open an incident ticket with:
   - Faulty release SHA
   - Rollback deployment URL
   - Impact window (UTC)

---

## 14. INCIDENT RESPONSE RUNBOOK

### Severity Levels
- `SEV1`: Checkout/payment outage or platform unavailable.
- `SEV2`: Core route degradation (catalog/search/account) with workaround.
- `SEV3`: Non-critical degradation (content/auxiliary features).

### Response Flow
1. Acknowledge incident in monitoring/ops channel.
2. Assign incident commander and issue owner.
3. Capture blast radius and first-failure timestamp.
4. Mitigate quickly:
   - Switch to fallback mode (shipping/payment stubs disabled only if unsafe)
   - Roll back if fix ETA > 15 minutes for SEV1
5. Validate end-to-end smoke checks.
6. Publish resolution summary and post-incident actions.
