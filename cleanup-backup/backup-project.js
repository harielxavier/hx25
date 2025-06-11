/**
 * Backup script for Hariel Xavier Photography Website
 * Creates a complete backup of the project in the Documents directory
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get current date for backup folder name
const now = new Date();
const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;
const backupFolderName = `HarielXavierPhotography_Backup_${timestamp}`;

// Define paths
const sourceDir = process.cwd(); // Current working directory
const documentsDir = path.join('/Users/bigmo/Documents');
const backupDir = path.join(documentsDir, backupFolderName);

// Create backup directory
console.log(`Creating backup directory: ${backupDir}`);
fs.mkdirSync(backupDir, { recursive: true });

// Define directories and files to exclude from backup
const excludes = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.DS_Store',
  '*.log'
].map(item => `--exclude="${item}"`).join(' ');

// Create the backup using rsync (more efficient than manual copying)
try {
  console.log('Starting backup process...');
  const command = `rsync -av ${excludes} "${sourceDir}/" "${backupDir}/"`;
  execSync(command, { stdio: 'inherit' });
  
  console.log('\n✅ Backup completed successfully!');
  console.log(`Backup location: ${backupDir}`);
} catch (error) {
  console.error('❌ Backup failed:', error.message);
  process.exit(1);
}
