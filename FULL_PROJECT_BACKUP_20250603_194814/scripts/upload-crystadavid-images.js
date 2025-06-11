/**
 * Script to upload Crysta & David wedding images to Firebase
 * Based on the file explorer screenshot showing cd1.jpg through cd64.jpg
 * Using Firebase Admin SDK for proper authentication
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import service account dynamically
const serviceAccountPath = path.resolve(__dirname, '../harielxavierphotography-18d17-firebase-adminsdk-fbsvc-7ce82ba6ec.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin SDK with service account
initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'harielxavierphotography-18d17.firebasestorage.app'
});

// Get Firestore and Storage instances
const db = getFirestore();
const bucket = getStorage().bucket();

// Helper function to upload an image to Firebase Storage
const uploadImage = async (filePath, storagePath) => {
  try {
    console.log(`Uploading ${filePath} to ${storagePath}...`);
    
    // Check if file exists locally
    if (!fs.existsSync(filePath)) {
      throw new Error(`Local file ${filePath} does not exist`);
    }
    
    // Upload file to Firebase Storage
    const [file] = await bucket.upload(filePath, {
      destination: storagePath,
      metadata: {
        contentType: getContentType(filePath),
        metadata: {
          isPublic: 'true',
          originalFilename: path.basename(filePath),
          size: fs.statSync(filePath).size.toString(),
          uploadDate: new Date().toISOString()
        }
      }
    });
    
    // Make the file publicly accessible
    await file.makePublic();
    
    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
    console.log(`Successfully uploaded to ${publicUrl}`);
    
    return publicUrl;
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error);
    throw error;
  }
};

/**
 * Get content type based on file extension
 * 
 * @param {string} filePath - Path to the file
 * @returns {string} - Content type
 */
function getContentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  
  switch (extension) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.svg':
      return 'image/svg+xml';
    case '.webp':
      return 'image/webp';
    case '.mp4':
      return 'video/mp4';
    case '.mov':
      return 'video/quicktime';
    case '.pdf':
      return 'application/pdf';
    default:
      return 'application/octet-stream';
  }
}

// Function to create portfolio entry in Firestore
const createPortfolioEntry = async (portfolioData) => {
  try {
    const portfolioRef = db.collection('portfolios').doc(portfolioData.id);
    await portfolioRef.set({
      ...portfolioData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
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
    // Update portfolio with image count
    const portfolioRef = db.collection('portfolios').doc(portfolioId);
    await portfolioRef.update({
      imageCount: images.length,
      updatedAt: Timestamp.now()
    });
    
    // Create a batch for Firestore
    const batch = db.batch();
    
    // Add each image to the portfolio's images collection
    for (const image of images) {
      const imageRef = db.collection('portfolios').doc(portfolioId).collection('images').doc(image.id);
      batch.set(imageRef, {
        ...image,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    }
    
    // Commit the batch
    await batch.commit();
    
    console.log(`Added ${images.length} images to portfolio ${portfolioId}`);
  } catch (error) {
    console.error('Error adding images to portfolio:', error);
    throw error;
  }
};

// Map sections based on image numbers
const getSectionForImage = (imageNumber) => {
  if (imageNumber <= 7) return 'portraits';
  if (imageNumber <= 12) return 'ceremony';
  if (imageNumber <= 19) return 'venue';
  if (imageNumber <= 30) return 'reception';
  if (imageNumber <= 40) return 'details';
  if (imageNumber <= 50) return 'portraits';
  return 'gallery'; // Default section
};

// Main function to upload Crysta & David wedding photos
const uploadCrystaDavidPortfolio = async () => {
  try {
    // Path to the Crysta & David images from the screenshot
    const sourceDir = '/Users/bigmo/Documents/Current Projects/HarielXavierPhotography Website Current/public/MoStuff/Portfolio/crystadavid';
    
    // Check if directory exists
    if (!fs.existsSync(sourceDir)) {
      throw new Error(`Source directory not found: ${sourceDir}`);
    }
    
    // Get all Crysta & David wedding images
    const files = fs.readdirSync(sourceDir)
      .filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'));
    
    console.log(`Found ${files.length} images to upload`);
    
    // Upload cover image first (using cd14.jpg as the cover based on your existing implementation)
    const coverImageFile = 'cd14.jpg';
    const coverImagePath = path.join(sourceDir, coverImageFile);
    const coverImageUrl = await uploadImage(
      coverImagePath, 
      `portfolios/crysta-david/cover.jpg`
    );
    
    // Create portfolio entry
    const portfolioId = 'crysta-david';
    const portfolioData = {
      id: portfolioId,
      title: 'Crysta & David',
      subtitle: 'Romantic Wedding at Skylands Manor',
      slug: 'crysta-david',
      category: 'WEDDINGS',
      location: 'Ringwood, New Jersey',
      venue: 'Skylands Manor',
      date: 'April 2025',
      coverImage: coverImageUrl,
      fallbackImage: '/images/portfolio/wedding-2.jpg',
      featured: true,
      description: 'A fairytale wedding at the historic Skylands Manor in Ringwood, New Jersey',
      testimonial: '"Hariel captured the essence of our day perfectly. Every time we look at our photos, we relive those special moments all over again."',
      clientName: "Crysta & David",
      packageInfo: "Complete Collection",
      packageDetails: "Full-day coverage, engagement session, luxury album, and digital gallery",
      limitedAvailability: false,
      tags: ["Romantic", "Castle", "Elegant", "Garden"],
      imageCount: 0,
      sections: [
        {
          id: 'portraits',
          title: 'Couple Portraits',
          description: 'Intimate moments capturing the couple\'s connection and love.'
        },
        {
          id: 'ceremony',
          title: 'The Ceremony',
          description: 'A heartfelt exchange of vows surrounded by loved ones.'
        },
        {
          id: 'venue',
          title: 'The Venue',
          description: 'The stunning Skylands Manor and its beautiful surroundings.'
        },
        {
          id: 'reception',
          title: 'The Celebration',
          description: 'Joyful moments of celebration with family and friends.'
        },
        {
          id: 'details',
          title: 'The Details',
          description: 'Beautiful details that made the day special.'
        },
        {
          id: 'gallery',
          title: 'Full Gallery',
          description: 'All the beautiful moments from the day.'
        }
      ]
    };
    
    await createPortfolioEntry(portfolioData);
    
    // Upload all images and create image entries
    const portfolioImages = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(sourceDir, file);
      
      // Extract the number from the filename (e.g., cd1.jpg -> 1)
      const fileNumber = parseInt(file.replace('cd', '').replace('.jpg', ''), 10);
      
      // Skip if not a valid number
      if (isNaN(fileNumber)) continue;
      
      // Define storage path
      const storagePath = `portfolios/${portfolioId}/images/${file}`;
      
      // Upload the image
      const imageUrl = await uploadImage(filePath, storagePath);
      
      // Determine section based on file number
      const section = getSectionForImage(fileNumber);
      
      // Create image entry
      portfolioImages.push({
        id: `crysta-david-${fileNumber}`,
        src: imageUrl,
        alt: `Crysta & David wedding - ${section}`,
        section: section,
        featured: fileNumber === 14 || fileNumber === 49, // Featured images
        width: 1200,
        height: 800,
        order: fileNumber
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
};

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
