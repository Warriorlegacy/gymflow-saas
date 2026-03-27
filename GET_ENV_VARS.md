# Environment Variables Guide for GymFlowSaaS

Here's exactly where to get each key needed for deployment:

## 🔑 Supabase Keys

Get these from your Supabase project dashboard:

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Go to: https://supabase.com/dashboard → Your Project → Settings → API
   - Look for: "Project URL"
   - Format: `https://your-project-id.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Same location as above
   - Look for: "anon public key"
   - Format: Long string starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. **SUPABASE_SERVICE_ROLE_KEY**
   - Same location as above
   - Look for: "service_role key"
   - Format: Similar to anon key but different value

4. **SUPABASE_JWT_SECRET**
   - Go to: Settings → Auth → Settings
   - Look for: "JWT Secret" (under Security)
   - Format: Random string, minimum 32 characters
   - ⚠️ Keep this SECRET - never expose publicly

## 🤖 AI API Keys (Both FREE)

### Groq API Key (Primary - Free Tier: 30 requests/minute)

1. Go to: https://console.groq.com/keys
2. Sign up/login with Google or GitHub
3. Click "Create API Key"
4. Name it: `gymflow-saas`
5. Copy the key (starts with `gsk_`)
6. Set as: `GROQ_API_KEY=your-key-here`
7. Optional: Set `GROQ_BASE_URL=https://api.groq.com/openai/v1` and `GROQ_MODEL=llama-3.3-70b-versatile`

### Gemini API Key (Fallback - Free Tier: 60 requests/minute)

1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Choose or create a project
5. Copy the key
6. Set as: `GEMINI_API_KEY=your-key-here`
7. The service will auto-use `gemini-2.0-flash` model

## 💳 Razorpay Keys (Optional - for Live Payments)

Only needed if you want to process real payments (2% per transaction, no monthly fee)

1. Go to: https://razorpay.com/dashboard
2. Sign up/login
3. Go to Settings → API Keys
4. Generate test keys first (recommended)
5. You'll get:
   - Key ID: `rzp_test_...`
   - Key Secret: `your-secret`
6. Set as:
   ```
   RAZORPAY_KEY_ID=your-key-id
   RAZORPAY_KEY_SECRET=your-key-secret
   ```
7. For live mode, repeat with live keys from Dashboard

## 📱 WhatsApp (Baileys) - FREE, No Keys Needed

The WhatsApp functionality uses Baileys library which works by:

1. WhatsApp Web session (QR code scan)
2. No API keys required
3. Stores session in `./.sessions` folder
4. To initialize: Start backend, visit any page, check console for QR code
5. Scan with WhatsApp phone → Linked Devices → Link a Device

## 🌐 Other Variables

```
NEXT_PUBLIC_APP_URL=http://localhost:3000        # Set to your Vercel URL in prod
BACKEND_PORT=4000                                # Only for local/Docker
API_BASE_URL=http://localhost:4000               # Set to your backend URL in prod
EXPO_PUBLIC_API_BASE_URL=http://localhost:4000   # Set to your backend URL in prod
DEMO_GYM_ID=00000000-0000-0000-0000-000000000001 # Keep as-is for demo
```

## 📝 Environment File Examples

### For Local Development (.env)

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=super-secret-jwt-token-min-32-chars
BACKEND_PORT=4000
GROQ_API_KEY=gsk_your-groq-key-here
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=llama-3.3-70b-versatile
GEMINI_API_KEY=your-gemini-key-here
WHATSAPP_SESSION_PATH=./.sessions
API_BASE_URL=http://localhost:4000
EXPO_PUBLIC_API_BASE_URL=http://localhost:4000
DEMO_GYM_ID=00000000-0000-0000-0000-000000000001
```

### For Vercel Production

Add the same keys (except NEXT_PUBLIC_APP_URL and local ports) to:
Project Settings → Environment Variables

- Set NEXT_PUBLIC_APP_URL to your Vercel domain
- Set API_BASE_URL to your backend URL (if deploying separately) or leave blank for same-origin

## 🔒 Security Notes

- Never commit real keys to git (we use .env.example with placeholders)
- Vercel encrypts environment variables at rest
- Supabase service_role key is powerful - keep it secure
- JWT secret should be complex and kept private
- Consider key rotation periodically

## 💡 Getting Started Without Keys

You can start immediately with:

1. Supabase (only required component)
2. Demo mode for AI (will show canned responses)
3. Demo mode for WhatsApp (will show "sent via demo")
4. Add real API keys later as you scale

Would you like me to:

1. Generate a template .env file with your actual Supabase credentials if you provide them?
2. Help you create accounts on Groq/Gemini if you need walkthroughs?
3. Explain how to test each service individually?
