#!/bin/bash
echo "🚀 ONE-CLICK BLOG SETUP"
echo ""
echo "Step 1: Copying SQL to clipboard..."
cat supabase-blog-schema.sql | pbcopy
echo "✅ SQL copied to clipboard!"
echo ""
echo "Step 2: Opening Supabase SQL Editor..."
open "https://supabase.com/dashboard/project/egoyqdbolmjfngjzllwl/sql"
echo "✅ Browser opening..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "NOW IN YOUR BROWSER:"
echo "1. Click 'New Query'"
echo "2. Press Cmd+V (SQL is already copied!)"
echo "3. Click 'Run'"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "Press Enter after you clicked 'Run' in Supabase..."
echo ""
echo "Step 3: Creating blog posts..."
node create-blog-directly.mjs
echo ""
echo "Step 4: Testing..."
node setup-blog-complete.mjs




