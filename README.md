# SiteVPN

SiteVPN is a privacy SaaS that combines private browsing, disposable email, anonymous temporary phone numbers, AI-assisted privacy intelligence, subscriptions, and a Business developer API in one account.

The app is built as a Next.js App Router product with Prisma/PostgreSQL, NextAuth, Stripe subscriptions, Claude-powered AI features, and API-key protected REST endpoints.

## Product Features

- Unified privacy dashboard for VPN, temp email, temp number, account, upgrade, and developer API access
- Auth with email/password and Google OAuth
- Plans: Free, Pro, and Business
- Stripe Checkout and webhook-based plan updates
- Usage limits by plan with daily usage tracking
- Smart VPN server recommendations
- Temp email classification: safe, promotional, phishing, OTP
- OTP extraction from email and SMS
- Pro AI email reply drafts
- Business API keys for reseller/integration use cases
- Signed webhooks for email, SMS, and VPN events
- SEO landing pages for free temp email, temporary phone number, and free VPN no logs

## Monorepo Layout

```text
SiteVPN-sitevpn/
  src/      Next.js SaaS app
  server/   NestJS service scaffold for backend/mail experiments
```

Most product work currently lives in `src/`.

## Tech Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS
- NextAuth.js
- Prisma ORM
- PostgreSQL / Supabase
- Stripe
- Claude API via Anthropic
- TypeScript

## Main Routes

### App

- `/` - conversion landing page
- `/signup` - redirects to auth
- `/auth/sign-in` - sign in / register
- `/dashboard` - unified privacy dashboard
- `/dashboard/api-keys` - Business API key and webhook management
- `/docs` - developer API docs and live tester
- `/tools/temp-email` - SEO page for free temp email
- `/tools/temp-number` - SEO page for temporary phone number
- `/tools/vpn` - SEO page for free VPN no logs

### Developer API

All `/api/v1/*` routes require:

```http
Authorization: Bearer svpn_your_api_key
```

Endpoints:

- `GET /api/v1/email/create`
- `GET /api/v1/email/:id/messages`
- `POST /api/v1/number/request`
- `GET /api/v1/number/:id/sms`
- `GET /api/v1/vpn/servers`
- `POST /api/v1/vpn/connect`

## Environment Variables

Create `src/.env.local` from `src/.env.example`.

Required for production:

```env
DATABASE_URL=""
NEXTAUTH_URL=""
NEXTAUTH_SECRET=""

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
STRIPE_PRO_PRICE_ID=""
STRIPE_BUSINESS_PRICE_ID=""

ANTHROPIC_API_KEY=""
CRON_SECRET=""
```

Notes:

- `NEXTAUTH_URL` should be your deployed Vercel URL or production domain.
- `NEXTAUTH_SECRET` must be a strong random value.
- `DATABASE_URL` should point to Supabase/PostgreSQL.
- `ANTHROPIC_API_KEY` enables Claude. Without it, local deterministic AI fallbacks are used.

## Local Development

```bash
cd src
npm install
npm run prisma:generate
npm run dev
```

Open:

```text
http://localhost:3000
```

## Database Setup

Generate Prisma Client:

```bash
cd src
npm run prisma:generate
```

Create/apply database migrations:

```bash
npm run prisma:migrate
```

Important: the schema includes tables for users, usage logs, API keys, and webhook endpoints. Make sure migrations are applied to Supabase before deploying, otherwise runtime API routes that touch those tables will fail.

## Stripe Setup

Create Stripe products/prices:

- Free: no charge
- Pro: `$9/month`
- Business: `$29/month`

The helper script can create products and recurring prices:

```bash
cd src
STRIPE_SECRET_KEY=sk_test_xxx npm run stripe:setup-products
```

Copy the generated Pro and Business price IDs into:

```env
STRIPE_PRO_PRICE_ID=""
STRIPE_BUSINESS_PRICE_ID=""
```

Configure Stripe webhooks to call:

```text
https://your-domain.com/api/stripe/webhook
```

Listen for:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Business Webhooks

Business users can register a webhook URL at:

```text
/dashboard/api-keys
```

SiteVPN signs webhook payloads with:

```http
X-SiteVPN-Signature: sha256=<hmac>
```

Verify using the webhook secret shown once at registration.

Events currently emitted by the API prototype:

- `email.created`
- `email.received`
- `sms.received`
- `vpn.connected`

## Deployment

### Vercel

Deploy the `src/` directory as the Next.js project root.

Recommended build command:

```bash
npm run build
```

Make sure all production environment variables are set in Vercel.

### Render

The `server/` folder contains a NestJS backend scaffold. If you deploy it separately on Render, configure its own environment variables and service commands from `server/package.json`.

## Verification

Current checks used before handoff:

```bash
cd src
npx tsc --noEmit
npm run build
```

Both should pass before pushing.

## Production Readiness Notes

Before real users:

- Apply Prisma migrations to Supabase.
- Add timeout/queueing around customer webhook delivery.
- Wrap Claude JSON parsing in a defensive `try/catch`.
- Replace mock email/SMS/VPN data with production providers.
- Connect daily usage alerts to an email provider.
- Configure real status, privacy, terms, and blog pages or redirects.

## License

Add your preferred license before public release.
