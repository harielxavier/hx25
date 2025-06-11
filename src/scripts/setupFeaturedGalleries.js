// This script sets up featured galleries for the homepage
// Run this script to ensure your featured galleries are properly configured

import { db, storage } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';

// Sample gallery data
const sampleGalleries = [
  {
    title: "Featured Gallery 1: Wedding Photography",
    slug: "featured-wedding-photography",
    description: "Capturing the most beautiful moments of your special day with elegance and emotion.",
    clientName: "Sample Client",
    clientEmail: "sample@example.com",
    eventDate: new Date(),
    password: null,
    isPublic: true,
    isPasswordProtected: false,
    allowDownloads: true,
    allowSharing: true,
    category: "Wedding",
    location: "New York, NY",
    featured: true,
    tags: ["wedding", "portrait", "couple"],
    order: 1
  },
  {
    title: "Featured Gallery 2: Portrait Collection",
    slug: "featured-portrait-collection",
    description: "Professional portrait photography that captures personality and emotion.",
    clientName: "Sample Client",
    clientEmail: "sample@example.com",
    eventDate: new Date(),
    password: null,
    isPublic: true,
    isPasswordProtected: false,
    allowDownloads: true,
    allowSharing: true,
    category: "Portrait",
    location: "Los Angeles, CA",
    featured: true,
    tags: ["portrait", "professional", "studio"],
    order: 2
  },
  {
    title: "Featured Gallery 3: Landscape Series",
    slug: "featured-landscape-series",
    description: "Breathtaking landscape photography from around the world.",
    clientName: "Sample Client",
    clientEmail: "sample@example.com",
    eventDate: new Date(),
    password: null,
    isPublic: true,
    isPasswordProtected: false,
    allowDownloads: true,
    allowSharing: true,
    category: "Landscape",
    location: "Various Locations",
    featured: true,
    tags: ["landscape", "nature", "travel"],
    order: 3
  }
];

// Sample images - URLs to high-quality sample images
const sampleImageUrls = {
  "featured-wedding-photography": [
    "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80"
  ],
  "featured-portrait-collection": [
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1376&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
  ],
  "featured-landscape-series": [
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1439853949127-fa647821eba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
  ]
};

// Function to fetch an image from a URL and convert to a File object
async function urlToFile(url, filename) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
}

// Function to create a gallery if it doesn't exist
async function createGalleryIfNotExists(galleryData) {
  try {
    // Check if gallery with this slug already exists
    const galleriesRef = collection(db, 'galleries');
    const q = query(galleriesRef, where('slug', '==', galleryData.slug));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // Gallery doesn't exist, create it
      console.log(`Creating gallery: ${galleryData.title}`);
      
      // Add timestamp fields
      const galleryWithTimestamps = {
        ...galleryData,
        createdAt: serverTimestamp(),
        expiresAt: null,
        imageCount: 0
      };
      
      // Create the gallery document
      const docRef = await addDoc(galleriesRef, galleryWithTimestamps);
      
      // Add sample images
      await addSampleImages(docRef.id, galleryData.slug);
      
      // Update the gallery with cover image and thumbnail
      const images = await getSampleImages(docRef.id);
      if (images.length > 0) {
        await updateDoc(doc(db, 'galleries', docRef.id), {
          coverImage: images[0].url,
          thumbnailImage: images[0].thumbnailUrl || images[0].url,
          imageCount: images.length
        });
      }
      
      console.log(`Gallery created with ID: ${docRef.id}`);
      return docRef.id;
    } else {
      // Gallery exists, return its ID
      const galleryId = querySnapshot.docs[0].id;
      console.log(`Gallery already exists with ID: ${galleryId}`);
      
      // Update it to ensure it's featured and public
      await updateDoc(doc(db, 'galleries', galleryId), {
        featured: true,
        isPublic: true
      });
      
      // Check if it has images
      const images = await getSampleImages(galleryId);
      if (images.length === 0) {
        await addSampleImages(galleryId, galleryData.slug);
        
        // Update the gallery with cover image and thumbnail
        const updatedImages = await getSampleImages(galleryId);
        if (updatedImages.length > 0) {
          await updateDoc(doc(db, 'galleries', galleryId), {
            coverImage: updatedImages[0].url,
            thumbnailImage: updatedImages[0].thumbnailUrl || updatedImages[0].url,
            imageCount: updatedImages.length
          });
        }
      }
      
      return galleryId;
    }
  } catch (error) {
    console.error(`Error creating gallery: ${error}`);
    throw error;
  }
}

// Function to get sample images for a gallery
async function getSampleImages(galleryId) {
  try {
    const imagesRef = collection(db, `galleries/${galleryId}/images`);
    const querySnapshot = await getDocs(imagesRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error getting sample images: ${error}`);
    return [];
  }
}

// Function to add sample images to a gallery
async function addSampleImages(galleryId, gallerySlug) {
  try {
    const urls = sampleImageUrls[gallerySlug] || [];
    
    if (urls.length === 0) {
      console.log(`No sample images defined for gallery: ${gallerySlug}`);
      return;
    }
    
    console.log(`Adding ${urls.length} sample images to gallery: ${galleryId}`);
    
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const filename = `sample-image-${i + 1}.jpg`;
      
      try {
        // Convert URL to File object
        const file = await urlToFile(url, filename);
        
        // Upload to Firebase Storage
        const storageRef = ref(storage, `galleries/${galleryId}/${filename}`);
        const uploadResult = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(uploadResult.ref);
        
        // Create thumbnail URL (using same URL for simplicity)
        const thumbnailStorageRef = ref(storage, `galleries/${galleryId}/thumbnails/${filename}`);
        await uploadBytes(thumbnailStorageRef, file);
        const thumbnailURL = await getDownloadURL(thumbnailStorageRef);
        
        // Add image document to Firestore
        const imagesRef = collection(db, `galleries/${galleryId}/images`);
        await addDoc(imagesRef, {
          url: downloadURL,
          thumbnailUrl: thumbnailURL,
          filename: filename,
          title: `Sample Image ${i + 1}`,
          description: `Description for sample image ${i + 1}`,
          featured: true,
          order: i,
          width: 1500,
          height: 1000,
          size: file.size,
          createdAt: serverTimestamp(),
          tags: i === 0 ? ['featured', 'cover'] : ['featured']
        });
        
        console.log(`Added image ${i + 1} to gallery ${galleryId}`);
      } catch (error) {
        console.error(`Error adding image ${i + 1}: ${error}`);
        // Continue with other images
      }
    }
  } catch (error) {
    console.error(`Error adding sample images: ${error}`);
  }
}

// Main function to set up featured galleries
async function setupFeaturedGalleries() {
  console.log('Setting up featured galleries...');
  
  try {
    for (const gallery of sampleGalleries) {
      await createGalleryIfNotExists(gallery);
    }
    
    console.log('Featured galleries setup complete!');
  } catch (error) {
    console.error('Error setting up featured galleries:', error);
  }
}

// Export the setup function
export { setupFeaturedGalleries };
