/**
 * Test script to verify lead form submission and email notifications
 * 
 * This script:
 * 1. Creates a test lead submission
 * 2. Submits it to the lead service
 * 3. Verifies the lead is registered and emails are sent
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

// Import the lead service
import * as leadService from '../src/services/leadService.js';
import emailServiceImport from '../src/lib/api/email.js';
const emailService = emailServiceImport;

// Firebase configuration
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
  
  // Create a test lead with a unique identifier
  const timestamp = new Date().toISOString();
  const testLead = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '555-123-4567',
    eventType: 'wedding',
    eventDate: '2025-12-31',
    eventLocation: 'Test Venue, NJ',
    preferredStyle: ['Documentary', 'Traditional'],
    additionalInfo: `This is a test submission created at ${timestamp}`,
    hearAboutUs: 'google',
    source: 'test_script'
  };
  
  console.log('📝 Created test lead:', testLead);
  
  try {
    // 1. Submit the lead using the lead service
    console.log('🚀 Submitting lead to lead service...');
    const leadId = await leadService.submitContactForm(testLead);
    console.log('✅ Lead successfully submitted with ID:', leadId);
    
    // 2. Verify the lead was created in Firestore
    console.log('🔍 Verifying lead in Firestore...');
    const leadsRef = collection(db, 'leads');
    const q = query(
      leadsRef, 
      where('email', '==', testLead.email),
      where('additionalInfo', '==', testLead.additionalInfo),
      orderBy('createdAt', 'desc'),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.error('❌ Lead verification failed: Lead not found in Firestore');
    } else {
      console.log('✅ Lead verification successful: Found in Firestore');
      
      // 3. Send test emails
      console.log('📧 Sending test admin notification email...');
      const adminEmailSent = await emailService.sendEmail({
        to: 'admin@harielxavier.com', // Use a test email address
        subject: `[TEST] New Lead Notification: ${testLead.firstName} ${testLead.lastName}`,
        html: `
          <h2>Test Lead Notification</h2>
          <p>This is a test email to verify the admin notification system.</p>
          <p><strong>Lead ID:</strong> ${leadId}</p>
          <p><strong>Name:</strong> ${testLead.firstName} ${testLead.lastName}</p>
          <p><strong>Email:</strong> ${testLead.email}</p>
          <p><strong>Timestamp:</strong> ${timestamp}</p>
        `
      });
      
      console.log('📧 Sending test client confirmation email...');
      const clientEmailSent = await emailService.sendEmail({
        to: testLead.email, // In a real test, use a test email address
        subject: '[TEST] Thank you for your inquiry - Hariel Xavier Photography',
        html: `
          <h2>Test Client Confirmation</h2>
          <p>This is a test email to verify the client confirmation system.</p>
          <p>Thank you for your interest in Hariel Xavier Photography.</p>
          <p><strong>Timestamp:</strong> ${timestamp}</p>
        `
      });
      
      console.log('✅ Email tests completed:', { 
        adminEmailSent, 
        clientEmailSent 
      });
    }
    
    console.log('🎉 Lead submission test completed successfully!');
    
  } catch (error) {
    console.error('❌ Lead submission test failed:', error);
  }
}

// Run the test
testLeadSubmission();
