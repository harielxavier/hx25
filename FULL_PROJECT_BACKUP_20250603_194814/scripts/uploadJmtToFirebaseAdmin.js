// Script to upload the jmt gallery to Firebase Storage using Admin SDK
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import mime from 'mime-types';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to service account key
const serviceAccountPath = path.join(__dirname, '../harielxavierphotography-18d17-firebase-adminsdk-fbsvc-7ce82ba6ec.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'harielxavierphotography-18d17.firebasestorage.app'
});

// Get storage bucket
const bucket = admin.storage().bucket();

// Source directory (local jmt folder)
const sourceDir = path.join(__dirname, '../public/MoStuff/jmt');

// Destination path in Firebase Storage
const destinationPath = 'galleries/jmt';

// Function to get file MIME type
function getMimeType(filename) {
  return mime.lookup(filename) || 'application/octet-stream';
}

// Function to upload a single file
async function uploadFile(filePath, destination) {
  try {
    const filename = path.basename(filePath);
    const destinationPath = `${destination}/${filename}`;
    
    // Set metadata including content type
    const metadata = {
      contentType: getMimeType(filename),
      metadata: {
        uploadedAt: new Date().toISOString(),
        originalPath: filePath
      }
    };
    
    // Upload the file
    await bucket.upload(filePath, {
      destination: destinationPath,
      metadata: metadata
    });
    
    // Make the file publicly accessible
    await bucket.file(destinationPath).makePublic();
    
    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destinationPath}`;
    
    console.log(`✅ Uploaded ${filename} to ${destinationPath}`);
    console.log(`   Public URL: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error(`❌ Error uploading ${filePath}:`, error);
    throw error;
  }
}

// Function to upload all files in a directory
async function uploadDirectory(sourceDir, destination) {
  try {
    // Check if directory exists
    if (!fs.existsSync(sourceDir)) {
      console.error(`❌ Source directory does not exist: ${sourceDir}`);
      return;
    }
    
    // Get all files in the directory
    const files = fs.readdirSync(sourceDir);
    console.log(`Found ${files.length} files in ${sourceDir}`);
    
    // Upload each file
    const uploadPromises = [];
    for (const file of files) {
      const filePath = path.join(sourceDir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isFile()) {
        uploadPromises.push(uploadFile(filePath, destination));
      } else if (stats.isDirectory()) {
        // Recursively upload subdirectories
        const subDir = path.basename(filePath);
        await uploadDirectory(filePath, `${destination}/${subDir}`);
      }
    }
    
    // Wait for all uploads to complete
    await Promise.all(uploadPromises);
    console.log(`✅ All files uploaded to ${destination}`);
  } catch (error) {
    console.error('❌ Error uploading directory:', error);
  }
}

// Main function
async function main() {
  try {
    console.log('🚀 Starting upload of jmt gallery to Firebase Storage using Admin SDK...');
    await uploadDirectory(sourceDir, destinationPath);
    
    console.log('✅ Upload completed successfully!');
    console.log('👉 Update your image paths to use the Firebase Storage URLs');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    // Terminate the app
    admin.app().delete();
  }
}

// Run the main function
main();
