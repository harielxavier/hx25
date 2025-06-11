// Script to update a lead's email address in Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

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

// Update the lead's email address
async function updateLeadEmail() {
  try {
    const leadId = 'LAODYctJj7fmdZt3U3kC';
    const leadRef = doc(db, 'leads', leadId);
    
    await updateDoc(leadRef, {
      email: 'missiongeek@gmail.com'
    });
    
    console.log(`Lead ${leadId} updated with email: missiongeek@gmail.com`);
  } catch (error) {
    console.error('Error updating lead:', error);
  }
}

// Run the function
updateLeadEmail();
