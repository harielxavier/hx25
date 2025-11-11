# Quick Reference Card

## To Prevent Build Failures - Use These Commands

### Before Every Important Commit
```bash
npm run build:safe
```
This is your safety net. It builds AND validates everything.

### Quick Validation Only
```bash
npm run build:validate
```
Checks if your current build is production-ready.

### Standard Build
```bash
npm run build
```
Regular production build (validation happens separately).

---

## What Happens Automatically

### When You Commit
✅ Pre-commit hook runs `build:safe` automatically
✅ Takes 40-60 seconds
✅ Blocks commit if validation fails

### When You Push
✅ Pre-push hook runs quick config checks
✅ Takes < 1 second
✅ Blocks push if critical issues found

---

## Critical Rules

### ❌ NEVER Do This in vite.config.ts:
```javascript
// BAD - manual chunking causes React initialization errors
manualChunks: (id) => {
  if (id.includes('react')) return 'react-vendor';
  if (id.includes('mui')) return 'mui-vendor';
  // ... more manual chunks
}
```

### ✅ ALWAYS Keep This:
```javascript
// GOOD - automatic chunking prevents all initialization issues
manualChunks: undefined
```

### ❌ NEVER Do This in terser options:
```javascript
// BAD - causes variable initialization issues
drop_console: true,
pure_funcs: ['console.log'],
```

### ✅ ALWAYS Keep This:
```javascript
// GOOD - preserves analytics debugging
drop_console: false,
```

---

## Emergency Override

**ONLY IF YOU KNOW WHAT YOU'RE DOING:**

```bash
# Skip all hooks (dangerous!)
git commit --no-verify -m "emergency fix"
git push --no-verify
```

⚠️ Use this ONLY for critical hotfixes when you're 100% sure the build works!

---

## Validation Checks Summary

The system checks for:
1. ✅ Build completes without errors
2. ✅ No dev-vendor chunk in production
3. ✅ React loads before animation libraries
4. ✅ Chunk sizes reasonable
5. ✅ GA4 analytics code present
6. ✅ No obvious circular dependencies

---

## Read More

See `BUILD_SAFETY_GUIDE.md` for complete documentation.
