/**
 * Backup Script for Hariel Xavier Photography Website
 * 
 * This script creates a timestamped backup of the project,
 * excluding large directories like node_modules and dist.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const projectRoot = path.resolve(__dirname, '..');
const backupDir = path.join(projectRoot, '../Backups');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupName = `HarielXavierPhotography-backup-${timestamp}`;
const backupPath = path.join(backupDir, backupName);

// Directories and files to exclude from backup
const excludes = [
  'node_modules',
  'dist',
  '.firebase',
  '.vite',
  'temp',
  'temp_images'
];

// Create backup directory if it doesn't exist
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
  console.log(`Created backup directory: ${backupDir}`);
}

// Build the rsync command with exclusions
const excludeParams = excludes.map(item => `--exclude="${item}"`).join(' ');
const rsyncCommand = `rsync -av ${excludeParams} "${projectRoot}/" "${backupPath}"`;

try {
  console.log('Starting backup...');
  console.log(`Source: ${projectRoot}`);
  console.log(`Destination: ${backupPath}`);
  
  // Execute the rsync command
  execSync(rsyncCommand, { stdio: 'inherit' });
  
  // Create a zip archive of the backup
  console.log('Creating zip archive...');
  const zipPath = `${backupPath}.zip`;
  execSync(`cd "${backupDir}" && zip -r "${zipPath}" "${backupName}"`, { stdio: 'inherit' });
  
  // Remove the uncompressed backup folder to save space
  console.log('Cleaning up...');
  execSync(`rm -rf "${backupPath}"`, { stdio: 'inherit' });
  
  console.log(`Backup completed successfully: ${zipPath}`);
} catch (error) {
  console.error('Backup failed:', error.message);
  process.exit(1);
}
