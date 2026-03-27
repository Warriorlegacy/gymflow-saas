# Supabase Setup Guide for GymFlowSaaS

## Prerequisites

1. Supabase account (signup at supabase.com - free tier available)
2. Git access to retrieve SQL files

## Step-by-Step Setup

### 1. Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in:
   - Project Name: `gymflow-saas` (or your choice)
   - Database Password: **Save this securely!**
   - Region: Choose closest to your users
4. Click "Create new project"
5. Wait for provisioning (takes 1-2 minutes)

### 2. Get Your Supabase Credentials

Once project is ready:

1. Go to Project Settings → API
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`
3. For JWT Secret:
   - Go to Settings → Auth → Settings
   - Copy "JWT Secret" → `SUPABASE_JWT_SECRET`

### 3. Apply SQL Migrations

You need to run 3 SQL files in order:

#### Option A: Using Supabase Dashboard (Easiest)

1. In Supabase dashboard, go to SQL Editor
2. Click "New Query"
3. **First**, copy and paste entire contents of:
   `supabase/migrations/0001_init.sql`
4. Click "RUN"
5. **Second**, copy and paste entire contents of:
   `supabase/migrations/0002_demo_seed.sql`
6. Click "RUN"
7. **Third**, copy and paste entire contents of:
   `supabase/migrations/0003_report_summary.sql`
8. Click "RUN"

#### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm i -g supabase

# Login
supabase login

# Link to your project (get project ID from URL: https://supabase.com/dashboard/project/[ID])
supabase link --project-ref YOUR_PROJECT_ID

# Apply migrations
supabase db push --supabase-resolve-dependencies --dry-run
supabase db push
```

### 4. Verify Tables Were Created

In Supabase dashboard:

1. Go to Table Editor
2. You should see these tables:
   - gyms
   - users
   - members
   - plans
   - payments
   - attendance
   - subscriptions
   - messages
   - ai_logs
   - trainers
   - workouts
   - diet_plans

### 5. Test Row Level Security (Important!)

RLS policies are already applied in the SQL. To test:

1. Go to SQL Editor
2. Run this query:
   ```sql
   select auth.uid();
   ```
3. Should return null (no authenticated user)
4. Now try:
   ```sql
   select * from gyms limit 1;
   ```
5. Should return 0 rows (due to RLS policy requiring valid gym_id)
6. With proper auth, queries will return data

## Environment Variables Summary

Add these to your Vercel/Deployment env:

| Variable                        | Where to Find              | Example Format                                  |
| ------------------------------- | -------------------------- | ----------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Project Settings → API     | `https://xyzcompany.supabase.co`                |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API     | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`       |
| `SUPABASE_SERVICE_ROLE_KEY`     | Project Settings → API     | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`       |
| `SUPABASE_JWT_SECRET`           | Settings → Auth → Settings | `super-secret-jwt-token-with-min-32-chars-long` |

## Troubleshooting

### "invalid input syntax for uuid: \"\""

- This happens when gym_id is missing from JWT
- Ensure SUPABASE_JWT_SECRET is set correctly in both Supabase and your env
- The demo session cookie handles this in development

### Tables missing or empty

- Verify you ran ALL 3 SQL files in order
- Check for red error messages when running SQL
- Demo data is in 0002_demo_seed.sql

### Connection refused/timeouts

- Verify your Supabase project is active (not paused)
- Check project status at https://supabase.com/dashboard
- Free projects may sleep after inactivity - they wake on connect

## Next Steps After Setup

1. Deploy web app to Vercel with these env vars
2. Test login at `/login` page (use demo credentials or magic link)
3. Visit `/dashboard` to see demo data
4. Try `/onboarding` to create a new gym tenant
5. Test mobile app with EXPO_PUBLIC_API_BASE_URL pointing to your Vercel URL

Need the actual SQL file contents to copy/paste? I can provide them.
