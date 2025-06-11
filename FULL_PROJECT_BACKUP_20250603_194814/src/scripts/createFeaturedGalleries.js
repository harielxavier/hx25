// Script to create three featured galleries for the homepage
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { db, storage } from '../../firebase/config';

// No need to initialize Firebase again as we're importing it
// // IMPORTANT: Use the shared Firebase instance from src/lib/firebase.ts instead of initializing a new one
// This prevents the "Firebase App named '[DEFAULT]' already exists" error
// const app = initializeApp(firebaseConfig); // This line is commented out to prevent duplicate initialization;
// const db = getFirestore(app);
// const storage = getStorage(app);

const createFeaturedGalleries = async () => {
  try {
    // Check if featured galleries already exist
    const galleriesRef = collection(db, 'galleries');
    const featuredQuery = query(galleriesRef, where('featured', '==', true));
    const existingFeatured = await getDocs(featuredQuery);
    
    if (!existingFeatured.empty) {
      console.log(`${existingFeatured.size} featured galleries already exist. Skipping creation.`);
      return;
    }
    
    // Create three featured galleries for the homepage
    const featuredGalleries = [
      {
        title: "Anna and Jose's Wedding",
        slug: "anna-jose-wedding",
        description: "Beautiful wedding photography featuring Anna and Jose's special day. Capturing precious moments of love and celebration.",
        coverImage: "https://source.unsplash.com/random/1200x800/?wedding",
        thumbnailImage: "https://source.unsplash.com/random/600x400/?wedding",
        clientName: "Anna and Jose",
        clientEmail: "annajose@example.com",
        eventDate: Timestamp.fromDate(new Date()),
        expiresAt: null,
        password: null,
        isPublic: true,
        isPasswordProtected: false,
        allowDownloads: true,
        allowSharing: true,
        category: "wedding",
        location: "Sunset Beach Resort",
        featured: true,
        tags: ["homepage", "featured", "position-1", "wedding"],
        createdAt: Timestamp.now(),
        imageCount: 5
      },
      {
        title: "Homepage Feature 2 - Portrait",
        slug: "homepage-feature-2-portrait",
        description: "This is the second featured gallery that appears on the homepage. Edit this gallery to change what appears in the second position of the homepage showcase.",
        coverImage: "https://source.unsplash.com/random/1200x800/?portrait",
        thumbnailImage: "https://source.unsplash.com/random/600x400/?portrait",
        clientName: "Homepage Feature 2",
        clientEmail: "admin@example.com",
        eventDate: Timestamp.fromDate(new Date()),
        expiresAt: null,
        password: null,
        isPublic: true,
        isPasswordProtected: false,
        allowDownloads: true,
        allowSharing: true,
        category: "homepage",
        location: "Homepage Position 2",
        featured: true,
        tags: ["homepage", "featured", "position-2", "portrait"],
        createdAt: Timestamp.now(),
        imageCount: 5
      },
      {
        title: "Homepage Feature 3 - Landscape",
        slug: "homepage-feature-3-landscape",
        description: "This is the third featured gallery that appears on the homepage. Edit this gallery to change what appears in the third position of the homepage showcase.",
        coverImage: "https://source.unsplash.com/random/1200x800/?landscape",
        thumbnailImage: "https://source.unsplash.com/random/600x400/?landscape",
        clientName: "Homepage Feature 3",
        clientEmail: "admin@example.com",
        eventDate: Timestamp.fromDate(new Date()),
        expiresAt: null,
        password: null,
        isPublic: true,
        isPasswordProtected: false,
        allowDownloads: true,
        allowSharing: true,
        category: "homepage",
        location: "Homepage Position 3",
        featured: true,
        tags: ["homepage", "featured", "position-3", "landscape"],
        createdAt: Timestamp.now(),
        imageCount: 5
      }
    ];
    
    // Create each featured gallery
    for (const gallery of featuredGalleries) {
      await addDoc(galleriesRef, gallery);
      console.log(`Created featured gallery: ${gallery.title}`);
    }
    
    console.log('Featured galleries for homepage created successfully!');
    console.log('You can now edit these galleries in the admin panel to customize your homepage.');
  } catch (error) {
    console.error('Error creating featured galleries:', error);
  }
};

// Execute the function
try {
  await createFeaturedGalleries();
  console.log('Script completed');
} catch (error) {
  console.error('Script failed:', error);
}
