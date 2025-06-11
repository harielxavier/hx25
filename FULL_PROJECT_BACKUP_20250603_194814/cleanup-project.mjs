#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a backup directory
const backupDir = path.join(__dirname, 'cleanup-backup');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
  console.log(`Created backup directory: ${backupDir}`);
}

// Files that are safe to move to backup
const filesToBackup = [
  // Test files
  ...findFiles(__dirname, /^test-.*\.mjs$/),
  ...findFiles(__dirname, /^test-.*\.js$/),
  
  // Backup files
  ...findFiles(__dirname, /\.backup$/),
  ...findFiles(__dirname, /\.bak$/),
  
  // Temporary files and directories
  './temp',
  './temp_images',
  
  // One-time utility scripts
  './admin-create-posts.js',
  './admin-create-posts.mjs',
  './admin-script.js',
  './backup-project.js',
  './backup-project.mjs',
  './build-functions.mjs',
  './cleanup-blog.mjs',
  './compile-template.mjs',
  './create-blog-posts.js',
  './create-plain-email-template.mjs',
  './create-posts.mjs',
  './create-sample-posts.js',
  './direct-email-test.mjs',
  './fix-blog.mjs',
  './fix-double-sidebar.js',
  './fix-white-screen.mjs',
  './fixed-portfolio-page.tsx',
  './save-logo.mjs',
  './save-new-logo.mjs',
  './send-enhanced-email.mjs',
  './send-final-professional-email.mjs',
  './send-test-email-ethereal.mjs',
  './send-test-email-production.mjs',
  './send-test-email.mjs',
  './simple-email-test.mjs',
  './temp-process-section.tsx',
  './update-admin-email.mjs',
  './update-lead-email.mjs',
  './upload-email-images.mjs',
];

// Function to find files matching a pattern
function findFiles(dir, pattern, excludeNodeModules = true) {
  const results = [];
  
  function traverse(currentDir, relativePath = '') {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const entryPath = path.join(currentDir, entry.name);
      const entryRelativePath = path.join(relativePath, entry.name);
      
      // Skip node_modules
      if (excludeNodeModules && entry.name === 'node_modules' && entry.isDirectory()) {
        continue;
      }
      
      if (entry.isDirectory()) {
        traverse(entryPath, entryRelativePath);
      } else if (pattern.test(entry.name)) {
        // Only include files in the root directory
        if (relativePath === '') {
          results.push(`./${entry.name}`);
        }
      }
    }
  }
  
  traverse(dir);
  return results;
}

// Move files to backup directory
let movedCount = 0;
for (const file of filesToBackup) {
  const sourcePath = path.join(__dirname, file);
  
  // Skip if file doesn't exist
  if (!fs.existsSync(sourcePath)) {
    console.log(`Skipping non-existent file: ${file}`);
    continue;
  }
  
  const fileName = path.basename(file);
  const destPath = path.join(backupDir, fileName);
  
  try {
    // Create a unique name if file already exists in backup
    let uniqueDestPath = destPath;
    let counter = 1;
    while (fs.existsSync(uniqueDestPath)) {
      const extname = path.extname(fileName);
      const basename = path.basename(fileName, extname);
      uniqueDestPath = path.join(backupDir, `${basename}_${counter}${extname}`);
      counter++;
    }
    
    // Move the file
    fs.renameSync(sourcePath, uniqueDestPath);
    console.log(`Moved: ${file} -> ${path.relative(__dirname, uniqueDestPath)}`);
    movedCount++;
  } catch (error) {
    console.error(`Error moving ${file}: ${error.message}`);
  }
}

console.log(`\nCleanup complete! Moved ${movedCount} files to ${path.relative(__dirname, backupDir)}`);
console.log('If you need to restore any files, you can find them in the backup directory.');
