/**
 * Script to upload Crysta & David wedding images to Firebase
 * This script will:
 * 1. Create a portfolio entry in Firestore
 * 2. Upload images to Firebase Storage
 * 3. Create image entries in Firestore with proper metadata
 * 4. Organize images into appropriate sections based on filename
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin SDK with your service account
// Make sure you have the firebase-admin-key.json file in your project root
try {
  const serviceAccountPath = path.join(__dirname, '../firebase-admin-key.json');
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'harielxavierphotography-18d17.firebasestorage.app'
  });
  console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
  process.exit(1);
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

// Portfolio ID for Crysta & David wedding
const portfolioId = 'crysta-david';

// Source directory containing the images
const sourceDir = path.resolve(__dirname, '../public/Crysta & David');

// Section mapping based on image filenames
// This maps specific image prefixes to their appropriate sections
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

// Create portfolio document in Firestore
async function createPortfolioDocument() {
  try {
    console.log(`Creating portfolio document for ${portfolioId}...`);
    
    const portfolioRef = db.collection('portfolios').doc(portfolioId);
    
    // Portfolio data following the structure from your FirebasePortfolioGallery component
    const portfolioData = {
      id: portfolioId,
      title: 'Crysta & David',
      subtitle: 'Romantic Countryside Wedding',
      slug: 'crysta-david',
      category: 'WEDDINGS',
      location: 'New Jersey',
      date: 'April 2025',
      coverImage: `https://storage.googleapis.com/harielxavierphotography-18d17.firebasestorage.app/portfolios/${portfolioId}/cdw-25.jpg`,
      fallbackImage: '/images/placeholder-image.jpg',
      featured: true,
      description: 'A beautiful celebration of love surrounded by nature and heartfelt moments, showcasing the couple\'s journey and connection.',
      testimonial: '"Hariel captured the essence of our day perfectly. Every time we look at our photos, we relive those special moments all over again."',
      clientName: "Crysta & David",
      packageInfo: "Complete Collection",
      packageDetails: "Full-day coverage, engagement session, luxury album, and digital gallery",
      limitedAvailability: false,
      tags: ["Romantic", "Countryside", "Elegant", "Intimate"],
      imageCount: Object.keys(sectionMap).length,
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
    
    await portfolioRef.set(portfolioData);
    console.log(`Portfolio document created successfully for ${portfolioId}`);
    
    return portfolioData;
  } catch (error) {
    console.error('Error creating portfolio document:', error);
    throw error;
  }
}

// Upload a single image to Firebase Storage
async function uploadImageToStorage(filePath, destination) {
  try {
    console.log(`Uploading ${path.basename(filePath)} to ${destination}...`);
    
    // Upload the file to Firebase Storage
    await bucket.upload(filePath, {
      destination,
      metadata: {
        contentType: `image/${path.extname(filePath).substring(1)}`
      }
    });
    
    // Get the public URL for the uploaded file
    const fileRef = bucket.file(destination);
    const [metadata] = await fileRef.getMetadata();
    const url = `https://storage.googleapis.com/${metadata.bucket}/${metadata.name}`;
    
    console.log(`Successfully uploaded ${path.basename(filePath)}`);
    return url;
  } catch (error) {
    console.error(`Error uploading ${path.basename(filePath)}:`, error);
    throw error;
  }
}

// Create an image document in Firestore
async function createImageDocument(portfolioId, imageId, imageData) {
  try {
    console.log(`Creating image document for ${imageId}...`);
    
    const imageRef = db.collection('portfolios').doc(portfolioId).collection('images').doc(imageId);
    await imageRef.set(imageData);
    
    console.log(`Image document created successfully for ${imageId}`);
    return imageData;
  } catch (error) {
    console.error(`Error creating image document for ${imageId}:`, error);
    throw error;
  }
}

// Main function to process all images
async function processImages() {
  try {
    console.log(`Starting to process images from ${sourceDir}`);
    
    // Check if source directory exists
    if (!fs.existsSync(sourceDir)) {
      console.error(`Source directory ${sourceDir} does not exist`);
      return;
    }
    
    // Get list of image files
    const files = fs.readdirSync(sourceDir).filter(file => 
      file.toLowerCase().endsWith('.jpg') || 
      file.toLowerCase().endsWith('.jpeg') || 
      file.toLowerCase().endsWith('.png')
    );
    
    console.log(`Found ${files.length} images to process`);
    
    if (files.length === 0) {
      console.log('No images found to process');
      return;
    }
    
    // Create portfolio document
    await createPortfolioDocument();
    
    // Process each image
    for (const [index, file] of files.entries()) {
      try {
        const filePath = path.join(sourceDir, file);
        const fileName = path.basename(file);
        const fileNameWithoutExt = path.basename(file, path.extname(file));
        
        // Determine section based on filename
        let section = 'reception'; // Default section
        
        // Check if the filename matches any of our section mappings
        for (const [prefix, sectionName] of Object.entries(sectionMap)) {
          if (fileNameWithoutExt === prefix) {
            section = sectionName;
            break;
          }
        }
        
        // Upload file to Firebase Storage
        const destination = `portfolios/${portfolioId}/${fileName}`;
        const imageUrl = await uploadImageToStorage(filePath, destination);
        
        // Create Firestore document for image
        const imageData = {
          id: fileNameWithoutExt,
          src: imageUrl,
          alt: `Crysta & David wedding - ${section}`,
          section,
          featured: index < 5, // First 5 images are featured
          width: 1200, // Default width, would be replaced with actual dimensions
          height: 800, // Default height, would be replaced with actual dimensions
          order: index
        };
        
        await createImageDocument(portfolioId, fileNameWithoutExt, imageData);
        
        console.log(`Successfully processed ${fileName} (${index + 1}/${files.length})`);
      } catch (error) {
        console.error(`Error processing ${file}:`, error);
        // Continue with next image
      }
    }
    
    console.log('All images processed successfully!');
  } catch (error) {
    console.error('Error processing images:', error);
  }
}

// Run the script
processImages().then(() => {
  console.log('Script completed');
  process.exit(0);
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});
