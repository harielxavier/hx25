// Direct email sending script using Nodemailer
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log("📧 Starting direct email test with Nodemailer...");

// Create a test lead
const testLead = {
  firstName: "Mary",
  lastName: "Jane",
  email: "missiongeek@gmail.com",
  eventType: "wedding",
  eventDate: "2025-08-12"
};

// SMTP configuration for Bluehost
const smtpConfig = {
  host: 'box5804.bluehost.com',
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
const createThankYouEmail = (lead) => {
  return {
    from: '"Hariel Xavier Photography" <forms@harielxavier.com>',
    to: lead.email,
    subject: `Thank You for Your ${lead.eventType.charAt(0).toUpperCase() + lead.eventType.slice(1)} Photography Inquiry`,
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
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 30px 0;">
              <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 20px; font-weight: 600;">Thank You for Your Inquiry</h1>
              
              <p style="margin-bottom: 20px; line-height: 1.6; font-size: 16px;">Dear ${lead.firstName},</p>
              
              <p style="margin-bottom: 20px; line-height: 1.6; font-size: 16px;">
                Thank you for reaching out to Hariel Xavier Photography about your ${lead.eventType} photography needs${lead.eventDate ? ` for ${lead.eventDate}` : ''}. I'm excited about the opportunity to capture your special moments!
              </p>
              
              <p style="margin-bottom: 20px; line-height: 1.6; font-size: 16px;">
                I've received your inquiry and will be reviewing your details within the next 24-48 hours. I'll get back to you with more information about how we can work together to create beautiful, lasting memories.
              </p>
              
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
              <p style="margin: 0; text-align: center; font-size: 14px; color: #666;">
                &copy; ${new Date().getFullYear()} Hariel Xavier Photography. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };
};

// Create admin notification email content
const createAdminEmail = (lead) => {
  return {
    from: '"Hariel Xavier Photography CRM" <forms@harielxavier.com>',
    to: 'missiongeek@gmail.com, dorismelv27@gmail.com, hi@harielxavier.com',
    subject: `New Lead: ${lead.firstName} ${lead.lastName} - ${lead.eventType.charAt(0).toUpperCase() + lead.eventType.slice(1)} Photography`,
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
                  <td style="padding: 8px 12px; border: 1px solid #ddd;">${lead.firstName} ${lead.lastName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Email</td>
                  <td style="padding: 8px 12px; border: 1px solid #ddd;">${lead.email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Event Type</td>
                  <td style="padding: 8px 12px; border: 1px solid #ddd;">${lead.eventType.charAt(0).toUpperCase() + lead.eventType.slice(1)} Photography</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Event Date</td>
                  <td style="padding: 8px 12px; border: 1px solid #ddd;">${lead.eventDate || 'Not provided'}</td>
                </tr>
              </table>
              
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
};

// Send the emails
async function sendEmails() {
  try {
    console.log("📤 Sending thank you email to client...");
    const thankYouEmail = createThankYouEmail(testLead);
    const thankYouInfo = await transporter.sendMail(thankYouEmail);
    console.log("✅ Thank you email sent:", thankYouInfo.messageId);
    
    console.log("📤 Sending admin notification...");
    const adminEmail = createAdminEmail(testLead);
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
    console.log("Test completed with result:", result);
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
