// Script to upload sample images to Firebase Storage for email templates
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadString } from 'firebase/storage';
import fs from 'fs';
import path from 'path';

// Firebase configuration from your project
const firebaseConfig = {
  apiKey: "AIzaSyAXW2TqnlSymyfdZULM4NN3gfSG_imcv0U",
  authDomain: "harielxavierphotography-18d17.firebaseapp.com",
  projectId: "harielxavierphotography-18d17",
  storageBucket: "harielxavierphotography-18d17.firebasestorage.app",
  messagingSenderId: "195040006099",
  appId: "1:195040006099:web:4d670ea2b5d859ab606926",
  measurementId: "G-SB0Q9ER7KW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Function to upload a base64 image to Firebase Storage
async function uploadBase64Image(base64Data, storagePath) {
  try {
    // Create a storage reference
    const storageRef = ref(storage, storagePath);
    
    // Upload the base64 string
    const snapshot = await uploadString(storageRef, base64Data, 'data_url');
    
    console.log(`Uploaded image to: ${storagePath}`);
    console.log(`Download URL: ${snapshot.ref.fullPath}`);
    
    return snapshot.ref.fullPath;
  } catch (error) {
    console.error(`Error uploading image to ${storagePath}:`, error);
    throw error;
  }
}

// Main function to upload all images
async function uploadImages() {
  try {
    // Check if we have any images in the public/images directory
    const imagesDir = path.join(process.cwd(), 'public/images');
    
    if (fs.existsSync(imagesDir)) {
      console.log(`Found images directory: ${imagesDir}`);
      
      // Find some sample images
      const files = fs.readdirSync(imagesDir);
      console.log(`Found ${files.length} files in the images directory`);
      
      // Find image files
      const imageFiles = files.filter(file => 
        file.endsWith('.jpg') || 
        file.endsWith('.jpeg') || 
        file.endsWith('.png') || 
        file.endsWith('.gif')
      );
      
      if (imageFiles.length > 0) {
        console.log(`Found ${imageFiles.length} image files`);
        
        // Upload a logo image
        const logoPath = path.join(imagesDir, imageFiles[0]);
        const logoData = fs.readFileSync(logoPath, { encoding: 'base64' });
        const logoBase64 = `data:image/jpeg;base64,${logoData}`;
        await uploadBase64Image(logoBase64, 'email-templates/logo.jpg');
        
        // Upload portfolio images
        for (let i = 0; i < Math.min(3, imageFiles.length); i++) {
          const imagePath = path.join(imagesDir, imageFiles[i]);
          const imageData = fs.readFileSync(imagePath, { encoding: 'base64' });
          const imageBase64 = `data:image/jpeg;base64,${imageData}`;
          await uploadBase64Image(imageBase64, `email-templates/portfolio-${i + 1}.jpg`);
        }
        
        // Upload a profile image
        const profilePath = path.join(imagesDir, imageFiles[imageFiles.length - 1]);
        const profileData = fs.readFileSync(profilePath, { encoding: 'base64' });
        const profileBase64 = `data:image/jpeg;base64,${profileData}`;
        await uploadBase64Image(profileBase64, 'email-templates/profile.jpg');
        
        console.log('All images uploaded successfully!');
      } else {
        console.log('No image files found in the images directory');
      }
    } else {
      console.log(`Images directory not found: ${imagesDir}`);
    }
  } catch (error) {
    console.error('Error uploading images:', error);
  }
}

// Run the function
uploadImages();
