import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load service account key
const serviceAccountPath = path.join(__dirname, '../harielxavierphotography-18d17-firebase-adminsdk-fbsvc-7ce82ba6ec.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

const auth = getAuth();

// Create test admin user
async function createTestAdmin() {
  try {
    // Email and password for the test admin
    const email = 'admin@example.com';
    const password = 'Test123!';
    
    // Create user with admin custom claims
    const userRecord = await auth.createUser({
      email,
      password,
      emailVerified: true,
      displayName: 'Test Admin'
    });
    
    // Set admin custom claims
    await auth.setCustomUserClaims(userRecord.uid, {
      admin: true
    });
    
    console.log(`Successfully created admin user: ${email}`);
    console.log(`User ID: ${userRecord.uid}`);
    console.log(`Password: ${password}`);
    console.log('You can now use these credentials to log in to the admin panel');
    
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      console.log('Admin user already exists. You can use the existing credentials to log in.');
    } else {
      console.error('Error creating admin user:', error);
    }
  }
}

createTestAdmin();
