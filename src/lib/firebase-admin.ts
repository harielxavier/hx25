import * as admin from 'firebase-admin';
import * as path from 'path';

// Path to the service account key file
const serviceAccountPath = path.resolve(__dirname, '../../harielxavierphotography-18d17-firebase-adminsdk-fbsvc-7ce82ba6ec.json');

// Initialize the admin app with a different name to avoid conflicts
try {
  // Check if the admin app already exists
  let adminApp;
  try {
    adminApp = admin.app('admin');
  } catch (e) {
    // App doesn't exist yet, initialize it
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
      storageBucket: 'harielxavierphotography-18d17.firebasestorage.app'
    }, 'admin');
    console.log('Firebase Admin SDK initialized successfully with new project credentials');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
}

// Get the admin app instance
const adminApp = admin.app('admin');

// Export the admin services using the admin app instance
export const adminAuth = admin.auth(adminApp);
export const adminFirestore = admin.firestore(adminApp);
export const adminStorage = admin.storage(adminApp);

export default admin;
