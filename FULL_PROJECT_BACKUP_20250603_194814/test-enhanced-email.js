/**
 * Test script for the enhanced email templates
 * This demonstrates how to use the templates with your existing Firebase functions
 */

import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { generateClientEmail, generateAdminEmail } from './src/utils/emailTemplates.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Firebase with your config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

/**
 * Send an email using Firebase Cloud Functions
 */
async function sendEmail(to, subject, html, from, replyTo) {
  try {
    // Call the Firebase Cloud Function
    const sendEmailFn = httpsCallable(functions, 'sendEmail');
    
    const result = await sendEmailFn({
      to,
      subject,
      html,
      from: from || 'Hariel Xavier Photography <hello@harielxavier.com>',
      replyTo: replyTo || 'hello@harielxavier.com'
    });
    
    console.log('Email sent successfully!');
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Test sending a client email
async function testClientEmail() {
  // Replace with the email where you want to receive the test
  const recipientEmail = process.argv[2] || 'your-test-email@example.com';
  
  // Sample client data
  const clientData = {
    name: 'Test Client',
    eventType: 'wedding',
    eventDate: 'June 15, 2025'
  };
  
  // Generate the email content using our template
  const emailHtml = generateClientEmail(clientData);
  const subject = `Thank You for Your Wedding Photography Inquiry | Hariel Xavier Photography`;
  
  console.log(`Sending enhanced client email to: ${recipientEmail}`);
  
  try {
    await sendEmail(recipientEmail, subject, emailHtml);
    console.log('✅ Client email sent successfully!');
  } catch (error) {
    console.error('❌ Failed to send client email:', error);
  }
}

// Test sending an admin email
async function testAdminEmail() {
  // Replace with the email where you want to receive the test
  const recipientEmail = process.argv[2] || 'your-test-email@example.com';
  
  // Sample lead data
  const leadData = {
    leadId: 'lead_12345',
    leadData: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@example.com',
      phone: '(555) 123-4567',
      eventType: 'wedding',
      eventDate: 'June 15, 2025',
      eventLocation: 'Sunset Beach Resort, Miami',
      message: 'We are planning a beach wedding and would love to discuss your photography packages. We especially love your candid style!',
      budget: '$2,000 - $3,000',
      hearAboutUs: 'Instagram',
      additionalInfo: 'We have about 80 guests and the ceremony will be at sunset.'
    }
  };
  
  // Generate the email content using our template
  const emailHtml = generateAdminEmail(leadData);
  const subject = `New Lead: ${leadData.leadData.firstName} ${leadData.leadData.lastName} - Wedding Photography`;
  
  console.log(`Sending enhanced admin email to: ${recipientEmail}`);
  
  try {
    await sendEmail(recipientEmail, subject, emailHtml);
    console.log('✅ Admin email sent successfully!');
  } catch (error) {
    console.error('❌ Failed to send admin email:', error);
  }
}

// Run both tests
async function runTests() {
  if (!process.argv[2]) {
    console.error('Please provide an email address to send the test emails to:');
    console.error('node test-enhanced-email.js your-email@example.com');
    process.exit(1);
  }
  
  console.log('🚀 Starting email template tests...');
  
  // Test client email
  await testClientEmail();
  
  // Wait a moment before sending the second email
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test admin email
  await testAdminEmail();
  
  console.log('✨ All tests completed!');
}

// Run the tests
runTests();
