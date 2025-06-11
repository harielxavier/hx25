// Script to update the first featured gallery title to "Anna and Jose's Wedding"
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const updateGalleryTitle = async () => {
  try {
    // Find the first featured gallery
    const galleriesRef = collection(db, 'galleries');
    const featuredQuery = query(
      galleriesRef, 
      where('featured', '==', true),
      where('tags', 'array-contains', 'position-1')
    );
    
    const querySnapshot = await getDocs(featuredQuery);
    
    if (querySnapshot.empty) {
      console.log('No featured gallery found with position-1 tag.');
      return;
    }
    
    // Update the first featured gallery's title
    const galleryDoc = querySnapshot.docs[0];
    const galleryRef = doc(db, 'galleries', galleryDoc.id);
    
    await updateDoc(galleryRef, {
      title: "Anna and Jose's Wedding",
      description: "Beautiful wedding photography featuring Anna and Jose's special day. Capturing precious moments of love and celebration.",
      clientName: "Anna and Jose",
      clientEmail: "annajose@example.com",
      category: "wedding",
      location: "Sunset Beach Resort"
    });
    
    console.log(`Updated gallery title to "Anna and Jose's Wedding"`);
  } catch (error) {
    console.error('Error updating gallery title:', error);
  }
};

// Execute the function
try {
  await updateGalleryTitle();
  console.log('Script completed');
} catch (error) {
  console.error('Script failed:', error);
}
