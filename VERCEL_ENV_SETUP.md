# Vercel Environment Variables Setup Guide

## Where to Find Your Values

### 1. VITE_SUPABASE_URL
**What it is:** Your Supabase project URL

**How to find it:**
1. Go to [supabase.com](https://supabase.com) and log in
2. Select your project (or create one if you don't have one)
3. Go to **Settings** → **API**
4. Look for **Project URL** (it looks like: `https://xxxxxxxxxxxxx.supabase.co`)
5. Copy this entire URL

**Example:**
```
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
```

---

### 2. VITE_SUPABASE_ANON_KEY
**What it is:** Your Supabase anonymous/public API key

**How to find it:**
1. In the same Supabase dashboard (Settings → API)
2. Look for **Project API keys**
3. Find the **anon** or **public** key (NOT the service_role key - that's secret!)
4. Copy the entire key (it's a long string)

**Example:**
```
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMDAwMDAwMCwiZXhwIjoxOTQ1NTYzMjAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**⚠️ Important:** Use the **anon** key, NOT the **service_role** key!

---

### 3. VITE_GOOGLE_CLIENT_ID (Optional)
**What it is:** Google OAuth 2.0 Client ID for Google Sign-In

**How to find/create it:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add authorized JavaScript origins:
   - `http://localhost:3000` (for local development)
   - `https://your-vercel-domain.vercel.app` (for production)
7. Copy the **Client ID** (not the Client Secret)

**Example:**
```
VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
```

**Note:** If you don't want Google Sign-In, you can leave this empty or skip it.

---

## How to Add in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. For each variable:
   - Click **Add New**
   - Enter the **Name** (exactly as shown: `VITE_SUPABASE_URL`)
   - Enter the **Value** (your actual value)
   - Select **Environment**: 
     - Check **Production**
     - Check **Preview** (optional, for preview deployments)
     - Check **Development** (optional, for local dev)
   - Click **Save**

4. After adding all variables, **redeploy** your project for changes to take effect

---

## Quick Checklist

- [ ] VITE_SUPABASE_URL - Found in Supabase Dashboard → Settings → API → Project URL
- [ ] VITE_SUPABASE_ANON_KEY - Found in Supabase Dashboard → Settings → API → anon/public key
- [ ] VITE_GOOGLE_CLIENT_ID - Created in Google Cloud Console (optional)

---

## Security Notes

- ✅ The **anon** key is safe to use in frontend code (it's public)
- ❌ Never use the **service_role** key in frontend code (it's secret!)
- ✅ Environment variables in Vercel are encrypted and secure
- ✅ These variables are only accessible in your build and runtime environment
