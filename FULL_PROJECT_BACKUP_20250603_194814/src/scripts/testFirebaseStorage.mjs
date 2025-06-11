
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
