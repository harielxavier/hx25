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
 * Upload a file to Firebase Storage
 * 
 * @param {string} localFilePath - Path to local file
 * @param {string} destinationPath - Path in Firebase Storage
 * @returns {Promise<string>} - Download URL
 */
async function uploadFile(localFilePath, destinationPath) {
  try {
    console.log(`Uploading ${localFilePath} to ${destinationPath}...`);
    
    // Check if file exists locally
    if (!fs.existsSync(localFilePath)) {
      throw new Error(`Local file ${localFilePath} does not exist`);
    }
    
    // Upload file to Firebase Storage
    const [file] = await bucket.upload(localFilePath, {
      destination: destinationPath,
      metadata: {
        contentType: 'image/jpeg',
        metadata: {
          isPublic: 'true' // Custom metadata to mark as public
        }
      }
    });
    
    // Make the file publicly accessible
    await file.makePublic();
    
    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destinationPath}`;
    console.log(`Successfully uploaded to ${publicUrl}`);
    
    return publicUrl;
  } catch (error) {
    console.error(`Error uploading ${localFilePath}:`, error);
    throw error;
  }
}

/**
 * Upload slider images to Firebase Storage
 */
async function uploadSliderImages() {
  try {
    const publicDir = path.resolve(__dirname, '../public');
    
    // Slider 1 images
    const slider1LeftPath = path.join(publicDir, 'mostuff', 'slider1', 'slider1left.jpg');
    const slider1RightPath = path.join(publicDir, 'mostuff', 'slider1', 'slider1right.jpg');
    
    // Upload slider1 images
    const leftUrl = await uploadFile(slider1LeftPath, 'sliders/slider1/slider1left.jpg');
    const rightUrl = await uploadFile(slider1RightPath, 'sliders/slider1/slider1right.jpg');
    
    console.log('Successfully uploaded slider images:');
    console.log('Left image:', leftUrl);
    console.log('Right image:', rightUrl);
    
    // Exit the process
    process.exit(0);
  } catch (error) {
    console.error('Error uploading slider images:', error);
    process.exit(1);
  }
}

// Run the upload function
uploadSliderImages();
