/**
 * Test script to verify lead form submission by directly adding a test lead to Firestore
 * 
 * This script:
 * 1. Creates a test lead with unique identifiers
 * 2. Adds it directly to Firestore using the Firebase Web SDK
 * 3. Logs confirmation for verification
 */

// Import Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Firebase configuration from your project
const firebaseConfig = {
  apiKey: "AIzaSyAohXEBojJPIFKXd1KTPQSi-LE2VxLG3xg",
  authDomain: "hariel-xavier-photography.firebaseapp.com",
  projectId: "hariel-xavier-photography",
  storageBucket: "hariel-xavier-photography.appspot.com",
  messagingSenderId: "397018472516",
  appId: "1:397018472516:web:49b2915c257651262a29b5",
  measurementId: "G-DNMEK173KQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Test the lead submission process
 */
async function testLeadSubmission() {
  console.log('🧪 Starting lead submission test...');
  
  // Create a unique test identifier
  const testId = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const timestamp = new Date().toISOString();
  
  // Create test data that matches your lead structure
  const testLead = {
    firstName: 'Test',
    lastName: `User-${testId}`,
    email: `test-${testId}@example.com`,
    phone: '555-123-4567',
    eventType: 'wedding',
    eventDate: '2025-12-31',
    eventLocation: 'Test Venue, NJ',
    preferredStyle: ['Documentary', 'Traditional'],
    additionalInfo: `This is a test submission created at ${timestamp}`,
    hearAboutUs: 'google',
    source: 'test_script',
    status: 'new',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  
  console.log('📝 Created test lead:', testLead);
  
  try {
    // Add the lead directly to Firestore
    console.log('🚀 Adding test lead to Firestore...');
    const docRef = await addDoc(collection(db, 'leads'), testLead);
    
    console.log('✅ Test lead successfully added with ID:', docRef.id);
    console.log('\n🎉 Test completed successfully!');
    console.log('\n🔍 VERIFICATION:');
    console.log(`1. Check your Lead Management admin panel - you should see a new lead for ${testLead.firstName} ${testLead.lastName}`);
    console.log(`2. The lead will have the email: ${testLead.email}`);
    console.log(`3. The lead was created at: ${new Date().toLocaleString()}`);
    
    // Simulate email notifications that would be sent
    console.log('\n📧 In a real submission, emails would be sent to:');
    console.log(`   - Admin: info@harielxavier.com`);
    console.log(`   - Client: ${testLead.email}`);
    
    return { success: true, leadId: docRef.id, testLead };
    
  } catch (error) {
    console.error('❌ Test lead submission failed:', error);
    return { success: false, error };
  }
}

// Run the test
testLeadSubmission()
  .then(result => {
    if (result.success) {
      console.log('\n✅ TEST PASSED: The lead was successfully added to your system.');
      console.log('You should now be able to see the test lead in your Lead Management system.');
      console.log(`Lead ID: ${result.leadId}`);
    } else {
      console.log('\n❌ TEST FAILED: The lead could not be added to your system.');
      console.log('Please check the error message above for details.');
    }
  })
  .catch(error => {
    console.error('Error running test:', error);
  });
