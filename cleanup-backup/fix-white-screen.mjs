#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

/**
 * This script temporarily replaces the main.tsx file with a simplified version
 * to help diagnose and fix the white screen issue.
 */

const rootDir = '/Users/bigmo/Documents/HarielXavierPhotography_Backup_2025-04-10_21-45';
const mainFile = path.join(rootDir, 'src/main.tsx');
const simplifiedFile = path.join(rootDir, 'src/main.simplified.tsx');
const backupFile = path.join(rootDir, 'src/main.tsx.backup');

// Check if the simplified file exists
if (!fs.existsSync(simplifiedFile)) {
  console.error('❌ Error: Simplified main.tsx file not found!');
  process.exit(1);
}

// Create a backup of the current file
console.log('📦 Creating backup of current main.tsx...');
if (fs.existsSync(mainFile)) {
  fs.copyFileSync(mainFile, backupFile);
  console.log(`✅ Backup created at ${backupFile}`);
} else {
  console.warn('⚠️ Warning: Current main.tsx file not found, no backup created.');
}

// Replace the current file with the simplified version
console.log('🔄 Replacing main.tsx with simplified version...');
fs.copyFileSync(simplifiedFile, mainFile);
console.log('✅ main.tsx successfully replaced!');

console.log(`
🎉 White Screen Fix Applied! 🎉

The main.tsx file has been replaced with a simplified version that:
- Removes potentially problematic Firebase initialization
- Adds better error logging
- Provides clearer error messages

Next steps:
1. Start the development server with: npm run dev
2. Check if the white screen issue is resolved
3. If you still see a white screen, check the browser console for errors

The original file has been backed up to: ${backupFile}
You can restore it later if needed.
`);
