# Fix: npm install Failing with Exit Code 126

## The Problem
Your build is failing at `npm install` with exit code 126. This means **npm itself cannot execute**, not your code.

## ✅ Solutions to Try (in order):

### Solution 1: Try Node 18.x Instead of 20.x

**In Vercel Dashboard:**
1. Settings → General → Node.js Version
2. Change from `20` to `18` (or `18.x`)
3. Save

**Also update locally:**
- Update `.nvmrc` to: `18`
- I've already made `package.json` engines more flexible

### Solution 2: Use npm ci Instead of npm install

**In Vercel Dashboard → Settings → General:**
- **Install Command:** Change from `npm install` to `npm ci`
- This uses package-lock.json and is more reliable

### Solution 3: Check npm Version

Exit code 126 can mean npm version mismatch. Try:

**In Vercel Dashboard → Settings → General:**
- **Node.js Version:** `18` (this comes with npm 9.x)
- OR explicitly set npm version if Vercel allows it

### Solution 4: Regenerate package-lock.json

The package-lock.json might be corrupted or incompatible:

**Locally:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build  # Test it works
git add package-lock.json
git commit -m "Regenerate package-lock.json"
git push
```

### Solution 5: Add .npmrc Configuration

I've created a `.npmrc` file to help with peer dependencies. Commit it:
```bash
git add .npmrc
git commit -m "Add .npmrc for npm install"
git push
```

## 🎯 Most Likely Fix:

**Try Node 18.x** - Node 20.x might have npm compatibility issues on Vercel.

1. Vercel Dashboard → Settings → General → Node.js Version → `18`
2. Update `.nvmrc` to `18`
3. Redeploy

## 📋 Quick Action Items:

- [ ] Change Node.js to `18` in Vercel dashboard
- [ ] Update `.nvmrc` to `18`
- [ ] Change Install Command to `npm ci` in Vercel
- [ ] Commit `.npmrc` file (already created)
- [ ] Regenerate package-lock.json locally and push
- [ ] Redeploy

---

**The key:** Exit code 126 during `npm install` means npm can't execute. This is almost always a Node.js/npm version mismatch. Try Node 18.x!
