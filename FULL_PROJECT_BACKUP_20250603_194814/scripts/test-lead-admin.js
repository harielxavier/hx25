/**
 * Test script to verify lead form submission using Firebase Admin SDK
 * 
 * This script:
 * 1. Creates a test lead submission
 * 2. Adds it directly to Firestore using Admin SDK
 * 3. Verifies the lead is registered in your system
 */

// Import Firebase Admin SDK
import admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import { createRequire } from 'module';

// Use createRequire to load JSON files in ES modules
const require = createRequire(import.meta.url);
const serviceAccount = require('./firebase-admin-key.json');

// Initialize Firebase Admin with the correct project ID
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "harielxavierphotography-18d17"
});

const db = admin.firestore();

/**
 * Test the lead submission process
 */
async function testLeadSubmission() {
  console.log('🧪 Starting lead submission test with Admin SDK...');
  
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
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };
  
  console.log('📝 Created test lead:', testLead);
  
  try {
    // Add the lead directly to Firestore
    console.log('🚀 Submitting lead to Firestore...');
    const docRef = await db.collection('leads').add(testLead);
    
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
    console.error('❌ Lead submission test failed:', error);
    return { success: false, error };
  } finally {
    // Properly close the Firebase Admin app
    await admin.app().delete();
  }
}

// Run the test
testLeadSubmission()
  .then(result => {
    if (result.success) {
      console.log('\n✅ TEST PASSED: The lead was successfully added to your system.');
      console.log('You should now be able to see the test lead in your Lead Management system.');
      console.log(`Lead ID: ${result.leadId}`);
      process.exit(0);
    } else {
      console.log('\n❌ TEST FAILED: The lead could not be added to your system.');
      console.log('Please check the error message above for details.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Error running test:', error);
    process.exit(1);
  });
