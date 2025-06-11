import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current file directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import service account dynamically
const serviceAccountPath = path.resolve(__dirname, '../harielxavierphotography-18d17-firebase-adminsdk-fbsvc-7ce82ba6ec.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin SDK with service account
initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'harielxavierphotography-18d17.firebasestorage.app'
});

const bucket = getStorage().bucket();

/**
 * Delete all files from Firebase Storage
 */
async function deleteAllFiles() {
  try {
    console.log('Fetching all files from Firebase Storage...');
    const [files] = await bucket.getFiles();
    
    console.log(`Found ${files.length} files in Firebase Storage.`);
    
    if (files.length === 0) {
      console.log('No files to delete. Firebase Storage is already empty.');
      process.exit(0);
    }
    
    console.log('Starting deletion process...');
    
    // Create a counter for progress tracking
    let deletedCount = 0;
    
    // Delete files in batches to avoid overwhelming the API
    const batchSize = 10;
    const totalBatches = Math.ceil(files.length / batchSize);
    
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const batchStart = batchIndex * batchSize;
      const batchEnd = Math.min((batchIndex + 1) * batchSize, files.length);
      const batch = files.slice(batchStart, batchEnd);
      
      console.log(`Processing batch ${batchIndex + 1}/${totalBatches} (files ${batchStart + 1}-${batchEnd})...`);
      
      // Create an array of promises for deleting files in this batch
      const deletePromises = batch.map(file => {
        console.log(`Deleting file: ${file.name}`);
        return file.delete().then(() => {
          deletedCount++;
          if (deletedCount % 10 === 0 || deletedCount === files.length) {
            console.log(`Progress: ${deletedCount}/${files.length} files deleted (${Math.round(deletedCount / files.length * 100)}%)`);
          }
        });
      });
      
      // Wait for all deletions in this batch to complete
      await Promise.all(deletePromises);
    }
    
    console.log(`Successfully deleted all ${files.length} files from Firebase Storage.`);
    process.exit(0);
  } catch (error) {
    console.error('Error deleting files from Firebase Storage:', error);
    process.exit(1);
  }
}

// Ask for confirmation before proceeding
console.log('WARNING: This will delete ALL files from your Firebase Storage bucket.');
console.log('Storage bucket: harielxavierphotography-18d17.firebasestorage.app');
console.log('');
console.log('To proceed, type "yes" and press Enter.');
console.log('To cancel, press Ctrl+C or type anything else and press Enter.');

process.stdin.setEncoding('utf8');
process.stdin.once('data', (data) => {
  const input = data.toString().trim().toLowerCase();
  
  if (input === 'yes') {
    console.log('Proceeding with deletion...');
    deleteAllFiles();
  } else {
    console.log('Operation cancelled.');
    process.exit(0);
  }
});
