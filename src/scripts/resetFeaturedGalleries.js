// Reset Featured Galleries Script
// This script will clear the featured status from all galleries
// Run with: node resetFeaturedGalleries.js

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  updateDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';

// Import Firebase config from your project
import { firebaseConfig } from '../firebase/config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function resetFeaturedGalleries() {
  try {
    console.log('Starting to reset featured galleries...');
    
    // Get all galleries
    const galleriesRef = collection(db, 'galleries');
    const querySnapshot = await getDocs(galleriesRef);
    
    console.log(`Found ${querySnapshot.size} galleries in total.`);
    
    // Count featured galleries
    let featuredCount = 0;
    querySnapshot.forEach(doc => {
      if (doc.data().featured) {
        featuredCount++;
      }
    });
    
    console.log(`Found ${featuredCount} featured galleries.`);
    
    // Update each gallery to remove featured status
    let updatedCount = 0;
    const updatePromises = [];
    
    querySnapshot.forEach(document => {
      const galleryData = document.data();
      if (galleryData.featured) {
        const galleryRef = doc(db, 'galleries', document.id);
        const updatePromise = updateDoc(galleryRef, {
          featured: false,
          updatedAt: serverTimestamp()
        }).then(() => {
          updatedCount++;
          console.log(`Removed featured status from gallery: ${galleryData.title} (${document.id})`);
        });
        
        updatePromises.push(updatePromise);
      }
    });
    
    // Wait for all updates to complete
    await Promise.all(updatePromises);
    
    console.log(`Successfully reset ${updatedCount} featured galleries.`);
    console.log('All galleries have been reset. You can now set new featured galleries.');
    
  } catch (error) {
    console.error('Error resetting featured galleries:', error);
  }
}

// Run the function
resetFeaturedGalleries()
  .then(() => console.log('Script completed.'))
  .catch(err => console.error('Script failed:', err));
