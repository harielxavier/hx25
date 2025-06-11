    // Script to create a final test lead to trigger the updated onLeadCreatedWithAdmin function with personalized emails
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
      firstName: 'Personalized',
      lastName: 'Email Test',
      email: 'missiongeek@gmail.com', // Use your email to receive the test email
      phone: '555-123-4567',
      eventType: 'wedding',
      eventDate: '2026-10-15',
      message: 'This is a test lead created to verify the updated onLeadCreatedWithAdmin function with personalized branded emails that reflect your brand better.',
      source: 'test_script',
      status: 'new',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'leads'), testLead);
    console.log('Test lead created with ID:', docRef.id);
    console.log('This should trigger the onLeadCreatedWithAdmin function with personalized branded emails.');
    console.log('Check your email for the confirmation and admin notification.');
  } catch (error) {
    console.error('Error creating test lead:', error);
  }
}

// Run the function
createTestLead();
