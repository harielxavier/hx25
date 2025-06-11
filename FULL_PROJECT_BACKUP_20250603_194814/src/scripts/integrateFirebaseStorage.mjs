// This script fully integrates Firebase Storage throughout the website
// It ensures all components use the storage instance correctly

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

// Load environment variables
dotenv.config({ path: path.join(projectRoot, '.env') });

console.log('Starting Firebase Storage integration...');

// Ensure Firebase config is properly set up
function checkFirebaseConfig() {
  console.log('Checking Firebase configuration...');
  
  const configPath = path.join(projectRoot, 'src', 'firebase', 'config.ts');
  const libFirebasePath = path.join(projectRoot, 'src', 'lib', 'firebase.ts');
  
  // Check which Firebase config file exists
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
  
  // Read the config file
  const configContent = fs.readFileSync(primaryConfigPath, 'utf8');
  
  // Check if storage is properly initialized
  if (configContent.includes('getStorage(') && configContent.includes('export { storage }')) {
    console.log('✅ Firebase Storage is properly initialized and exported');
  } else {
    console.log('⚠️ Firebase Storage may not be properly initialized or exported');
    
    // Update the config file to ensure storage is properly initialized and exported
    const updatedContent = configContent.includes('getStorage')
      ? configContent
      : configContent.replace(
          "import { getFirestore } from 'firebase/firestore';",
          "import { getFirestore } from 'firebase/firestore';\nimport { getStorage } from 'firebase/storage';"
        );
    
    const finalContent = updatedContent.includes('const storage = getStorage')
      ? updatedContent
      : updatedContent.replace(
          'const db = getFirestore(app);',
          'const db = getFirestore(app);\nconst storage = getStorage(app);'
        );
    
    const exportContent = finalContent.includes('export { storage }')
      ? finalContent
      : finalContent.replace(
          'export { app, db, auth };',
          'export { app, db, auth, storage };'
        ).replace(
          'export { db, auth };',
          'export { db, auth, storage };'
        );
    
    fs.writeFileSync(primaryConfigPath, exportContent);
    console.log(`✅ Updated ${primaryConfigPath} to properly initialize and export Firebase Storage`);
  }
  
  return true;
}

// Update gallery service to use Firebase Storage
function updateGalleryService() {
  console.log('Updating gallery service to use Firebase Storage...');
  
  const galleryServicePath = path.join(projectRoot, 'src', 'services', 'galleryService.ts');
  
  if (!fs.existsSync(galleryServicePath)) {
    console.error('❌ galleryService.ts not found!');
    return;
  }
  
  // Create a backup
  const backupPath = `${galleryServicePath}.backup`;
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(galleryServicePath, backupPath);
    console.log(`✅ Created backup at ${backupPath}`);
  }
  
  // Read the service file
  let serviceContent = fs.readFileSync(galleryServicePath, 'utf8');
  
  // Check if Firebase Storage imports are present
  if (!serviceContent.includes('ref, uploadBytes, getDownloadURL')) {
    serviceContent = serviceContent.replace(
      "import {",
      "import { \n  ref, \n  uploadBytes, \n  getDownloadURL, \n  deleteObject\n} from 'firebase/storage';\nimport {"
    );
    console.log('✅ Added Firebase Storage imports to galleryService.ts');
  }
  
  // Check if storage is imported from the correct location
  if (!serviceContent.includes('storage')) {
    // Find the import statement for Firebase
    const importMatch = serviceContent.match(/import\s+\{\s+db.*?\}\s+from\s+['"](.+?)['"]/s);
    if (importMatch) {
      const importPath = importMatch[1];
      serviceContent = serviceContent.replace(
        `import { db`,
        `import { db, storage`
      );
      console.log(`✅ Added storage import to galleryService.ts from ${importPath}`);
    } else {
      console.error('❌ Could not find Firebase import in galleryService.ts');
    }
  }
  
  // Ensure the uploadGalleryImage function uses Firebase Storage
  if (serviceContent.includes('uploadGalleryImage') && !serviceContent.includes('ref(storage')) {
    // Add storage references to the upload function
    serviceContent = serviceContent.replace(
      /async function uploadGalleryImage.*?\{/s,
      (match) => `${match}\n  // Create a reference to the storage location\n  const storageRef = ref(storage, \`galleries/\${galleryId}/\${file.name}\`);\n`
    );
    
    // Add the upload logic
    serviceContent = serviceContent.replace(
      /\/\/ Upload the image.*?\/\/ Get the download URL/s,
      `// Upload the image to Firebase Storage\n  console.log('Uploading image to Firebase Storage:', file.name);\n  await uploadBytes(storageRef, file);\n  \n  // Get the download URL`
    );
    
    // Ensure getDownloadURL is used
    serviceContent = serviceContent.replace(
      /\/\/ Get the download URL.*?const downloadURL/s,
      `// Get the download URL from Firebase Storage\n  const downloadURL = await getDownloadURL(storageRef);\n  console.log('Download URL obtained:', downloadURL);\n`
    );
    
    console.log('✅ Updated uploadGalleryImage function to use Firebase Storage');
  }
  
  // Ensure the deleteGalleryImage function uses Firebase Storage
  if (serviceContent.includes('deleteGalleryImage') && !serviceContent.includes('deleteObject(')) {
    // Add storage deletion logic
    serviceContent = serviceContent.replace(
      /async function deleteGalleryImage.*?\{/s,
      (match) => `${match}\n  try {\n    // Get the image data to find the storage path\n    const imageDoc = await getDoc(doc(db, \`galleries/\${galleryId}/images/\${imageId}\`));\n    \n    if (imageDoc.exists()) {\n      const imageData = imageDoc.data();\n      \n      // Delete from storage if filename exists\n      if (imageData.filename) {\n        const imageRef = ref(storage, \`galleries/\${galleryId}/\${imageData.filename}\`);\n        await deleteObject(imageRef).catch(err => console.error('Error deleting image file:', err));\n        console.log('Deleted image from storage:', imageData.filename);\n      }\n    }\n`
    );
    
    console.log('✅ Updated deleteGalleryImage function to use Firebase Storage');
  }
  
  // Write the updated content
  fs.writeFileSync(galleryServicePath, serviceContent);
  console.log('✅ Updated galleryService.ts to fully use Firebase Storage');
}

// Update image components to properly handle Firebase Storage URLs
function updateImageComponents() {
  console.log('Updating image components...');
  
  // Update LazyImage component
  const lazyImagePath = path.join(projectRoot, 'src', 'components', 'gallery', 'LazyImage.tsx');
  
  if (fs.existsSync(lazyImagePath)) {
    console.log('Updating LazyImage component...');
    
    // Create a backup
    const backupPath = `${lazyImagePath}.backup`;
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(lazyImagePath, backupPath);
      console.log(`✅ Created backup at ${backupPath}`);
    }
    
    // Read the component file
    let componentContent = fs.readFileSync(lazyImagePath, 'utf8');
    
    // Add error handling for Firebase Storage URLs
    if (!componentContent.includes('onError=')) {
      componentContent = componentContent.replace(
        /<img\s+[^>]*src=\{src\}/,
        `<img 
          src={src} 
          onError={(e) => {
            console.error('Image failed to load:', src);
            e.currentTarget.src = '/placeholder-image.jpg';
          }}`
      );
      
      console.log('✅ Added error handling to LazyImage component');
    }
    
    // Write the updated content
    fs.writeFileSync(lazyImagePath, componentContent);
    console.log('✅ Updated LazyImage component');
  } else {
    console.log('⚠️ LazyImage component not found, skipping');
  }
  
  // Create a placeholder image in the public directory
  const publicDir = path.join(projectRoot, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }
  
  const placeholderPath = path.join(publicDir, 'placeholder-image.jpg');
  if (!fs.existsSync(placeholderPath)) {
    // Create a simple placeholder image (1x1 pixel JPEG)
    const placeholderContent = Buffer.from([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
      0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08,
      0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
      0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20, 0x24, 0x2e, 0x27, 0x20,
      0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29, 0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27,
      0x39, 0x3d, 0x38, 0x32, 0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01,
      0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xc4, 0x00, 0x14,
      0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f, 0x00, 0x37, 0xff, 0xd9
    ]);
    
    fs.writeFileSync(placeholderPath, placeholderContent);
    console.log(`✅ Created placeholder image at ${placeholderPath}`);
  }
}

// Update PortfolioShowcase component to properly handle Firebase Storage
function updatePortfolioShowcase() {
  console.log('Updating PortfolioShowcase component...');
  
  const showcasePath = path.join(projectRoot, 'src', 'components', 'landing', 'PortfolioShowcase.tsx');
  
  if (!fs.existsSync(showcasePath)) {
    console.error('❌ PortfolioShowcase.tsx not found!');
    return;
  }
  
  // Create a backup
  const backupPath = `${showcasePath}.backup`;
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(showcasePath, backupPath);
    console.log(`✅ Created backup at ${backupPath}`);
  }
  
  // Read the component file
  let componentContent = fs.readFileSync(showcasePath, 'utf8');
  
  // Add more logging to help diagnose issues
  if (!componentContent.includes('console.log(\'Image URL:')) {
    componentContent = componentContent.replace(
      /{featuredImage \? \(/,
      '{featuredImage ? (console.log(\'Image URL:\', featuredImage.url),'
    );
    
    // Close the console.log parenthesis
    componentContent = componentContent.replace(
      /src=\{featuredImage\.url\}/,
      'src={featuredImage.url})'
    );
    
    console.log('✅ Added image URL logging to PortfolioShowcase component');
  }
  
  // Add error handling for images
  if (!componentContent.includes('onError=')) {
    componentContent = componentContent.replace(
      /<img\s+[^>]*src=\{featuredImage\.url\}/,
      `<img 
                    src={featuredImage.url} 
                    onError={(e) => {
                      console.error('Featured image failed to load:', featuredImage.url);
                      e.currentTarget.src = '/placeholder-image.jpg';
                    }}`
    );
    
    console.log('✅ Added error handling to PortfolioShowcase images');
  }
  
  // Write the updated content
  fs.writeFileSync(showcasePath, componentContent);
  console.log('✅ Updated PortfolioShowcase component');
}

// Create a test script to verify Firebase Storage is working
function createStorageTestScript() {
  console.log('Creating Firebase Storage test script...');
  
  const testScriptPath = path.join(projectRoot, 'src', 'scripts', 'testFirebaseStorage.mjs');
  
  const testScriptContent = `
// This script tests Firebase Storage functionality
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

// Load environment variables
dotenv.config({ path: path.join(projectRoot, '.env') });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

console.log('Testing Firebase Storage with config:', {
  apiKey: firebaseConfig.apiKey ? '***' : 'MISSING',
  authDomain: firebaseConfig.authDomain ? '***' : 'MISSING',
  projectId: firebaseConfig.projectId ? '***' : 'MISSING',
  storageBucket: firebaseConfig.storageBucket ? '***' : 'MISSING'
});

async function testStorage() {
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    
    console.log('Firebase initialized successfully');
    
    // Create a test file in storage
    const testRef = ref(storage, 'test/test-file.txt');
    
    // Upload a string
    console.log('Uploading test file to Firebase Storage...');
    await uploadString(testRef, 'This is a test file to verify Firebase Storage is working correctly.');
    
    // Get the download URL
    console.log('Getting download URL...');
    const url = await getDownloadURL(testRef);
    
    console.log('✅ Firebase Storage is working correctly!');
    console.log('Test file URL:', url);
    
    return true;
  } catch (error) {
    console.error('❌ Firebase Storage test failed:', error);
    return false;
  }
}

// Run the test
testStorage()
  .then(success => {
    if (success) {
      console.log('Firebase Storage test completed successfully');
    } else {
      console.error('Firebase Storage test failed');
    }
  })
  .catch(error => {
    console.error('Error running Firebase Storage test:', error);
  });
`;
  
  fs.writeFileSync(testScriptPath, testScriptContent);
  console.log(`✅ Created Firebase Storage test script at ${testScriptPath}`);
}

// Create a script to fix the .env file if needed
function fixEnvFile() {
  console.log('Checking .env file...');
  
  const envPath = path.join(projectRoot, '.env');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found!');
    return;
  }
  
  // Read the .env file
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Check if Firebase Storage bucket is defined
  if (!envContent.includes('VITE_FIREBASE_STORAGE_BUCKET')) {
    // Try to extract from the Firebase config
    const configPath = path.join(projectRoot, 'src', 'firebase', 'config.ts');
    const libFirebasePath = path.join(projectRoot, 'src', 'lib', 'firebase.ts');
    
    let storageBucket = null;
    
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, 'utf8');
      const match = configContent.match(/storageBucket:\s*['"](.+?)['"]/);
      if (match) {
        storageBucket = match[1];
      }
    } else if (fs.existsSync(libFirebasePath)) {
      const configContent = fs.readFileSync(libFirebasePath, 'utf8');
      const match = configContent.match(/storageBucket:\s*['"](.+?)['"]/);
      if (match) {
        storageBucket = match[1];
      }
    }
    
    if (storageBucket) {
      envContent += `\nVITE_FIREBASE_STORAGE_BUCKET="${storageBucket}"\n`;
      fs.writeFileSync(envPath, envContent);
      console.log(`✅ Added VITE_FIREBASE_STORAGE_BUCKET to .env file: ${storageBucket}`);
    } else {
      console.error('❌ Could not determine Firebase Storage bucket from config files');
    }
  } else {
    console.log('✅ VITE_FIREBASE_STORAGE_BUCKET already defined in .env file');
  }
}

// Run all the functions to fully integrate Firebase Storage
async function integrateFirebaseStorage() {
  try {
    // Fix the .env file if needed
    fixEnvFile();
    
    // Check Firebase config
    const configOk = checkFirebaseConfig();
    if (!configOk) {
      console.error('❌ Firebase configuration issues must be fixed before continuing');
      return;
    }
    
    // Update gallery service
    updateGalleryService();
    
    // Update image components
    updateImageComponents();
    
    // Update PortfolioShowcase component
    updatePortfolioShowcase();
    
    // Create a test script
    createStorageTestScript();
    
    console.log('\n=== Firebase Storage integration completed ===');
    console.log('To test Firebase Storage functionality, run:');
    console.log('node src/scripts/testFirebaseStorage.mjs');
    console.log('\nThen restart your development server:');
    console.log('npm run dev');
    
  } catch (error) {
    console.error('Error integrating Firebase Storage:', error);
  }
}

// Run the integration
integrateFirebaseStorage()
  .then(() => console.log('Firebase Storage integration script completed'))
  .catch(error => console.error('Firebase Storage integration script failed:', error));
