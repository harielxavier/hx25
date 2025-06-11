/**
 * Script to upload Crysta & David wedding images to Firebase Storage
 * and create the appropriate Firestore entries
 */
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccount = require('../firebase-admin-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'harielxavierphotography-18d17.firebasestorage.app'
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

// Portfolio ID for Crysta & David
const portfolioId = 'crysta-david';

// Source directory containing the images
const sourceDir = '/Users/bigmo/Documents/Current Projects/HarielXavierPhotography Website Current/public/Crysta & David';

// Map of image prefixes to sections
const sectionMap = {
  'cdw-25': 'preparation',
  'cdw-55': 'preparation',
  'cdw-64': 'preparation',
  'cdw-127': 'ceremony',
  'cdw-160': 'ceremony',
  'cdw-169': 'ceremony',
  'cdw-170': 'ceremony',
  'cdw-174': 'portraits',
  'cdw-185': 'portraits',
  'cdw-186': 'portraits',
  'cdw-188': 'portraits',
  'cdw-198': 'portraits',
  'cdw-203': 'portraits',
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

// Create portfolio document if it doesn't exist
async function createPortfolio() {
  const portfolioRef = db.collection('portfolios').doc(portfolioId);
  
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
  console.log(`Created portfolio document for ${portfolioId}`);
}

// Upload images to Firebase Storage and create Firestore entries
async function uploadImages() {
  // Get list of image files
  const files = fs.readdirSync(sourceDir).filter(file => 
    file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
  );
  
  console.log(`Found ${files.length} images to upload`);
  
  // Create portfolio document
  await createPortfolio();
  
  // Upload each image
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
      await bucket.upload(filePath, {
        destination,
        metadata: {
          contentType: `image/${path.extname(file).substring(1)}`
        }
      });
      
      // Get public URL
      const fileRef = bucket.file(destination);
      const [metadata] = await fileRef.getMetadata();
      const url = `https://storage.googleapis.com/${metadata.bucket}/${metadata.name}`;
      
      // Create Firestore document for image
      const imageRef = db.collection('portfolios').doc(portfolioId).collection('images').doc(fileNameWithoutExt);
      
      const imageData = {
        id: fileNameWithoutExt,
        src: url,
        alt: `Crysta & David wedding - ${section}`,
        section,
        featured: index < 5, // First 5 images are featured
        width: 1200, // Default width, would be replaced with actual dimensions
        height: 800, // Default height, would be replaced with actual dimensions
        order: index
      };
      
      await imageRef.set(imageData);
      console.log(`Uploaded and created document for ${fileName}`);
      
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }
  
  console.log('Upload complete!');
}

// Run the upload process
uploadImages().catch(console.error);
