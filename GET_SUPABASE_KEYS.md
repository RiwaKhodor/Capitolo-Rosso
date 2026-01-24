# How to Get Your Supabase Keys

## Quick Steps:

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Log in to your account

2. **Select Your Project:**
   - Click on your project (or create one if you don't have one)

3. **Get Your Keys:**
   - Click **Settings** (gear icon) in the left sidebar
   - Click **API** under Project Settings
   - You'll see two important values:

### VITE_SUPABASE_URL
- Look for **Project URL**
- It looks like: `https://xxxxxxxxxxxxx.supabase.co`
- Copy this entire URL

### VITE_SUPABASE_ANON_KEY  
- Look for **Project API keys** section
- Find the **anon** or **public** key (it's a long string starting with `eyJ...`)
- **IMPORTANT:** Use the **anon** key, NOT the **service_role** key!
- Copy this entire key

4. **Add to Your .env File:**
   - Open the `.env` file in your project root
   - Replace the placeholder values:
     ```
     VITE_SUPABASE_URL=https://your-actual-project-url.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key-here
     ```

5. **For Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add the same values there

## Visual Guide:

In Supabase Dashboard:
```
Settings → API
├── Project URL (this is VITE_SUPABASE_URL)
└── Project API keys
    └── anon public (this is VITE_SUPABASE_ANON_KEY) ← Use this one!
    └── service_role (DO NOT use this - it's secret!)
```

## Your Current Values:

✅ **VITE_GOOGLE_CLIENT_ID:** Already set in your .env file
❌ **VITE_SUPABASE_URL:** Need to add from Supabase dashboard
❌ **VITE_SUPABASE_ANON_KEY:** Need to add from Supabase dashboard
