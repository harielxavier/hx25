#!/bin/bash

# Script to set Vercel environment variables for harirelxavier project
# These are REQUIRED for the site to work - without them, the app hangs on spinner

echo "Setting Vercel environment variables..."

# CRITICAL: Supabase credentials (app throws error without these)
vercel env add VITE_SUPABASE_URL production <<< "https://egoyqdbolmjfngjzllwl.supabase.co"
vercel env add VITE_SUPABASE_ANON_KEY production <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnb3lxZGJvbG1qZm5nanpsbHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjAyNDgsImV4cCI6MjA3MDI5NjI0OH0.O4Q5-rQbUa2_vGYLjMw7UBpODonjJvgBsrfHlHJhFGk"

echo "✅ Critical Supabase environment variables set!"
echo ""
echo "Next steps:"
echo "1. Go to https://vercel.com/harielxavier/harirelxavier/settings/environment-variables"
echo "2. Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are listed"
echo "3. Redeploy the site from Vercel dashboard"
echo ""
echo "Or run: vercel --prod"
