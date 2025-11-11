# Build Safety Guide

This guide ensures production builds NEVER fail again.

## Quick Reference

### Before Every Commit
```bash
npm run build:safe
```

This runs the build AND validates it before committing.

### Manual Validation
```bash
npm run build:validate
```

Run this anytime to check if your build is production-ready.

## Common Issues & How We Prevent Them

### ❌ Issue 1: Manual Chunking Causes React Initialization Errors
**Problem:** Manual chunking splits React across multiple chunks or loads dependencies before React, causing:
- "Cannot set properties of undefined (setting 'AsyncMode')"
- "Cannot access 'n' before initialization"
- Other initialization race conditions

**Prevention:**
1. ✅ Pre-push hook detects manual chunking and blocks push
2. ✅ Build validator ensures automatic chunking is active
3. ✅ Vite config set to `manualChunks: undefined`

**Fix if it happens:**
- Set `manualChunks: undefined` in vite.config.ts
- Let Vite handle chunking automatically
- Vite's dependency analysis prevents initialization issues

---

### ❌ Issue 2: dev-vendor Initialization Error
**Problem:** Dev dependencies get bundled in production, causing "Cannot access 'n' before initialization"

**Prevention:**
1. ✅ Pre-push hook checks vite.config.ts for dev-vendor chunks
2. ✅ Build validator ensures no dev-vendor chunk exists
3. ✅ Automatic chunking prevents dev deps from being bundled

**Fix if it happens:**
- Ensure no manual dev-vendor chunking
- Let Vite tree-shake dev dependencies automatically

---

### ❌ Issue 3: Aggressive Console Dropping
**Problem:** Terser removes console.log causing variable initialization issues

**Prevention:**
1. ✅ drop_console set to false in vite.config.ts
2. ✅ Pre-push hook warns if drop_console is true
3. ✅ Analytics logs preserved for debugging

**Fix if it happens:**
- Set `drop_console: false` in terser options
- Keep console statements for analytics debugging

---

### ❌ Issue 4: Missing Analytics Tracking
**Problem:** GA4 tracking code not included in build

**Prevention:**
1. ✅ Build validator checks for G-SB0Q9ER7KW in index.html
2. ✅ Pre-push hook validates GA4 presence
3. ✅ Analytics initialization tested on startup

**Fix if it happens:**
- Verify GA4 script tag in index.html
- Check GA_MEASUREMENT_ID in config/analytics.ts

---

## Build Validation Checks

The `build:validate` script performs these checks:

1. ✅ **Build Success** - Production build completes without errors
2. ✅ **No dev-vendor** - Development chunks not in production
3. ✅ **React Loads First** - Correct chunk loading order
4. ✅ **Chunk Sizes OK** - Warns about chunks over 800KB
5. ✅ **Analytics Present** - GA4 tracking code included
6. ✅ **No Circular Deps** - Basic circular dependency detection

## Git Hooks

### Pre-Commit Hook
**When:** Before every commit
**What:** Runs full build validation
**Time:** ~40-60 seconds
**Blocks:** ❌ Yes, if validation fails

### Pre-Push Hook
**When:** Before pushing to GitHub
**What:** Quick config validation
**Time:** < 1 second
**Blocks:** ❌ Yes, if critical issues found

## Emergency: Skip Validation

**ONLY IF ABSOLUTELY NECESSARY:**

```bash
# Skip pre-commit hook
git commit --no-verify -m "your message"

# Skip pre-push hook
git push --no-verify
```

⚠️ **WARNING:** Only use this if you know what you're doing!

## Workflow

### Standard Workflow (Recommended)
```bash
# 1. Make changes
# 2. Test locally
npm run dev

# 3. Run safe build (automatic with pre-commit)
npm run build:safe

# 4. Commit (validation runs automatically)
git add .
git commit -m "your message"

# 5. Push (quick checks run automatically)
git push
```

### Quick Workflow (Use Carefully)
```bash
# Make small changes
npm run build

# Quick validation only
npm run build:validate

# Commit and push
git add .
git commit -m "your message"
git push
```

## Troubleshooting

### Build Validation Fails
1. Read the error message carefully
2. Check the specific validation that failed
3. Fix the issue in your code
4. Run `npm run build:validate` again
5. Commit once validation passes

### Pre-Commit Hook Fails
1. Fix the build issues
2. Run `npm run build:safe` manually
3. Verify all checks pass
4. Try committing again

### Pre-Push Hook Fails
1. Check vite.config.ts for dev-vendor
2. Check index.html for GA4 tracking
3. Fix the issues
4. Try pushing again

## Scripts Reference

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `npm run build` | Standard production build | Normal development |
| `npm run build:validate` | Validate existing build | After build, before commit |
| `npm run build:safe` | Build + Validate | Before important commits |
| `npm run precommit` | Pre-commit checks | Automatically runs |

## Best Practices

1. ✅ **Always run `build:safe` before major commits**
2. ✅ **Never disable git hooks in production workflows**
3. ✅ **Test builds locally before pushing**
4. ✅ **Read validation error messages carefully**
5. ✅ **Keep vite.config.ts comments up to date**
6. ✅ **Document any build config changes**

## Critical Files to Watch

- ✅ `vite.config.ts` - Build configuration
- ✅ `index.html` - Analytics and SEO
- ✅ `src/App.tsx` - Analytics initialization
- ✅ `src/utils/enhancedAnalytics.ts` - Tracking code
- ✅ `package.json` - Build scripts

## Deployment Checklist

Before pushing to production:

- [ ] Run `npm run build:safe`
- [ ] All validation checks pass
- [ ] Test site locally with `npm run preview`
- [ ] Check browser console for errors
- [ ] Verify analytics tracking works
- [ ] Commit with descriptive message
- [ ] Push and monitor Vercel deployment

---

**Remember:** These safeguards exist to prevent production failures. Don't skip them unless absolutely necessary!
