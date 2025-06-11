// Test script for the fixed email service implementation
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirestore } from 'firebase/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.windsurf' });

// Firebase configuration
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

// Test function to send email using Firebase Cloud Functions
async function testCloudFunctionEmail() {
  try {
    console.log('Testing Firebase Cloud Function email sending...');
    
    // Call the Firebase Cloud Function directly
    const sendEmailFn = httpsCallable(functions, 'sendEmail');
    
    const result = await sendEmailFn({
      to: 'missiongeek@gmail.com', // Replace with your email
      subject: 'Test Email from Firebase Cloud Function',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
          <h1 style="color: #333;">Cloud Function Email Test</h1>
          <p>This is a test email sent from the Firebase Cloud Function.</p>
          <p>If you're receiving this, it means the email functionality is working correctly!</p>
          <p>Time sent: ${new Date().toLocaleString()}</p>
        </div>
      `,
      from: 'Hariel Xavier Photography <forms@harielxavier.com>',
      replyTo: 'hi@harielxavier.com'
    });
    
    console.log('Cloud Function response:', result.data);
    return true;
  } catch (error) {
    console.error('Error testing Cloud Function email:', error);
    return false;
  }
}

// Run the test
testCloudFunctionEmail()
  .then(success => {
    console.log(success ? '✅ Cloud Function email test completed successfully!' : '❌ Cloud Function email test failed.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Unexpected error during test:', err);
    process.exit(1);
  });