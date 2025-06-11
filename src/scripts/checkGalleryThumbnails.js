// Script to check gallery thumbnails
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxZL40_7Enc-I9IwRt0DllOMqlMwneje8",
  authDomain: "harielxavierphotograph.firebaseapp.com",
  projectId: "harielxavierphotograph",
  storageBucket: "harielxavierphotograph.appspot.com",
  messagingSenderId: "829105046643",
  appId: "1:829105046643:web:6d22b9c17ac453472fd606",
  measurementId: "G-0TQFQH1YLC"
};

// Initialize Firebase
// IMPORTANT: Use the shared Firebase instance from src/lib/firebase.ts instead of initializing a new one
// This prevents the "Firebase App named '[DEFAULT]' already exists" error
import app from '../lib/firebase';
// const app = initializeApp(firebaseConfig); // This line is commented out to prevent duplicate initialization;
const db = getFirestore(app);

async function checkGalleryThumbnails() {
  try {
    console.log('Checking gallery thumbnails...');
    
    const galleriesRef = collection(db, 'galleries');
    const querySnapshot = await getDocs(galleriesRef);
    
    querySnapshot.forEach(doc => {
      const gallery = doc.data();
      console.log(`Gallery: ${gallery.title} (ID: ${doc.id})`);
      console.log(`- Featured: ${gallery.featured}`);
      console.log(`- Thumbnail: ${gallery.thumbnailImage || 'None'}`);
      console.log(`- Cover: ${gallery.coverImage || 'None'}`);
      console.log('---');
    });
    
    console.log('Gallery check complete!');
  } catch (error) {
    console.error('Error checking galleries:', error);
  }
}

// Run the function
try {
  await checkGalleryThumbnails();
  console.log('Script completed successfully');
} catch (err) {
  console.error('Script failed:', err);
}
