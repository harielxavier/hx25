#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

/**
 * This script applies the fixed main.tsx file with proper Firebase configuration
 * to resolve the white screen issue.
 */

const rootDir = '/Users/bigmo/Documents/HarielXavierPhotography_Backup_2025-04-10_21-45';
const fixedMainFile = path.join(rootDir, 'src/main.fixed.tsx');
const mainFile = path.join(rootDir, 'src/main.tsx');
const backupFile = path.join(rootDir, 'src/main.tsx.original');

// Check if the fixed file exists
if (!fs.existsSync(fixedMainFile)) {
  console.error('❌ Error: Fixed main.tsx file not found!');
  process.exit(1);
}

// Create a backup of the current file if not already backed up
console.log('📦 Creating backup of original main.tsx...');
if (fs.existsSync(mainFile) && !fs.existsSync(backupFile)) {
  fs.copyFileSync(mainFile, backupFile);
  console.log(`✅ Original backup created at ${backupFile}`);
} else {
  console.log('ℹ️ Original backup already exists, skipping backup creation.');
}

// Replace the current file with the fixed version
console.log('🔄 Replacing main.tsx with fixed version...');
fs.copyFileSync(fixedMainFile, mainFile);
console.log('✅ main.tsx successfully replaced!');

console.log(`
🎉 White Screen Fix Applied! 🎉

The main.tsx file has been replaced with a fixed version that:
- Uses a robust Firebase configuration
- Provides proper error handling
- Includes detailed logging for troubleshooting

Next steps:
1. Restart the development server with: npm run dev
2. Check if the white screen issue is resolved
3. If you still see a white screen, check the browser console for errors

The original file has been backed up to: ${backupFile}
`);
