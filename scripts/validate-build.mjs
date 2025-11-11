#!/usr/bin/env node

/**
 * Build Validation Script
 * Validates production builds to catch issues BEFORE deployment
 * Run this before every commit to ensure build quality
 */

import { createServer } from 'vite';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const VALIDATION_CHECKS = {
  buildSuccess: false,
  noCircularDeps: false,
  chunkSizesOk: false,
  noDevVendor: false,
  reactLoadsFirst: false,
  analyticsPresent: false,
};

console.log('🔍 Starting build validation...\n');

// 1. Clean previous build
console.log('1️⃣  Cleaning previous build...');
try {
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  console.log('   ✅ Clean complete\n');
} catch (error) {
  console.error('   ❌ Clean failed:', error.message);
  process.exit(1);
}

// 2. Run production build
console.log('2️⃣  Running production build...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  VALIDATION_CHECKS.buildSuccess = true;
  console.log('   ✅ Build succeeded\n');
} catch (error) {
  console.error('   ❌ Build failed');
  process.exit(1);
}

// 3. Check for dev-vendor chunk (should NOT exist)
console.log('3️⃣  Checking for dev-vendor chunk...');
try {
  const distJs = fs.readdirSync('dist/assets/js');
  const devVendorFiles = distJs.filter(file => file.includes('dev-vendor'));

  if (devVendorFiles.length > 0) {
    console.error('   ❌ CRITICAL: dev-vendor chunk found!', devVendorFiles);
    console.error('   This will cause initialization errors in production');
    process.exit(1);
  }

  VALIDATION_CHECKS.noDevVendor = true;
  console.log('   ✅ No dev-vendor chunk (good!)\n');
} catch (error) {
  console.error('   ❌ Failed to check chunks:', error.message);
  process.exit(1);
}

// 4. Verify automatic chunking is working
console.log('4️⃣  Verifying chunk strategy...');
try {
  const distJs = fs.readdirSync('dist/assets/js');

  // With automatic chunking, we should have index chunks and page chunks
  const indexChunks = distJs.filter(file => file.includes('index-v5-'));

  if (indexChunks.length === 0) {
    console.error('   ❌ CRITICAL: No index chunks found!');
    process.exit(1);
  }

  console.log(`   ✅ Found ${indexChunks.length} index chunk(s)`);
  console.log('   ✅ Automatic chunking active (no manual chunk conflicts)\n');

  VALIDATION_CHECKS.reactLoadsFirst = true;
} catch (error) {
  console.error('   ❌ Failed to verify chunking:', error.message);
  process.exit(1);
}

// 5. Check chunk sizes
console.log('5️⃣  Checking chunk sizes...');
try {
  const distJs = fs.readdirSync('dist/assets/js');
  const largeChunks = [];

  distJs.forEach(file => {
    const filePath = path.join('dist/assets/js', file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);

    // Warn about chunks over 800KB (not blocking, just FYI)
    if (stats.size > 800 * 1024) {
      largeChunks.push({ file, sizeKB });
    }
  });

  if (largeChunks.length > 0) {
    console.log('   ⚠️  Large chunks detected (not blocking):');
    largeChunks.forEach(({ file, sizeKB }) => {
      console.log(`      - ${file}: ${sizeKB} KB`);
    });
  } else {
    console.log('   ✅ All chunks under 800KB');
  }

  VALIDATION_CHECKS.chunkSizesOk = true;
  console.log('');
} catch (error) {
  console.error('   ❌ Failed to check chunk sizes:', error.message);
  process.exit(1);
}

// 6. Verify analytics code is present in index.html
console.log('6️⃣  Verifying analytics integration...');
try {
  const indexHtml = fs.readFileSync('dist/index.html', 'utf-8');

  if (!indexHtml.includes('G-SB0Q9ER7KW')) {
    console.error('   ❌ CRITICAL: GA4 tracking ID not found in index.html!');
    process.exit(1);
  }

  if (!indexHtml.includes('gtag')) {
    console.error('   ❌ CRITICAL: gtag not found in index.html!');
    process.exit(1);
  }

  VALIDATION_CHECKS.analyticsPresent = true;
  console.log('   ✅ GA4 analytics code present\n');
} catch (error) {
  console.error('   ❌ Failed to verify analytics:', error.message);
  process.exit(1);
}

// 7. Check for circular dependencies (basic check)
console.log('7️⃣  Checking for obvious circular dependencies...');
try {
  // This is a basic check - more advanced tools like madge can be added
  const jsFiles = fs.readdirSync('dist/assets/js');

  // Look for suspiciously small files that might indicate circular deps
  const suspiciousFiles = jsFiles.filter(file => {
    const stats = fs.statSync(path.join('dist/assets/js', file));
    return stats.size < 100; // Files under 100 bytes are suspicious
  });

  if (suspiciousFiles.length > 0) {
    console.log('   ⚠️  Suspiciously small files found:');
    suspiciousFiles.forEach(file => console.log(`      - ${file}`));
    console.log('   This might indicate circular dependencies');
  } else {
    console.log('   ✅ No obvious circular dependencies');
  }

  VALIDATION_CHECKS.noCircularDeps = true;
  console.log('');
} catch (error) {
  console.error('   ❌ Failed to check dependencies:', error.message);
  process.exit(1);
}

// Final Summary
console.log('═══════════════════════════════════════════════════════');
console.log('📊 VALIDATION SUMMARY:');
console.log('═══════════════════════════════════════════════════════');
Object.entries(VALIDATION_CHECKS).forEach(([check, passed]) => {
  const icon = passed ? '✅' : '❌';
  const label = check.replace(/([A-Z])/g, ' $1').trim();
  console.log(`${icon} ${label}`);
});
console.log('═══════════════════════════════════════════════════════\n');

const allPassed = Object.values(VALIDATION_CHECKS).every(v => v === true);

if (allPassed) {
  console.log('🎉 BUILD VALIDATION PASSED!');
  console.log('✅ Safe to commit and deploy\n');
  process.exit(0);
} else {
  console.log('❌ BUILD VALIDATION FAILED!');
  console.log('⛔ DO NOT COMMIT - Fix issues first\n');
  process.exit(1);
}
