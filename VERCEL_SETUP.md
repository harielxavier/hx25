# Vercel Deployment & Environment Variables Setup

## Prerequisites

1. **Login to Vercel CLI:**
   ```bash
   vercel login
   ```

2. **Link your project (if not already linked):**
   ```bash
   vercel link
   ```

---

## Required Environment Variables

### 🔴 CRITICAL (Required for site to work):

These are **REQUIRED** for your blog and database to function:

```bash
# Supabase Database (REQUIRED)
vercel env add VITE_SUPABASE_URL production
# When prompted, enter: https://egoyqdbolmjfngjzllwl.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY production
# When prompted, paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnb3lxZGJvbG1qZm5nanpsbHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjAyNDgsImV4cCI6MjA3MDI5NjI0OH0.O4Q5-rQbUa2_vGYLjMw7UBpODonjJvgBsrfHlHJhFGk
```

**Also add to preview and development:**
```bash
vercel env add VITE_SUPABASE_URL preview
vercel env add VITE_SUPABASE_URL development

vercel env add VITE_SUPABASE_ANON_KEY preview
vercel env add VITE_SUPABASE_ANON_KEY development
```

---

## Optional Environment Variables

### 🤖 Anthropic API (for Claude AI features)

```bash
vercel env add VITE_ANTHROPIC_API_KEY production
# Enter: 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
```

### 📸 Cloudinary (for image optimization)

```bash
vercel env add VITE_CLOUDINARY_CLOUD_NAME production
# Enter your Cloudinary cloud name

vercel env add VITE_CLOUDINARY_API_KEY production
# Enter your Cloudinary API key
```

### 📧 EmailJS (for contact forms)

```bash
vercel env add VITE_EMAILJS_SERVICE_ID production
# Enter your EmailJS service ID

vercel env add VITE_EMAILJS_TEMPLATE_ID production
# Enter your EmailJS template ID

vercel env add VITE_EMAILJS_PUBLIC_KEY production
# Enter your EmailJS public key
```

### 🗺️ Google Maps API (for venue maps)

```bash
vercel env add VITE_GOOGLE_MAPS_API_KEY production
# Enter your Google Maps API key
```

### 🔍 Sentry (for error tracking)

```bash
vercel env add VITE_SENTRY_DSN_FRONTEND production
# Enter your Sentry DSN
```

---

## Quick Setup (Copy-Paste Method)

If you want to set up all required variables at once:

```bash
# Login first
vercel login

# Link project (if needed)
vercel link

# Add required Supabase variables
echo "https://egoyqdbolmjfngjzllwl.supabase.co" | vercel env add VITE_SUPABASE_URL production
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnb3lxZGJvbG1qZm5nanpsbHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjAyNDgsImV4cCI6MjA3MDI5NjI0OH0.O4Q5-rQbUa2_vGYLjMw7UBpODonjJvgBsrfHlHJhFGk" | vercel env add VITE_SUPABASE_ANON_KEY production

# Verify
vercel env ls
```

---

## Verify Environment Variables

**Check what's currently set:**
```bash
vercel env ls
```

**Pull environment variables to local .env file:**
```bash
vercel env pull
```

---

## Deploy to Vercel

### Option 1: Deploy via CLI
```bash
# Deploy to production
vercel --prod
```

### Option 2: Automatic Deployment via GitHub
Once you push to GitHub, Vercel will automatically deploy if connected.

**Check deployment status:**
```bash
vercel ls
```

---

## Environment Variables Summary

### ✅ Required (Your site won't work without these):
- `VITE_SUPABASE_URL` - Your Supabase database URL
- `VITE_SUPABASE_ANON_KEY` - Public key for Supabase client

### ⚙️ Optional (Add as needed):
- `VITE_ANTHROPIC_API_KEY` - Claude AI features
- `VITE_CLOUDINARY_CLOUD_NAME` - Image optimization
- `VITE_CLOUDINARY_API_KEY` - Image optimization
- `VITE_EMAILJS_SERVICE_ID` - Contact forms
- `VITE_EMAILJS_TEMPLATE_ID` - Contact forms
- `VITE_EMAILJS_PUBLIC_KEY` - Contact forms
- `VITE_GOOGLE_MAPS_API_KEY` - Venue maps
- `VITE_SENTRY_DSN_FRONTEND` - Error tracking

---

## Troubleshooting

### "The specified token is not valid"
Run `vercel login` again

### "No existing credentials found"
Run `vercel link` to link your project

### Environment variable not showing up
Make sure to:
1. Add it for all environments (production, preview, development)
2. Redeploy after adding: `vercel --prod`

### Site loads but blog doesn't work
Check that Supabase variables are set correctly:
```bash
vercel env ls | grep SUPABASE
```

---

## Testing Your Deployment

After deployment:

1. **Visit your production site:**
   https://harielxavier.com

2. **Check the blog:**
   https://harielxavier.com/blog

3. **Verify all 8 blog posts load:**
   They should all be visible and clickable

4. **Test social sharing:**
   Click any blog post and use share buttons

5. **Check related posts:**
   Scroll to bottom of any blog post to see related content

---

## Post-Deployment Checklist

- [ ] Logged in to Vercel CLI (`vercel login`)
- [ ] Project linked (`vercel link`)
- [ ] Required Supabase variables added
- [ ] Deployed to production (`vercel --prod`)
- [ ] Site loads at harielxavier.com
- [ ] Blog page works (/blog)
- [ ] Individual blog posts load
- [ ] Social sharing buttons work
- [ ] Related posts appear
- [ ] No console errors

---

## Quick Reference

**View logs:**
```bash
vercel logs
```

**Check deployment status:**
```bash
vercel inspect
```

**Rollback to previous deployment:**
```bash
vercel rollback
```

**View all deployments:**
```bash
vercel ls
```

---

## Support

If you encounter issues:
1. Check Vercel dashboard: https://vercel.com/dashboard
2. View deployment logs in Vercel UI
3. Check that all environment variables are set
4. Verify GitHub connection is active

---

**Your website is ready to go live! 🚀**

Once you set up these variables and deploy, your professional wedding photography website with blog will be live at https://harielxavier.com
