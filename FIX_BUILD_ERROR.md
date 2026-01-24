# Fix Build Error - Exit Code 126

## The Problem
Your Vercel build is failing with exit code 126 during `npm install`. This typically means:
- Node.js version mismatch
- Missing environment variables
- Build configuration issues

## Solution Steps

### 1. Set Node.js Version in Vercel Dashboard

**In Vercel Dashboard:**
1. Go to your project: **capitolo-rosso**
2. Click **Settings** → **General**
3. Scroll to **Node.js Version**
4. Select **20.x** (or manually enter `20`)
5. Click **Save**

### 2. Add Environment Variables

**In Vercel Dashboard:**
1. Go to **Settings** → **Environment Variables**
2. Add these three variables (for **Production** and **Preview**):

| Name | Value | Where to Get It |
|------|-------|-----------------|
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` | Supabase Dashboard → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Supabase Dashboard → Settings → API → anon public key |
| `VITE_GOOGLE_CLIENT_ID` | `835780706455-e6ta5remqorqrimnrj6ik0ojj0sj6g7b.apps.googleusercontent.com` | ✅ Already found in your code |

### 3. Verify Build Settings

**In Vercel Dashboard → Settings → General:**
- **Framework Preset:** Vite (or "Other")
- **Build Command:** `npm run build`
- **Output Directory:** `out`
- **Install Command:** `npm install`
- **Node.js Version:** `20.x`

### 4. Clear Build Cache

1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **Redeploy**
4. Check **"Use existing Build Cache"** → **Uncheck it**
5. Click **Redeploy**

### 5. Redeploy

After making these changes:
1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger a new deployment

## Quick Checklist

- [ ] Set Node.js version to **20.x** in Vercel Settings → General
- [ ] Add `VITE_SUPABASE_URL` environment variable
- [ ] Add `VITE_SUPABASE_ANON_KEY` environment variable  
- [ ] Add `VITE_GOOGLE_CLIENT_ID` environment variable
- [ ] Verify build settings match the above
- [ ] Clear build cache and redeploy

## If It Still Fails

1. **Check the full build logs** in Vercel to see the exact error
2. **Try Node 18.x** instead of 20.x if 20.x doesn't work
3. **Check package.json** - ensure all dependencies are valid
4. **Remove node_modules and package-lock.json locally**, then:
   ```bash
   npm install
   npm run build
   ```
   If it works locally, commit the new `package-lock.json` and push

## Your Current Configuration

✅ `.nvmrc` specifies Node 20
✅ `package.json` has `engines.node >= 18.0.0`
✅ `vercel.json` is configured for Vite
✅ Build output directory is `out`

The main issue is likely the **Node.js version** not being set in Vercel dashboard.
