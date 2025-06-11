
// This script verifies that Firebase Storage is working correctly
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

// Load environment variables
dotenv.config({ path: path.join(projectRoot, '.env') });

// Firebase configuration with hardcoded values for development
const firebaseConfig = {
  apiKey: "AIzaSyCxZL40_7Enc-I9IwRt0DllOMqlMwneje8",
  authDomain: "harielxavierphotograph.firebaseapp.com",
  projectId: "harielxavierphotograph",
  storageBucket: "harielxavierphotograph.appspot.com",
  messagingSenderId: "829105046643",
  appId: "1:829105046643:web:6d22b9c17ac453472fd606",
  measurementId: "G-0TQFQH1YLC"
};

console.log('Verifying Firebase Storage with config:', {
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket
});

// Function to verify Firebase Storage
async function verifyFirebaseStorage() {
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const storage = getStorage(app);
    
    console.log('Firebase initialized successfully');
    
    // Check for featured galleries
    console.log('Checking for featured galleries...');
    const galleriesRef = collection(db, 'galleries');
    const featuredQuery = query(
      galleriesRef, 
      where('featured', '==', true),
      orderBy('order', 'asc')
    );
    
    const querySnapshot = await getDocs(featuredQuery);
    
    if (querySnapshot.empty) {
      console.log('No featured galleries found. You may need to run the createSampleGalleries.mjs script.');
      return false;
    }
    
    console.log(`Found ${querySnapshot.size} featured galleries:`);
    
    // Check each gallery for images
    for (const galleryDoc of querySnapshot.docs) {
      const gallery = { id: galleryDoc.id, ...galleryDoc.data() };
      console.log(`Gallery: ${gallery.title} (ID: ${gallery.id})`);
      
      // Check if cover image exists
      if (gallery.coverImage) {
        console.log(`Cover image URL: ${gallery.coverImage}`);
        
        try {
          // Try to access the image directly
          const response = await fetch(gallery.coverImage);
          if (response.ok) {
            console.log('✅ Cover image is accessible');
          } else {
            console.error(`❌ Cover image returned status: ${response.status}`);
          }
        } catch (error) {
          console.error('❌ Error accessing cover image:', error.message);
        }
      } else {
        console.log('❌ No cover image set for this gallery');
      }
      
      // Check for featured images
      console.log(`Checking for featured images in gallery ${gallery.id}...`);
      const imagesRef = collection(db, `galleries/${gallery.id}/images`);
      const featuredImagesQuery = query(
        imagesRef, 
        where('featured', '==', true),
        orderBy('order', 'asc')
      );
      
      const imagesSnapshot = await getDocs(featuredImagesQuery);
      
      if (imagesSnapshot.empty) {
        console.log('No featured images found in this gallery.');
        continue;
      }
      
      console.log(`Found ${imagesSnapshot.size} featured images:`);
      
      // Check each image
      for (const imageDoc of imagesSnapshot.docs) {
        const image = { id: imageDoc.id, ...imageDoc.data() };
        console.log(`Image: ${image.title || 'Untitled'} (ID: ${image.id})`);
        console.log(`Image URL: ${image.url}`);
        
        try {
          // Try to access the image directly
          const response = await fetch(image.url);
          if (response.ok) {
            console.log('✅ Image is accessible');
          } else {
            console.error(`❌ Image returned status: ${response.status}`);
          }
        } catch (error) {
          console.error('❌ Error accessing image:', error.message);
        }
      }
    }
    
    console.log('✅ Firebase Storage verification completed');
    return true;
  } catch (error) {
    console.error('❌ Error verifying Firebase Storage:', error);
    return false;
  }
}

// Run the verification
verifyFirebaseStorage()
  .then(success => {
    if (success) {
      console.log('Firebase Storage verification completed successfully');
    } else {
      console.error('Firebase Storage verification failed');
    }
  })
  .catch(error => {
    console.error('Error running Firebase Storage verification:', error);
  });
