import { db } from '../firebase/config';
import { collection, addDoc, getDoc, doc, deleteDoc } from 'firebase/firestore';
import { adminFirestore } from '../lib/firebase-admin';

/**
 * Tests the client-side Firebase connection
 * @returns Promise that resolves to a success message or rejects with an error
 */
export const testClientConnection = async (): Promise<string> => {
  try {
    console.log('Testing client-side Firebase connection...');
    
    // Create a test document
    const testData = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Firebase client connection test'
    };
    
    // Add the test document to a test collection
    const docRef = await addDoc(collection(db, 'connection_tests'), testData);
    console.log('Test document created with ID:', docRef.id);
    
    // Read the document back
    const docSnap = await getDoc(doc(db, 'connection_tests', docRef.id));
    
    if (docSnap.exists()) {
      console.log('Successfully read test document:', docSnap.data());
      
      // Clean up - delete the test document
      await deleteDoc(doc(db, 'connection_tests', docRef.id));
      console.log('Test document deleted');
      
      return 'Client-side Firebase connection successful!';
    } else {
      throw new Error('Test document not found after creation');
    }
  } catch (error) {
    console.error('Client-side Firebase connection test failed:', error);
    throw error;
  }
};

/**
 * Tests the server-side Firebase Admin SDK connection
 * @returns Promise that resolves to a success message or rejects with an error
 */
export const testAdminConnection = async (): Promise<string> => {
  try {
    console.log('Testing Firebase Admin SDK connection...');
    
    // Create a test document
    const testData = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Firebase Admin SDK connection test'
    };
    
    // Add the test document to a test collection
    const docRef = await adminFirestore.collection('admin_connection_tests').add(testData);
    console.log('Admin test document created with ID:', docRef.id);
    
    // Read the document back
    const docSnap = await adminFirestore.collection('admin_connection_tests').doc(docRef.id).get();
    
    if (docSnap.exists) {
      console.log('Successfully read admin test document:', docSnap.data());
      
      // Clean up - delete the test document
      await adminFirestore.collection('admin_connection_tests').doc(docRef.id).delete();
      console.log('Admin test document deleted');
      
      return 'Firebase Admin SDK connection successful!';
    } else {
      throw new Error('Admin test document not found after creation');
    }
  } catch (error) {
    console.error('Firebase Admin SDK connection test failed:', error);
    throw error;
  }
};

/**
 * Run both client and admin connection tests
 */
export const runConnectionTests = async (): Promise<void> => {
  try {
    // Test client connection
    const clientResult = await testClientConnection();
    console.log(clientResult);
    
    // Test admin connection
    const adminResult = await testAdminConnection();
    console.log(adminResult);
    
    console.log('All Firebase connection tests passed! Your database is fully configured.');
  } catch (error) {
    console.error('Firebase connection tests failed:', error);
  }
};
