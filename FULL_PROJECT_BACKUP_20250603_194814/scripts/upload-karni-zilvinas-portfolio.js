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
import dotenv from 'dotenv';

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

// Main function to upload Karni & Zilvinas wedding photos
async function uploadKarniZilvinasPortfolio() {
  try {
    console.log('Starting upload of Karni & Zilvinas wedding portfolio...');
    
    // Define the source directory for the images
    const sourceDir = path.join(process.cwd(), 'public', 'MoStuff', 'Portfolio', 'All Photos 2');
    
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
