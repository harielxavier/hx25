// Test script to verify date availability checking in lead emails
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseConfig } from './src/firebase/config.ts';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to create a test lead with a wedding date
async function createTestLeadWithDate() {
  try {
    // Create a date string in YYYY-MM-DD format
    // For testing, we'll use a date that should be available and one that should be booked
    // Based on the mock data in admin-email.ts
    
    // This date should be available (not in the booked dates list)
    const availableDate = '2025-05-15'; // May 15, 2025
    
    // This date should be booked (in the booked dates list)
    const bookedDate = '2025-05-17'; // May 17, 2025
    
    // Choose which date to test
    const testDate = availableDate; // Testing with a date that should be available
    
    // Create lead data
    const leadData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'missiongeek@gmail.com', // Use your email for testing
      phone: '555-123-4567',
      eventType: 'wedding',
      eventDate: testDate,
      message: 'This is a test lead to verify date availability checking.',
      status: 'new',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      convertedToClient: false,
      convertedToJob: false,
      leadSource: 'test_script'
    };
    
    // Add document to leads collection
    const docRef = await addDoc(collection(db, 'leads'), leadData);
    
    console.log(`Test lead created with ID: ${docRef.id}`);
    console.log(`Test date: ${testDate}`);
    console.log('Check your email to see if the availability message is included.');
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating test lead:', error);
    throw error;
  }
}

// Run the test
createTestLeadWithDate()
  .then((leadId) => {
    console.log('Test completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
  });
