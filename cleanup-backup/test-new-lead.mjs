// Script to create a new test lead to trigger the onLeadCreatedWithAdmin function
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

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
const db = getFirestore(app);

// Create a test lead
async function createTestLead() {
  try {
    const testLead = {
      firstName: 'New',
      lastName: 'Test User',
      email: 'missiongeek@gmail.com', // Use your email to receive the test email
      phone: '555-987-6543',
      eventType: 'portrait',
      eventDate: '2026-01-15',
      message: 'This is a new test lead created to verify the onLeadCreatedWithAdmin function.',
      source: 'test_script',
      status: 'new',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'leads'), testLead);
    console.log('New test lead created with ID:', docRef.id);
    console.log('This should trigger the onLeadCreatedWithAdmin function.');
    console.log('Check your email for the confirmation and admin notification.');
  } catch (error) {
    console.error('Error creating test lead:', error);
  }
}

// Run the function
createTestLead();
