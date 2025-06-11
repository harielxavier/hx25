#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a backup directory for src backups
const backupDir = path.join(__dirname, 'cleanup-backup', 'src-backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
  console.log(`Created backup directory: ${backupDir}`);
}

// Source directory to clean
const srcDir = path.join(__dirname, 'src');

// Find and move backup files
function findAndMoveBackupFiles(dir, backupDir, baseRelativePath = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let movedCount = 0;
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(baseRelativePath, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively process subdirectories
      movedCount += findAndMoveBackupFiles(fullPath, backupDir, relativePath);
    } else if (entry.name.endsWith('.backup') || entry.name.endsWith('.bak')) {
      // Create directory structure in backup directory
      const relativeDir = path.dirname(relativePath);
      const backupDestDir = path.join(backupDir, relativeDir);
      
      if (!fs.existsSync(backupDestDir)) {
        fs.mkdirSync(backupDestDir, { recursive: true });
      }
      
      // Move the file
      const destPath = path.join(backupDir, relativePath);
      fs.renameSync(fullPath, destPath);
      console.log(`Moved: ${relativePath} -> ${path.relative(__dirname, destPath)}`);
      movedCount++;
    }
  }
  
  return movedCount;
}

// Run the cleanup
console.log('Cleaning up backup files in src directory...');
const movedCount = findAndMoveBackupFiles(srcDir, backupDir);

console.log(`\nCleanup complete! Moved ${movedCount} backup files from src to ${path.relative(__dirname, backupDir)}`);
console.log('If you need to restore any files, you can find them in the backup directory.');
