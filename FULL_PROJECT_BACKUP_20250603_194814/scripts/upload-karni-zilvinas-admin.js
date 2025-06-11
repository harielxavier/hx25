import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create require function
const require = createRequire(import.meta.url);

// Load service account credentials
const serviceAccount = require('../harielxavierphotography-18d17-firebase-adminsdk-fbsvc-7ce82ba6ec.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'harielxavierphotography-18d17.firebasestorage.app'
});

// Get references to Firestore and Storage
const db = admin.firestore();
const bucket = admin.storage().bucket();

// Helper function to upload an image to Firebase Storage
const uploadImage = async (filePath, storagePath) => {
  try {
    console.log(`Uploading ${filePath} to ${storagePath}...`);
    
    // Upload the file to Firebase Storage
    const [file] = await bucket.upload(filePath, {
      destination: storagePath,
      metadata: {
        contentType: 'image/jpeg',
        metadata: {
          originalFilename: path.basename(filePath),
          uploadDate: new Date().toISOString()
        }
      }
    });
    
    // Make the file publicly accessible
    await file.makePublic();
    
    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
    console.log(`Uploaded successfully. URL: ${publicUrl}`);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Function to create portfolio entry in Firestore
const createPortfolioEntry = async (portfolioData) => {
  try {
    const portfolioRef = db.collection('portfolios').doc(portfolioData.id);
    await portfolioRef.set({
      ...portfolioData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
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
    
    const batch = db.batch();
    
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const imageRef = db.collection('portfolios').doc(portfolioId).collection('images').doc(image.id);
      
      batch.set(imageRef, {
        ...image,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Only commit in batches of 500 (Firestore limit)
      if ((i + 1) % 500 === 0) {
        await batch.commit();
        console.log(`Committed batch ${Math.floor(i / 500) + 1}`);
      }
    }
    
    // Commit any remaining documents
    await batch.commit();
    
    // Update the image count in the portfolio document
    const portfolioRef = db.collection('portfolios').doc(portfolioId);
    await portfolioRef.update({
      imageCount: images.length,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`Updated portfolio with image count: ${images.length}`);
  } catch (error) {
    console.error('Error adding images to portfolio:', error);
    throw error;
  }
};

// Main function to upload Karni & Zilvinas wedding photos
async function uploadKarniZilvinasPortfolio() {
  try {
    console.log('Starting upload of Karni & Zilvinas wedding portfolio...');
    
    // Define the source directory for the images
    const sourceDir = path.join(path.dirname(__dirname), 'public', 'MoStuff', 'Portfolio', 'All Photos 2');
    
    // Check if the directory exists
    if (!fs.existsSync(sourceDir)) {
      throw new Error(`Source directory not found: ${sourceDir}`);
    }
    
    // Get all Karni & Zilvinas wedding images
    const files = fs.readdirSync(sourceDir)
      .filter(file => file.includes('Karni & Zilvinas Wedding') && file.endsWith('.jpg'));
    
    console.log(`Found ${files.length} images to upload`);
    
    // Upload cover image first
    const coverImagePath = path.join(sourceDir, 'Karni & Zilvinas Wedding (13).jpg');
    const coverImageUrl = await uploadImage(
      coverImagePath, 
      'portfolios/karni-zilvinas/cover.jpg'
    );
    
    // Create portfolio entry
    const portfolioId = 'karni-zilvinas';
    const portfolioData = {
      id: portfolioId,
      title: 'Karni & Zilvinas',
      subtitle: 'Luxury Venetian Wedding',
      slug: 'karni-zilvinas',
      category: 'WEDDINGS',
      location: 'The Venetian, NJ',
      coverImage: coverImageUrl,
      fallbackImage: '/images/portfolio/wedding-1-cover.jpg',
      featured: true,
      description: 'A spectacular celebration at <a href="https://www.venetiannj.com/" target="_blank" rel="noopener noreferrer" class="text-rose-300 hover:text-rose-400 transition-colors font-medium">The Venetian</a> in New Jersey, featuring opulent ballrooms, grand staircases, and exquisite architectural details that created the perfect backdrop for this elegant affair.',
      testimonial: "Hariel captured our special day with such artistry and attention to detail. Every time we look at our photos, we're transported back to those magical moments. The Masterpiece Package was absolutely worth it!",
      clientName: "Karni & Zilvinas",
      packageInfo: "Masterpiece Collection",
      packageDetails: "Full-day coverage, second photographer, engagement session, luxury album, and complete digital gallery",
      limitedAvailability: true,
      tags: ["Elegant", "Luxury", "Traditional", "Ballroom", "Venetian"],
      imageCount: 0,
      sections: [
        {
          id: 'gallery',
          title: 'Wedding Gallery',
          description: 'A collection of beautiful moments from this elegant Venetian wedding. Photos are arranged in chronological order from preparation to reception.',
        }
      ]
    };
    
    await createPortfolioEntry(portfolioData);
    
    // Upload all images and create image entries
    const portfolioImages = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(sourceDir, file);
      
      // Extract the image number from the filename
      const match = file.match(/\((\d+)\)/);
      const imageNumber = match ? match[1] : i + 1;
      
      // Define storage path
      const storagePath = `portfolios/${portfolioId}/images/karni-zilvinas-${imageNumber}.jpg`;
      
      // Upload the image
      const imageUrl = await uploadImage(filePath, storagePath);
      
      // Determine section based on image number
      let section = 'gallery';
      let featured = false;
      
      // Make some images featured
      if ([1, 4, 5, 8, 10, 11, 15, 20, 21, 22, 30, 35, 40, 42, 45, 47, 50].includes(Number(imageNumber))) {
        featured = true;
      }
      
      // Create image entry
      portfolioImages.push({
        id: `kz-${imageNumber}`,
        src: imageUrl,
        alt: `Karni & Zilvinas wedding photo ${imageNumber}`,
        section: section,
        featured: featured,
        width: 1200,
        height: 800,
        order: i
      });
    }
    
    // Add images to portfolio
    await addImagesToPortfolio(portfolioId, portfolioImages);
    
    console.log('Successfully uploaded Karni & Zilvinas wedding portfolio!');
    return portfolioId;
  } catch (error) {
    console.error('Error uploading portfolio:', error);
    throw error;
  }
}

// Run the function
uploadKarniZilvinasPortfolio()
  .then(portfolioId => {
    console.log(`Portfolio created/updated successfully with ID: ${portfolioId}`);
    process.exit(0);
  })
  .catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
