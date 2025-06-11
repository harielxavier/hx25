// Production email sending script using Nodemailer with actual SMTP settings
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log("📧 Starting email test with production SMTP settings...");

// Create a test lead
const testLead = {
  firstName: "Mary",
  lastName: "Jane",
  email: "missiongeek@gmail.com",
  eventType: "wedding",
  eventDate: "2025-08-12"
};

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

// Create thank you email content
const thankYouEmail = {
  from: '"Hariel Xavier Photography" <forms@harielxavier.com>',
  to: testLead.email,
  subject: `Thank You for Your ${testLead.eventType.charAt(0).toUpperCase() + testLead.eventType.slice(1)} Photography Inquiry`,
  html: `
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
            
            <p style="margin-bottom: 20px; line-height: 1.6; font-size: 16px;">Dear ${testLead.firstName},</p>
            
            <p style="margin-bottom: 20px; line-height: 1.6; font-size: 16px;">
              Thank you for reaching out to Hariel Xavier Photography about your ${testLead.eventType} photography needs${testLead.eventDate ? ` for ${testLead.eventDate}` : ''}. I'm excited about the opportunity to capture your special moments!
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
  `
};

// Create admin notification email content
const adminEmail = {
  from: '"Hariel Xavier Photography CRM" <forms@harielxavier.com>',
  to: 'missiongeek@gmail.com, dorismelv27@gmail.com, hi@harielxavier.com',
  subject: `New Lead: ${testLead.firstName} ${testLead.lastName} - ${testLead.eventType.charAt(0).toUpperCase() + testLead.eventType.slice(1)} Photography`,
  html: `
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
                <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Event Type</td>
                <td style="padding: 8px 12px; border: 1px solid #ddd;">${testLead.eventType.charAt(0).toUpperCase() + testLead.eventType.slice(1)} Photography</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Event Date</td>
                <td style="padding: 8px 12px; border: 1px solid #ddd;">${testLead.eventDate || 'Not provided'}</td>
              </tr>
            </table>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="https://harielxavier.com/admin/leads" style="background-color: #3d5a80; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: 500; display: inline-block; font-size: 16px;">
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
  `
};

// Send the emails
async function sendEmails() {
  try {
    // Verify SMTP connection
    console.log("🔄 Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection verified successfully");
    
    console.log("📤 Sending thank you email to client...");
    const thankYouInfo = await transporter.sendMail(thankYouEmail);
    console.log("✅ Thank you email sent:", thankYouInfo.messageId);
    
    console.log("📤 Sending admin notification...");
    const adminInfo = await transporter.sendMail(adminEmail);
    console.log("✅ Admin notification sent:", adminInfo.messageId);
    
    console.log("🎉 All emails sent successfully!");
    return { success: true };
  } catch (error) {
    console.error("❌ Error sending emails:", error);
    return { success: false, error };
  }
}

// Run the email test
sendEmails()
  .then(result => {
    console.log("\nTest completed with result:", result);
    if (result.success) {
      console.log("\n📋 TEST SUMMARY:");
      console.log("✅ SMTP connection verified");
      console.log("✅ Sent thank you email to Mary Jane at", testLead.email);
      console.log("✅ Sent admin notification to missiongeek@gmail.com, dorismelv27@gmail.com, hi@harielxavier.com");
      console.log("\n🔍 Check the recipient inboxes to verify receipt");
    }
  })
  .catch(error => {
    console.error("Fatal error:", error);
  });
