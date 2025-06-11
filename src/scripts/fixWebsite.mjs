// This is a comprehensive fix for the photography website
// It will ensure featured galleries are properly set up and fix any Firebase issues

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  doc, 
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';

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

// Initialize Firebase - prevent duplicate app instances
// IMPORTANT: Use the shared Firebase instance from src/lib/firebase.ts instead of initializing a new one
// This prevents the "Firebase App named '[DEFAULT]' already exists" error
import app from '../lib/firebase';
// const app = initializeApp(firebaseConfig); // This line is commented out to prevent duplicate initialization;
const db = getFirestore(app);

// Main function to fix the website
async function fixWebsite() {
  try {
    console.log('Starting comprehensive website fix...');
    
    // Step 1: Check all galleries
    const galleriesRef = collection(db, 'galleries');
    const allGalleriesSnapshot = await getDocs(galleriesRef);
    
    if (allGalleriesSnapshot.empty) {
      console.log('No galleries found in the database. Creating sample galleries...');
      await createSampleGalleries();
      return;
    }
    
    console.log(`Found ${allGalleriesSnapshot.size} galleries total.`);
    
    // Step 2: Check for featured galleries
    const featuredQuery = query(galleriesRef, where('featured', '==', true));
    const featuredSnapshot = await getDocs(featuredQuery);
    
    if (featuredSnapshot.empty) {
      console.log('No featured galleries found. Setting up featured galleries...');
      
      // Get the first 3 galleries and make them featured and public
      const galleries = allGalleriesSnapshot.docs.slice(0, 3);
      
      if (galleries.length === 0) {
        console.log('No galleries available to feature.');
        return;
      }
      
      for (const docSnapshot of galleries) {
        const galleryData = docSnapshot.data();
        console.log(`Making gallery "${galleryData.title}" featured and public...`);
        
        await updateDoc(doc(db, 'galleries', docSnapshot.id), {
          featured: true,
          isPublic: true,
          updatedAt: serverTimestamp()
        });
      }
      
      console.log(`Successfully set up ${galleries.length} featured galleries.`);
    } else {
      console.log(`Found ${featuredSnapshot.size} featured galleries.`);
      
      // Make sure they're all public
      let updatedCount = 0;
      
      for (const docSnapshot of featuredSnapshot.docs) {
        const galleryData = docSnapshot.data();
        
        if (!galleryData.isPublic) {
          console.log(`Making gallery "${galleryData.title}" public...`);
          
          await updateDoc(doc(db, 'galleries', docSnapshot.id), {
            isPublic: true,
            updatedAt: serverTimestamp()
          });
          
          updatedCount++;
        }
      }
      
      if (updatedCount > 0) {
        console.log(`Updated ${updatedCount} galleries to be public.`);
      } else {
        console.log('All featured galleries are already public.');
      }
    }
    
    // Step 3: Check for gallery images
    console.log('Checking gallery images...');
    
    const featuredGalleriesQuery = query(
      galleriesRef, 
      where('featured', '==', true),
      where('isPublic', '==', true)
    );
    
    const featuredGalleriesSnapshot = await getDocs(featuredGalleriesQuery);
    
    for (const galleryDoc of featuredGalleriesSnapshot.docs) {
      const galleryId = galleryDoc.id;
      const galleryData = galleryDoc.data();
      
      console.log(`Checking images for gallery "${galleryData.title}" (${galleryId})...`);
      
      const imagesRef = collection(db, 'galleries', galleryId, 'images');
      const imagesSnapshot = await getDocs(imagesRef);
      
      if (imagesSnapshot.empty) {
        console.log(`No images found for gallery "${galleryData.title}".`);
      } else {
        console.log(`Found ${imagesSnapshot.size} images for gallery "${galleryData.title}".`);
        
        // Check for featured images
        const featuredImagesQuery = query(imagesRef, where('featured', '==', true));
        const featuredImagesSnapshot = await getDocs(featuredImagesQuery);
        
        if (featuredImagesSnapshot.empty) {
          console.log(`No featured images found for gallery "${galleryData.title}". Setting up featured images...`);
          
          // Make the first 3 images featured
          const images = imagesSnapshot.docs.slice(0, 3);
          
          for (const imageDoc of images) {
            const imageId = imageDoc.id;
            const imageData = imageDoc.data();
            
            console.log(`Making image "${imageData.filename}" featured...`);
            
            await updateDoc(doc(db, 'galleries', galleryId, 'images', imageId), {
              featured: true
            });
          }
          
          console.log(`Successfully set up ${images.length} featured images for gallery "${galleryData.title}".`);
        } else {
          console.log(`Found ${featuredImagesSnapshot.size} featured images for gallery "${galleryData.title}".`);
        }
      }
    }
    
    console.log('Website fix completed successfully!');
    console.log('Your landing page should now display featured galleries correctly.');
    
  } catch (error) {
    console.error('Error fixing website:', error);
  }
}

// Helper function to create sample galleries if none exist
async function createSampleGalleries() {
  try {
    const galleriesRef = collection(db, 'galleries');
    
    const sampleGalleries = [
      {
        title: 'Wedding Photography',
        slug: 'wedding-photography',
        description: 'Beautiful wedding photography capturing special moments.',
        coverImage: 'https://source.unsplash.com/random/800x600/?wedding',
        thumbnailImage: 'https://source.unsplash.com/random/400x300/?wedding',
        clientName: 'Sample Client',
        clientEmail: 'sample@example.com',
        eventDate: new Date(),
        createdAt: serverTimestamp(),
        expiresAt: null,
        password: null,
        isPublic: true,
        isPasswordProtected: false,
        allowDownloads: true,
        allowSharing: true,
        category: 'Wedding',
        location: 'New York',
        imageCount: 0,
        featured: true,
        tags: ['wedding', 'couple', 'love']
      },
      {
        title: 'Portrait Photography',
        slug: 'portrait-photography',
        description: 'Professional portrait photography for individuals and families.',
        coverImage: 'https://source.unsplash.com/random/800x600/?portrait',
        thumbnailImage: 'https://source.unsplash.com/random/400x300/?portrait',
        clientName: 'Sample Client',
        clientEmail: 'sample@example.com',
        eventDate: new Date(),
        createdAt: serverTimestamp(),
        expiresAt: null,
        password: null,
        isPublic: true,
        isPasswordProtected: false,
        allowDownloads: true,
        allowSharing: true,
        category: 'Portrait',
        location: 'Boston',
        imageCount: 0,
        featured: true,
        tags: ['portrait', 'family', 'professional']
      },
      {
        title: 'Nature Photography',
        slug: 'nature-photography',
        description: 'Stunning nature and landscape photography.',
        coverImage: 'https://source.unsplash.com/random/800x600/?nature',
        thumbnailImage: 'https://source.unsplash.com/random/400x300/?nature',
        clientName: 'Sample Client',
        clientEmail: 'sample@example.com',
        eventDate: new Date(),
        createdAt: serverTimestamp(),
        expiresAt: null,
        password: null,
        isPublic: true,
        isPasswordProtected: false,
        allowDownloads: true,
        allowSharing: true,
        category: 'Landscape',
        location: 'Colorado',
        imageCount: 0,
        featured: true,
        tags: ['nature', 'landscape', 'outdoors']
      }
    ];
    
    for (const gallery of sampleGalleries) {
      await addDoc(galleriesRef, gallery);
    }
    
    console.log('Successfully created 3 sample galleries.');
    
  } catch (error) {
    console.error('Error creating sample galleries:', error);
  }
}

// Run the function
fixWebsite()
  .then(() => console.log('Fix completed'))
  .catch(error => console.error('Fix failed:', error));
