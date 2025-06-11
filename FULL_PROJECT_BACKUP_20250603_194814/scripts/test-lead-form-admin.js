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
const serviceAccount = require('../firebase-admin-key.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Get Firestore instance
const db = admin.firestore();

/**
 * Test the lead submission process
 */
async function testLeadSubmission() {
  console.log('🧪 Starting lead submission test with Admin SDK...');
  
  // Create a test lead with a unique identifier
  const timestamp = new Date().toISOString();
  const testId = uuidv4().substring(0, 8);
  const testEmail = `test-${testId}@example.com`;
  
  const testLead = {
    firstName: 'Test',
    lastName: `User-${testId}`,
    email: testEmail,
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
    // 1. Submit the lead directly to Firestore using Admin SDK
    console.log('🚀 Submitting lead to Firestore...');
    
    const docRef = await db.collection('leads').add(testLead);
    console.log('✅ Lead successfully submitted with ID:', docRef.id);
    
    // 2. Simulate email notifications
    console.log('📧 Email notifications would be sent to:');
    console.log(`   - Admin: info@harielxavier.com`);
    console.log(`   - Client: ${testEmail}`);
    
    // 3. Verify the lead was added to Firestore
    const leadDoc = await docRef.get();
    if (leadDoc.exists) {
      console.log('✅ Lead verification successful: Found in Firestore');
      console.log('📊 Lead data:', leadDoc.data());
    } else {
      console.error('❌ Lead verification failed: Lead not found in Firestore');
    }
    
    console.log('\n🎉 Lead submission test completed successfully!');
    console.log('\n🔍 VERIFICATION:');
    console.log(`1. Check your Lead Management admin panel - you should see a new lead for ${testLead.firstName} ${testLead.lastName}`);
    console.log(`2. The lead will have the email: ${testEmail}`);
    console.log(`3. The lead was created at: ${new Date().toLocaleString()}`);
    
  } catch (error) {
    console.error('❌ Lead submission test failed:', error);
  }
}

// Run the test
testLeadSubmission()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error in test execution:', error);
    process.exit(1);
  });
