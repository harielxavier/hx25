// Simple test script for lead workflow
const { initializeApp, getApps, getApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');
const { getFunctions, httpsCallable } = require('firebase/functions');
require('dotenv').config();

// Firebase configuration
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
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);
const functions = getFunctions(app);

// Test lead data
const testLead = {
  firstName: "Sarah",
  lastName: "Johnson",
  email: "test@example.com",
  phone: "555-123-4567",
  eventType: "wedding",
  eventDate: "2025-09-15",
  source: "test_workflow"
};

// Create a lead in Firestore
async function createTestLead() {
  try {
    console.log("✅ Starting lead creation test...");
    
    // Add lead to Firestore
    const leadsRef = collection(db, 'leads');
    const lead = {
      ...testLead,
      status: 'new',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(leadsRef, lead);
    console.log("✅ Lead created with ID:", docRef.id);
    
    // Send thank you email
    await sendThankYouEmail();
    
    return docRef.id;
  } catch (error) {
    console.error("❌ Error creating lead:", error);
    throw error;
  }
}

// Send thank you email
async function sendThankYouEmail() {
  try {
    console.log("📧 Sending thank you email...");
    
    // SMTP configuration
    const smtpConfig = {
      host: 'box5804.bluehost.com',
      port: 465,
      secure: true,
      auth: {
        user: 'forms@harielxavier.com',
        pass: 'Vamos!!86'
      }
    };
    
    // Create email content
    const emailContent = `
      <h1>Thank You for Your Inquiry</h1>
      <p>Dear ${testLead.firstName},</p>
      <p>Thank you for reaching out to Hariel Xavier Photography about your ${testLead.eventType} needs. 
      I'm excited about the opportunity to capture your special moments!</p>
      <p>I've received your inquiry and will be reviewing your details within the next 24-48 hours.</p>
      <p>Best regards,<br>Hariel Xavier<br>Photographer & Founder</p>
    `;
    
    // Call the sendEmail function
    const sendEmailFn = httpsCallable(functions, 'sendEmailWithSMTP');
    
    await sendEmailFn({
      to: testLead.email,
      from: 'Hariel Xavier Photography <forms@harielxavier.com>',
      subject: `Thank You for Your ${testLead.eventType.charAt(0).toUpperCase() + testLead.eventType.slice(1)} Photography Inquiry`,
      html: emailContent,
      smtpConfig: smtpConfig
    });
    
    console.log("✅ Thank you email sent successfully to:", testLead.email);
    
    // Log email in Firestore
    const emailsRef = collection(db, 'leads_emails');
    await addDoc(emailsRef, {
      to: testLead.email,
      subject: `Thank You for Your ${testLead.eventType.charAt(0).toUpperCase() + testLead.eventType.slice(1)} Photography Inquiry`,
      type: 'lead_thank_you',
      sentAt: serverTimestamp(),
      leadName: `${testLead.firstName} ${testLead.lastName}`,
      eventType: testLead.eventType,
      eventDate: testLead.eventDate
    });
    
    console.log("✅ Email logged in Firestore");
    
  } catch (error) {
    console.error("❌ Error sending thank you email:", error);
    throw error;
  }
}

// Run the test
createTestLead()
  .then(() => {
    console.log("🎉 TEST COMPLETED SUCCESSFULLY 🎉");
    console.log("✅ Lead created in Firestore");
    console.log("✅ Thank you email sent");
    console.log("✅ Email logged in Firestore");
    process.exit(0);
  })
  .catch(error => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
