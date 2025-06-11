import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { initializeApp } = require('firebase/app');
const { getFunctions, httpsCallable } = require('firebase/functions');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAohXEBojJPIFKXd1KTPQSi-LE2VxLG3xg", // Assuming this is correct for the project
  authDomain: "hariel-xavier-photography.firebaseapp.com", // This might also need to be harielxavierphotography-18d17.firebaseapp.com
  projectId: "harielxavierphotography-18d17", // Corrected Project ID
  storageBucket: "hariel-xavier-photography.appspot.com", // This might also need to be harielxavierphotography-18d17.appspot.com
  messagingSenderId: "397018472516",
  appId: "1:397018472516:web:49b2915c257651262a29b5", // Ensure this app ID is for the -18d17 project
  measurementId: "G-DNMEK173KQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functionsInstance = getFunctions(app);

// --- Live Firebase Connection ---
// This script will now target your live deployed Firebase Functions.
// Ensure your functions are deployed with `firebase deploy --only functions`.
console.log('Configured to call live Firebase Functions.');
// --- End Live Firebase Connection ---

// Function to send a test email
async function sendTestEmail() {
  try {
    // Ensure you are calling the correct region if your functions are deployed to a specific region.
    // If your functions are in 'us-central1' (default), you might not need to specify the region.
    // However, if they are in another region, you'll need to add it like so:
    // const sendEmailFn = httpsCallable(functionsInstance, 'sendEmail', { region: 'your-function-region' });
    // For now, we'll assume the default region or that it's handled by your Firebase project settings.
    // Let's explicitly try 'us-central1' as it's a common default.
    console.log("Calling 'sendEmail' function, assuming region 'us-central1'.");
    const sendEmailFn = httpsCallable(functionsInstance, 'sendEmail', { region: 'us-central1' });
    const emailData = {
      to: 'missiongeek@gmail.com',
      subject: 'Test Email from Hariel Xavier Photography',
      html: '<p>This is a test email to confirm the setup is working correctly.</p>',
      from: 'Forms@harielxavier.com'
    };
    console.log('Attempting to send test email with data:', emailData);
    const result = await sendEmailFn(emailData);
    console.log('Test email sent successfully:', result.data);
  } catch (error) {
    console.error('Error sending test email:', error);
    if (error.details) {
      console.error('Error details:', error.details);
    }
    if (error.code) {
      console.error('Error code:', error.code);
    }
  }
}

// Execute the function
sendTestEmail();
