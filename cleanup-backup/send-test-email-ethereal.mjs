// Direct email testing script using Nodemailer with Ethereal Email
import nodemailer from 'nodemailer';

console.log("📧 Starting email test with Ethereal Email (fake SMTP service)...");

// Create a test lead
const testLead = {
  firstName: "Mary",
  lastName: "Jane",
  email: "missiongeek@gmail.com",
  eventType: "wedding",
  eventDate: "2025-08-12"
};

async function main() {
  // Create a test account on Ethereal
  console.log("Creating test email account...");
  const testAccount = await nodemailer.createTestAccount();
  console.log("Test account created:", testAccount.user);

  // Create a transporter using the test account
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });

  // Create thank you email content
  const thankYouEmail = {
    from: '"Hariel Xavier Photography" <test@harielxavier.com>',
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

  // Create admin notification email content
  const adminEmail = {
    from: '"Hariel Xavier Photography CRM" <test@harielxavier.com>',
    to: 'missiongeek@gmail.com',
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

  try {
    // Send thank you email
    console.log("📤 Sending thank you email to client...");
    const thankYouInfo = await transporter.sendMail(thankYouEmail);
    console.log("✅ Thank you email sent:", thankYouInfo.messageId);
    console.log("📨 Preview URL:", nodemailer.getTestMessageUrl(thankYouInfo));
    
    // Send admin notification
    console.log("📤 Sending admin notification...");
    const adminInfo = await transporter.sendMail(adminEmail);
    console.log("✅ Admin notification sent:", adminInfo.messageId);
    console.log("📨 Preview URL:", nodemailer.getTestMessageUrl(adminInfo));
    
    console.log("🎉 All emails sent successfully!");
    return {
      success: true,
      thankYouPreview: nodemailer.getTestMessageUrl(thankYouInfo),
      adminPreview: nodemailer.getTestMessageUrl(adminInfo)
    };
  } catch (error) {
    console.error("❌ Error sending emails:", error);
    return { success: false, error };
  }
}

// Run the email test
main()
  .then(result => {
    console.log("\nTest completed with result:", result);
    if (result.success) {
      console.log("\n📋 TEST SUMMARY:");
      console.log("✅ Created test email account");
      console.log("✅ Sent thank you email to Mary Jane");
      console.log("✅ Sent admin notification");
      console.log("\n🔍 You can view the sent emails at the preview URLs above");
    }
  })
  .catch(error => {
    console.error("Fatal error:", error);
  });
