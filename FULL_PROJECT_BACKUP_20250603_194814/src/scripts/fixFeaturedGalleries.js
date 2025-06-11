// Script to mark BMW gallery as featured
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

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

async function markBMWAsFeatured() {
  try {
    const galleryId = 'hHL8hcqu6FBXxnRFAczB'; // BMW M Series gallery ID
    const galleryRef = doc(db, 'galleries', galleryId);
    
    await updateDoc(galleryRef, { 
      featured: true 
    });
    
    console.log('BMW M Series gallery has been marked as featured!');
  } catch (error) {
    console.error('Error updating gallery:', error);
  }
}

// Run the function
markBMWAsFeatured()
  .then(() => console.log('Script completed successfully'))
  .catch(err => console.error('Script failed:', err));
