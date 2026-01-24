# Vercel Deployment Guide

## Quick Deploy to Vercel

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Vite settings

3. **Configure Environment Variables:**
   In Vercel dashboard, go to Settings → Environment Variables and add:
   
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GOOGLE_CLIENT_ID=your_google_client_id (optional, for Google login)
   ```

4. **Deploy:**
   - Click "Deploy"
   - Your site will be live in minutes!

## Admin Redirect Feature

When an admin user logs in, they will be automatically redirected to `/manage` page instead of the home page.

## Build Settings

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `out`
- **Install Command:** `npm install`

The `vercel.json` file is already configured for optimal deployment.
