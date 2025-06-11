console.log("--- EXECUTING LATEST VERSION OF test-mailgun-setup.mjs (v6 - admin.functions() retry) ---");
import admin from 'firebase-admin';
// import { getFunctions } from 'firebase-admin/functions'; // No longer using this specific import
import { initializeApp, cert } from 'firebase-admin/app';
import { createRequire } from 'module'; // Import createRequire

const require = createRequire(import.meta.url); // Create a require function

// --- Configuration ---
// IMPORTANT: Make sure the path to your service account key is correct.
const serviceAccountPath = './firebase-service-account.json'; 
const testRecipientEmail = 'missiongeek@gmail.com'; // Set to the requested test recipient
const testSenderEmail = 'Hariel Xavier Photography <forms@harielxavier.com>'; // Desired "From" address
// --- End Configuration ---

try {
  // Initialize Firebase Admin SDK
  // Check if already initialized to prevent re-initialization errors if run multiple times or in an environment where it's already set up.
  if (!admin.apps.length) {
    const serviceAccount = require(serviceAccountPath); // Use require to load the JSON
    initializeApp({
      credential: cert(serviceAccount), // Use the loaded service account directly
      // Add your databaseURL and storageBucket if needed by other parts of your admin setup,
      // though not strictly necessary for calling a single function.
      // databaseURL: "https://your-project-id.firebaseio.com", 
      // storageBucket: "your-project-id.appspot.com"
    });
    console.log('Firebase Admin SDK initialized.');
  } else {
    console.log('Firebase Admin SDK already initialized.');
  }

  // Use the namespaced admin.functions() to get the callable
  const sendEmailHttpsCallable = admin.functions().httpsCallable('sendEmail'); 

  console.log(`Attempting to send a test email to: ${testRecipientEmail}`);
  console.log('Using Mailgun key and domain configured in Firebase Functions environment variables.');

  const emailData = {
    to: testRecipientEmail,
    from: testSenderEmail, // Using the specified "From" address
    replyTo: 'hi@harielxavier.com', // A good default reply-to
    subject: 'Test Email from Hariel Xavier Photography (via Mailgun)',
    html: `
      <h1>Test Email from forms@harielxavier.com</h1>
      <p>This is a test email sent via the <strong>sendEmail</strong> Firebase Function using Mailgun.</p>
      <p>It is configured to appear as being sent from: <strong>${testSenderEmail}</strong>.</p>
      <p>The receiving email is: <strong>${testRecipientEmail}</strong>.</p>
      <p>Mailgun Sending Domain: mg.harielxavier.com (configured in Firebase Functions)</p>
      <p>If you received this, the setup is likely working!</p>
      <p>Timestamp: ${new Date().toISOString()}</p>
    `,
  };

  const result = await sendEmailHttpsCallable(emailData);

  console.log('Test email function called successfully.');
  console.log('Response from sendEmail function:', result.data);

  if (result.data.success) {
    console.log(`\nSUCCESS: Test email queued for sending to ${testRecipientEmail} via Mailgun. Message ID: ${result.data.messageId}`);
    console.log('Please check your inbox (and spam folder).');
  } else {
    console.error('\nERROR: The sendEmail function reported an issue. Details:', result.data);
  }

} catch (error) {
  console.error('\nFATAL ERROR running test script:', error);
  if (error.code === 'functions/not-found') {
    console.error("Error: The 'sendEmail' function was not found. Ensure it's correctly exported in functions/src/index.ts and deployed.");
  } else if (error.message && error.message.includes('ENOENT')) {
    console.error(`Error: Service account key not found at ${serviceAccountPath}. Please ensure the path is correct.`);
  } else if (error.details) {
    console.error("Error Details:", error.details);
  }
}
