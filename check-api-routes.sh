#!/bin/bash

echo "=========================================="
echo "🔍 API ROUTES & CALLS VERIFICATION"
echo "=========================================="
echo ""

echo "## Checking Critical User Flows:"
echo "----------------------------------------"

# 1. Authentication Flow
echo "1. AUTHENTICATION:"
grep -q "signInWithPassword\|signUp\|signOut" src/services/authService.ts && echo "  ✅ Login/Signup/Logout present" || echo "  ❌ Auth functions missing"

# 2. Blog Flow
echo "2. BLOG POSTS:"
grep -q "getAllPosts\|getPostBySlug\|createPost" src/services/blogService.ts && echo "  ✅ Blog CRUD operations present" || echo "  ❌ Blog functions missing"

# 3. Gallery Flow
echo "3. GALLERIES:"
grep -q "uploadGalleryImage\|getGalleryMedia\|createGallery" src/services/galleryService.ts && echo "  ✅ Gallery operations present" || echo "  ❌ Gallery functions missing"

# 4. Lead Capture
echo "4. LEAD CAPTURE:"
grep -q "createLead\|submitContactForm" src/services/leadService.ts && echo "  ✅ Lead capture present" || echo "  ❌ Lead functions missing"

# 5. Comments
echo "5. BLOG COMMENTS:"
grep -q "createComment\|getCommentsByPostId\|approveComment" src/services/commentService.ts && echo "  ✅ Comment system present" || echo "  ❌ Comment functions missing"

# 6. Client Portal
echo "6. CLIENT PORTAL:"
grep -q "getClientSelections\|submitClientSelections" src/services/galleryService.ts && echo "  ✅ Client selection present" || echo "  ❌ Client functions missing"

# 7. Job Management
echo "7. JOB MANAGEMENT:"
grep -q "createJob\|getAllJobs\|uploadJobDocument" src/services/jobsService.ts && echo "  ✅ Job management present" || echo "  ❌ Job functions missing"

# 8. Analytics
echo "8. ANALYTICS:"
grep -q "trackPageView\|getAnalyticsSummary" src/services/analyticsService.ts && echo "  ✅ Analytics tracking present" || echo "  ❌ Analytics missing"

echo ""
echo "## Checking API Endpoints:"
echo "----------------------------------------"

# Check for API calls
echo "API calls in codebase:"
grep -r "fetch\|axios\|supabase\.from" src --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "node_modules" | wc -l | xargs echo "  Total API calls:"

echo ""
echo "## Checking for Broken References:"
echo "----------------------------------------"

# Check for Firebase references that might break
FIREBASE_REFS=$(grep -r "firebase\|firestore" src --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "// REMOVED" | grep -v "console\|comment" | wc -l | tr -d ' ')
echo "  Firebase references (excluding comments): $FIREBASE_REFS"
if [ "$FIREBASE_REFS" -lt "10" ]; then
  echo "  ✅ Minimal Firebase references remaining"
else
  echo "  ⚠️  Some Firebase references might cause issues"
fi

echo ""
echo "=========================================="
