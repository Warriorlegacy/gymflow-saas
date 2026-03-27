# Custom Domain Setup for Vercel (GymFlowSaaS)

## Prerequisites

1. Your GymFlowSaaS project deployed to Vercel (via vercel CLI or GitHub integration)
2. Access to your domain registrar's DNS settings (e.g., GoDaddy, Namecheap, Google Domains, Cloudflare)
3. The domain you want to use (e.g., gymflowsaas.com, app.gymflowsaas.com)

## Step-by-Step Setup

### Option 1: Root Domain (e.g., gymflowsaas.com)

#### A. In Vercel Dashboard:

1. Go to your Vercel project: https://vercel.com/your-username/gymflow-saas
2. Click "Settings" → "Domains"
3. Under "Domains", click "Add"
4. Enter your domain: `gymflowsaas.com`
5. Click "Add"
6. Vercel will show you DNS records to configure

#### B. In Your Domain Registrar's DNS Settings:

Add these records:

```
TYPE  NAME        VALUE                  TTL
A     @           76.76.21.21            Automatic
A     @           76.76.21.22            Automatic
CNAME www         cname.vercel-dns.com.  Automatic
```

Some registrars require the trailing dot on CNAME values.

#### C. Verification:

- Return to Vercel Domains settings
- Vercel will automatically check DNS propagation
- Once verified, it will show "OK" and provision SSL certificate
- This usually takes 1-24 hours (often much faster with modern DNS)

### Option 2: Subdomain (e.g., app.gymflowsaas.com or saas.gymflowsaas.com)

#### A. In Vercel Dashboard:

1. Settings → Domains → Add
2. Enter your subdomain: `app.gymflowsaas.com`
3. Click "Add"

#### B. In Your Domain Registrar's DNS Settings:

Add this record:

```
TYPE  NAME        VALUE                  TTL
CNAME app         cname.vercel-dns.com.  Automatic
```

(Replace "app" with your chosen subdomain)

#### C. Verification:

Same as root domain - Vercel will auto-verify and provision SSL

### Option 3: Multiple Domains (Brand + App)

You can add both:

- Root domain: `gymflowsaas.com` (marketing site)
- Subdomain: `app.gymflowsaas.com` (SaaS application)

In Vercel, you can set one as primary and redirect others, or serve the same app from both.

## Important Configuration Notes

### 1. Vercel Project Settings

After domain is verified:

- Go to Settings → Domains
- Set your preferred domain as "Primary Domain"
- Enable "Redirect www to naked domain" or vice versa as preferred
- SSL is automatically provisioned and renewed

### 2. Environment Variables Update

Once your custom domain is working, update these in Vercel Environment Variables:

```
NEXT_PUBLIC_APP_URL=https://app.gymflowsaas.com   # Your actual frontend URL
API_BASE_URL=https://app.gymflowsaas.com          # If backend is same-origin
EXPO_PUBLIC_API_BASE_URL=https://app.gymflowsaas.com  # For mobile app
```

(If you host backend separately, adjust accordingly)

### 3. Mobile App Configuration

For your Expo mobile app to work with custom domain:

1. Update `app.json` or create `.env`:
   ```
   EXPO_PUBLIC_API_BASE_URL=https://app.gymflowsaas.com
   ```
2. Rebuild and redistribute the app
3. Or use over-the-air (OTA) updates if using Expo EAS

### 4. Cookie & Session Considerations

Your demo session cookie (`gymflow_demo_session`) should work across subdomains of the same domain.
If you need cross-domain cookies, you may need to adjust cookie settings in your middleware.

## DNS Propagation & Verification

- DNS changes typically propagate in seconds to minutes with most modern registrars
- Can take up to 24 hours in rare cases (usually due to TTL settings)
- Use tools like:
  - `dig gymflowsaas.com` (Mac/Linux)
  - `nslookup gymflowsaas.com` (Windows)
  - https://dnschecker.org/
  - https://www.whatsmydns.net/
- Vercel shows DNS status in Domains settings

## SSL/TLS

- Vercel automatically provisions Let's Encrypt SSL certificates
- Certificates are auto-renewed
- You'll see a padlock 🔒 in browser when visiting your domain
- No additional configuration needed

## Common Issues & Fixes

### Issue: "Domain not configured" or "DNS not verified"

- Double-check DNS records match exactly what Vercel shows
- Ensure no typos in domain name
- Wait a few minutes and refresh Vercel Domains page
- Some registrars require saving changes explicitly
- Check if domain is locked or has transfer restrictions

### Issue: Website shows "404 Not Found" after domain setup

- Ensure your Vercel deployment is successful (check Deployments tab)
- Verify the domain is added and verified in Vercel Settings → Domains
- Check if you have a Redirect or Redirect Domain setting misconfigured

### Issue: Mixed content warnings (HTTP/HTTPS)

- Ensure NEXT_PUBLIC_APP_URL uses https://
- Vercel forces HTTPS, so your app should use https:// URLs
- Check for hardcoded http:// links in your code

### Issue: Mobile app can't connect to custom domain

- Verify EXPO_PUBLIC_API_BASE_URL matches your custom domain
- Ensure backend API endpoints are accessible at that domain
- Check CORS settings if hosting backend separately
- Test with curl or Postman first: `curl https://app.gymflowsaas.com/api/health`

### Issue: Email verification or magic links broken

- Check that email redirect URLs in Supabase settings use your custom domain
- In Supabase: Settings → Auth → Email → Site URL
- Should be: `https://app.gymflowsaas.com`

## Advanced: Using Cloudflare (Recommended for Performance & Security)

If you want to use Cloudflare for CDN, WAF, or additional security:

1. Add your domain to Cloudflare
2. Change nameservers at your registrar to Cloudflare's nameservers
3. In Cloudflare DNS:
   - Add A record: `@` → `76.76.21.21` (and `.22`)
   - Add CNAME: `www` → `cname.vercel-dns.com.` (proxied: orange cloud)
4. In Vercel: Add domain as usual
5. Enable "Full SSL" in Cloudflare SSL/TLS settings
6. Use Cloudflare Page Rules for redirects, caching, etc.

## Renewal & Maintenance

- Vercel handles SSL certificate renewal automatically
- Domain renewal is handled by your registrar (set to auto-renew!)
- No action needed on Vercel side for SSL
- Check Vercel dashboard occasionally for domain status warnings

## Testing Your Setup

Once DNS propagates and Vercel shows domain as verified:

1. Visit `https://yourdomain.com` - should show your GymFlow landing page
2. Visit `https://yourdomain.com/dashboard` - should show login or dashboard (if authed)
3. Visit `https://yourdomain.com/onboarding` - should show tenant creation form
4. Check browser dev tools for console errors
5. Test mobile app connectivity if configured

## Example Configuration

For domain `gymflowsaas.com` with app at `app.gymflowsaas.com`:

**Vercel Project:** gymflow-saas
**Domains Added:**

- gymflowsaas.com (Primary)
- app.gymflowsaas.com

**DNS Records:**

```
TYPE  NAME        VALUE                  TTL
A     @           76.76.21.21            Automatic
A     @           76.76.21.22            Automatic
CNAME www         cname.vercel-dns.com.  Automatic
CNAME app         cname.vercel-dns.com.  Automatic
```

**Environment Variables:**

```
NEXT_PUBLIC_APP_URL=https://app.gymflowsaas.com
API_BASE_URL=https://app.gymflowsaas.com
EXPO_PUBLIC_API_BASE_URL=https://app.gymflowsaas.com
```

Would you like me to help you with any specific part of this process, or do you have questions about a particular registrar's DNS interface?
