# GymFlow: Elite SaaS Production Deployment Manifest

This document contains the final production configuration and launch instructions for the GymFlow SaaS platform. All components have been verified with a successful production build (`pnpm build`).

## 🔑 Production Credentials

### Supabase (Live Instance)

- **URL**: `https://jsjrspjygwbtgocojzjh.supabase.co`
- **Anon Key**: [REDACTED FOR SECURITY]
- **Service Role Key**: [REDACTED FOR SECURITY]
- **JWT Secret**: [REDACTED FOR SECURITY]

### AI Engines

- **Gemini API Key**: [REDACTED FOR SECURITY]
- **Groq API Key**: [REDACTED FOR SECURITY]

---

## 🚀 Launch Instructions

### 1. Database (Completed)

The remote Supabase project is already provisioned with:

- [x] Schema (Tables, Views, Functions)
- [x] RLS Policies (Multi-tenant isolation)
- [x] Seed Data (Demo gym and trainers)
- [x] Analytics Wrappers (Report summaries)

### 2. Web App (Vercel)

1. **Connect Repository**: Point Vercel to the root of this monorepo.
2. **Root Directory**: Select `apps/web`.
3. **Framework**: Next.js.
4. **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`: (See above)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (See above)
   - `NEXT_PUBLIC_API_BASE_URL`: [Your Backend URL]

### 3. Backend API (Railway/Render)

1. **Root Directory**: Select `apps/backend`.
2. **Build Command**: `pnpm build`.
3. **Start Command**: `pnpm start`.
4. **Environment Variables**:
   - `SUPABASE_URL`: (See above)
   - `SUPABASE_SERVICE_ROLE_KEY`: (See above)
   - `SUPABASE_JWT_SECRET`: (See above)
   - `GEMINI_API_KEY`: (See above)
   - `GROQ_API_KEY`: (See above)

### 4. Mobile App (EAS)

1. Environment variables are pre-configured in `apps/mobile/.env`.
2. Run `eas build --platform all` to generate production binaries.

---

## ✅ Final Pre-Flight Check

- [x] **Monorepo Build**: `pnpm build` verified locally.
- [x] **CSS Compatibility**: PostCSS refactored for production optimization.
- [x] **UI Consistency**: Premium Emerald branding applied across all layers.

**GymFlow is now ready to scale.**
