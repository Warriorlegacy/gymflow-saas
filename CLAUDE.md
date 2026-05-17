# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GymFlow is a multi-tenant gym management SaaS with a Next.js 14 web app, Expo mobile app, and Fastify backend. It uses Supabase for PostgreSQL database and auth, free AI providers (Groq + Gemini), and WhatsApp automation via Baileys.

## Live Production URLs

- **Web App**: https://gymflow-saas.vercel.app
- **Mobile APK (Production)**: https://expo.dev/artifacts/eas/fEzr7xwS3EeaqeMkYtpEFR.apk
- **Mobile APK (Preview)**: https://expo.dev/artifacts/eas/cLuY1pP2McXNUPnUqf5JLW.apk

## Monorepo Structure

This is a pnpm workspace with Turbo:

```
apps/
  web/          # Next.js 14 marketing site + dashboard (@gymflow/web)
  backend/      # Fastify API server (@gymflow/backend)
  mobile/       # Expo React Native app (@gymflow/mobile)
packages/
  lib/          # Shared types, schemas, constants, demo data (@gymflow/lib)
  ui/           # Shared shadcn-style UI components (@gymflow/ui)
  services/     # Shared Supabase and API clients (@gymflow/services)
supabase/
  migrations/   # SQL schema, RLS policies, seed data
```

## Common Commands

```bash
# Install dependencies
pnpm install

# Development (runs web + backend + mobile in parallel)
pnpm dev

# Individual app development
pnpm dev:web          # Next.js on http://localhost:3000
pnpm dev:backend      # Fastify API on http://localhost:4000
pnpm dev:mobile       # Expo (mobile app)

# Build
pnpm build            # Builds all packages and apps
pnpm --filter @gymflow/web build
pnpm --filter @gymflow/backend build

# Type checking and linting
pnpm typecheck        # TypeScript check all packages
pnpm lint             # Lint all packages

# Tests (web only)
pnpm --filter @gymflow/web test
pnpm --filter @gymflow/web test:watch
pnpm --filter @gymflow/web test:coverage

# Docker
docker-compose up --build

# Mobile builds
eas build -p android --profile production --non-interactive
eas build -p android --profile preview --non-interactive
eas build:list --platform android --limit 5

# Web deployment
vercel --prod --yes
vercel env ls production
```

## Architecture

### Multi-Tenancy

- Every business table has `gym_id` column for tenant isolation
- RLS policies use `auth.jwt() ->> 'gym_id'` for filtering
- Demo mode falls back to `DEMO_GYM_ID=00000000-0000-0000-0000-000000000001`

### Auth System

#### Owner Authentication

- **Login**: `POST /api/auth/login-owner` - Email + password verification using `scryptSync` + `timingSafeEqual`
- **Register**: `POST /api/auth/register-owner` - Creates gym + owner with `password_hash` stored in `users` table
- **Reset Password**: `POST /api/auth/reset-password` - Resets owner password by email or phone
- **Session**: Cookie-based via `gymflow_owner_gym` (httpOnly, 7-day expiry)

#### Member Authentication

- **Login**: `POST /api/member/login` - Phone + password verification
- **Register**: `POST /api/member/register` - Creates member with hashed password
- **Reset Password**: `POST /api/member/reset-password` - Resets member password by phone
- **Dashboard**: `GET /api/member/dashboard` - Member dashboard with attendance + subscription
- **Check-in**: `POST /api/member/checkin` - Mobile attendance check-in
- **Session**: localStorage-based token (base64 encoded member ID + gym ID)

### Password Hashing

All passwords use Node.js `scryptSync`:

```typescript
// Hash
const salt = randomBytes(16).toString("hex");
const hashed = scryptSync(password, salt, 64).toString("hex");
return `${salt}:${hashed}`;

// Verify
const [salt, key] = storedHash.split(":");
const hashed = scryptSync(password, salt, 64);
return timingSafeEqual(Buffer.from(key, "hex"), hashed);
```

### Web App Structure

Next.js 14 with App Router:

- **Landing**: `/` - Marketing page with feature showcase
- **Login**: `/login` - Owner login with "Forgot password?" link
- **Register**: `/onboarding` - New gym creation + owner registration
- **Dashboard**: `/dashboard` - Real-time metrics from Supabase
- **Members**: `/members` - Member CRUD with trainer assignment
- **Plans**: `/plans` - Membership plan management
- **Payments**: `/payments` - Payment tracking
- **Attendance**: `/attendance` - Manual/QR/mobile check-ins
- **Trainers**: `/trainers` - Trainer management
- **Workouts**: `/workouts` - AI-generated workout plans
- **Diet Plans**: `/diet-plans` - AI-generated nutrition plans
- **Reports**: `/reports` - Subscription health + coach output
- **Billing**: `/billing` - SaaS subscription management
- **Settings**: `/settings` - Gym profile + account settings
- **Reset Password**: `/reset-password` - Password reset for owners + members
- **Member Login**: `/member/login` - Member login with "Forgot password?" link
- **Member Register**: `/member/register` - Member registration
- **Member Dashboard**: `/member/dashboard` - Member portal (attendance, subscription)

### API Routes (Web)

All API routes are in `apps/web/src/app/api/`:

- `/api/auth/login-owner` - Owner login
- `/api/auth/register-owner` - Owner registration
- `/api/auth/reset-password` - Owner password reset
- `/api/member/[action]` - Member login/register/checkin/reset-password
- `/api/member/reset-password` - Member password reset (standalone)
- `/api/member/dashboard` - Member dashboard data
- `/api/dashboard` - Owner dashboard snapshot
- `/api/members`, `/api/members/[id]` - Member CRUD
- `/api/plans`, `/api/plans/[id]` - Plan CRUD
- `/api/payments`, `/api/payments/[id]` - Payment CRUD
- `/api/attendance`, `/api/attendance/[id]` - Attendance CRUD
- `/api/trainers`, `/api/trainers/[id]` - Trainer CRUD
- `/api/workouts`, `/api/workouts/[id]` - Workout CRUD
- `/api/diet-plans`, `/api/diet-plans/[id]` - Diet plan CRUD
- `/api/ai/generate` - AI generation (Groq/Gemini)
- `/api/whatsapp/send` - WhatsApp messaging
- `/api/billing/demo-subscribe` - Demo billing
- `/api/onboarding/gym` - Gym provisioning

### Mobile App Structure

Expo with Expo Router (file-based routing):

- `app/index.tsx` - Owner login screen (with "Member Login" link)
- `app/member-login.tsx` - Member login screen (with "Owner Login" link)
- `app/member-dashboard.tsx` - Member dashboard (attendance, subscription, check-in)
- `app/dashboard.tsx` - Owner dashboard with metrics
- `app/members.tsx` - Member management
- `app/plans.tsx` - Plan management
- `app/payments.tsx` - Payment tracking
- `app/attendance.tsx` - Attendance records
- `app/trainers.tsx` - Trainer management
- `app/workouts.tsx` - Workout management
- `app/diet-plans.tsx` - Diet plan management
- `app/profile.tsx` - Owner profile + logout

### Backend API Structure

Fastify routes in `apps/backend/src/routes/index.ts`:

- `/api/dashboard` - Dashboard snapshot
- `/api/members`, `/api/plans`, `/api/payments`, `/api/attendance`, `/api/trainers`, `/api/workouts`, `/api/diet-plans` - CRUD endpoints
- `/api/ai/generate` - AI generation via Groq/Gemini
- `/api/whatsapp/send` - WhatsApp messaging via Baileys
- `/api/billing/demo-subscribe` - Demo billing
- `/api/onboarding/gym` - New gym provisioning
- `/api/webhooks/razorpay` - Payment webhooks
- `/api/auth/login-owner`, `/api/auth/register-owner` - Owner auth
- `/api/member/login`, `/api/member/register`, `/api/member/checkin`, `/api/member/dashboard` - Member auth

### Shared Packages

- `@gymflow/lib`: Zod schemas, types, constants, demo data
- `@gymflow/services`: Supabase client, API functions, auth helpers, member auth
- `@gymflow/ui`: React components (Button, Card, Input, Badge)

## Environment Variables

### Web App (Vercel)

All configured in Vercel production environment:

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (admin access)
- `SUPABASE_JWT_SECRET` - JWT secret for Supabase auth
- `GROQ_API_KEY` - Groq API key for AI
- `GROQ_BASE_URL` - Groq API base URL (https://api.groq.com/openai/v1)
- `GROQ_MODEL` - Groq model (openai/gpt-oss-120b)
- `GEMINI_API_KEY` - Gemini API key (fallback)
- `API_BASE_URL` - Backend URL (https://gymflow-saas.vercel.app)
- `DEMO_GYM_ID` - Demo gym ID (00000000-0000-0000-0000-000000000001)
- `NEXT_PUBLIC_APP_URL` - App URL (https://gymflow-saas.vercel.app)

### Mobile App

Configured in `apps/mobile/.env`:

- `EXPO_PUBLIC_API_BASE_URL` - Backend API URL
- `EXPO_PUBLIC_SUPABASE_URL` - Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

## Database Setup

Run migrations in Supabase SQL editor in order:

1. `supabase/migrations/0001_init.sql` - Schema + RLS
2. `supabase/migrations/0002_demo_seed.sql` - Demo data (optional)
3. `supabase/migrations/0003_report_summary.sql` - Report functions

## Testing

Vitest configured in `apps/web/vitest.config.ts`:

- Test files: `src/**/*.{test,spec}.{ts,tsx}`
- Setup: `src/test/setup.ts` imports `@testing-library/jest-dom`
- Environment: jsdom

## Deployment

- **Web**: Vercel (configured via `vercel.json`)
- **Backend**: Render or Docker
- **Mobile**: Expo (EAS builds configured)
- **CI/CD**: GitHub Actions in `.github/workflows/deploy.yml`

## Key Patterns

- **Tenant Resolution**: Backend uses `x-gym-id` header; Web uses `gymflow_owner_gym` cookie + Supabase auth
- **API Proxy**: Web app API routes use `SUPABASE_SERVICE_ROLE_KEY` directly for admin access
- **AI Fallback**: Groq primary, Gemini fallback on rate limit
- **WhatsApp**: Baileys library with QR code auth, sessions stored in `WHATSAPP_SESSION_PATH`
- **Demo Mode**: Special cookie-based session for prospect trials
- **Supabase Client**: Created inline in API routes with `SUPABASE_SERVICE_ROLE_KEY` (never falls back to anon key)

## Recent Changes (v1.0.0)

### Auth System Overhaul

- Added password verification for owner login (scryptSync + timingSafeEqual)
- Added password_hash field to user registration
- Added password reset for owners (email or phone)
- Added password reset for members (phone)
- Added "Forgot password?" links on all login pages

### Mobile App Features

- Added member login screen (`app/member-login.tsx`)
- Added member dashboard (`app/member-dashboard.tsx`)
- Added owner-to-member login toggle
- Added member check-in functionality

### Web App Features

- Added reset password page (`/reset-password`)
- Added member reset password API (`/api/member/reset-password`)
- Added APK download link on landing page
- Fixed Supabase client to only use SERVICE_ROLE_KEY (no anon key fallback)

### Environment Variables Updated

- Added GROQ_BASE_URL, GROQ_MODEL
- Added API_BASE_URL, DEMO_GYM_ID, NEXT_PUBLIC_APP_URL
- All env vars configured in Vercel production

### Deployment

- Web app deployed to https://gymflow-saas.vercel.app
- Mobile APK built via EAS (production profile)
- APK download link: https://expo.dev/artifacts/eas/fEzr7xwS3EeaqeMkYtpEFR.apk
