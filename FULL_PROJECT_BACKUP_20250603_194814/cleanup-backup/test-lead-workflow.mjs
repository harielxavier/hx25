// Complete Lead Form Workflow Test Script
// Uses actual project assets and branding
import nodemailer from 'nodemailer';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log("🔍 Starting complete lead form workflow test...");

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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// SMTP configuration for Hariel Xavier Photography
const smtpConfig = {
  host: 'mail.harielxavier.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: 'forms@harielxavier.com',
    pass: 'Vamos!!86'
  }
};

// Create transporter
const transporter = nodemailer.createTransport(smtpConfig);

// Test lead data for Mary Jane
const testLead = {
  firstName: "Mary",
  lastName: "Jane",
  email: "missiongeek@gmail.com",
  phone: "555-123-4567",
  eventType: "wedding",
  eventDate: "2025-08-12",
  source: "test_workflow"
};

// Admin email recipients
const ADMIN_EMAILS = [
  'missiongeek@gmail.com',
  'dorismelv27@gmail.com',
  'hi@harielxavier.com'
];

// Step 1: Create lead in Firestore
async function createLead() {
  console.log("\n📝 STEP 1: Creating lead in Firestore...");
  
  try {
    const leadData = {
      ...testLead,
      status: 'new',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'leads'), leadData);
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
    // Format the event type for display
    const formattedEventType = testLead.eventType === 'other' ? 
      'Photography Services' : 
      testLead.eventType.charAt(0).toUpperCase() + testLead.eventType.slice(1) + ' Photography';
    
    // Create the subject line
    const subject = `Thank You for Your ${formattedEventType} Inquiry | Hariel Xavier Photography`;
    
    // Create the email content with actual branding and assets from the project
    const message = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You for Your Inquiry | Hariel Xavier Photography</title>
        <!--[if mso]>
        <style type="text/css">
          body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
        </style>
        <![endif]-->
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; background-color: #f9f9f9;">
        <!-- Preheader text (hidden) -->
        <div style="display: none; max-height: 0px; overflow: hidden;">
          Thank you for your interest in Hariel Xavier Photography. We've received your inquiry and will be in touch soon.
        </div>
        
        <!-- Main container -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; background-color: #f9f9f9;">
          <tr>
            <td align="center" valign="top">
              <!-- Email container -->
              <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                <!-- Header with logo -->
                <tr>
                  <td align="center" valign="top" style="padding: 40px 0 30px;">
                    <img src="https://harielxavier.com/logo.svg" alt="Hariel Xavier Photography" width="250" style="display: block; margin: 0 auto;">
                  </td>
                </tr>
                
                <!-- Divider -->
                <tr>
                  <td style="padding: 0 40px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-bottom: 1px solid #eeeeee;">
                      <tr>
                        <td>&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Main Content -->
                <tr>
                  <td style="padding: 40px 40px 20px;">
                    <h1 style="color: #1a1a1a; font-size: 24px; margin: 0 0 20px; font-weight: 600; text-align: center; font-family: Georgia, serif;">Thank You for Your Inquiry</h1>
                    
                    <p style="margin: 0 0 20px; line-height: 1.6; font-size: 16px;">Dear ${testLead.firstName},</p>
                    
                    <p style="margin: 0 0 20px; line-height: 1.6; font-size: 16px;">
                      Thank you for reaching out to Hariel Xavier Photography about your ${testLead.eventType} photography needs${testLead.eventDate ? ` for ${testLead.eventDate}` : ''}. I'm truly excited about the opportunity to capture your special moments and create timeless memories for you.
                    </p>
                    
                    <p style="margin: 0 0 20px; line-height: 1.6; font-size: 16px;">
                      I've received your inquiry and will be personally reviewing your details within the next 24-48 hours. I'll get back to you with more information about how we can work together to create beautiful, lasting memories that you'll cherish for years to come.
                    </p>
                    
                    <p style="margin: 0 0 30px; line-height: 1.6; font-size: 16px;">
                      While you wait, I'd love to know: what inspired you to capture these moments with professional photography? Understanding your vision helps me tailor my services to your specific needs and preferences.
                    </p>
                  </td>
                </tr>
                
                <!-- Portfolio Showcase -->
                <tr>
                  <td style="padding: 0 40px 30px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" style="padding-bottom: 20px;">
                          <p style="margin: 0 0 15px; font-size: 18px; color: #333; font-weight: 600; text-align: center; font-family: Georgia, serif;">A Glimpse of My Work</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td width="33.33%" style="padding: 0 5px;">
                                <img src="https://harielxavier.com/MoStuff/Featured Wedding/Ansimon & Mina's Wedding/Annie & Steve Ansimon & Mina Wedding additional-1028_websize.jpg" alt="Wedding Photography" width="100%" style="display: block; width: 100%; border-radius: 4px;">
                              </td>
                              <td width="33.33%" style="padding: 0 5px;">
                                <img src="https://harielxavier.com/MoStuff/Featured Wedding/Ansimon & Mina's Wedding/Annie & Steve Ansimon & Mina Wedding additional-1069_websize.jpg" alt="Wedding Photography" width="100%" style="display: block; width: 100%; border-radius: 4px;">
                              </td>
                              <td width="33.33%" style="padding: 0 5px;">
                                <img src="https://harielxavier.com/MoStuff/Featured Wedding/Ansimon & Mina's Wedding/Annie & Steve Ansimon & Mina Wedding additional-1156_websize.jpg" alt="Wedding Photography" width="100%" style="display: block; width: 100%; border-radius: 4px;">
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- CTA Button -->
                <tr>
                  <td align="center" style="padding: 0 40px 40px;">
                    <table border="0" cellpadding="0" cellspacing="0" style="background-color: #3d5a80; border-radius: 4px;">
                      <tr>
                        <td align="center" style="padding: 14px 30px;">
                          <a href="https://harielxavier.com/pricing" target="_blank" style="color: #ffffff; text-decoration: none; display: inline-block; font-weight: 500; font-size: 16px;">View Pricing & Packages</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Testimonial -->
                <tr>
                  <td style="padding: 0 40px 30px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f7f9fc; border-radius: 6px; padding: 20px;">
                      <tr>
                        <td>
                          <p style="margin: 0 0 10px; font-size: 16px; line-height: 1.6; font-style: italic; color: #555;">
                            "Hariel captured our wedding day perfectly. The photos are absolutely stunning and tell the complete story of our special day. His professionalism and artistic eye made all the difference. We couldn't be happier with our decision to work with him!"
                          </p>
                          <p style="margin: 0; font-size: 14px; font-weight: 600; color: #333;">
                            — Annie & Steve, New York
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Signature -->
                <tr>
                  <td style="padding: 0 40px 40px;">
                    <p style="margin: 0 0 5px; line-height: 1.6; font-size: 16px;">
                      Looking forward to connecting with you soon,
                    </p>
                    
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 20px;">
                      <tr>
                        <td width="80" style="vertical-align: top;">
                          <img src="https://harielxavier.com/MoStuff/portrait.jpg" alt="Hariel Xavier" width="70" style="display: block; border-radius: 50%;">
                        </td>
                        <td style="vertical-align: middle;">
                          <p style="margin: 0 0 5px; font-size: 18px; font-weight: 600; color: #333; font-family: Georgia, serif;">
                            Hariel Xavier
                          </p>
                          <p style="margin: 0; font-size: 14px; color: #666;">
                            Lead Photographer & Founder<br>
                            Hariel Xavier Photography
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #3d5a80; padding: 30px 40px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" style="color: #ffffff; font-size: 14px; line-height: 1.6;">
                          <p style="margin: 0 0 10px;">
                            Hariel Xavier Photography<br>
                            New York City, NY<br>
                            <a href="mailto:hi@harielxavier.com" style="color: #ffffff; text-decoration: none;">hi@harielxavier.com</a>
                          </p>
                          <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.7);">
                            &copy; ${new Date().getFullYear()} Hariel Xavier Photography. All rights reserved.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
    
    // Send the email
    const thankYouInfo = await transporter.sendMail({
      from: '"Hariel Xavier Photography" <forms@harielxavier.com>',
      to: testLead.email,
      subject,
      html: message
    });
    
    console.log("✅ Thank you email sent:", thankYouInfo.messageId);
    
    // Log email in Firestore
    await addDoc(collection(db, 'leads_emails'), {
      to: testLead.email,
      subject,
      type: 'lead_thank_you',
      sentAt: serverTimestamp()
    });
    
    console.log("✅ Thank you email logged in Firestore");
    
    return true;
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
    const formattedEventType = testLead.eventType === 'other' ? 
      'Custom Photography Services' : 
      testLead.eventType.charAt(0).toUpperCase() + testLead.eventType.slice(1) + ' Photography';
    
    // Create the subject line
    const subject = `New Lead: ${testLead.firstName} ${testLead.lastName} - ${formattedEventType}`;
    
    // Format the lead data into a readable table
    const leadDataTable = `
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold; width: 30%;">Name</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${testLead.firstName} ${testLead.lastName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Email</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${testLead.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Phone</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${testLead.phone}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Event Type</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${formattedEventType}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Event Date</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${testLead.eventDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Source</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${testLead.source}</td>
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
        <title>New Lead Notification | Hariel Xavier Photography</title>
        <!--[if mso]>
        <style type="text/css">
          body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
        </style>
        <![endif]-->
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; background-color: #f9f9f9;">
        <!-- Main container -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; background-color: #f9f9f9;">
          <tr>
            <td align="center" valign="top">
              <!-- Email container -->
              <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                <!-- Header with logo -->
                <tr>
                  <td align="center" valign="top" style="padding: 40px 0 30px;">
                    <img src="https://harielxavier.com/logo.svg" alt="Hariel Xavier Photography" width="250" style="display: block; margin: 0 auto;">
                  </td>
                </tr>
                
                <!-- Divider -->
                <tr>
                  <td style="padding: 0 40px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-bottom: 1px solid #eeeeee;">
                      <tr>
                        <td>&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Main Content -->
                <tr>
                  <td style="padding: 40px 40px 20px;">
                    <h1 style="color: #1a1a1a; font-size: 24px; margin: 0 0 20px; font-weight: 600; text-align: center; font-family: Georgia, serif;">New Lead Notification</h1>
                    
                    <p style="margin: 0 0 20px; line-height: 1.6; font-size: 16px;">
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
                  <td style="background-color: #3d5a80; padding: 30px 40px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" style="color: #ffffff; font-size: 14px; line-height: 1.6;">
                          <p style="margin: 0 0 10px;">
                            Hariel Xavier Photography<br>
                            New York City, NY<br>
                            <a href="mailto:hi@harielxavier.com" style="color: #ffffff; text-decoration: none;">hi@harielxavier.com</a>
                          </p>
                          <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.7);">
                            &copy; ${new Date().getFullYear()} Hariel Xavier Photography CRM. All rights reserved.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
    
    // Send to all admin emails
    for (const adminEmail of ADMIN_EMAILS) {
      console.log(`Sending admin notification to: ${adminEmail}`);
      
      const adminInfo = await transporter.sendMail({
        from: '"Hariel Xavier Photography CRM" <forms@harielxavier.com>',
        to: adminEmail,
        subject,
        html: message
      });
      
      console.log(`✅ Admin notification sent to ${adminEmail}:`, adminInfo.messageId);
      
      // Log admin email in Firestore
      await addDoc(collection(db, 'leads_emails'), {
        to: adminEmail,
        subject,
        type: 'lead_admin_notification',
        sentAt: serverTimestamp(),
        leadId
      });
    }
    
    console.log(`✅ Admin notifications sent to ${ADMIN_EMAILS.length} recipients and logged in Firestore`);
    
    return true;
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
    console.log("✅ Thank you email sent to client:", testLead.email);
    console.log("✅ Admin notifications sent to:", ADMIN_EMAILS.join(", "));
    console.log("✅ All emails logged in Firestore for tracking");
    
    return {
      success: true,
      leadId,
      clientEmail: testLead.email,
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
