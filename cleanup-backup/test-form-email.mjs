// Simple test script to verify the email functionality
import { initializeApp } from 'firebase/app';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { sendEmailToClient, sendEmailToAdmin } from './src/services/emailService.js';

// Initialize Firebase with your config
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "your-auth-domain",
  projectId: process.env.FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "your-storage-bucket",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "your-messaging-sender-id",
  appId: process.env.FIREBASE_APP_ID || "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
const db = getFirestore(app);

// Use emulators if in development environment
if (process.env.NODE_ENV === 'development') {
  connectFunctionsEmulator(functions, 'localhost', 5001);
  connectFirestoreEmulator(db, 'localhost', 8080);
}

async function testEmailFunctionality() {
  console.log('Testing email functionality...');
  
  try {
    // Test sending email to client
    console.log('Sending test email to client...');
    await sendEmailToClient({
      to: 'test@example.com', // Replace with your test email
      name: 'Test User',
      eventType: 'wedding',
      eventDate: new Date().toLocaleDateString()
    });
    console.log('✅ Client email sent successfully!');
    
    // Test sending email to admin
    console.log('Sending test email to admin...');
    await sendEmailToAdmin({
      leadId: 'test-lead-id',
      leadData: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '555-123-4567',
        eventType: 'wedding',
        message: 'This is a test message',
        eventDate: new Date().toLocaleDateString(),
        eventLocation: 'Test Location'
      }
    });
    console.log('✅ Admin email sent successfully!');
    
    console.log('All email tests completed successfully!');
  } catch (error) {
    console.error('❌ Error testing email functionality:', error);
  }
}

// Run the test
testEmailFunctionality()
  .then(() => console.log('Test completed'))
  .catch(err => console.error('Test failed:', err));