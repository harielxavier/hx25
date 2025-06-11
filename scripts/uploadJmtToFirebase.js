// Script to upload the jmt gallery to Firebase Storage
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import readline from 'readline';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase configuration from your project
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
const auth = getAuth(app);
const storage = getStorage(app);

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Source directory (local jmt folder)
const sourceDir = path.join(__dirname, '../public/MoStuff/jmt');

// Destination path in Firebase Storage
const destinationPath = 'galleries/jmt';

// Function to get file MIME type
function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

// Function to upload a single file
async function uploadFile(filePath, destination) {
  try {
    const filename = path.basename(filePath);
    const fileData = fs.readFileSync(filePath);
    const fileRef = ref(storage, `${destination}/${filename}`);
    
    // Set metadata including content type
    const metadata = {
      contentType: getMimeType(filename),
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        originalPath: filePath
      }
    };
    
    // Upload the file
    const snapshot = await uploadBytes(fileRef, fileData, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log(`✅ Uploaded ${filename} to ${destination}/${filename}`);
    console.log(`   Download URL: ${downloadURL}`);
    return downloadURL;
  } catch (error) {
    console.error(`❌ Error uploading ${filePath}:`, error);
    throw error;
  }
}

// Function to upload all files in a directory
async function uploadDirectory(sourceDir, destination) {
  try {
    // Check if directory exists
    if (!fs.existsSync(sourceDir)) {
      console.error(`❌ Source directory does not exist: ${sourceDir}`);
      return;
    }
    
    // Get all files in the directory
    const files = fs.readdirSync(sourceDir);
    console.log(`Found ${files.length} files in ${sourceDir}`);
    
    // Upload each file
    const uploadPromises = [];
    for (const file of files) {
      const filePath = path.join(sourceDir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isFile()) {
        uploadPromises.push(uploadFile(filePath, destination));
      } else if (stats.isDirectory()) {
        // Recursively upload subdirectories
        const subDir = path.basename(filePath);
        await uploadDirectory(filePath, `${destination}/${subDir}`);
      }
    }
    
    // Wait for all uploads to complete
    await Promise.all(uploadPromises);
    console.log(`✅ All files uploaded to ${destination}`);
  } catch (error) {
    console.error('❌ Error uploading directory:', error);
  }
}

// Prompt for email and password
function promptForCredentials() {
  return new Promise((resolve) => {
    rl.question('Enter your Firebase email: ', (email) => {
      rl.question('Enter your Firebase password: ', (password) => {
        resolve({ email, password });
      });
    });
  });
}

// Main function
async function main() {
  try {
    console.log('🔐 Authentication required for Firebase Storage uploads');
    const { email, password } = await promptForCredentials();
    
    // Sign in to Firebase
    console.log('🔑 Signing in to Firebase...');
    await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Authentication successful');
    
    // Start the upload process
    console.log('🚀 Starting upload of jmt gallery to Firebase Storage...');
    await uploadDirectory(sourceDir, destinationPath);
    
    console.log('✅ Upload completed successfully!');
    console.log('👉 Update your image paths to use the Firebase Storage URLs');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

// Run the main function
main();
