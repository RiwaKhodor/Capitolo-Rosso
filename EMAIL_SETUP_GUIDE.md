# Email Setup Guide for .de Domain

This guide will help you configure email sending for your contact form using a .de email address.

## Overview

Your contact form is already set up to send emails. You just need to configure the SMTP settings based on your email provider.

## Step-by-Step Setup

### Option 1: Using mail.de or web.de (Free German Email Providers)

#### For mail.de:
1. **Create/Use your mail.de account**
   - Go to https://www.mail.de
   - Sign up or log in to your account
   - Note your email address and password

2. **Enable SMTP Access**
   - Log into your mail.de account
   - Go to Settings → Email → SMTP/POP3
   - Enable SMTP access
   - Note: You may need to use an "App Password" instead of your regular password

3. **Get SMTP Settings**
   - SMTP Host: `smtp.mail.de`
   - SMTP Port: `587` (or `465` for SSL)
   - Security: TLS/STARTTLS

#### For web.de:
1. **Create/Use your web.de account**
   - Go to https://www.web.de
   - Sign up or log in
   - Note your email address and password

2. **Enable SMTP Access**
   - Log into web.de
   - Go to Settings → Email → External Access
   - Enable SMTP/POP3 access
   - You may need to generate an app-specific password

3. **Get SMTP Settings**
   - SMTP Host: `smtp.web.de`
   - SMTP Port: `587` (or `465` for SSL)
   - Security: TLS/STARTTLS

---

### Option 2: Using Your Own .de Domain Email (Custom SMTP)

If you have your own domain email (like Info@capitolo-rosso.de), you need to find your hosting provider's SMTP settings.

#### Common German Hosting Providers:

**1. Strato (strato.de)**
   - SMTP Host: `smtp.strato.de`
   - SMTP Port: `587` or `465`
   - Security: TLS/STARTTLS

**2. 1&1 IONOS (ionos.de)**
   - SMTP Host: `smtp.ionos.de`
   - SMTP Port: `587` or `465`
   - Security: TLS/STARTTLS

**3. Host Europe**
   - SMTP Host: `smtp.hosteurope.de`
   - SMTP Port: `587` or `465`
   - Security: TLS/STARTTLS

**4. All-Inkl**
   - SMTP Host: `smtp.all-inkl.com`
   - SMTP Port: `587` or `465`
   - Security: TLS/STARTTLS

**5. Check with your hosting provider**
   - Log into your hosting control panel
   - Look for "Email Settings" or "SMTP Settings"
   - Contact support if you can't find it

---

### Option 3: Using Gmail (If you have a Gmail account)

If you prefer using Gmail:

1. **Enable 2-Factor Authentication**
   - Go to your Google Account settings
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Capitolo Rosso Contact Form"
   - Copy the generated 16-character password

3. **SMTP Settings**
   - SMTP Host: `smtp.gmail.com`
   - SMTP Port: `587`
   - Security: TLS/STARTTLS
   - Username: Your full Gmail address
   - Password: The 16-character app password (not your regular password)

---

## Step 2: Set Environment Variables in Vercel

Since you're using Vercel for deployment, you need to set environment variables:

### For Local Development:

1. **Create a `.env.local` file** in your project root (if it doesn't exist)
   ```bash
   # .env.local
   SMTP_HOST=smtp.mail.de
   SMTP_PORT=587
   SMTP_USER=your-email@mail.de
   SMTP_PASS=your-app-password
   ```

2. **Important**: Add `.env.local` to `.gitignore` (it should already be there)

### For Production (Vercel):

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project

2. **Navigate to Settings**
   - Click on "Settings" tab
   - Click on "Environment Variables" in the sidebar

3. **Add Environment Variables**
   Add these 4 variables:

   ```
   SMTP_HOST = smtp.mail.de (or your SMTP host)
   SMTP_PORT = 587 (or 465)
   SMTP_USER = Info@capitolo-rosso.de (your email address)
   SMTP_PASS = your-email-password (or app password)
   ```

4. **Important Settings:**
   - ✅ Check "Production"
   - ✅ Check "Preview" (if you want it in preview deployments)
   - ✅ Check "Development" (if you want it in dev deployments)

5. **Redeploy**
   - After adding variables, go to "Deployments"
   - Click the three dots (⋯) on your latest deployment
   - Click "Redeploy"
   - Or push a new commit to trigger a redeploy

---

## Step 3: Test Your Email Setup

1. **Test Locally (Optional)**
   ```bash
   npm run dev
   ```
   - Go to your contact page
   - Fill out and submit the form
   - Check your email inbox

2. **Test in Production**
   - Deploy to Vercel
   - Visit your live contact page
   - Submit a test message
   - Check your email inbox

3. **Check Vercel Logs**
   - If emails aren't sending, go to Vercel Dashboard
   - Click on "Deployments"
   - Click on your deployment
   - Click on "Functions" tab
   - Click on `api/send-email`
   - Check the logs for error messages

---

## Step 4: Troubleshooting

### Common Issues:

**1. "Authentication failed" error**
   - ✅ Make sure you're using the correct password
   - ✅ For Gmail, use an App Password, not your regular password
   - ✅ For mail.de/web.de, check if you need to enable SMTP access first
   - ✅ Double-check your email address is correct

**2. "Connection timeout" error**
   - ✅ Check if the SMTP host is correct
   - ✅ Try port 465 instead of 587 (or vice versa)
   - ✅ Check if your firewall is blocking the connection
   - ✅ Verify SMTP is enabled in your email account settings

**3. "Email not received"**
   - ✅ Check spam/junk folder
   - ✅ Verify the "to" email address in `api/send-email.ts` is correct
   - ✅ Check Vercel function logs for errors
   - ✅ Make sure environment variables are set correctly in Vercel

**4. "Invalid login" error**
   - ✅ Some providers require you to use your full email as username
   - ✅ Some providers require app-specific passwords
   - ✅ Check if your account has SMTP access enabled

### Testing SMTP Settings Manually

You can test your SMTP settings using a tool like:
- https://www.smtper.net/
- Or use a Node.js script to test

---

## Step 5: Update Email API (If Needed)

If your SMTP provider uses different settings, you may need to update `api/send-email.ts`:

```typescript
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mail.de',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'Info@capitolo-rosso.de',
    pass: process.env.SMTP_PASS || 'your-password',
  },
});
```

**Note**: The code already uses environment variables, so you just need to set them in Vercel!

---

## Quick Reference: Environment Variables

| Variable | Example Value | Description |
|----------|---------------|-------------|
| `SMTP_HOST` | `smtp.mail.de` | Your SMTP server address |
| `SMTP_PORT` | `587` | SMTP port (587 for TLS, 465 for SSL) |
| `SMTP_USER` | `Info@capitolo-rosso.de` | Your email address |
| `SMTP_PASS` | `your-password` | Your email password or app password |

---

## Security Best Practices

1. ✅ **Never commit passwords to Git**
   - Always use environment variables
   - `.env.local` should be in `.gitignore`

2. ✅ **Use App Passwords when possible**
   - More secure than regular passwords
   - Can be revoked individually

3. ✅ **Use different passwords for production and development**
   - Set different environment variables for each environment

4. ✅ **Regularly rotate passwords**
   - Change your email passwords periodically

---

## Need Help?

If you're still having issues:

1. Check Vercel function logs for specific error messages
2. Contact your email provider's support for SMTP settings
3. Verify your email account allows SMTP access
4. Try a different SMTP port (587 vs 465)

---

## Current Configuration

Your current setup in `api/send-email.ts`:
- ✅ Uses environment variables (secure)
- ✅ Sends to: `Info@capitolo-rosso.de`
- ✅ Reply-to: User's email address
- ✅ Includes all form fields (name, email, phone, subject, message)

You just need to configure the SMTP settings based on your email provider!
