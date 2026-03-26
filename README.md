# GymFlow SaaS

GymFlow is a production-ready, free-tier gym management SaaS starter built for resale. It includes a Next.js 14 web app, Expo mobile app, Fastify backend, tenant-safe PostgreSQL schema for Supabase, local AI with Ollama, WhatsApp automation with Baileys, demo billing, Docker, and free deployment guidance for Vercel and Render.

## What ships

- Multi-tenant architecture with `gym_id` on every tenant table
- Supabase-ready SQL schema with row-level security policies
- Auth-ready login flow for Supabase magic links
- Demo session protection for dashboard routes
- Dashboard, members, plans, payments, attendance, trainers, reports, settings, and landing page
- Gym onboarding flow for tenant provisioning
- AI studio for chatbot, diet plan generation, workout generation, and message generation
- WhatsApp reminder panel using Baileys with demo fallback
- Expo mobile screens for login, dashboard, members, attendance, and payments
- Demo SaaS billing tiers at `299`, `499`, and `999`
- Docker, GitHub Actions verification workflow, and Vercel deployment config

## Monorepo layout

- `apps/web` - Next.js 14 marketing site and SaaS dashboard
- `apps/mobile` - Expo React Native companion app
- `apps/backend` - Fastify API for AI, WhatsApp, dashboard, CRUD, and billing
- `packages/ui` - shared shadcn-style UI primitives
- `packages/lib` - shared types, constants, demo data, and helpers
- `packages/services` - shared Supabase and API client utilities
- `supabase/migrations` - SQL schema, indexes, triggers, and RLS policies

## Free stack

- Frontend: Next.js 14, TypeScript, TailwindCSS
- UI: shadcn-style components in a shared package
- Backend: Fastify on Node.js
- Database and auth: Supabase free tier
- Mobile: Expo free tier
- AI: Ollama local
- WhatsApp: Baileys
- Billing: demo-only subscription logic
- Hosting: Vercel free for web, Render free or local Docker for backend
- Repo and CI: GitHub free

## Local setup

1. Install Node.js 20+, Git, and `pnpm`.
2. Copy [`.env.example`](/D:/GymFlow/.env.example) to `.env`.
3. Run `pnpm install`.
4. Create a free Supabase project.
5. Run [`0001_init.sql`](/D:/GymFlow/supabase/migrations/0001_init.sql) inside the Supabase SQL editor.
6. Run [`0002_demo_seed.sql`](/D:/GymFlow/supabase/migrations/0002_demo_seed.sql) if you want the full demo dataset in Supabase.
7. Add your Supabase URL and keys to `.env`.
8. Optional: install [Ollama](https://ollama.com/) and pull a local model like `llama3.2:3b`.
9. Optional: connect a WhatsApp Web session for Baileys by starting the backend and scanning the QR code.
10. Start everything with `pnpm dev`.

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

- `GET /api/dashboard`
- `POST /api/onboarding/gym`
- `GET /api/members`
- `POST /api/members`
- `PUT /api/members/:id`
- `DELETE /api/members/:id`
- Same CRUD pattern for `plans`, `payments`, `attendance`, and `trainers`
- `POST /api/ai/generate`
- `POST /api/whatsapp/send`
- `POST /api/billing/demo-subscribe`

## Sales-readiness upgrades included

- Protected dashboard routes via demo session cookie middleware
- CRUD forms in the web app for members, plans, payments, attendance, and trainers
- Backend payload validation with shared `zod` schemas
- Fastify rate limiting for basic abuse protection
- Tenant-aware API routing through the `x-gym-id` header with demo fallback
- New gym onboarding endpoint and UI

## Deploy free

### Web on Vercel

1. Push the repo to GitHub.
2. Import the repository into a free Vercel account.
3. Set the root directory to `apps/web` or keep root and use the included [`vercel.json`](/D:/GymFlow/vercel.json).
4. Add the environment variables from [`.env.example`](/D:/GymFlow/.env.example).

### Backend on Render

1. Create a free web service.
2. Point it at this repo.
3. Build command: `pnpm install && pnpm --filter @gymflow/backend build`
4. Start command: `pnpm --filter @gymflow/backend start`

### Mobile on Expo

1. Run `pnpm --filter @gymflow/mobile start`
2. Test through Expo Go for free
3. Use `pnpm --filter @gymflow/mobile build` for exportable bundles

## Verification status

- `pnpm typecheck` passes
- `pnpm build` passes
- The SQL migration, web build, backend build, and Expo export are all included in this workspace

## Important note

This repo is intentionally payment-gateway free and credit-card free. Billing is implemented as SaaS plan logic only so you can demo, validate, and sell the product before choosing whether to integrate a live provider later.
