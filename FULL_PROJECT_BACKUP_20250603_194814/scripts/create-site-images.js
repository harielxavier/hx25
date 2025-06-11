import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin SDK with your service account
const serviceAccountPath = path.join(__dirname, '..', 'harielxavierphotography-18d17-firebase-adminsdk-fbsvc-7ce82ba6ec.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'harielxavierphotography-18d17.firebasestorage.app'
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

// Site images to create in Firestore
const siteImages = [
  {
    identifier: 'common.header.logo',
    description: 'Logo displayed in the site header/navigation',
    src: '/MoStuff/black.png', // Using existing path from code
    alt: 'Hariel Xavier Photography Logo',
    enableLightbox: false,
    width: 150, // Approximate values - adjust as needed
    height: 64  // Approximate values - adjust as needed
  },
  {
    identifier: 'landing.intro.portrait',
    description: 'Portrait image in the landing page intro section',
    src: '/MoStuff/portrait.jpg', // Using existing path from code
    alt: 'Hariel Xavier Portrait',
    enableLightbox: false
  },
  {
    identifier: 'landing.testimonials.background',
    description: 'Background image for the testimonials section on the landing page',
    src: '/images/backgroundclient.jpg', // Using existing path from code
    alt: 'Wedding testimonial background',
    enableLightbox: false
  },
  {
    identifier: 'landingPage.recentWeddings.thumbnail_1',
    description: 'First thumbnail in the Recent Weddings section',
    src: '/images/portfolio/wedding-1.jpg', // Placeholder path - replace with actual
    alt: 'Preview from a recent wedding celebration 1',
    enableLightbox: true
  },
  {
    identifier: 'landingPage.recentWeddings.thumbnail_2',
    description: 'Second thumbnail in the Recent Weddings section',
    src: '/images/portfolio/wedding-2.jpg', // Placeholder path - replace with actual
    alt: 'Preview from a recent wedding celebration 2',
    enableLightbox: true
  },
  {
    identifier: 'landingPage.recentWeddings.thumbnail_3',
    description: 'Third thumbnail in the Recent Weddings section',
    src: '/images/portfolio/wedding-3.jpg', // Placeholder path - replace with actual
    alt: 'Preview from a recent wedding celebration 3',
    enableLightbox: true
  },
  {
    identifier: 'about.hero.image',
    description: 'Background hero image on About page',
    src: '/images/about/hero-bg.jpg', // Placeholder path - replace with actual
    alt: 'About Hariel Xavier Photography',
    enableLightbox: false
  },
  {
    identifier: 'about.bio.portrait',
    description: 'Portrait image in the bio section of About page',
    src: '/MoStuff/portrait.jpg', // Using existing path from code
    alt: 'Hariel Xavier Portrait',
    enableLightbox: false
  },
  {
    identifier: 'about.studio.image',
    description: 'Image of the studio in the About page',
    src: '/images/about/studio.jpg', // Placeholder path - replace with actual
    alt: 'Hariel Xavier Photography Studio',
    enableLightbox: false
  },
  {
    identifier: 'weddingPhotography.hero.backgroundImage',
    description: 'Background hero image on Wedding Photography page',
    src: '/images/wedding/hero-bg.jpg', // From CSS file
    alt: 'Wedding Photography by Hariel Xavier',
    enableLightbox: false
  },
  {
    identifier: 'weddingPhotography.testimonials.coupleImage_1',
    description: 'First couple testimonial image on wedding page',
    src: '/images/testimonials/couple-1.jpg', // From code
    alt: 'Happy couple',
    enableLightbox: false
  }
];

// Function to create a single site image document
async function createSiteImageDocument(imageData) {
  try {
    // Check if document with this identifier already exists
    const existingDocs = await db.collection('site_images')
      .where('identifier', '==', imageData.identifier)
      .limit(1)
      .get();
    
    if (!existingDocs.empty) {
      console.log(`Image with identifier "${imageData.identifier}" already exists. Updating...`);
      const docId = existingDocs.docs[0].id;
      await db.collection('site_images').doc(docId).update({
        ...imageData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      return docId;
    } else {
      // Create new document
      const docRef = await db.collection('site_images').add({
        ...imageData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`Created image document "${imageData.identifier}" with ID: ${docRef.id}`);
      return docRef.id;
    }
  } catch (error) {
    console.error(`Error creating/updating site image "${imageData.identifier}":`, error);
    return null;
  }
}

// Main function to create all site images
async function createAllSiteImages() {
  console.log(`Creating/updating ${siteImages.length} site image documents...`);
  
  for (const imageData of siteImages) {
    await createSiteImageDocument(imageData);
  }
  
  console.log('Finished creating/updating site image documents!');
}

// Run the main function
createAllSiteImages()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
