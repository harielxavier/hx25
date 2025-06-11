/**
 * Email Template Preview Script
 * 
 * This script generates HTML previews of the enhanced email templates
 * for both client and admin emails. It saves the HTML files locally
 * so you can open them in a browser to see how they look.
 */

// Import the required modules
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current filename and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock Firebase and other dependencies
const mockFirebase = {
  functions: {},
  db: {}
};

// Import the BRAND constants and email templates
const BRAND = {
  primaryColor: '#3d5a80',
  secondaryColor: '#98c1d9',
  accentColor: '#ee6c4d',
  textColor: '#293241',
  lightGray: '#e0fbfc',
  darkGray: '#333333',
  lightText: '#ffffff',
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  logoUrl: 'https://res.cloudinary.com/dos0qac90/image/upload/v1649789940/hariel-xavier-logo.png',
  instagramUrl: 'https://instagram.com/harielxavierphotography',
  facebookUrl: 'https://facebook.com/harielxavierphotography',
  websiteUrl: 'https://harielxavier.com'
};

// Common email components for reuse
const emailHeader = `
  <tr>
    <td align="center" style="padding: 25px 0; background-color: ${BRAND.lightGray};">
      <img src="${BRAND.logoUrl}" alt="Hariel Xavier Photography" width="220" style="display: block; margin: 0 auto;">
    </td>
  </tr>
  <tr>
    <td style="height: 5px; background: linear-gradient(to right, ${BRAND.primaryColor}, ${BRAND.secondaryColor}, ${BRAND.accentColor});"></td>
  </tr>
`;

const emailFooter = `
  <tr>
    <td style="height: 2px; background-color: ${BRAND.secondaryColor};"></td>
  </tr>
  <tr>
    <td style="background-color: ${BRAND.primaryColor}; padding: 30px 20px; text-align: center;">
      <p style="color: ${BRAND.lightText}; margin-bottom: 15px; font-size: 16px;">Connect with us</p>
      
      <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
        <tr>
          <td style="padding: 0 10px;">
            <a href="${BRAND.instagramUrl}" target="_blank" style="display: inline-block;">
              <img src="https://res.cloudinary.com/dos0qac90/image/upload/v1649789940/icons/instagram-white.png" alt="Instagram" width="32" height="32">
            </a>
          </td>
          <td style="padding: 0 10px;">
            <a href="${BRAND.facebookUrl}" target="_blank" style="display: inline-block;">
              <img src="https://res.cloudinary.com/dos0qac90/image/upload/v1649789940/icons/facebook-white.png" alt="Facebook" width="32" height="32">
            </a>
          </td>
          <td style="padding: 0 10px;">
            <a href="${BRAND.websiteUrl}" target="_blank" style="display: inline-block;">
              <img src="https://res.cloudinary.com/dos0qac90/image/upload/v1649789940/icons/website-white.png" alt="Website" width="32" height="32">
            </a>
          </td>
        </tr>
      </table>
      
      <p style="color: ${BRAND.lightText}; margin-top: 20px; font-size: 14px;">
        © ${new Date().getFullYear()} Hariel Xavier Photography. All rights reserved.
      </p>
    </td>
  </tr>
`;

// Generate Client Email Preview
function generateClientEmail() {
  // Sample client data
  const params = {
    to: 'client@example.com',
    name: 'Sarah Johnson',
    eventType: 'wedding',
    eventDate: 'June 15, 2025'
  };
  
  const { name, eventType, eventDate } = params;
  
  // Format the event type for display
  const formattedEventType = eventType === 'other' ? 'Photography Services' : 
    eventType.charAt(0).toUpperCase() + eventType.slice(1) + ' Photography';
  
  // Create a personalized greeting
  const greeting = `Dear ${name.split(' ')[0]},`;
  
  // Create the subject line
  const subject = `Thank You for Your ${formattedEventType} Inquiry | Hariel Xavier Photography`;
  
  // Create the enhanced HTML email content with improved branding
  const message = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You for Your Inquiry | Hariel Xavier Photography</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: ${BRAND.fontFamily}; color: ${BRAND.textColor}; background-color: #f9f9f9;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 650px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
        
        <!-- Header with Logo -->
        ${emailHeader}
        
        <!-- Hero Image -->
        <tr>
          <td>
            <img src="https://res.cloudinary.com/dos0qac90/image/upload/c_fill,g_auto,h_300,w_650/v1649789940/email-header-image.jpg" 
                 alt="Hariel Xavier Photography" width="100%" style="display: block;">
          </td>
        </tr>
        
        <!-- Main Content -->
        <tr>
          <td style="padding: 40px 30px;">
            <h1 style="color: ${BRAND.primaryColor}; font-size: 28px; margin-bottom: 25px; font-weight: 600; text-align: center;">Thank You for Your Inquiry</h1>
            
            <p style="margin-bottom: 20px; line-height: 1.6; font-size: 16px;">${greeting}</p>
            
            <p style="margin-bottom: 20px; line-height: 1.6; font-size: 16px;">
              Thank you for reaching out to Hariel Xavier Photography about your ${formattedEventType.toLowerCase()} needs${eventDate ? ` for ${eventDate}` : ''}. I'm excited about the opportunity to capture your special moments!
            </p>
            
            <div style="background-color: ${BRAND.lightGray}; border-left: 4px solid ${BRAND.accentColor}; padding: 20px; margin: 25px 0;">
              <p style="margin: 0; line-height: 1.6; font-size: 16px;">
                <strong>What happens next:</strong><br>
                I'll be reviewing your details within the next 24-48 hours and will get back to you with more information about how we can work together to create beautiful, lasting memories.
              </p>
            </div>
            
            <p style="margin-bottom: 30px; line-height: 1.6; font-size: 16px;">
              While you wait, I'd love to know: what inspired you to capture these moments with professional photography? Understanding your vision helps me tailor my services to your specific needs.
            </p>
            
            <!-- Portfolio Showcase -->
            <h3 style="color: ${BRAND.primaryColor}; font-size: 20px; margin: 30px 0 15px; font-weight: 600; text-align: center;">From My Portfolio</h3>
            
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td width="32%" style="padding-right: 2%;">
                  <img src="https://res.cloudinary.com/dos0qac90/image/upload/c_fill,g_faces,h_200,w_200/v1649789940/portfolio/sample1.jpg" 
                       alt="Portfolio Image 1" width="100%" style="display: block; border-radius: 4px;">
                </td>
                <td width="32%" style="padding-right: 2%;">
                  <img src="https://res.cloudinary.com/dos0qac90/image/upload/c_fill,g_faces,h_200,w_200/v1649789940/portfolio/sample2.jpg" 
                       alt="Portfolio Image 2" width="100%" style="display: block; border-radius: 4px;">
                </td>
                <td width="32%">
                  <img src="https://res.cloudinary.com/dos0qac90/image/upload/c_fill,g_faces,h_200,w_200/v1649789940/portfolio/sample3.jpg" 
                       alt="Portfolio Image 3" width="100%" style="display: block; border-radius: 4px;">
                </td>
              </tr>
            </table>
            
            <!-- CTA Button -->
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td align="center" style="padding: 35px 0;">
                  <a href="https://harielxavier.com/pricing" target="_blank" 
                     style="background-color: ${BRAND.accentColor}; color: ${BRAND.lightText}; padding: 14px 35px; 
                            text-decoration: none; border-radius: 4px; font-weight: 500; display: inline-block; 
                            font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">
                    View Pricing & Packages
                  </a>
                </td>
              </tr>
            </table>
            
            <p style="line-height: 1.6; font-size: 16px; margin-bottom: 10px;">
              Looking forward to connecting with you soon,
            </p>
            
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 20px;">
              <tr>
                <td width="80" style="vertical-align: top;">
                  <img src="https://res.cloudinary.com/dos0qac90/image/upload/c_fill,g_face,h_80,w_80,r_max/v1649789940/hariel-signature-photo.jpg" 
                       alt="Hariel Xavier" width="70" height="70" style="border-radius: 50%; display: block;">
                </td>
                <td style="vertical-align: middle; padding-left: 15px;">
                  <p style="margin: 0; line-height: 1.4; font-size: 18px; font-weight: 600; color: ${BRAND.primaryColor};">
                    Hariel Xavier
                  </p>
                  <p style="margin: 5px 0 0; line-height: 1.4; font-size: 14px; color: ${BRAND.darkGray};">
                    Photographer & Founder<br>
                    Hariel Xavier Photography
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Footer -->
        ${emailFooter}
        
      </table>
    </body>
    </html>
  `;
  
  return { subject, message };
}

// Generate Admin Email Preview
function generateAdminEmail() {
  // Sample lead data
  const leadId = 'lead_' + Math.random().toString(36).substring(2, 10);
  const leadData = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '(555) 123-4567',
    eventType: 'wedding',
    eventDate: 'June 15, 2025',
    eventLocation: 'Oceanside Resort, Miami',
    message: 'Hello! My fiancé and I are planning our wedding and we love your portfolio. We would like to discuss your availability and packages for our special day.'
  };
  
  // Format the event type for display
  const formattedEventType = leadData.eventType === 'other' ? 'Photography Services' : 
    leadData.eventType.charAt(0).toUpperCase() + leadData.eventType.slice(1) + ' Photography';
  
  // Create the subject line
  const subject = `New Lead: ${leadData.name} - ${formattedEventType}`;
  
  // Format the lead data into a readable table with enhanced branding
  const leadDataTable = `
    <table style="width: 100%; border-collapse: collapse; margin: 0;">
      <tr>
        <td style="padding: 12px 15px; background-color: ${BRAND.primaryColor}; color: ${BRAND.lightText}; font-weight: bold; width: 30%;">Name</td>
        <td style="padding: 12px 15px; border-bottom: 1px solid ${BRAND.lightGray};">${leadData.name}</td>
      </tr>
      <tr>
        <td style="padding: 12px 15px; background-color: ${BRAND.primaryColor}; color: ${BRAND.lightText}; font-weight: bold;">Email</td>
        <td style="padding: 12px 15px; border-bottom: 1px solid ${BRAND.lightGray};">
          <a href="mailto:${leadData.email}" style="color: ${BRAND.accentColor}; text-decoration: none;">${leadData.email}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 15px; background-color: ${BRAND.primaryColor}; color: ${BRAND.lightText}; font-weight: bold;">Phone</td>
        <td style="padding: 12px 15px; border-bottom: 1px solid ${BRAND.lightGray};">
          <a href="tel:${leadData.phone}" style="color: ${BRAND.accentColor}; text-decoration: none;">${leadData.phone}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 15px; background-color: ${BRAND.primaryColor}; color: ${BRAND.lightText}; font-weight: bold;">Service Type</td>
        <td style="padding: 12px 15px; border-bottom: 1px solid ${BRAND.lightGray};"><strong>${formattedEventType}</strong></td>
      </tr>
      <tr>
        <td style="padding: 12px 15px; background-color: ${BRAND.primaryColor}; color: ${BRAND.lightText}; font-weight: bold;">Event Date</td>
        <td style="padding: 12px 15px; border-bottom: 1px solid ${BRAND.lightGray};">${leadData.eventDate || 'Not specified'}</td>
      </tr>
      <tr>
        <td style="padding: 12px 15px; background-color: ${BRAND.primaryColor}; color: ${BRAND.lightText}; font-weight: bold;">Location</td>
        <td style="padding: 12px 15px; border-bottom: 1px solid ${BRAND.lightGray};">${leadData.eventLocation || 'Not specified'}</td>
      </tr>
      <tr>
        <td style="padding: 12px 15px; background-color: ${BRAND.primaryColor}; color: ${BRAND.lightText}; font-weight: bold;">Message</td>
        <td style="padding: 12px 15px; border-bottom: 1px solid ${BRAND.lightGray}; line-height: 1.5;">${leadData.message || 'No message provided'}</td>
      </tr>
      <tr>
        <td style="padding: 12px 15px; background-color: ${BRAND.primaryColor}; color: ${BRAND.lightText}; font-weight: bold;">Lead ID</td>
        <td style="padding: 12px 15px;">${leadId}</td>
      </tr>
    </table>
  `;
  
  // Create the enhanced HTML email content with improved branding
  const message = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Lead Notification | Hariel Xavier Photography</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: ${BRAND.fontFamily}; color: ${BRAND.textColor}; background-color: #f9f9f9;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 650px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
        
        <!-- Header with Logo -->
        ${emailHeader}
        
        <!-- Main Content -->
        <tr>
          <td style="padding: 40px 30px;">
            <h1 style="color: ${BRAND.primaryColor}; font-size: 28px; margin-bottom: 25px; font-weight: 600; text-align: center;">
              <span style="color: ${BRAND.accentColor};">New Lead</span> Submission!
            </h1>
            
            <p style="margin-bottom: 20px; line-height: 1.6; font-size: 16px;">
              A new lead has been submitted through the website form. Here are the details:
            </p>
            
            <!-- Enhanced Lead Data Table -->
            <div style="border: 1px solid ${BRAND.secondaryColor}; border-radius: 6px; overflow: hidden; margin: 25px 0;">
              ${leadDataTable}
            </div>
            
            <!-- Action Box -->
            <div style="background-color: ${BRAND.lightGray}; border-left: 4px solid ${BRAND.primaryColor}; padding: 20px; margin: 25px 0;">
              <h3 style="margin-top: 0; color: ${BRAND.primaryColor}; font-size: 18px;">Next Steps:</h3>
              <ul style="margin-bottom: 0; padding-left: 20px; line-height: 1.6; font-size: 16px;">
                <li>The lead has been added to your CRM and calendar.</li>
                <li>An automated thank you email was sent to the client.</li>
                <li>Follow up within 24-48 hours to discuss their needs.</li>
              </ul>
            </div>
            
            <!-- CTA Button -->
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td align="center" style="padding: 30px 0;">
                  <a href="https://harielxavier.com/admin/leads" target="_blank" 
                     style="background-color: ${BRAND.primaryColor}; color: ${BRAND.lightText}; padding: 14px 35px; 
                            text-decoration: none; border-radius: 4px; font-weight: 500; display: inline-block; 
                            font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">
                    View in Admin Dashboard
                  </a>
                </td>
              </tr>
            </table>
            
            <!-- Lead Stats -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 20px; background-color: #f9f9f9; border-radius: 6px;">
              <tr>
                <td style="padding: 15px; text-align: center; border-right: 1px solid #eee; width: 33%;">
                  <p style="margin: 0; font-size: 14px; color: ${BRAND.darkGray};">Lead ID</p>
                  <p style="margin: 5px 0 0; font-size: 16px; font-weight: 600; color: ${BRAND.primaryColor};">${leadId.substring(0, 8)}...</p>
                </td>
                <td style="padding: 15px; text-align: center; border-right: 1px solid #eee; width: 33%;">
                  <p style="margin: 0; font-size: 14px; color: ${BRAND.darkGray};">Service Type</p>
                  <p style="margin: 5px 0 0; font-size: 16px; font-weight: 600; color: ${BRAND.primaryColor};">${formattedEventType}</p>
                </td>
                <td style="padding: 15px; text-align: center; width: 33%;">
                  <p style="margin: 0; font-size: 14px; color: ${BRAND.darkGray};">Submission Time</p>
                  <p style="margin: 5px 0 0; font-size: 16px; font-weight: 600; color: ${BRAND.primaryColor};">${new Date().toLocaleString()}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Footer -->
        ${emailFooter}
        
      </table>
    </body>
    </html>
  `;
  
  return { subject, message };
}

// Generate and save the email previews
function generateAndSaveEmailPreviews() {
  // Create output directory if it doesn't exist
  const outputDir = path.join(__dirname, 'email-previews');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  
  // Generate client email
  const clientEmail = generateClientEmail();
  fs.writeFileSync(
    path.join(outputDir, 'client-email-preview.html'),
    clientEmail.message
  );
  
  // Generate admin email
  const adminEmail = generateAdminEmail();
  fs.writeFileSync(
    path.join(outputDir, 'admin-email-preview.html'),
    adminEmail.message
  );
  
  console.log('Email previews generated successfully!');
  console.log(`Client email preview saved to: ${path.join(outputDir, 'client-email-preview.html')}`);
  console.log(`Admin email preview saved to: ${path.join(outputDir, 'admin-email-preview.html')}`);
}

// Run the preview generator
generateAndSaveEmailPreviews();
