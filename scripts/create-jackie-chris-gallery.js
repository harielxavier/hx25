import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc,
  updateDoc,
  doc,
  serverTimestamp 
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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

// Helper function to generate a slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single one
    .trim();
};

// Helper function to upload an image to Firebase Storage
const uploadImage = async (filePath, storagePath) => {
  try {
    console.log(`Uploading ${filePath} to ${storagePath}...`);
    
    // Read the file
    const fileBuffer = fs.readFileSync(filePath);
    
    // Get file metadata
    const fileStats = fs.statSync(filePath);
    const fileType = path.extname(filePath).toLowerCase() === '.jpg' ? 'image/jpeg' : 'image/png';
    
    // Create a reference to the storage location
    const storageRef = ref(storage, storagePath);
    
    // Upload the file
    const uploadResult = await uploadBytes(storageRef, fileBuffer, {
      contentType: fileType,
      customMetadata: {
        originalFilename: path.basename(filePath),
        size: fileStats.size.toString(),
        uploadDate: new Date().toISOString()
      }
    });
    
    // Get the download URL
    const downloadUrl = await getDownloadURL(uploadResult.ref);
    console.log(`Uploaded successfully. URL: ${downloadUrl}`);
    
    return downloadUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Main function to create Wedding Gallery 1
async function createWeddingGallery1() {
  try {
    console.log('Creating Wedding Gallery 1...');
    
    // Check if gallery already exists
    const galleriesRef = collection(db, 'galleries');
    const q = query(galleriesRef, where('slug', '==', 'wedding-gallery-1'));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      console.log('Gallery already exists. Updating...');
      const galleryDoc = querySnapshot.docs[0];
      const galleryId = galleryDoc.id;
      
      // Update the gallery
      await updateDoc(doc(db, 'galleries', galleryId), {
        title: 'Wedding Gallery 1',
        description: 'A beautiful wedding celebration at a luxury venue',
        isPublished: true,
        isPasswordProtected: false,
        allowDownloads: true,
        allowSharing: true,
        clientName: 'Wedding Gallery 1',
        isPublic: true,
        galleryType: 'portfolio',
        displayLocation: 'portfolio',
        showOnWebsite: true,
        location: 'The Inn at Millrace Pond, Hope, NJ',
        updatedAt: serverTimestamp()
      });
      
      console.log(`Updated gallery with ID: ${galleryId}`);
      
      // Upload thumbnail if it exists
      const thumbnailPath = path.join(process.cwd(), 'MoStuff', 'Jackie and Chris\'s Teasers', 'jackiethumb.jpg');
      if (fs.existsSync(thumbnailPath)) {
        const thumbnailUrl = await uploadImage(thumbnailPath, `galleries/${galleryId}/thumbnails/jackiethumb.jpg`);
        
        // Update gallery with thumbnail
        await updateDoc(doc(db, 'galleries', galleryId), {
          thumbnailImage: thumbnailUrl,
          updatedAt: serverTimestamp()
        });
        
        console.log(`Updated gallery thumbnail: ${thumbnailUrl}`);
      }
      
      return galleryId;
    } else {
      // Create a new gallery
      const galleryData = {
        title: 'Wedding Gallery 1',
        slug: 'wedding-gallery-1',
        description: 'A beautiful wedding celebration at a luxury venue',
        coverImage: '',
        thumbnailImage: '',
        imageCount: 0,
        isPublished: true,
        isPasswordProtected: false,
        password: '',
        allowDownloads: true,
        allowSharing: true,
        clientName: 'Wedding Gallery 1',
        clientEmail: 'client1@example.com',
        expiryDate: null,
        watermarkEnabled: false,
        selectionDeadline: null,
        requiredSelectionCount: 0,
        isPublic: true,
        tags: ['wedding', 'featured'],
        filterTags: ['wedding', 'featured'],
        category: 'wedding',
        location: 'The Inn at Millrace Pond, Hope, NJ',
        featured: true,
        galleryType: 'portfolio',
        displayLocation: 'portfolio',
        showOnWebsite: true,
        sortOrder: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(galleriesRef, galleryData);
      console.log(`Created new gallery with ID: ${docRef.id}`);
      
      // Upload thumbnail if it exists
      const thumbnailPath = path.join(process.cwd(), 'MoStuff', 'Jackie and Chris\'s Teasers', 'jackiethumb.jpg');
      if (fs.existsSync(thumbnailPath)) {
        const thumbnailUrl = await uploadImage(thumbnailPath, `galleries/${docRef.id}/thumbnails/jackiethumb.jpg`);
        
        // Update gallery with thumbnail
        await updateDoc(doc(db, 'galleries', docRef.id), {
          thumbnailImage: thumbnailUrl,
          coverImage: thumbnailUrl,
          updatedAt: serverTimestamp()
        });
        
        console.log(`Updated gallery thumbnail: ${thumbnailUrl}`);
      }
      
      return docRef.id;
    }
  } catch (error) {
    console.error('Error creating gallery:', error);
    throw error;
  }
};

// Run the function
createWeddingGallery1()
  .then(galleryId => {
    console.log(`Gallery created/updated successfully with ID: ${galleryId}`);
    process.exit(0);
  })
  .catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
