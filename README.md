# GymFlow SaaS

GymFlow is a production-ready, free-tier gym management SaaS built for resale. It includes a Next.js 14 web app, Expo mobile app, Fastify backend, tenant-safe PostgreSQL schema for Supabase, free AI with Groq + Gemini, WhatsApp automation with Baileys, demo billing, Docker, and auto-deploy via Vercel.

## What ships

- Multi-tenant architecture with `gym_id` on every tenant table
- Supabase-ready SQL schema with row-level security policies
- Auth-ready login flow for Supabase magic links
- Demo session protection for dashboard routes
- Dashboard, members, plans, payments, attendance, trainers, workouts, diet plans, reports, billing, settings, and landing page
- Gym onboarding flow for tenant provisioning
- AI studio: chatbot, diet plan generator, workout generator, message generator, report summary
- WhatsApp reminder panel using Baileys with demo fallback
- Expo mobile screens: login, dashboard, members, attendance, payments, workouts, diet plans, profile
- Demo SaaS billing tiers at `299`, `499`, and `999`
- Razorpay webhook support for payment processing
- Docker multi-stage build for web and backend
- GitHub Actions CI/CD with auto-deploy to Vercel

## Monorepo layout

- `apps/web` - Next.js 14 marketing site and SaaS dashboard
- `apps/mobile` - Expo React Native companion app
- `apps/backend` - Fastify API for AI, WhatsApp, dashboard, CRUD, billing, webhooks
- `packages/ui` - shared shadcn-style UI primitives
- `packages/lib` - shared types, constants, demo data, and helpers
- `packages/services` - shared Supabase and API client utilities
- `supabase/migrations` - SQL schema, indexes, triggers, and RLS policies

## Free stack (zero monthly cost)

- Frontend: Next.js 14, TypeScript, TailwindCSS
- UI: shadcn-style components in a shared package
- Backend: Fastify on Node.js
- Database and auth: Supabase free tier (500MB)
- Mobile: Expo free tier
- AI: Groq free tier (30 req/min) + Gemini free tier (60 req/min)
- WhatsApp: Baileys (WhatsApp Web, free)
- Billing: demo subscription logic + Razorpay webhook support
- Hosting: Vercel free (web), Render free or Docker (backend)
- Repo and CI: GitHub free

## Local setup

1. Install Node.js 20+, Git, and `pnpm`.
2. Copy [`.env.example`](.env.example) to `.env`.
3. Run `pnpm install`.
4. Create a free Supabase project.
5. Run [`0001_init.sql`](supabase/migrations/0001_init.sql) inside the Supabase SQL editor.
6. Run [`0002_demo_seed.sql`](supabase/migrations/0002_demo_seed.sql) if you want the full demo dataset.
7. Run [`0003_report_summary.sql`](supabase/migrations/0003_report_summary.sql) for the AI report feature.
8. Add your Supabase URL and keys to `.env`.
9. Add Groq and Gemini API keys to `.env` (provided in `.env.example`).
10. Optional: connect a WhatsApp Web session for Baileys by starting the backend and scanning the QR code.
11. Start everything with `pnpm dev`.

## Workspace commands

- `pnpm dev:web` starts the Next.js app on `http://localhost:3000`
- `pnpm dev:backend` starts the Fastify API on `http://localhost:4000`
- `pnpm dev:mobile` starts Expo
- `pnpm typecheck` validates the whole monorepo
- `pnpm build` builds web, backend, shared packages, and exports the mobile app
- `docker-compose up --build` runs web and backend locally in containers

## Multi-tenant model

- Every business table contains `gym_id`
- All Supabase reads and writes are expected to filter on `gym_id`
- RLS policies use `auth.jwt() ->> 'gym_id'`
- Demo mode falls back to `00000000-0000-0000-0000-000000000001`

## Backend API summary

### Core CRUD

- `GET /api/dashboard`
- `POST /api/onboarding/gym`
- `GET|POST /api/members`, `PUT|DELETE /api/members/:id`
- `GET|POST /api/plans`, `PUT|DELETE /api/plans/:id`
- `GET|POST /api/payments`, `PUT|DELETE /api/payments/:id`
- `GET|POST /api/attendance`, `PUT|DELETE /api/attendance/:id`
- `GET|POST /api/trainers`, `PUT|DELETE /api/trainers/:id`
- `GET|POST /api/workouts`, `PUT|DELETE /api/workouts/:id`
- `GET|POST /api/diet-plans`, `PUT|DELETE /api/diet-plans/:id`

### AI

- `POST /api/ai/generate` - Free AI via Groq + Gemini fallback

### WhatsApp

- `POST /api/whatsapp/send` - Baileys with demo fallback

### Billing

- `POST /api/billing/demo-subscribe`
- `POST /api/webhooks/razorpay` - Razorpay payment webhooks

## Deploy free

### Web on Vercel (auto-deploy)

1. Push the repo to GitHub.
2. Import the repository into a free Vercel account.
3. The included `vercel.json` configures the build automatically.
4. Add the environment variables from `.env.example`.
5. Set GitHub secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` for auto-deploy.

### Backend on Render

1. Create a free web service on Render.
2. Point it at this repo.
3. Build command: `pnpm install && pnpm --filter @gymflow/backend build`
4. Start command: `pnpm --filter @gymflow/backend start`

### Mobile on Expo

1. Run `pnpm --filter @gymflow/mobile start`
2. Test through Expo Go for free
3. Use `pnpm --filter @gymflow/mobile build` for exportable bundles

### Docker

```bash
docker-compose up --build
```

## Verification status

- `pnpm typecheck` passes
- `pnpm build` passes
- All 18 web routes build successfully
- SQL migrations, Docker, GitHub Actions, and Vercel configs included

## Database tables

gyms, users, members, plans, payments, attendance, subscriptions, messages, ai_logs, trainers, workouts, diet_plans

All tables include `gym_id` for multi-tenant isolation with RLS policies.

## AI features (free)

- **Chatbot**: Gym operations assistant
- **Diet plan generator**: Indian-friendly nutrition plans
- **Workout generator**: Structured gym programs with sets/reps
- **Message generator**: WhatsApp-style customer messages
- **Report summary**: Business KPI analysis and recommendations

Powered by Groq (free, 30 req/min) with Gemini (free, 60 req/min) as automatic fallback.

## Important note

This repo uses only free-tier services. No credit card or monthly subscription required to run the demo or first paying customers. Billing is implemented as demo subscription logic with Razorpay webhook support for when you're ready to process payments (2% per transaction, no monthly fee).
