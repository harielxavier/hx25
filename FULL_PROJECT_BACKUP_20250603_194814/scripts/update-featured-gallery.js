import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc,
  addDoc,
  deleteDoc,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import fs from 'fs';
import path from 'path';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Main function to update the featured gallery
const updateFeaturedGallery = async () => {
  try {
    console.log('Updating featured gallery for Wedding Gallery 1...');
    
    // Check if a left position gallery already exists
    const featuredRef = collection(db, 'featuredGalleries');
    const q = query(featuredRef, where('position', '==', 'left'), orderBy('displayOrder', 'asc'));
    const querySnapshot = await getDocs(q);
    
    // Data for Wedding Gallery 1 gallery
    const galleryData = {
      title: 'Wedding Gallery 1',
      description: 'A beautiful wedding celebration',
      position: 'left',
      linkUrl: '/gallery/wedding-gallery-1',
      displayOrder: 1,
      coupleName: 'Wedding Gallery 1',
      venue: 'The Inn at Millrace Pond',
      location: 'Hope, NJ',
      galleryId: 'wedding-gallery-1',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // If a left gallery exists, update it; otherwise, create a new one
    if (!querySnapshot.empty) {
      const leftGalleryDoc = querySnapshot.docs[0];
      console.log(`Updating existing left gallery with ID: ${leftGalleryDoc.id}`);
      
      // Keep the existing imageUrl if it exists
      const existingData = leftGalleryDoc.data();
      const imageUrl = existingData.imageUrl || '';
      
      await updateDoc(doc(db, 'featuredGalleries', leftGalleryDoc.id), {
        ...galleryData,
        imageUrl,
        updatedAt: serverTimestamp()
      });
      
      console.log('Left gallery updated successfully!');
    } else {
      console.log('No left gallery found. Creating a new one...');
      
      // Create a new gallery
      const docRef = await addDoc(featuredRef, {
        ...galleryData,
        imageUrl: '', // Will be updated after image upload
      });
      
      console.log(`Created new left gallery with ID: ${docRef.id}`);
    }
    
    console.log('Featured gallery update completed successfully!');
  } catch (error) {
    console.error('Error updating featured gallery:', error);
  }
};

// Run the update
updateFeaturedGallery();
