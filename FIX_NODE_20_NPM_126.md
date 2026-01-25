# Fix: npm install Exit Code 126 with Node 20.x

Since Node 18.x isn't available, here are the solutions:

## ✅ Solution 1: Try Node 22.x

**In Vercel Dashboard:**
1. Settings → General → Node.js Version
2. Select **22.x** (newer, might have better npm compatibility)
3. Save

I've updated `.nvmrc` to `22` to match.

## ✅ Solution 2: Use `npm ci` Instead of `npm install`

**In Vercel Dashboard → Settings → General:**
- **Install Command:** Change from `npm install` to `npm ci`
- This is more reliable and uses package-lock.json exactly

**Why this helps:**
- `npm ci` is designed for CI/CD environments
- It's faster and more reliable
- It fails fast if package-lock.json is out of sync

## ✅ Solution 3: Check Install Command Settings

Make sure in Vercel Dashboard → Settings → General:
- **Install Command:** Should be `npm ci` (not empty, not `npm install`)
- **Build Command:** `npm run build`
- **Output Directory:** `out`

## ✅ Solution 4: Regenerate package-lock.json

The package-lock.json might be incompatible with Node 20.x:

**Locally:**
```bash
# Delete old files
rm -rf node_modules package-lock.json

# Reinstall with Node 20 (or 22)
npm install

# Test build
npm run build

# If it works, commit
git add package-lock.json
git commit -m "Regenerate package-lock.json for Node 22"
git push
```

## ✅ Solution 5: Add Explicit Install Command to vercel.json

If Vercel dashboard settings don't work, we can add it to vercel.json:

```json
{
  "installCommand": "npm ci",
  "rewrites": [...]
}
```

## 🎯 Recommended Steps (in order):

1. **Try Node 22.x** in Vercel dashboard
2. **Change Install Command to `npm ci`** in Vercel dashboard
3. **Regenerate package-lock.json** locally and push
4. **Redeploy** (clear cache)

---

**Most likely fix:** Use `npm ci` instead of `npm install` - this is the #1 solution for exit code 126 during npm install!
