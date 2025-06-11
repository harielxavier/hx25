// Script to create an admin user for testing
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxZL40_7Enc-I9IwRt0DllOMqlMwneje8",
  authDomain: "harielxavierphotograph.firebaseapp.com",
  projectId: "harielxavierphotograph",
  storageBucket: "harielxavierphotograph.appspot.com",
  messagingSenderId: "829105046643",
  appId: "1:829105046643:web:6d22b9c17ac453472fd606",
  measurementId: "G-0TQFQH1YLC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Admin user credentials
const adminEmail = "admin@example.com";
const adminPassword = "Admin123!";

// Function to create admin user
async function createAdminUser() {
  try {
    console.log(`Attempting to create admin user: ${adminEmail}`);
    
    // Try to create the user
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
      console.log('Admin user created successfully:', userCredential.user.uid);
    } catch (error) {
      // If user already exists, try to sign in
      if (error.code === 'auth/email-already-in-use') {
        console.log('Admin user already exists, signing in...');
        userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
        console.log('Signed in as admin:', userCredential.user.uid);
      } else {
        throw error;
      }
    }
    
    // Add admin role to user in Firestore
    const userId = userCredential.user.uid;
    await setDoc(doc(db, 'users', userId), {
      email: adminEmail,
      role: 'admin',
      createdAt: new Date().toISOString()
    }, { merge: true });
    
    console.log(`Admin role assigned to user: ${userId}`);
    
    // Print credentials for the user
    console.log('\n===== ADMIN CREDENTIALS =====');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('=============================\n');
    
    return userCredential.user;
  } catch (error) {
    console.error('Error creating admin user:', error.code, error.message);
    return null;
  }
}

// Run the function
createAdminUser()
  .then(() => console.log('Admin user setup completed'))
  .catch(error => console.error('Admin user setup failed:', error));
