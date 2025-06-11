#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

/**
 * This script replaces the current blogService.ts with the fixed version
 * to resolve issues with the blog functionality.
 */

const rootDir = '/Users/bigmo/Documents/HarielXavierPhotography_Backup_2025-04-10_21-45';
const sourceFile = path.join(rootDir, 'src/services/blogService.fixed.ts');
const targetFile = path.join(rootDir, 'src/services/blogService.ts');
const backupFile = path.join(rootDir, 'src/services/blogService.ts.backup');

// Check if the fixed file exists
if (!fs.existsSync(sourceFile)) {
  console.error('❌ Error: Fixed blog service file not found!');
  process.exit(1);
}

// Create a backup of the current file
console.log('📦 Creating backup of current blog service...');
if (fs.existsSync(targetFile)) {
  fs.copyFileSync(targetFile, backupFile);
  console.log(`✅ Backup created at ${backupFile}`);
} else {
  console.warn('⚠️ Warning: Current blog service file not found, no backup created.');
}

// Replace the current file with the fixed version
console.log('🔄 Replacing blog service with fixed version...');
fs.copyFileSync(sourceFile, targetFile);
console.log('✅ Blog service successfully replaced!');

console.log(`
🎉 Blog Fix Complete! 🎉

The blog service has been replaced with a more robust version that:
- Properly handles Firestore connection errors
- Provides fallback to mock data when needed
- Uses a more efficient error handling approach
- Includes additional mock blog posts for better presentation

Your blog should now display correctly. If you still encounter issues:
1. Check the browser console for any errors
2. Verify your Firebase configuration
3. Ensure your Firestore database has the correct security rules

The original file has been backed up to: ${backupFile}
`);
