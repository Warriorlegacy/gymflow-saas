# Vercel Deployment Guide for GymFlowSaaS

## Prerequisites

1. Node.js 20+ installed
2. GitHub account with access to Warriorlegacy/gymflow-saas
3. Vercel account (signup at vercel.com)

## Step-by-Step Deployment

### Option 1: Using Vercel Dashboard (Recommended for Beginners)

1. Go to https://vercel.com and sign up/log in
2. Click "New Project" → "Import Git Repository"
3. Select `Warriorlegacy/gymflow-saas` from your repositories
4. Vercel should auto-detect Next.js project
5. Click "Continue"
6. For Framework Preset, choose "Next.js"
7. For Root Directory, keep as `/` (the vercel.json handles monorepo)
8. Click "Environment Variables" and add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SUPABASE_JWT_SECRET=your-jwt-secret
   GROQ_API_KEY=your-groq-key
   GEMINI_API_KEY=your-gemini-key
   ```
9. Click "Deploy"

### Option 2: Using Vercel CLI (Faster for Developers)

```bash
# 1. Login to Vercel (only needed once)
vercel login
# Follow browser prompts to authenticate

# 2. Deploy from project root
vercel
# On first deploy, it will ask:
#   - Set up and deploy "Warriorlegacy/gymflow-saas"? [Y/n]: Y
#   - Which scope do you want to deploy to? <your-username-or-org>
#   - Link to existing project? [y/N]: N (unless you already created one)
#   - What's your project name? (gymflow-saas)
#   - In which directory is your code located? ./
#   - Want to override build command? [y/N]: N
#   - Want to override output directory? [y/N]: N
#   - Want to deploy to https://gymflow-saas.vercel.app? [Y/n]: Y

# 3. For production deployment with custom env vars:
vercel --prod --env .env.production
```

### Option 3: GitHub Auto-Deploy (After Initial Setup)

1. After deploying via dashboard or CLI once:
2. Go to your Vercel project Settings → Git
3. Ensure:
   - "Auto-deploy on push to production branch" is ✓
   - Production Branch is set to `master`
   - Ignored Commits: `[skip ci]`, `[ci skip]`
4. Now every push to `master` will auto-deploy

## Verifying Deployment

After deployment completes, visit:

- Your preview URL (e.g., https://gymflow-saas.vercel.app)
- Check dashboard loads: https://gymflow-saas.vercel.app/dashboard
- Verify no build errors in Vercel dashboard "Deployments" tab

## Troubleshooting

If you see "Error: Command \"pnpm\" not found":

- Add this to vercel.json under "functions":
  ```json
  {
    "functions": {
      "api/**": {
        "runtime": "nodejs20.x"
      }
    }
  }
  ```
- Or ensure pnpm is available in build environment (it should be via corepack)

If you see Next.js build errors:

- Check that vercel.json buildCommand matches what we tested locally
- Verify node_modules are not being cached incorrectly
