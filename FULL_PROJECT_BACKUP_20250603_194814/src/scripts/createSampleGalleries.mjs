
// This script creates sample galleries and images in Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc, Timestamp } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
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

console.log('Creating sample galleries with config:', {
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket
});

// Sample gallery data
const sampleGalleries = [
  {
    title: 'Wedding Photography',
    slug: 'wedding-photography',
    description: 'Beautiful wedding photography showcasing couples on their special day.',
    clientName: 'Sample Client',
    clientEmail: 'sample@example.com',
    eventDate: new Date(),
    password: null,
    isPublic: true,
    isPasswordProtected: false,
    allowDownloads: true,
    allowSharing: true,
    category: 'Wedding',
    location: 'New York, NY',
    featured: true,
    tags: ['wedding', 'couple', 'love'],
    order: 1
  },
  {
    title: 'Portrait Photography',
    slug: 'portrait-photography',
    description: 'Professional portrait photography capturing personality and emotion.',
    clientName: 'Sample Client',
    clientEmail: 'sample@example.com',
    eventDate: new Date(),
    password: null,
    isPublic: true,
    isPasswordProtected: false,
    allowDownloads: true,
    allowSharing: true,
    category: 'Portrait',
    location: 'New York, NY',
    featured: true,
    tags: ['portrait', 'professional', 'headshot'],
    order: 2
  },
  {
    title: 'Landscape Photography',
    slug: 'landscape-photography',
    description: 'Breathtaking landscape photography from around the world.',
    clientName: 'Sample Client',
    clientEmail: 'sample@example.com',
    eventDate: new Date(),
    password: null,
    isPublic: true,
    isPasswordProtected: false,
    allowDownloads: true,
    allowSharing: true,
    category: 'Landscape',
    location: 'Various Locations',
    featured: true,
    tags: ['landscape', 'nature', 'travel'],
    order: 3
  }
];

// Sample base64 image (a simple 1x1 pixel JPEG)
const sampleImageBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//Z';

// Function to create sample galleries and images
async function createSampleGalleries() {
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const storage = getStorage(app);
    
    console.log('Firebase initialized successfully');
    
    // Create each gallery
    for (const galleryData of sampleGalleries) {
      console.log(`Creating gallery: ${galleryData.title}`);
      
      // Add gallery to Firestore
      const galleryRef = doc(collection(db, 'galleries'));
      const galleryId = galleryRef.id;
      
      await setDoc(galleryRef, {
        ...galleryData,
        id: galleryId,
        coverImage: '',  // Will update after uploading images
        thumbnailImage: '',  // Will update after uploading images
        createdAt: Timestamp.now(),
        expiresAt: null,
        imageCount: 0
      });
      
      console.log(`Created gallery with ID: ${galleryId}`);
      
      // Create 3 sample images for each gallery
      for (let i = 1; i <= 3; i++) {
        console.log(`Creating image ${i} for gallery ${galleryId}`);
        
        // Upload image to Firebase Storage
        const imageName = `sample-image-${i}.jpg`;
        const imageRef = ref(storage, `galleries/${galleryId}/${imageName}`);
        
        // Upload the base64 image
        await uploadString(imageRef, sampleImageBase64, 'data_url');
        
        // Get the download URL
        const downloadURL = await getDownloadURL(imageRef);
        
        console.log(`Image uploaded, URL: ${downloadURL}`);
        
        // Add image metadata to Firestore
        const imageRef2 = doc(collection(db, `galleries/${galleryId}/images`));
        await setDoc(imageRef2, {
          id: imageRef2.id,
          url: downloadURL,
          thumbnailUrl: downloadURL,
          filename: imageName,
          title: `Sample Image ${i}`,
          description: `This is sample image ${i} for gallery ${galleryData.title}`,
          featured: i === 1, // Make the first image featured
          order: i,
          width: 100,
          height: 100,
          size: 1024,
          createdAt: Timestamp.now(),
          tags: galleryData.tags
        });
        
        console.log(`Added image metadata to Firestore`);
        
        // If this is the first image, use it as the gallery cover
        if (i === 1) {
          await setDoc(galleryRef, {
            coverImage: downloadURL,
            thumbnailImage: downloadURL,
            imageCount: 3
          }, { merge: true });
          
          console.log(`Updated gallery ${galleryId} with cover image`);
        }
      }
    }
    
    console.log('✅ Sample galleries and images created successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error creating sample galleries:', error);
    return false;
  }
}

// Run the function
createSampleGalleries()
  .then(success => {
    if (success) {
      console.log('Sample galleries creation completed successfully');
    } else {
      console.error('Sample galleries creation failed');
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('Error running sample galleries creation:', error);
    process.exit(1);
  });
