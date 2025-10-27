# 🚀 Quick Deploy to Vercel - 3 Steps

## ✅ Everything is Ready!

All code is committed and pushed to GitHub. You're 3 commands away from going live at **harielxavier.com**!

---

## Step 1: Login to Vercel (30 seconds)

```bash
vercel login
```

This opens your browser to authenticate.

---

## Step 2: Set Environment Variables (2 minutes)

Copy and paste these commands:

```bash
# Supabase URL (required for blog)
echo "https://egoyqdbolmjfngjzllwl.supabase.co" | vercel env add VITE_SUPABASE_URL production
echo "https://egoyqdbolmjfngjzllwl.supabase.co" | vercel env add VITE_SUPABASE_URL preview
echo "https://egoyqdbolmjfngjzllwl.supabase.co" | vercel env add VITE_SUPABASE_URL development

# Supabase Anon Key (required for blog)
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnb3lxZGJvbG1qZm5nanpsbHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjAyNDgsImV4cCI6MjA3MDI5NjI0OH0.O4Q5-rQbUa2_vGYLjMw7UBpODonjJvgBsrfHlHJhFGk" | vercel env add VITE_SUPABASE_ANON_KEY production
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnb3lxZGJvbG1qZm5nanpsbHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjAyNDgsImV4cCI6MjA3MDI5NjI0OH0.O4Q5-rQbUa2_vGYLjMw7UBpODonjJvgBsrfHlHJhFGk" | vercel env add VITE_SUPABASE_ANON_KEY preview
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnb3lxZGJvbG1qZm5nanpsbHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjAyNDgsImV4cCI6MjA3MDI5NjI0OH0.O4Q5-rQbUa2_vGYLjMw7UBpODonjJvgBsrfHlHJhFGk" | vercel env add VITE_SUPABASE_ANON_KEY development
```

**Verify they're set:**
```bash
vercel env ls
```

---

## Step 3: Deploy! (1 minute)

```bash
vercel --prod
```

**OR** - If GitHub is connected to Vercel, it auto-deploys when you push!

---

## ✅ What Goes Live:

- **Main Site:** https://harielxavier.com
- **Blog:** https://harielxavier.com/blog
- **8 Professional Blog Posts** with SEO optimization
- **Social Sharing** on all posts
- **Related Posts** recommendations
- **Mobile Responsive** design

---

## 🎯 After Deployment:

1. **Test:** Visit https://harielxavier.com/blog
2. **Verify:** All 8 blog posts load
3. **Share:** Try social share buttons
4. **Mobile:** Check on your phone

---

## 📞 Need More Detail?

- **DEPLOYMENT_COMPLETE.md** - Full deployment guide
- **VERCEL_SETUP.md** - Detailed environment variable instructions
- **Session Summary** - Everything we built today

---

**That's it! 3 commands and you're live! 🚀**

Domain: **harielxavier.com** (not .co)
