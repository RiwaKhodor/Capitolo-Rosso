# Vercel Deployment Guide

## Quick Deploy to Vercel

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Vite settings

3. **Configure Build Settings in Vercel Dashboard:**
   - Go to Settings → General
   - **Framework Preset:** Vite (or leave as "Other")
   - **Build Command:** `npm run build`
   - **Output Directory:** `out`
   - **Install Command:** `npm install`
   - **Node.js Version:** 20.x (or 18.x)

4. **Configure Environment Variables:**
   In Vercel dashboard, go to Settings → Environment Variables and add:
   
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GOOGLE_CLIENT_ID=your_google_client_id (optional, for Google login)
   ```

5. **Deploy:**
   - Click "Deploy"
   - Your site will be live in minutes!

## Admin Redirect Feature

When an admin user logs in, they will be automatically redirected to `/manage` page instead of the home page.

## Troubleshooting Build Issues

If you get exit code 126:
1. Make sure Node.js version is set to 18.x or 20.x in Vercel settings
2. Check that all environment variables are set
3. Try clearing the build cache in Vercel dashboard
4. The `.nvmrc` file specifies Node 20 for local development
