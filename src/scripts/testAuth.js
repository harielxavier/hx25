// Test script for Firebase authentication
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

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

// Test user credentials
const testEmail = "test@example.com";
const testPassword = "Test123!";

// Function to create a test user
async function createTestUser() {
  try {
    console.log(`Attempting to create test user: ${testEmail}`);
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    console.log('Test user created successfully:', userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error('Error creating test user:', error.code, error.message);
    
    // If user already exists, try to sign in
    if (error.code === 'auth/email-already-in-use') {
      console.log('User already exists, attempting to sign in...');
      return signInTest();
    }
    return null;
  }
}

// Function to test sign in
async function signInTest() {
  try {
    console.log(`Attempting to sign in with: ${testEmail}`);
    const userCredential = await signInWithEmailAndPassword(auth, testEmail, testPassword);
    console.log('Sign in successful:', userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error.code, error.message);
    return null;
  }
}

// Run the tests
async function runTests() {
  console.log('Starting Firebase authentication tests...');
  console.log('Firebase config:', firebaseConfig);
  
  try {
    // First try to sign in
    let user = await signInTest();
    
    // If sign in fails, try to create a user
    if (!user) {
      user = await createTestUser();
    }
    
    if (user) {
      console.log('Authentication test passed!');
    } else {
      console.log('Authentication test failed!');
    }
  } catch (error) {
    console.error('Unexpected error during tests:', error);
  }
}

// Execute the tests
runTests()
  .then(() => console.log('Tests completed'))
  .catch(error => console.error('Test execution failed:', error));
