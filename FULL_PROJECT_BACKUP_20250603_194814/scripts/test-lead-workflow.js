/**
 * Lead Workflow Test Script
 * 
 * This script simulates a lead submission to test the entire workflow:
 * 1. Creating a lead in Firestore
 * 2. Adding a calendar entry
 * 3. Sending confirmation email to the lead
 * 4. Sending notification emails to admins
 */

/**
 * Lead Workflow Test Script - SIMULATION MODE
 * 
 * This simulates the entire lead workflow without requiring actual Firebase credentials
 */

import nodemailer from 'nodemailer';
import { format } from 'date-fns';

// Mock Firestore functionality
class MockFirestore {
  constructor() {
    this.collections = {};
    this.lastId = 0;
  }

  collection(name) {
    if (!this.collections[name]) {
      this.collections[name] = [];
    }
    return {
      add: (data) => this.addDocument(name, data),
      doc: (id) => ({
        update: (data) => this.updateDocument(name, id, data)
      })
    };
  }

  addDocument(collectionName, data) {
    const id = `mock-doc-${++this.lastId}`;
    const timestamp = new Date().toISOString();
    
    // Handle serverTimestamp() function calls
    const processedData = {};
    for (const [key, value] of Object.entries(data)) {
      if (value === 'SERVER_TIMESTAMP') {
        processedData[key] = timestamp;
      } else {
        processedData[key] = value;
      }
    }
    
    this.collections[collectionName].push({
      id,
      data: processedData
    });
    
    console.log(`[MOCK DB] Added document to ${collectionName} with ID: ${id}`);
    console.log(`[MOCK DB] Document data:`, JSON.stringify(processedData, null, 2));
    
    return { id };
  }
  
  updateDocument(collectionName, id, data) {
    console.log(`[MOCK DB] Updated document in ${collectionName} with ID: ${id}`);
    console.log(`[MOCK DB] Update data:`, JSON.stringify(data, null, 2));
    return Promise.resolve();
  }
}

// Create mock Firestore instance
const db = new MockFirestore();

// Mock serverTimestamp function
const serverTimestamp = () => 'SERVER_TIMESTAMP';

// Bluehost SMTP configuration
const BLUEHOST_SMTP_CONFIG = {
  host: 'box5804.bluehost.com',
  port: 465,
  secure: true,
  auth: {
    user: 'forms@harielxavier.com',
    pass: 'Vamos!!86'
  }
};

// Admin notification recipients
const ADMIN_EMAILS = [
  'missiongeek@gmail.com',
  'dorismelv27@gmail.com',
  'hi@harielxavier.com'
];

// Create a test lead matching the updated Lead structure
const testLead = {
  firstName: 'Test',
  lastName: 'Client',
  email: 'test@example.com', // Use a real email to test if needed
  phone: '(555) 123-4567',
  eventType: 'wedding',
  eventDate: new Date('2025-08-15').toISOString(),
  eventLocation: 'New York City, NY',
  guestCount: '150',
  preferredStyle: ['Traditional', 'Candid'],
  mustHaveShots: 'First look, family portraits',
  budget: '3000-5000',
  hearAboutUs: 'google',
  additionalInfo: 'This is a test lead submission to verify the workflow.',
  source: 'test_script',
  status: 'new',
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
};

// Function to send email
async function sendEmail(options) {
  // Create transporter with provided SMTP config
  const transporter = nodemailer.createTransport(BLUEHOST_SMTP_CONFIG);
  
  // Email options
  const mailOptions = {
    from: options.from || 'Hariel Xavier Photography <forms@harielxavier.com>',
    to: options.to,
    subject: options.subject,
    html: options.html,
    replyTo: options.replyTo || 'hi@harielxavier.com'
  };
  
  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${options.to}:`, info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Function to send thank you email to client
async function sendEmailToClient(params) {
  const { to, firstName, lastName, eventType, eventDate } = params;
  
  // Format the event type for display
  const formattedEventType = eventType === 'other' ? 'Photography Services' : 
    eventType.charAt(0).toUpperCase() + eventType.slice(1) + ' Photography';
  
  // Create a personalized greeting
  const greeting = `Dear ${firstName},`;
  
  // Create the subject line
  const subject = `Thank You for Your ${formattedEventType} Inquiry | Hariel Xavier Photography`;
  
  // Create the HTML email content with branding
  const message = `
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
            
            <p style="margin-bottom: 20px; line-height: 1.6; font-size: 16px;">${greeting}</p>
            
            <p style="margin-bottom: 20px; line-height: 1.6; font-size: 16px;">
              Thank you for reaching out to Hariel Xavier Photography about your ${formattedEventType.toLowerCase()} needs${eventDate ? ` for ${eventDate}` : ''}. I'm excited about the opportunity to capture your special moments!
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
  
  return sendEmail({
    to,
    from: 'Hariel Xavier Photography <forms@harielxavier.com>',
    subject,
    html: message
  });
}

// Function to send admin notification
async function sendEmailToAdmin(params) {
  const { leadId, leadData } = params;
  
  // Format the event type for display
  const formattedEventType = leadData.eventType === 'other' ? 
    (leadData.customEventType || 'Custom Photography Services') : 
    leadData.eventType.charAt(0).toUpperCase() + leadData.eventType.slice(1) + ' Photography';
  
  // Create the subject line
  const subject = `New Lead: ${leadData.name} - ${formattedEventType}`;
  
  // Format the lead data into a readable table
  const leadDataTable = `
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr>
        <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold; width: 30%;">Name</td>
        <td style="padding: 8px 12px; border: 1px solid #ddd;">${leadData.name}</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Email</td>
        <td style="padding: 8px 12px; border: 1px solid #ddd;">
          <a href="mailto:${leadData.email}">${leadData.email}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Phone</td>
        <td style="padding: 8px 12px; border: 1px solid #ddd;">
          <a href="tel:${leadData.phone}">${leadData.phone}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Service Type</td>
        <td style="padding: 8px 12px; border: 1px solid #ddd;">${formattedEventType}</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Event Date</td>
        <td style="padding: 8px 12px; border: 1px solid #ddd;">${leadData.eventDate || 'Not specified'}</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Location</td>
        <td style="padding: 8px 12px; border: 1px solid #ddd;">${leadData.eventLocation || 'Not specified'}</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Message</td>
        <td style="padding: 8px 12px; border: 1px solid #ddd;">${leadData.message || 'No message provided'}</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Lead ID</td>
        <td style="padding: 8px 12px; border: 1px solid #ddd;">${leadId}</td>
      </tr>
    </table>
  `;
  
  // Create the HTML email content
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
        
        <!-- Main Content -->
        <tr>
          <td style="padding: 30px 0;">
            <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 20px; font-weight: 600;">
              New Lead Submission!
            </h1>
            
            <p style="margin-bottom: 20px; line-height: 1.6; font-size: 16px;">
              A new lead has been submitted through the website form. Here are the details:
            </p>
            
            ${leadDataTable}
            
            <p style="margin: 30px 0; line-height: 1.6; font-size: 16px;">
              <strong>Next Steps:</strong>
            </p>
            
            <ul style="margin-bottom: 30px; line-height: 1.6; font-size: 16px;">
              <li>The lead has been added to your CRM and calendar.</li>
              <li>An automated thank you email was sent to the client.</li>
              <li>Follow up within 24-48 hours to discuss their needs.</li>
            </ul>
            
            <!-- CTA Button -->
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td align="center" style="padding: 15px 0 30px;">
                  <a href="https://harielxavier.com/admin/leads" target="_blank" style="background-color: #3d5a80; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: 500; display: inline-block; font-size: 16px;">View in Admin Dashboard</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="background-color: #f7f7f7; padding: 20px; border-radius: 4px;">
            <p style="margin: 0; text-align: center; font-size: 14px; color: #666;">
              This is an automated notification from your website.<br>
              &copy; ${new Date().getFullYear()} Hariel Xavier Photography
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
  
  // Send to all admin emails (sequentially to avoid SMTP rate limits)
  for (const adminEmail of ADMIN_EMAILS) {
    await sendEmail({
      to: adminEmail,
      from: 'Hariel Xavier Photography <forms@harielxavier.com>',
      subject,
      html: message
    });
    console.log(`Admin notification sent to: ${adminEmail}`);
  }
}

// Main function to test workflow
async function testLeadWorkflow() {
  console.log('Starting lead workflow test...');
  
  try {
    // Step 1: Create lead in Firestore (simulation)
    console.log('Creating test lead in Firestore (simulated)...');
    const leadRef = await db.collection('leads').add(testLead);
    const leadId = leadRef.id;
    console.log(`Lead created with ID: ${leadId}`);
    
    // Step 2: Create calendar entry (simulation)
    console.log('Creating calendar entry (simulated)...');
    await db.collection('calendar_events').add({
      title: `Lead: ${testLead.name} - ${testLead.eventType}`,
      date: new Date(testLead.eventDate).toISOString(),
      description: `New lead for ${testLead.eventType}. Contact: ${testLead.email}, ${testLead.phone}`,
      type: 'lead',
      leadId: leadId,
      createdAt: serverTimestamp()
    });
    console.log('Calendar entry created');
    
    // Step 3: Send thank you email to client
    console.log('Sending thank you email to client (simulation mode)...');
    // In simulation mode, we'll show the email content without actually sending it
    // Prepare client email content
    const clientEmailData = {
      to: testLead.email,
      name: testLead.name,
      eventType: testLead.eventType,
      eventDate: format(new Date(testLead.eventDate), 'MMMM dd, yyyy')
    };
    
    // Format the event type for display
    const formattedEventType = clientEmailData.eventType === 'other' ? 'Photography Services' : 
      clientEmailData.eventType.charAt(0).toUpperCase() + clientEmailData.eventType.slice(1) + ' Photography';
    
    // Create a personalized greeting
    const greeting = `Dear ${clientEmailData.name.split(' ')[0]},`;
    
    // Create the subject line
    const subject = `Thank You for Your ${formattedEventType} Inquiry | Hariel Xavier Photography`;
    
    // Generate the email content
    const clientEmailHtml = `
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
              
              <p style="margin-bottom: 20px; line-height: 1.6; font-size: 16px;">${greeting}</p>
              
              <p style="margin-bottom: 20px; line-height: 1.6; font-size: 16px;">
                Thank you for reaching out to Hariel Xavier Photography about your ${formattedEventType.toLowerCase()} needs${clientEmailData.eventDate ? ` for ${clientEmailData.eventDate}` : ''}. I'm excited about the opportunity to capture your special moments!
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
    
    console.log('\n\n======= CLIENT EMAIL PREVIEW =======');
    console.log(`TO: ${clientEmailData.to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log('\n[HTML Email Content would look like the email template shown above]\n');

    // If we actually want to send real emails
    if (process.env.SEND_ACTUAL_EMAILS === 'true') {
      await sendEmailToClient(clientEmailData);
    }
    
    // Step 4: Send notification to admin
    console.log('Sending notification emails to admins (simulation mode)...');
    // Prepare admin email content
    const adminEmailData = {
      leadId: leadId,
      leadData: {
        ...testLead,
        eventDate: format(new Date(testLead.eventDate), 'MMMM dd, yyyy')
      }
    };
    
    // Format the event type for display
    const adminFormattedEventType = adminEmailData.leadData.eventType === 'other' ? 
      (adminEmailData.leadData.customEventType || 'Custom Photography Services') : 
      adminEmailData.leadData.eventType.charAt(0).toUpperCase() + adminEmailData.leadData.eventType.slice(1) + ' Photography';
    
    // Create the subject line
    const adminSubject = `New Lead: ${adminEmailData.leadData.name} - ${adminFormattedEventType}`;
    
    // Format the lead data into a readable table
    const leadDataTable = `
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold; width: 30%;">Name</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${adminEmailData.leadData.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Email</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">
            <a href="mailto:${adminEmailData.leadData.email}">${adminEmailData.leadData.email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Phone</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">
            <a href="tel:${adminEmailData.leadData.phone}">${adminEmailData.leadData.phone}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Service Type</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${adminFormattedEventType}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Event Date</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${adminEmailData.leadData.eventDate || 'Not specified'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Location</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${adminEmailData.leadData.eventLocation || 'Not specified'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Message</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${adminEmailData.leadData.message || 'No message provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Lead ID</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${adminEmailData.leadId}</td>
        </tr>
      </table>
    `;
    
    // Create the HTML email content
    const adminEmailHtml = `
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
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 30px 0;">
              <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 20px; font-weight: 600;">
                New Lead Submission!
              </h1>
              
              <p style="margin-bottom: 20px; line-height: 1.6; font-size: 16px;">
                A new lead has been submitted through the website form. Here are the details:
              </p>
              
              ${leadDataTable}
              
              <p style="margin: 30px 0; line-height: 1.6; font-size: 16px;">
                <strong>Next Steps:</strong>
              </p>
              
              <ul style="margin-bottom: 30px; line-height: 1.6; font-size: 16px;">
                <li>The lead has been added to your CRM and calendar.</li>
                <li>An automated thank you email was sent to the client.</li>
                <li>Follow up within 24-48 hours to discuss their needs.</li>
              </ul>
              
              <!-- CTA Button -->
              <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 15px 0 30px;">
                    <a href="https://harielxavier.com/admin/leads" target="_blank" style="background-color: #3d5a80; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: 500; display: inline-block; font-size: 16px;">View in Admin Dashboard</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f7f7f7; padding: 20px; border-radius: 4px;">
              <p style="margin: 0; text-align: center; font-size: 14px; color: #666;">
                This is an automated notification from your website.<br>
                &copy; ${new Date().getFullYear()} Hariel Xavier Photography
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
    
    console.log('\n\n======= ADMIN EMAIL PREVIEW =======');
    console.log(`TO: ${ADMIN_EMAILS.join(', ')}`);
    console.log(`SUBJECT: ${adminSubject}`);
    console.log('\n[HTML Email Content would look like this:] \n');
    console.log(leadDataTable.replace(/<[^>]*>/g, ''));

    // If we actually want to send real emails
    if (process.env.SEND_ACTUAL_EMAILS === 'true') {
      await sendEmailToAdmin(adminEmailData);
    }
    
    // Step 5: Update lead record to mark emails as sent
    console.log('Updating lead record...');
    await db.collection('leads').doc(leadId).update({
      adminNotified: true,
      clientEmailed: true,
      emailsSentAt: serverTimestamp()
    });
    
    console.log('✅ Lead workflow test completed successfully!');
    console.log(`
      Summary:
      - Lead created in Firestore with ID: ${leadId}
      - Calendar entry created
      - Thank you email preview shown (would be sent to: ${testLead.email})
      - Admin notifications preview shown (would be sent to: ${ADMIN_EMAILS.join(', ')})
      - Lead record updated with email status
    `);
    
    console.log('\n\nTo send actual emails, run this script with: SEND_ACTUAL_EMAILS=true node scripts/test-lead-workflow.js');
    
  } catch (error) {
    console.error('❌ Error in lead workflow test:', error);
  }
}

// Run the test
testLeadWorkflow();
