#!/bin/bash

echo "=========================================="
echo "🔍 WEBSITE HEALTH CHECK - BMAD METHOD"
echo "=========================================="
echo ""

echo "## 1. BUSINESS - Critical Service Check"
echo "----------------------------------------"

# Check critical services exist and have Supabase imports
echo "✓ Auth Service (Supabase):"
grep -q "supabase" src/services/authService.ts && echo "  ✅ Using Supabase" || echo "  ❌ Not using Supabase"

echo "✓ Blog Service (Supabase):"
grep -q "supabase" src/services/blogService.ts && echo "  ✅ Using Supabase" || echo "  ❌ Not using Supabase"

echo "✓ Gallery Service (Supabase):"
grep -q "supabase" src/services/galleryService.ts && echo "  ✅ Using Supabase" || echo "  ❌ Not using Supabase"

echo "✓ Jobs Service (Supabase):"
grep -q "supabase" src/services/jobsService.ts && echo "  ✅ Using Supabase" || echo "  ❌ Not using Supabase"

echo "✓ Leads Service (Supabase):"
grep -q "supabase" src/services/leadService.ts && echo "  ✅ Using Supabase" || echo "  ❌ Not using Supabase"

echo "✓ Comments Service (Supabase):"
grep -q "supabase" src/services/commentService.ts && echo "  ✅ Using Supabase" || echo "  ❌ Not using Supabase"

echo "✓ Analytics Service (Supabase):"
grep -q "supabase" src/services/analyticsService.ts && echo "  ✅ Using Supabase" || echo "  ❌ Not using Supabase"

echo ""
echo "## 2. MARKET - Bundle Analysis"
echo "----------------------------------------"

# Check if Firebase still exists in node_modules
if [ -d "node_modules/firebase" ]; then
  echo "  ❌ Firebase still in node_modules!"
else
  echo "  ✅ Firebase removed from node_modules"
fi

# Check package.json
echo "✓ Dependencies:"
grep -q '"firebase"' package.json && echo "  ❌ Firebase in package.json" || echo "  ✅ No Firebase in package.json"
grep -q '@supabase/supabase-js' package.json && echo "  ✅ Supabase in package.json" || echo "  ❌ No Supabase"

echo ""
echo "## 3. ARCHITECTURE - API Routes Check"
echo "----------------------------------------"

# Check for broken Firebase imports
FIREBASE_IMPORTS=$(find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "from.*firebase" 2>/dev/null | grep -v "// REMOVED" | wc -l | tr -d ' ')
echo "✓ Firebase imports remaining: $FIREBASE_IMPORTS files"
if [ "$FIREBASE_IMPORTS" -eq "0" ]; then
  echo "  ✅ All Firebase imports removed"
else
  echo "  ⚠️  Some Firebase imports still exist (likely commented)"
fi

# Check Supabase client exists
if [ -f "src/lib/supabase.ts" ]; then
  echo "  ✅ Supabase client exists"
else
  echo "  ❌ Supabase client missing!"
fi

echo ""
echo "## 4. DATA - Database Tables Verification"
echo "----------------------------------------"

# Check if we have SQL schemas
if [ -f "create-supabase-tables.sql" ]; then
  echo "  ✅ Supabase schema file exists"
  echo "  Tables defined:"
  grep -o "CREATE TABLE [a-z_]*" create-supabase-tables.sql | awk '{print "    - "$3}'
else
  echo "  ❌ No Supabase schema file"
fi

echo ""
echo "=========================================="
echo "✅ Health check complete!"
echo "=========================================="
