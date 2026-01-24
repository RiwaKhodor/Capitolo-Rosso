# Vercel Environment Variables - Exact Values to Add

## Values Found in Your Code:

### ✅ VITE_GOOGLE_CLIENT_ID
**Value:** `835780706455-e6ta5remqorqrimnrj6ik0ojj0sj6g7b.apps.googleusercontent.com`

---

## Values You Need to Get from Supabase:

### ❌ VITE_SUPABASE_URL
**Where to get it:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Settings → API
4. Copy the **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)

**Example format:**
```
https://abcdefghijklmnop.supabase.co
```

---

### ❌ VITE_SUPABASE_ANON_KEY
**Where to get it:**
1. Same page: Settings → API
2. Under **Project API keys**
3. Copy the **anon public** key (long string starting with `eyJ...`)
4. ⚠️ **IMPORTANT:** Use the **anon** key, NOT the **service_role** key!

**Example format:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMDAwMDAwMCwiZXhwIjoxOTQ1NTYzMjAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## How to Add in Vercel Dashboard:

1. Go to your Vercel project: **capitolo-rosso**
2. Click **Settings** → **Environment Variables**
3. Add these three variables:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://your-project-id.supabase.co` | Production, Preview |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Production, Preview |
| `VITE_GOOGLE_CLIENT_ID` | `835780706455-e6ta5remqorqrimnrj6ik0ojj0sj6g7b.apps.googleusercontent.com` | Production, Preview |

4. Click **Save** for each variable
5. **Redeploy** your project after adding the variables

---

## Quick Checklist:

- [ ] Get Supabase Project URL from Supabase Dashboard
- [ ] Get Supabase anon key from Supabase Dashboard  
- [ ] Add all 3 variables to Vercel Environment Variables
- [ ] Redeploy the project

---

## Note About Build Failure:

The build is currently failing with exit code 126. This might be due to:
- Missing environment variables (Supabase URL/Key)
- Node version mismatch

After adding the environment variables, try:
1. Setting Node.js version to **20.x** in Vercel Settings → General
2. Clearing the build cache
3. Redeploying
