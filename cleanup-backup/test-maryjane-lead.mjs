// Test script for Mary Jane lead workflow
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log("🔍 Starting Mary Jane lead workflow test...");

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

console.log("🔧 Initializing Firebase with config");

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  console.log("✅ Firebase app initialized");
} else {
  app = getApp();
  console.log("✅ Using existing Firebase app");
}

const db = getFirestore(app);
const functions = getFunctions(app);

// SMTP configuration for emails
const BLUEHOST_SMTP_CONFIG = {
  host: 'box5804.bluehost.com',
  port: 465,
  secure: true,
  auth: {
    user: 'forms@harielxavier.com',
    pass: 'Vamos!!86'
  }
};

// Admin email recipients
const ADMIN_EMAILS = [
  'missiongeek@gmail.com',
  'dorismelv27@gmail.com',
  'hi@harielxavier.com'
];

// Mary Jane test lead data
const maryJaneData = {
  firstName: "Mary",
  lastName: "Jane",
  email: "missiongeek@gmail.com", // Using the specified email
  phone: "555-987-6543",
  eventType: "wedding",
  eventDate: "2025-08-12",
  eventLocation: "Central Park, New York",
  guestCount: "120",
  preferredStyle: ["Documentary", "Artistic"],
  budget: "3000-5000",
  hearAboutUs: "google",
  additionalInfo: "We're planning an outdoor ceremony with a sunset reception. Looking for a photographer who can capture candid moments.",
  source: "test_workflow_maryjane"
};

// Step 1: Create lead in Firestore
async function createLead() {
  console.log("\n📝 STEP 1: Creating lead in Firestore...");
  console.log("Lead data:", maryJaneData);
  
  try {
    const leadsRef = collection(db, 'leads');
    
    const lead = {
      ...maryJaneData,
      status: 'new',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(leadsRef, lead);
    console.log("✅ Lead created successfully with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error creating lead:", error);
    throw error;
  }
}

// Step 2: Send thank you email to client
async function sendThankYouEmail() {
  console.log("\n📧 STEP 2: Sending thank you email to client...");
  
  try {
    // Create email content
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <!-- Header with Logo -->
          <tr>
            <td align="center" style="padding: 20px 0;">
              <img src="https://res.cloudinary.com/dos0qac90/image/upload/v1649789940/hariel-xavier-logo.png" alt="Hariel Xavier Photography" width="180" style="display: block; margin: 0 auto;">
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="height: 2px; background-color: #ddd;"></td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 30px 0;">
              <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 20px; font-weight: 600;">Thank You for Your Inquiry</h1>
              
              <p style="margin-bottom: 20px; line-height: 1.6; font-size: 16px;">Dear ${maryJaneData.firstName},</p>
              
              <p style="margin-bottom: 20px; line-height: 1.6; font-size: 16px;">
                Thank you for reaching out to Hariel Xavier Photography about your wedding photography needs for ${maryJaneData.eventDate}. I'm excited about the opportunity to capture your special moments!
              </p>
              
              <p style="margin-bottom: 20px; line-height: 1.6; font-size: 16px;">
                I've received your inquiry and will be reviewing your details within the next 24-48 hours. I'll get back to you with more information about how we can work together to create beautiful, lasting memories.
              </p>
              
              <p style="margin-bottom: 30px; line-height: 1.6; font-size: 16px;">
                While you wait, I'd love to know: what inspired you to capture these moments with professional photography? Understanding your vision helps me tailor my services to your specific needs.
              </p>
              
              <!-- CTA Button -->
              <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 15px 0 30px;">
                    <a href="https://harielxavier.com/pricing" target="_blank" style="background-color: #3d5a80; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: 500; display: inline-block; font-size: 16px;">View Pricing & Packages</a>
                  </td>
                </tr>
              </table>
              
              <p style="line-height: 1.6; font-size: 16px;">
                Looking forward to connecting with you soon,
              </p>
              
              <p style="margin-bottom: 30px; line-height: 1.6; font-size: 16px;">
                Hariel Xavier<br>
                <span style="color: #666;">Photographer & Founder</span>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f7f7f7; padding: 20px; border-radius: 4px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <a href="https://instagram.com/harielxavierphotography" style="display: inline-block; margin: 0 10px;">
                      <img src="https://res.cloudinary.com/dos0qac90/image/upload/v1649789940/icons/instagram.png" alt="Instagram" width="24">
                    </a>
                    <a href="https://facebook.com/harielxavierphotography" style="display: inline-block; margin: 0 10px;">
                      <img src="https://res.cloudinary.com/dos0qac90/image/upload/v1649789940/icons/facebook.png" alt="Facebook" width="24">
                    </a>
                    <a href="https://pinterest.com/harielxavierphotography" style="display: inline-block; margin: 0 10px;">
                      <img src="https://res.cloudinary.com/dos0qac90/image/upload/v1649789940/icons/pinterest.png" alt="Pinterest" width="24">
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="color: #666; font-size: 14px; line-height: 1.6;">
                    <p style="margin: 0;">
                      Hariel Xavier Photography<br>
                      New York City, NY<br>
                      <a href="mailto:hi@harielxavier.com" style="color: #3d5a80; text-decoration: none;">hi@harielxavier.com</a>
                    </p>
                    <p style="margin: 10px 0 0; font-size: 12px; color: #888;">
                      &copy; ${new Date().getFullYear()} Hariel Xavier Photography. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
    
    // Call the sendEmail function with SMTP configuration
    const sendEmailFn = httpsCallable(functions, 'sendEmailWithSMTP');
    
    await sendEmailFn({
      to: maryJaneData.email,
      from: 'Hariel Xavier Photography <forms@harielxavier.com>',
      subject: `Thank You for Your Wedding Photography Inquiry | Hariel Xavier Photography`,
      html: emailContent,
      smtpConfig: BLUEHOST_SMTP_CONFIG
    });
    
    console.log("✅ Thank you email sent successfully to:", maryJaneData.email);
    
    // Log email sent to leads_emails collection
    const emailsRef = collection(db, 'leads_emails');
    await addDoc(emailsRef, {
      to: maryJaneData.email,
      subject: `Thank You for Your Wedding Photography Inquiry | Hariel Xavier Photography`,
      type: 'lead_thank_you',
      sentAt: serverTimestamp(),
      leadName: `${maryJaneData.firstName} ${maryJaneData.lastName}`,
      eventType: maryJaneData.eventType,
      eventDate: maryJaneData.eventDate
    });
    
    console.log("✅ Thank you email logged in Firestore");
    
  } catch (error) {
    console.error("❌ Error sending thank you email:", error);
    throw error;
  }
}

// Step 3: Send admin notification
async function sendAdminNotification(leadId) {
  console.log("\n📧 STEP 3: Sending admin notification...");
  
  try {
    // Format the event type for display
    const formattedEventType = maryJaneData.eventType === 'other' ? 
      (maryJaneData.customEventType || 'Custom Photography Services') : 
      maryJaneData.eventType.charAt(0).toUpperCase() + maryJaneData.eventType.slice(1) + ' Photography';
    
    // Create the subject line
    const subject = `New Lead: ${maryJaneData.firstName} ${maryJaneData.lastName} - ${formattedEventType}`;
    
    // Format the lead data into a readable table
    const leadDataTable = `
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold; width: 30%;">Name</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${maryJaneData.firstName} ${maryJaneData.lastName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Email</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${maryJaneData.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Phone</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${maryJaneData.phone || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Event Type</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${formattedEventType}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Event Date</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${maryJaneData.eventDate || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Location</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${maryJaneData.eventLocation || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Guest Count</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${maryJaneData.guestCount || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Budget</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${maryJaneData.budget || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">How They Found Us</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${maryJaneData.hearAboutUs || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Additional Info</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${maryJaneData.additionalInfo || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Source</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${maryJaneData.source}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Lead ID</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${leadId}</td>
        </tr>
      </table>
    `;
    
    // Create the email content
    const message = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 20px 0;">
              <img src="https://res.cloudinary.com/dos0qac90/image/upload/v1649789940/hariel-xavier-logo.png" alt="Hariel Xavier Photography" width="180" style="display: block; margin: 0 auto;">
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="height: 2px; background-color: #ddd;"></td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 30px 0;">
              <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 20px; font-weight: 600;">New Lead Notification</h1>
              
              <p style="margin-bottom: 20px; line-height: 1.6; font-size: 16px;">
                A new lead has been submitted through the website. Here are the details:
              </p>
              
              ${leadDataTable}
              
              <div style="margin: 30px 0; text-align: center;">
                <a href="https://harielxavier.com/admin/leads/${leadId}" style="background-color: #3d5a80; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: 500; display: inline-block; font-size: 16px;">
                  View Lead in Admin Panel
                </a>
              </div>
              
              <p style="margin-bottom: 0; line-height: 1.6; font-size: 16px;">
                This lead was submitted on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f7f7f7; padding: 20px; border-radius: 4px;">
              <p style="margin: 0; text-align: center; font-size: 14px; color: #666;">
                This is an automated notification from the Hariel Xavier Photography CRM system.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
    
    // Send to all admin emails
    for (const adminEmail of ADMIN_EMAILS) {
      console.log(`Sending admin notification to: ${adminEmail}`);
      
      // Call the sendEmail function with SMTP configuration
      const sendEmailFn = httpsCallable(functions, 'sendEmailWithSMTP');
      
      await sendEmailFn({
        to: adminEmail,
        from: 'Hariel Xavier Photography CRM <forms@harielxavier.com>',
        subject,
        html: message,
        smtpConfig: BLUEHOST_SMTP_CONFIG
      });
      
      // Log admin email in Firestore
      const emailsRef = collection(db, 'leads_emails');
      await addDoc(emailsRef, {
        to: adminEmail,
        subject,
        type: 'lead_admin_notification',
        sentAt: serverTimestamp(),
        leadId,
        leadName: `${maryJaneData.firstName} ${maryJaneData.lastName}`
      });
    }
    
    console.log(`✅ Admin notifications sent to ${ADMIN_EMAILS.length} recipients`);
    
  } catch (error) {
    console.error("❌ Error sending admin notifications:", error);
    throw error;
  }
}

// Run the complete workflow
async function runCompleteWorkflow() {
  try {
    // Step 1: Create lead
    const leadId = await createLead();
    
    // Step 2: Send thank you email to client
    await sendThankYouEmail();
    
    // Step 3: Send admin notification
    await sendAdminNotification(leadId);
    
    // Final result
    console.log("\n🎉 WORKFLOW TEST COMPLETE 🎉");
    console.log("✅ Lead created in Firestore with ID:", leadId);
    console.log("✅ Thank you email sent to client:", maryJaneData.email);
    console.log("✅ Admin notifications sent to:", ADMIN_EMAILS.join(", "));
    console.log("✅ All emails logged in Firestore for tracking");
    
    return {
      success: true,
      leadId,
      clientEmail: maryJaneData.email,
      adminEmails: ADMIN_EMAILS
    };
  } catch (error) {
    console.error("❌ Workflow test failed:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Execute the workflow
runCompleteWorkflow()
  .then(result => {
    console.log("\nTest result:", result);
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
