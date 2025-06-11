// Test script to verify the email fix
import { initializeApp } from 'firebase/app';
import { getFunctions } from 'firebase/functions';
import { httpsCallable } from 'firebase/functions';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDQxEpQHZtJvKKBFoW-4qxTWNUwmgvt0gE",
  authDomain: "harielxavierphotography.firebaseapp.com",
  projectId: "harielxavierphotography",
  storageBucket: "harielxavierphotography.appspot.com",
  messagingSenderId: "1045282978407",
  appId: "1:1045282978407:web:c3f1d2e9b9d8a8e3a9b9d8",
  measurementId: "G-MEASUREMENT_ID"
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

// Test function to send email
async function testEmailSend() {
  try {
    console.log('Testing email sending with Firebase function...');
    
    // Get the callable function reference
    const sendEmailFn = httpsCallable(functions, 'sendEmailWithSMTP');
    
    // Call the function with test data
    const result = await sendEmailFn({
      to: 'missiongeek@gmail.com', // Replace with your test email
      subject: 'Test Email - Fix Verification',
      message: `
        <h1>Email Fix Test</h1>
        <p>This is a test email to verify that the email fix is working correctly.</p>
        <p>If you're receiving this, it means the integration with Firebase Cloud Functions is working!</p>
        <p>Time sent: ${new Date().toLocaleString()}</p>
      `,
      from: 'Hariel Xavier Photography <forms@harielxavier.com>',
      replyTo: 'hi@harielxavier.com'
    });
    
    console.log('Test email sent successfully!');
    console.log('Result:', result.data);
    return true;
  } catch (error) {
    console.error('Failed to send test email:', error);
    return false;
  }
}

// Run the test
testEmailSend()
  .then(success => {
    if (success) {
      console.log('✅ Email fix verification completed successfully!');
    } else {
      console.log('❌ Email fix verification failed.');
    }
  })
  .catch(err => {
    console.error('Error during test:', err);
  });
