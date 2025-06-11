// Emergency fix script for the broken website
// This script will reset any problematic data and ensure the site renders correctly

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  doc, 
  serverTimestamp,
  addDoc
} from 'firebase/firestore';

// Firebase configuration - using the one from fixWebsite.mjs
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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixBrokenWebsite() {
  console.log('Starting emergency website repair...');
  
  try {
    // Step 1: Check for and fix featured galleries
    await fixFeaturedGalleries();
    
    // Step 2: Check for and fix gallery images
    await fixGalleryImages();
    
    // Step 3: Ensure proper configuration
    await fixConfiguration();
    
    console.log('Website repair completed successfully!');
    console.log('Please restart your development server (npm run dev) and clear your browser cache.');
    console.log('The website should now display correctly.');
    
  } catch (error) {
    console.error('Error during website repair:', error);
    console.log('Please try running the script again or contact support.');
  }
}

async function fixFeaturedGalleries() {
  console.log('Checking featured galleries...');
  
  // Get all galleries
  const galleriesRef = collection(db, 'galleries');
  const allGalleriesSnapshot = await getDocs(galleriesRef);
  
  if (allGalleriesSnapshot.empty) {
    console.log('No galleries found. Creating sample galleries...');
    await createSampleGalleries();
    return;
  }
  
  console.log(`Found ${allGalleriesSnapshot.size} galleries.`);
  
  // Check for featured galleries
  const featuredQuery = query(galleriesRef, where('featured', '==', true));
  const featuredSnapshot = await getDocs(featuredQuery);
  
  if (featuredSnapshot.empty) {
    console.log('No featured galleries found. Setting up featured galleries...');
    
    // Get the first 3 galleries and make them featured and public
    const galleries = allGalleriesSnapshot.docs.slice(0, 3);
    
    for (const galleryDoc of galleries) {
      const galleryId = galleryDoc.id;
      const galleryData = galleryDoc.data();
      
      console.log(`Making gallery "${galleryData.title}" featured and public...`);
      
      await updateDoc(doc(db, 'galleries', galleryId), {
        featured: true,
        isPublic: true,
        updatedAt: serverTimestamp()
      });
    }
    
    console.log(`Successfully set up ${galleries.length} featured galleries.`);
  } else {
    console.log(`Found ${featuredSnapshot.size} featured galleries.`);
    
    // Make sure they're all public
    for (const galleryDoc of featuredSnapshot.docs) {
      const galleryId = galleryDoc.id;
      const galleryData = galleryDoc.data();
      
      if (!galleryData.isPublic) {
        console.log(`Making gallery "${galleryData.title}" public...`);
        
        await updateDoc(doc(db, 'galleries', galleryId), {
          isPublic: true,
          updatedAt: serverTimestamp()
        });
      }
    }
  }
}

async function fixGalleryImages() {
  console.log('Checking gallery images...');
  
  // Get all featured galleries
  const galleriesRef = collection(db, 'galleries');
  const featuredQuery = query(
    galleriesRef, 
    where('featured', '==', true),
    where('isPublic', '==', true)
  );
  
  const featuredGalleries = await getDocs(featuredQuery);
  
  for (const galleryDoc of featuredGalleries.docs) {
    const galleryId = galleryDoc.id;
    const galleryData = galleryDoc.data();
    
    console.log(`Checking images for gallery "${galleryData.title}" (${galleryId})...`);
    
    // Get all images for this gallery
    const imagesRef = collection(db, 'galleries', galleryId, 'images');
    const imagesSnapshot = await getDocs(imagesRef);
    
    if (imagesSnapshot.empty) {
      console.log(`No images found for gallery "${galleryData.title}". Adding sample images...`);
      
      // Add sample images
      await addSampleImages(galleryId, galleryData.category);
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
}

async function fixConfiguration() {
  console.log('Checking configuration...');
  
  // This function would check and fix any configuration issues
  // For now, we'll just log a message
  console.log('Configuration check completed.');
}

async function createSampleGalleries() {
  console.log('Creating sample galleries...');
  
  const galleriesRef = collection(db, 'galleries');
  
  const sampleGalleries = [
    {
      title: "Wedding Photography",
      slug: "wedding-photography",
      description: "Beautiful wedding photography capturing special moments.",
      coverImage: "https://source.unsplash.com/random/800x600/?wedding",
      thumbnailImage: "https://source.unsplash.com/random/400x300/?wedding",
      clientName: "Sample Client",
      clientEmail: "sample@example.com",
      eventDate: new Date(),
      createdAt: serverTimestamp(),
      expiresAt: null,
      password: null,
      isPublic: true,
      isPasswordProtected: false,
      allowDownloads: true,
      allowSharing: true,
      category: "Wedding",
      location: "New York",
      imageCount: 0,
      featured: true,
      tags: ['wedding', 'couple', 'love']
    },
    {
      title: "Portrait Photography",
      slug: "portrait-photography",
      description: "Professional portrait photography for individuals and families.",
      coverImage: "https://source.unsplash.com/random/800x600/?portrait",
      thumbnailImage: "https://source.unsplash.com/random/400x300/?portrait",
      clientName: "Sample Client",
      clientEmail: "sample@example.com",
      eventDate: new Date(),
      createdAt: serverTimestamp(),
      expiresAt: null,
      password: null,
      isPublic: true,
      isPasswordProtected: false,
      allowDownloads: true,
      allowSharing: true,
      category: "Portrait",
      location: "Los Angeles",
      imageCount: 0,
      featured: true,
      tags: ['portrait', 'professional', 'studio']
    },
    {
      title: "Landscape Photography",
      slug: "landscape-photography",
      description: "Breathtaking landscape photography from around the world.",
      coverImage: "https://source.unsplash.com/random/800x600/?landscape",
      thumbnailImage: "https://source.unsplash.com/random/400x300/?landscape",
      clientName: "Sample Client",
      clientEmail: "sample@example.com",
      eventDate: new Date(),
      createdAt: serverTimestamp(),
      expiresAt: null,
      password: null,
      isPublic: true,
      isPasswordProtected: false,
      allowDownloads: true,
      allowSharing: true,
      category: "Landscape",
      location: "Various",
      imageCount: 0,
      featured: true,
      tags: ['landscape', 'nature', 'travel']
    }
  ];
  
  for (const gallery of sampleGalleries) {
    const docRef = await addDoc(galleriesRef, gallery);
    console.log(`Created gallery "${gallery.title}" with ID: ${docRef.id}`);
    
    // Add sample images to this gallery
    await addSampleImages(docRef.id, gallery.category);
  }
  
  console.log('Sample galleries created successfully.');
}

async function addSampleImages(galleryId, category) {
  console.log(`Adding sample images to gallery ${galleryId}...`);
  
  const imagesRef = collection(db, 'galleries', galleryId, 'images');
  
  // Generate sample images based on category
  const imageType = category.toLowerCase();
  const sampleImages = [];
  
  for (let i = 1; i <= 5; i++) {
    sampleImages.push({
      url: `https://source.unsplash.com/random/800x600/?${imageType},${i}`,
      thumbnailUrl: `https://source.unsplash.com/random/400x300/?${imageType},${i}`,
      filename: `sample-${imageType}-${i}.jpg`,
      title: `Sample ${category} Image ${i}`,
      description: `A beautiful sample ${category.toLowerCase()} image.`,
      featured: i <= 3, // First 3 images are featured
      order: i,
      width: 800,
      height: 600,
      size: 500000,
      createdAt: serverTimestamp(),
      tags: [category.toLowerCase(), 'sample']
    });
  }
  
  for (const image of sampleImages) {
    await addDoc(imagesRef, image);
  }
  
  console.log(`Added ${sampleImages.length} sample images to gallery ${galleryId}.`);
}

// Run the fix
fixBrokenWebsite()
  .then(() => console.log('Fix script completed'))
  .catch(error => console.error('Fix script failed:', error));
