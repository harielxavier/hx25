/**
 * Script to upload Crysta & David wedding images to Firebase
 * Using the client SDK approach that works for other galleries
 */

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc,
  setDoc,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Firebase configuration - using direct values from config.ts
const firebaseConfig = {
  apiKey: "AIzaSyAXW2TqnlSymyfdZULM4NN3gfSG_imcv0U",
  authDomain: "harielxavierphotography-18d17.firebaseapp.com",
  projectId: "harielxavierphotography-18d17",
  storageBucket: "harielxavierphotography-18d17.firebasestorage.app",
  messagingSenderId: "195040006099",
  appId: "1:195040006099:web:4d670ea2b5d859ab606926",
  measurementId: "G-SB0Q9ER7KW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Section mapping based on image filenames
const sectionMap = {
  // Preparation section
  'cdw-25': 'preparation',
  'cdw-55': 'preparation',
  'cdw-64': 'preparation',
  
  // Ceremony section
  'cdw-127': 'ceremony',
  'cdw-160': 'ceremony',
  'cdw-169': 'ceremony',
  'cdw-170': 'ceremony',
  
  // Portraits section
  'cdw-174': 'portraits',
  'cdw-185': 'portraits',
  'cdw-186': 'portraits',
  'cdw-188': 'portraits',
  'cdw-198': 'portraits',
  'cdw-203': 'portraits',
  
  // Reception section
  'cdw-210': 'reception',
  'cdw-219': 'reception',
  'cdw-225': 'reception',
  'cdw-240': 'reception',
  'cdw-248': 'reception',
  'cdw-255': 'reception',
  'cdw-261': 'reception',
  'cdw-265': 'reception',
  'cdw-270': 'reception',
  'cdw-278': 'reception',
  'cdw-290': 'reception',
  'cdw-314': 'reception',
  'cdw-322': 'reception',
  'cdw-330': 'reception',
  'cdw-333': 'reception',
  'cdw-377': 'reception',
  'cdw-381': 'reception',
  'cdw-384': 'reception',
  'cdw-387': 'reception',
  'cdw-390': 'reception',
  'cdw-391': 'reception',
  'cdw-401': 'reception',
  'cdw-405': 'reception',
  'cdw-414': 'reception',
  'cdw-415': 'reception',
  'cdw-425': 'reception',
  'cdw-428': 'reception'
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

// Function to create portfolio entry in Firestore
const createPortfolioEntry = async (portfolioData) => {
  try {
    const portfolioRef = doc(db, 'portfolios', portfolioData.id);
    await setDoc(portfolioRef, {
      ...portfolioData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log(`Created portfolio entry with ID: ${portfolioData.id}`);
    return portfolioData.id;
  } catch (error) {
    console.error('Error creating portfolio entry:', error);
    throw error;
  }
};

// Function to add images to a portfolio
const addImagesToPortfolio = async (portfolioId, images) => {
  try {
    console.log(`Adding ${images.length} images to portfolio ${portfolioId}...`);
    
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const imageRef = doc(collection(db, 'portfolios', portfolioId, 'images'));
      
      await setDoc(imageRef, {
        ...image,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log(`Added image ${i+1}/${images.length} with ID: ${imageRef.id}`);
    }
    
    // Update the image count in the portfolio document
    const portfolioRef = doc(db, 'portfolios', portfolioId);
    await updateDoc(portfolioRef, {
      imageCount: images.length,
      updatedAt: serverTimestamp()
    });
    
    console.log(`Updated portfolio with image count: ${images.length}`);
  } catch (error) {
    console.error('Error adding images to portfolio:', error);
    throw error;
  }
};

// Main function to upload Crysta & David wedding photos
async function uploadCrystaDavidPortfolio() {
  try {
    console.log('Starting upload of Crysta & David wedding portfolio...');
    
    // Define the source directory for the images
    const sourceDir = path.resolve(__dirname, '../public/Crysta & David');
    
    // Check if the directory exists
    if (!fs.existsSync(sourceDir)) {
      throw new Error(`Source directory not found: ${sourceDir}`);
    }
    
    // Get all Crysta & David wedding images
    const files = fs.readdirSync(sourceDir)
      .filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'));
    
    console.log(`Found ${files.length} images to upload`);
    
    // Upload cover image first
    const coverImagePath = path.join(sourceDir, 'cdw-25.jpg');
    const coverImageUrl = await uploadImage(
      coverImagePath, 
      'portfolios/crysta-david/cover.jpg'
    );
    
    // Create portfolio entry
    const portfolioId = 'crysta-david';
    const portfolioData = {
      id: portfolioId,
      title: 'Crysta & David',
      subtitle: 'Romantic Countryside Wedding',
      slug: 'crysta-david',
      category: 'WEDDINGS',
      location: 'New Jersey',
      date: 'April 2025',
      coverImage: coverImageUrl,
      fallbackImage: '/images/placeholder-image.jpg',
      featured: true,
      description: 'A beautiful celebration of love surrounded by nature and heartfelt moments, showcasing the couple\'s journey and connection.',
      testimonial: '"Hariel captured the essence of our day perfectly. Every time we look at our photos, we relive those special moments all over again."',
      clientName: "Crysta & David",
      packageInfo: "Complete Collection",
      packageDetails: "Full-day coverage, engagement session, luxury album, and digital gallery",
      limitedAvailability: false,
      tags: ["Romantic", "Countryside", "Elegant", "Intimate"],
      imageCount: 0,
      sections: [
        {
          id: 'preparation',
          title: 'Getting Ready',
          description: 'The anticipation and excitement as the couple prepares for their special day.'
        },
        {
          id: 'ceremony',
          title: 'The Ceremony',
          description: 'A heartfelt exchange of vows surrounded by loved ones.'
        },
        {
          id: 'portraits',
          title: 'Couple Portraits',
          description: 'Intimate moments capturing the couple\'s connection and love.'
        },
        {
          id: 'reception',
          title: 'The Celebration',
          description: 'Joyful moments of celebration with family and friends.'
        }
      ]
    };
    
    await createPortfolioEntry(portfolioData);
    
    // Upload all images and create image entries
    const portfolioImages = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(sourceDir, file);
      const fileNameWithoutExt = path.basename(file, path.extname(file));
      
      // Define storage path
      const storagePath = `portfolios/${portfolioId}/images/${file}`;
      
      // Upload the image
      const imageUrl = await uploadImage(filePath, storagePath);
      
      // Determine section based on filename
      let section = 'reception'; // Default section
      
      // Check if the filename matches any of our section mappings
      for (const [prefix, sectionName] of Object.entries(sectionMap)) {
        if (fileNameWithoutExt === prefix) {
          section = sectionName;
          break;
        }
      }
      
      // Create image entry
      portfolioImages.push({
        id: fileNameWithoutExt,
        src: imageUrl,
        alt: `Crysta & David wedding - ${section}`,
        section: section,
        featured: i < 5, // First 5 images are featured
        width: 1200,
        height: 800,
        order: i
      });
    }
    
    // Add images to portfolio
    await addImagesToPortfolio(portfolioId, portfolioImages);
    
    console.log('Successfully uploaded Crysta & David wedding portfolio!');
    return portfolioId;
  } catch (error) {
    console.error('Error uploading portfolio:', error);
    throw error;
  }
}

// Run the function
uploadCrystaDavidPortfolio()
  .then(portfolioId => {
    console.log(`Portfolio created/updated successfully with ID: ${portfolioId}`);
    process.exit(0);
  })
  .catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
