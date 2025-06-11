// This script fixes Firebase Storage configuration and creates sample galleries with images
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

// Load environment variables
dotenv.config({ path: path.join(projectRoot, '.env') });

console.log('Starting Firebase Storage fix...');

// Fix the .env file with correct Firebase config
function fixEnvFile() {
  console.log('Checking and fixing .env file...');
  
  const envPath = path.join(projectRoot, '.env');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    console.log('Found existing .env file');
  }
  
  // Ensure we have the correct Firebase config
  // Check if we need to update any values
  const firebaseConfig = {
    apiKey: "AIzaSyCxZL40_7Enc-I9IwRt0DllOMqlMwneje8",
    authDomain: "harielxavierphotograph.firebaseapp.com",
    projectId: "harielxavierphotograph",
    storageBucket: "harielxavierphotograph.appspot.com",
    messagingSenderId: "829105046643",
    appId: "1:829105046643:web:6d22b9c17ac453472fd606",
    measurementId: "G-0TQFQH1YLC"
  };
  
  // Create a new .env content with the correct values
  let newEnvContent = '';
  let updated = false;
  
  // Helper function to update or add an environment variable
  const updateEnvVar = (name, value) => {
    const regex = new RegExp(`^${name}=.*`, 'm');
    if (envContent.match(regex)) {
      // Update existing variable
      envContent = envContent.replace(regex, `${name}="${value}"`);
      updated = true;
    } else {
      // Add new variable
      newEnvContent += `${name}="${value}"\n`;
      updated = true;
    }
  };
  
  // Update Firebase config variables
  updateEnvVar('VITE_FIREBASE_API_KEY', firebaseConfig.apiKey);
  updateEnvVar('VITE_FIREBASE_AUTH_DOMAIN', firebaseConfig.authDomain);
  updateEnvVar('VITE_FIREBASE_PROJECT_ID', firebaseConfig.projectId);
  updateEnvVar('VITE_FIREBASE_STORAGE_BUCKET', firebaseConfig.storageBucket);
  updateEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID', firebaseConfig.messagingSenderId);
  updateEnvVar('VITE_FIREBASE_APP_ID', firebaseConfig.appId);
  updateEnvVar('VITE_FIREBASE_MEASUREMENT_ID', firebaseConfig.measurementId);
  
  // Write the updated .env file
  fs.writeFileSync(envPath, envContent + newEnvContent);
  
  if (updated) {
    console.log('✅ Updated .env file with correct Firebase configuration');
  } else {
    console.log('✅ .env file already has correct Firebase configuration');
  }
}

// Fix the Firebase config file
function fixFirebaseConfig() {
  console.log('Fixing Firebase configuration...');
  
  // Check both possible locations for Firebase config
  const configPath = path.join(projectRoot, 'src', 'firebase', 'config.ts');
  const libFirebasePath = path.join(projectRoot, 'src', 'lib', 'firebase.ts');
  
  let primaryConfigPath = null;
  
  if (fs.existsSync(configPath)) {
    primaryConfigPath = configPath;
    console.log(`Found Firebase config at: ${configPath}`);
  } else if (fs.existsSync(libFirebasePath)) {
    primaryConfigPath = libFirebasePath;
    console.log(`Found Firebase config at: ${libFirebasePath}`);
  } else {
    console.error('❌ No Firebase configuration file found!');
    return false;
  }
  
  // Create a backup of the config file
  const backupPath = `${primaryConfigPath}.original`;
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(primaryConfigPath, backupPath);
    console.log(`✅ Created backup at ${backupPath}`);
  }
  
  // Read the config file
  let configContent = fs.readFileSync(primaryConfigPath, 'utf8');
  
  // Update the Firebase config to use hardcoded values if needed
  // This ensures it works even if environment variables are missing
  if (configContent.includes('import.meta.env.VITE_FIREBASE')) {
    const updatedConfig = `// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase configuration with hardcoded values for development
// In production, use environment variables
const firebaseConfig = {
  apiKey: "AIzaSyCxZL40_7Enc-I9IwRt0DllOMqlMwneje8",
  authDomain: "harielxavierphotograph.firebaseapp.com",
  projectId: "harielxavierphotograph",
  storageBucket: "harielxavierphotograph.appspot.com",
  messagingSenderId: "829105046643",
  appId: "1:829105046643:web:6d22b9c17ac453472fd606",
  measurementId: "G-0TQFQH1YLC"
};

console.log('Firebase config loaded with storage bucket:', firebaseConfig.storageBucket);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
`;
    
    fs.writeFileSync(primaryConfigPath, updatedConfig);
    console.log('✅ Updated Firebase config with hardcoded values for development');
  } else {
    console.log('✅ Firebase config is already using hardcoded values');
  }
  
  return true;
}

// Update the gallery service to properly use Firebase Storage
function fixGalleryService() {
  console.log('Fixing gallery service...');
  
  const galleryServicePath = path.join(projectRoot, 'src', 'services', 'galleryService.ts');
  
  if (!fs.existsSync(galleryServicePath)) {
    console.error('❌ galleryService.ts not found!');
    return;
  }
  
  // Create a backup
  const backupPath = `${galleryServicePath}.original`;
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(galleryServicePath, backupPath);
    console.log(`✅ Created backup at ${backupPath}`);
  }
  
  // Read the service file
  let serviceContent = fs.readFileSync(galleryServicePath, 'utf8');
  
  // Fix the getFeaturedGalleryImages function to add more logging
  if (serviceContent.includes('getFeaturedGalleryImages')) {
    serviceContent = serviceContent.replace(
      /export const getFeaturedGalleryImages = async \(galleryId: string\): Promise<GalleryImage\[\]> => {/,
      `export const getFeaturedGalleryImages = async (galleryId: string): Promise<GalleryImage[]> => {
  console.log('Getting featured images for gallery:', galleryId);`
    );
    
    // Add logging after getting the images
    serviceContent = serviceContent.replace(
      /return querySnapshot\.docs\.map\(doc => \({/,
      `const images = querySnapshot.docs.map(doc => ({`
    );
    
    serviceContent = serviceContent.replace(
      /\} as GalleryImage\)\);/,
      `} as GalleryImage));
      
      console.log(\`Found \${images.length} featured images for gallery \${galleryId}\`);
      
      // Log the first image URL if available
      if (images.length > 0) {
        console.log('First image URL:', images[0].url);
      }
      
      return images;`
    );
    
    console.log('✅ Added logging to getFeaturedGalleryImages function');
  }
  
  // Fix the getFeaturedGalleries function to add more logging
  if (serviceContent.includes('getFeaturedGalleries')) {
    serviceContent = serviceContent.replace(
      /export const getFeaturedGalleries = async \(\): Promise<Gallery\[\]> => {/,
      `export const getFeaturedGalleries = async (): Promise<Gallery[]> => {
  console.log('Getting featured galleries');`
    );
    
    // Add logging after getting the galleries
    serviceContent = serviceContent.replace(
      /return querySnapshot\.docs\.map\(doc => \({/,
      `const galleries = querySnapshot.docs.map(doc => ({`
    );
    
    serviceContent = serviceContent.replace(
      /\} as Gallery\)\);/,
      `} as Gallery));
      
      console.log(\`Found \${galleries.length} featured galleries\`);
      
      // Log gallery IDs
      if (galleries.length > 0) {
        console.log('Gallery IDs:', galleries.map(g => g.id).join(', '));
      }
      
      return galleries;`
    );
    
    console.log('✅ Added logging to getFeaturedGalleries function');
  }
  
  // Write the updated content
  fs.writeFileSync(galleryServicePath, serviceContent);
  console.log('✅ Updated galleryService.ts with improved logging');
}

// Create a script to create sample galleries and images
function createSampleGalleriesScript() {
  console.log('Creating sample galleries script...');
  
  const sampleScriptPath = path.join(projectRoot, 'src', 'scripts', 'createSampleGalleries.mjs');
  
  const sampleScriptContent = `
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
      console.log(\`Creating gallery: \${galleryData.title}\`);
      
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
      
      console.log(\`Created gallery with ID: \${galleryId}\`);
      
      // Create 3 sample images for each gallery
      for (let i = 1; i <= 3; i++) {
        console.log(\`Creating image \${i} for gallery \${galleryId}\`);
        
        // Upload image to Firebase Storage
        const imageName = \`sample-image-\${i}.jpg\`;
        const imageRef = ref(storage, \`galleries/\${galleryId}/\${imageName}\`);
        
        // Upload the base64 image
        await uploadString(imageRef, sampleImageBase64, 'data_url');
        
        // Get the download URL
        const downloadURL = await getDownloadURL(imageRef);
        
        console.log(\`Image uploaded, URL: \${downloadURL}\`);
        
        // Add image metadata to Firestore
        const imageRef2 = doc(collection(db, \`galleries/\${galleryId}/images\`));
        await setDoc(imageRef2, {
          id: imageRef2.id,
          url: downloadURL,
          thumbnailUrl: downloadURL,
          filename: imageName,
          title: \`Sample Image \${i}\`,
          description: \`This is sample image \${i} for gallery \${galleryData.title}\`,
          featured: i === 1, // Make the first image featured
          order: i,
          width: 100,
          height: 100,
          size: 1024,
          createdAt: Timestamp.now(),
          tags: galleryData.tags
        });
        
        console.log(\`Added image metadata to Firestore\`);
        
        // If this is the first image, use it as the gallery cover
        if (i === 1) {
          await setDoc(galleryRef, {
            coverImage: downloadURL,
            thumbnailImage: downloadURL,
            imageCount: 3
          }, { merge: true });
          
          console.log(\`Updated gallery \${galleryId} with cover image\`);
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
`;
  
  fs.writeFileSync(sampleScriptPath, sampleScriptContent);
  console.log(`✅ Created sample galleries script at ${sampleScriptPath}`);
}

// Create a script to verify Firebase Storage is working
function createStorageVerificationScript() {
  console.log('Creating Firebase Storage verification script...');
  
  const verificationScriptPath = path.join(projectRoot, 'src', 'scripts', 'verifyFirebaseStorage.mjs');
  
  const verificationScriptContent = `
// This script verifies that Firebase Storage is working correctly
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
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

console.log('Verifying Firebase Storage with config:', {
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket
});

// Function to verify Firebase Storage
async function verifyFirebaseStorage() {
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const storage = getStorage(app);
    
    console.log('Firebase initialized successfully');
    
    // Check for featured galleries
    console.log('Checking for featured galleries...');
    const galleriesRef = collection(db, 'galleries');
    const featuredQuery = query(
      galleriesRef, 
      where('featured', '==', true),
      orderBy('order', 'asc')
    );
    
    const querySnapshot = await getDocs(featuredQuery);
    
    if (querySnapshot.empty) {
      console.log('No featured galleries found. You may need to run the createSampleGalleries.mjs script.');
      return false;
    }
    
    console.log(\`Found \${querySnapshot.size} featured galleries:\`);
    
    // Check each gallery for images
    for (const galleryDoc of querySnapshot.docs) {
      const gallery = { id: galleryDoc.id, ...galleryDoc.data() };
      console.log(\`Gallery: \${gallery.title} (ID: \${gallery.id})\`);
      
      // Check if cover image exists
      if (gallery.coverImage) {
        console.log(\`Cover image URL: \${gallery.coverImage}\`);
        
        try {
          // Try to access the image directly
          const response = await fetch(gallery.coverImage);
          if (response.ok) {
            console.log('✅ Cover image is accessible');
          } else {
            console.error(\`❌ Cover image returned status: \${response.status}\`);
          }
        } catch (error) {
          console.error('❌ Error accessing cover image:', error.message);
        }
      } else {
        console.log('❌ No cover image set for this gallery');
      }
      
      // Check for featured images
      console.log(\`Checking for featured images in gallery \${gallery.id}...\`);
      const imagesRef = collection(db, \`galleries/\${gallery.id}/images\`);
      const featuredImagesQuery = query(
        imagesRef, 
        where('featured', '==', true),
        orderBy('order', 'asc')
      );
      
      const imagesSnapshot = await getDocs(featuredImagesQuery);
      
      if (imagesSnapshot.empty) {
        console.log('No featured images found in this gallery.');
        continue;
      }
      
      console.log(\`Found \${imagesSnapshot.size} featured images:\`);
      
      // Check each image
      for (const imageDoc of imagesSnapshot.docs) {
        const image = { id: imageDoc.id, ...imageDoc.data() };
        console.log(\`Image: \${image.title || 'Untitled'} (ID: \${image.id})\`);
        console.log(\`Image URL: \${image.url}\`);
        
        try {
          // Try to access the image directly
          const response = await fetch(image.url);
          if (response.ok) {
            console.log('✅ Image is accessible');
          } else {
            console.error(\`❌ Image returned status: \${response.status}\`);
          }
        } catch (error) {
          console.error('❌ Error accessing image:', error.message);
        }
      }
    }
    
    console.log('✅ Firebase Storage verification completed');
    return true;
  } catch (error) {
    console.error('❌ Error verifying Firebase Storage:', error);
    return false;
  }
}

// Run the verification
verifyFirebaseStorage()
  .then(success => {
    if (success) {
      console.log('Firebase Storage verification completed successfully');
    } else {
      console.error('Firebase Storage verification failed');
    }
  })
  .catch(error => {
    console.error('Error running Firebase Storage verification:', error);
  });
`;
  
  fs.writeFileSync(verificationScriptPath, verificationScriptContent);
  console.log(`✅ Created Firebase Storage verification script at ${verificationScriptPath}`);
}

// Run all the functions to fix Firebase Storage
async function fixFirebaseStorage() {
  try {
    // Fix the .env file
    fixEnvFile();
    
    // Fix the Firebase config
    fixFirebaseConfig();
    
    // Fix the gallery service
    fixGalleryService();
    
    // Create sample galleries script
    createSampleGalleriesScript();
    
    // Create storage verification script
    createStorageVerificationScript();
    
    console.log('\n=== Firebase Storage fix completed ===');
    console.log('Next steps:');
    console.log('1. Run the sample galleries script to create test data:');
    console.log('   node src/scripts/createSampleGalleries.mjs');
    console.log('2. Verify Firebase Storage is working:');
    console.log('   node src/scripts/verifyFirebaseStorage.mjs');
    console.log('3. Restart your development server:');
    console.log('   npm run dev');
    
  } catch (error) {
    console.error('Error fixing Firebase Storage:', error);
  }
}

// Run the fix
fixFirebaseStorage()
  .then(() => console.log('Firebase Storage fix script completed'))
  .catch(error => console.error('Firebase Storage fix script failed:', error));
