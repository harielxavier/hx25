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

// Main function to create Sarah & Michael Wedding Gallery
async function createSarahMichaelGallery() {
  try {
    console.log('Creating Sarah & Michael Wedding Gallery...');
    
    // Define gallery slug
    const gallerySlug = 'sarah-michael-wedding';
    
    // Check if gallery already exists
    const galleriesRef = collection(db, 'galleries');
    const q = query(galleriesRef, where('slug', '==', gallerySlug));
    const querySnapshot = await getDocs(q);
    
    // Gallery data
    const galleryData = {
      title: 'Sarah & Michael\'s Wedding',
      description: 'A beautiful wedding celebration filled with authentic moments and emotional storytelling',
      isPublished: true,
      isPasswordProtected: false,
      allowDownloads: true,
      allowSharing: true,
      clientName: 'Sarah & Michael',
      isPublic: true,
      galleryType: 'portfolio',
      displayLocation: 'portfolio',
      showOnWebsite: true,
      location: 'Sparta, NJ',
      tags: ['wedding', 'documentary', 'featured'],
      filterTags: ['wedding', 'documentary', 'featured'],
      category: 'wedding',
      featured: true,
      updatedAt: serverTimestamp()
    };
    
    let galleryId;
    
    if (!querySnapshot.empty) {
      console.log('Gallery already exists. Updating...');
      galleryId = querySnapshot.docs[0].id;
      
      // Update the gallery
      await updateDoc(doc(db, 'galleries', galleryId), galleryData);
      console.log(`Updated gallery with ID: ${galleryId}`);
    } else {
      // Create a new gallery
      const newGalleryData = {
        ...galleryData,
        slug: gallerySlug,
        coverImage: '',
        thumbnailImage: '',
        imageCount: 0,
        password: '',
        clientEmail: '',
        expiryDate: null,
        watermarkEnabled: false,
        selectionDeadline: null,
        requiredSelectionCount: 0,
        sortOrder: 1,
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(galleriesRef, newGalleryData);
      galleryId = docRef.id;
      console.log(`Created new gallery with ID: ${galleryId}`);
    }
    
    // List of images to upload (using Karni & Zilvinas Wedding images)
    const imageFiles = [
      'Karni & Zilvinas Wedding (1).jpg',
      'Karni & Zilvinas Wedding (2).jpg',
      'Karni & Zilvinas Wedding (3).jpg',
      'Karni & Zilvinas Wedding (4).jpg',
      'Karni & Zilvinas Wedding (5).jpg',
      'Karni & Zilvinas Wedding (6).jpg',
      'Karni & Zilvinas Wedding (7).jpg',
      'Karni & Zilvinas Wedding (8).jpg',
      'Karni & Zilvinas Wedding (9).jpg',
      'Karni & Zilvinas Wedding (10).jpg',
      'Karni & Zilvinas Wedding (11).jpg',
      'Karni & Zilvinas Wedding (12).jpg',
      'Karni & Zilvinas Wedding (13).jpg',
      'Karni & Zilvinas Wedding (15).jpg',
      'Karni & Zilvinas Wedding (16).jpg',
      'Karni & Zilvinas Wedding (17).jpg',
      'Karni & Zilvinas Wedding (20).jpg',
      'Karni & Zilvinas Wedding (21).jpg',
      'Karni & Zilvinas Wedding (22).jpg',
      'Karni & Zilvinas Wedding (23).jpg',
      'Karni & Zilvinas Wedding (24).jpg',
      'Karni & Zilvinas Wedding (25).jpg',
      'Karni & Zilvinas Wedding (26).jpg',
      'Karni & Zilvinas Wedding (27).jpg',
      'Karni & Zilvinas Wedding (28).jpg',
      'Karni & Zilvinas Wedding (29).jpg',
      'Karni & Zilvinas Wedding (30).jpg',
      'Karni & Zilvinas Wedding (31).jpg',
      'Karni & Zilvinas Wedding (32).jpg',
      'Karni & Zilvinas Wedding (33).jpg',
      'Karni & Zilvinas Wedding (34).jpg',
      'Karni & Zilvinas Wedding (35).jpg',
      'Karni & Zilvinas Wedding (36).jpg',
      'Karni & Zilvinas Wedding (37).jpg',
      'Karni & Zilvinas Wedding (38).jpg',
      'Karni & Zilvinas Wedding (39).jpg',
      'Karni & Zilvinas Wedding (40).jpg',
      'Karni & Zilvinas Wedding (41).jpg',
      'Karni & Zilvinas Wedding (42).jpg',
      'Karni & Zilvinas Wedding (43).jpg',
      'Karni & Zilvinas Wedding (44).jpg',
      'Karni & Zilvinas Wedding (45).jpg',
      'Karni & Zilvinas Wedding (46).jpg',
      'Karni & Zilvinas Wedding (47).jpg',
      'Karni & Zilvinas Wedding (48).jpg',
      'Karni & Zilvinas Wedding (49).jpg',
      'Karni & Zilvinas Wedding (50).jpg',
      'Karni & Zilvinas Wedding (51).jpg',
      'Karni & Zilvinas Wedding (52).jpg'
    ];
    
    // Source directory for the images
    const sourceDir = path.join(process.cwd(), 'All Photos 2');
    
    // Upload images and create image documents
    let uploadedCount = 0;
    let thumbnailUrl = '';
    
    for (let i = 0; i < imageFiles.length; i++) {
      const fileName = imageFiles[i];
      const filePath = path.join(sourceDir, fileName);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        continue;
      }
      
      // New filename for Sarah & Michael (replacing Karni & Zilvinas with Sarah & Michael)
      const newFileName = fileName.replace('Karni & Zilvinas', 'Sarah & Michael');
      
      // Upload to Firebase Storage
      const storagePath = `galleries/${galleryId}/images/${newFileName}`;
      const downloadUrl = await uploadImage(filePath, storagePath);
      
      // Save the first image URL as the thumbnail and cover image
      if (i === 0) {
        thumbnailUrl = downloadUrl;
        
        // Update gallery with thumbnail and cover image
        await updateDoc(doc(db, 'galleries', galleryId), {
          thumbnailImage: thumbnailUrl,
          coverImage: thumbnailUrl,
          updatedAt: serverTimestamp()
        });
        
        console.log(`Set gallery thumbnail and cover image: ${thumbnailUrl}`);
      }
      
      // Create image document in Firestore
      const imageData = {
        galleryId: galleryId,
        fileName: newFileName,
        originalFileName: fileName,
        url: downloadUrl,
        thumbnailUrl: downloadUrl, // Using the same URL for thumbnail in this example
        size: fs.statSync(filePath).size,
        width: 0, // Would need image processing library to get actual dimensions
        height: 0,
        contentType: 'image/jpeg',
        sortOrder: i,
        isPublished: true,
        isFeatured: i < 5, // Feature the first 5 images
        caption: `Sarah & Michael's Wedding - ${i + 1}`,
        tags: ['wedding', 'documentary'],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // Add image document to Firestore
      const imagesRef = collection(db, 'galleries', galleryId, 'images');
      await addDoc(imagesRef, imageData);
      
      uploadedCount++;
      console.log(`Uploaded image ${i + 1}/${imageFiles.length}: ${newFileName}`);
    }
    
    // Update gallery with image count
    await updateDoc(doc(db, 'galleries', galleryId), {
      imageCount: uploadedCount,
      updatedAt: serverTimestamp()
    });
    
    console.log(`Gallery updated with ${uploadedCount} images`);
    
    return galleryId;
  } catch (error) {
    console.error('Error creating gallery:', error);
    throw error;
  }
}

// Run the function
createSarahMichaelGallery()
  .then(galleryId => {
    console.log(`Gallery created/updated successfully with ID: ${galleryId}`);
    process.exit(0);
  })
  .catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
