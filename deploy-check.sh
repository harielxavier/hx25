#!/bin/bash

echo ""
echo "════════════════════════════════════════════════════════════════════"
echo "  🚀 PRODUCTION DEPLOYMENT CHECK"
echo "════════════════════════════════════════════════════════════════════"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Check 1: Build
echo "📦 Building production bundle..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check 2: Environment variables
echo ""
echo "🔐 Checking environment variables..."

if grep -q "VITE_FIREBASE_API_KEY" .env; then
    echo -e "${GREEN}✅ Firebase configured${NC}"
else
    echo -e "${RED}❌ Firebase not configured${NC}"
    ERRORS=$((ERRORS + 1))
fi

if grep -q "VITE_SUPABASE_URL" .env; then
    echo -e "${GREEN}✅ Supabase configured${NC}"
else
    echo -e "${YELLOW}⚠️  Supabase not configured (optional)${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Check 3: JWT Secrets
if grep -q "your-super-secret-jwt" .env; then
    echo -e "${RED}❌ JWT secrets are using default values!${NC}"
    echo -e "${YELLOW}   Generate new ones with:${NC}"
    echo -e "   node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ JWT secrets configured${NC}"
fi

# Check 4: Dependencies
echo ""
echo "📚 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ Dependencies not installed${NC}"
    echo -e "   Run: npm install"
    ERRORS=$((ERRORS + 1))
fi

# Check 5: Build size
echo ""
echo "📊 Checking build size..."
if [ -d "dist" ]; then
    SIZE=$(du -sh dist | cut -f1)
    echo -e "${GREEN}✅ Build size: ${SIZE}${NC}"
else
    echo -e "${YELLOW}⚠️  No dist folder (run build first)${NC}"
fi

# Summary
echo ""
echo "════════════════════════════════════════════════════════════════════"
echo "  📋 SUMMARY"
echo "════════════════════════════════════════════════════════════════════"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL CHECKS PASSED!${NC}"
    echo ""
    echo "Your app is ready to deploy!"
    echo ""
    echo "Next steps:"
    echo "1. Deploy to Vercel: https://vercel.com/new"
    echo "2. Or deploy to Netlify: https://app.netlify.com/start"
    echo "3. Or use Firebase: firebase deploy"
    echo ""
else
    echo -e "${RED}❌ ${ERRORS} error(s) found${NC}"
    echo -e "${YELLOW}⚠️  ${WARNINGS} warning(s) found${NC}"
    echo ""
    echo "Fix the errors above before deploying."
    echo ""
fi

echo "See PRODUCTION_CHECKLIST.txt for full deployment guide"
echo "════════════════════════════════════════════════════════════════════"
echo ""

exit $ERRORS
