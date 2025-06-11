import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fetch from 'node-fetch';

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
          isPublic: 'true'
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
 * Replace slider1 images in Firebase Storage
 */
async function replaceSliderImages() {
  try {
    const publicDir = path.resolve(__dirname, '../public');
    const sliderDir = path.join(publicDir, 'MoStuff', 'slider1');
    
    // Make sure the directory exists
    if (!fs.existsSync(sliderDir)) {
      fs.mkdirSync(sliderDir, { recursive: true });
    }
    
    // Replace the images with the new ones
    console.log('Replacing slider images with the new wedding photos...');
    
    // Upload the new images to Firebase
    const leftUrl = await uploadFile(
      path.join(sliderDir, 'slider1left.jpg'),
      'sliders/slider1/slider1left.jpg'
    );
    
    const rightUrl = await uploadFile(
      path.join(sliderDir, 'slider1right.jpg'),
      'sliders/slider1/slider1right.jpg'
    );
    
    console.log('Successfully replaced slider images');
    console.log('Left image URL:', leftUrl);
    console.log('Right image URL:', rightUrl);
    
    process.exit(0);
  } catch (error) {
    console.error('Error replacing slider images:', error);
    process.exit(1);
  }
}

// Run the replacement function
replaceSliderImages();
