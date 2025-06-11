// Simple Firebase connection test script
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Configure dotenv
config();

// Get current file path (ES modules don't have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test client-side Firebase connection
async function testClientConnection() {
  try {
    console.log('Testing client-side Firebase connection...');
    
    const { initializeApp } = await import('firebase/app');
    const { getFirestore, collection, addDoc, getDoc, doc, deleteDoc } = await import('firebase/firestore');
    
    // Initialize Firebase with config from env variables
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
    };
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Create a test document
    const testData = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Firebase client connection test'
    };
    
    // Add the test document to a test collection
    const docRef = await addDoc(collection(db, 'connection_tests'), testData);
    console.log('✅ Test document created with ID:', docRef.id);
    
    // Read the document back
    const docSnap = await getDoc(doc(db, 'connection_tests', docRef.id));
    
    if (docSnap.exists()) {
      console.log('✅ Successfully read test document:', docSnap.data());
      
      // Clean up - delete the test document
      await deleteDoc(doc(db, 'connection_tests', docRef.id));
      console.log('✅ Test document deleted');
      
      return 'CLIENT CONNECTION SUCCESSFUL! ✅';
    } else {
      throw new Error('Test document not found after creation');
    }
  } catch (error) {
    console.error('❌ Client-side Firebase connection test failed:', error);
    throw error;
  }
}

// Test Admin SDK connection
async function testAdminConnection() {
  try {
    console.log('\nTesting Firebase Admin SDK connection...');
    
    // Import firebase-admin using dynamic import
    const adminModule = await import('firebase-admin');
    const admin = adminModule.default;
    
    // Path to the service account key file
    const serviceAccountPath = resolve(__dirname, 'harielxavierphotography-18d17-firebase-adminsdk-fbsvc-7ce82ba6ec.json');
    
    // Initialize the admin app
    let adminApp;
    try {
      adminApp = admin.app('admin-test');
    } catch (e) {
      adminApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
        storageBucket: 'harielxavierphotography-18d17.firebasestorage.app'
      }, 'admin-test');
    }
    
    const adminFirestore = admin.firestore(adminApp);
    
    // Create a test document
    const testData = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Firebase Admin SDK connection test'
    };
    
    // Add the test document to a test collection
    const docRef = await adminFirestore.collection('admin_connection_tests').add(testData);
    console.log('✅ Admin test document created with ID:', docRef.id);
    
    // Read the document back
    const docSnap = await adminFirestore.collection('admin_connection_tests').doc(docRef.id).get();
    
    if (docSnap.exists) {
      console.log('✅ Successfully read admin test document:', docSnap.data());
      
      // Clean up - delete the test document
      await adminFirestore.collection('admin_connection_tests').doc(docRef.id).delete();
      console.log('✅ Admin test document deleted');
      
      return 'ADMIN SDK CONNECTION SUCCESSFUL! ✅';
    } else {
      throw new Error('Admin test document not found after creation');
    }
  } catch (error) {
    console.error('❌ Firebase Admin SDK connection test failed:', error);
    throw error;
  }
}

// Run both tests
async function runTests() {
  console.log('🔥 FIREBASE CONNECTION TESTS 🔥');
  console.log('===============================');
  
  try {
    const clientResult = await testClientConnection();
    console.log('\n' + clientResult);
    
    const adminResult = await testAdminConnection();
    console.log('\n' + adminResult);
    
    console.log('\n✅✅✅ ALL TESTS PASSED! Your Firebase configuration is working correctly! ✅✅✅');
  } catch (error) {
    console.error('\n❌ TESTS FAILED: Please check your Firebase configuration and service account key file.');
  }
}

runTests();
