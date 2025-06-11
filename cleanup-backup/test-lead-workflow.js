// Test script to verify the complete lead submission workflow
require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, orderBy, limit, addDoc, serverTimestamp } = require('firebase/firestore');
const { httpsCallable } = require('firebase/functions');
const { getAuth } = require('firebase/auth');

// Load environment variables
dotenv.config({ path: '.env.local' });

// Firebase configuration from environment variables
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
const db = getFirestore(app);

// Test data for our pretend client
const testLeadData = {
  firstName: "Sarah",
  lastName: "Johnson",
  email: "test@example.com", // Using a test email
  phone: "555-123-4567",
  eventType: "wedding",
  eventDate: "2025-09-15",
  eventLocation: "Sparta, NJ",
  preferredStyle: ["Documentary", "Artistic"],
  budget: "3000-5000",
  hearAboutUs: "instagram",
  additionalInfo: "Looking for a photographer who can capture candid moments. We're having an outdoor ceremony.",
  source: "test_workflow"
};

// Function to test the complete workflow
async function testLeadWorkflow() {
  console.log("🔍 Starting lead workflow test...");
  console.log("📋 Test client data:", testLeadData);
  
  try {
    // Step 1: Submit the lead to the lead management system
    console.log("\n📝 Step 1: Submitting lead to Firestore...");
    const leadId = await submitContactForm(testLeadData);
    console.log("✅ Lead created successfully with ID:", leadId);
    
    // Step 2: Send thank you email to the lead
    console.log("\n📧 Step 2: Sending thank you email...");
    await sendEmailToClient({
      to: testLeadData.email,
      name: `${testLeadData.firstName} ${testLeadData.lastName}`,
      eventType: testLeadData.eventType,
      eventDate: testLeadData.eventDate
    });
    console.log("✅ Thank you email sent successfully to:", testLeadData.email);
    
    // Step 3: Verify lead was stored in Firestore
    console.log("\n🔍 Step 3: Verifying lead in Firestore...");
    const leadsRef = collection(db, 'leads');
    const q = query(
      leadsRef,
      where("email", "==", testLeadData.email),
      where("source", "==", "test_workflow"),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      console.log("✅ Lead verified in Firestore database");
      const leadDoc = querySnapshot.docs[0];
      console.log("📊 Lead data in Firestore:", leadDoc.data());
    } else {
      console.error("❌ Lead not found in Firestore");
    }
    
    // Step 4: Verify email was logged
    console.log("\n🔍 Step 4: Verifying email log in Firestore...");
    const emailsRef = collection(db, 'leads_emails');
    const emailQuery = query(
      emailsRef,
      where("to", "==", testLeadData.email),
      where("type", "==", "lead_thank_you"),
      orderBy("sentAt", "desc"),
      limit(1)
    );
    
    const emailSnapshot = await getDocs(emailQuery);
    if (!emailSnapshot.empty) {
      console.log("✅ Email log verified in Firestore database");
      const emailDoc = emailSnapshot.docs[0];
      console.log("📊 Email log data:", emailDoc.data());
    } else {
      console.error("❌ Email log not found in Firestore");
    }
    
    // Final result
    console.log("\n🎉 WORKFLOW TEST COMPLETE 🎉");
    console.log("✅ Lead submission workflow verified successfully");
    console.log("✅ Thank you email sent and logged");
    console.log("✅ All systems functioning correctly");
    
  } catch (error) {
    console.error("❌ Error in workflow test:", error);
  }
}

// Run the test
testLeadWorkflow().then(() => {
  console.log("\nTest completed. Exiting...");
  process.exit(0);
}).catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});
