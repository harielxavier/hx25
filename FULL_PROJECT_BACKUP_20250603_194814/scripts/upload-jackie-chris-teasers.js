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
 * Upload Wedding Gallery 1 teaser images as slider images
 */
async function uploadWeddingGallery1TeasersAsSliderImages() {
  try {
    const publicDir = path.resolve(__dirname, '../public');
    const teaserDir = path.join(publicDir, 'MoStuff', 'Wedding Gallery 1 teasers');
    
    console.log(`Uploading Wedding Gallery 1 teaser images from ${teaserDir}...`);
    
    // Upload teaser images as slider images
    const leftUrl = await uploadFile(
      path.join(teaserDir, 'teaser1.jpg'),
      'sliders/slider1/slider1left.jpg'
    );
    
    const rightUrl = await uploadFile(
      path.join(teaserDir, 'teaser2.jpg'),
      'sliders/slider1/slider1right.jpg'
    );
    
    console.log('Successfully uploaded Wedding Gallery 1 teaser images as slider images');
    console.log('Left image URL:', leftUrl);
    console.log('Right image URL:', rightUrl);
    
    process.exit(0);
  } catch (error) {
    console.error('Error uploading Wedding Gallery 1 teaser images:', error);
    process.exit(1);
  }
}

// Run the upload function
uploadWeddingGallery1TeasersAsSliderImages();
