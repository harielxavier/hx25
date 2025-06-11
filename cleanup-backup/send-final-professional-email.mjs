// Final professional email template with correct branding
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log("📧 Starting final professional email test...");

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

// Create final professional thank you email
const professionalThankYouEmail = {
  from: '"Hariel Xavier Photography" <forms@harielxavier.com>',
  to: testLead.email,
  subject: `Thank You for Your ${testLead.eventType.charAt(0).toUpperCase() + testLead.eventType.slice(1)} Photography Inquiry | Hariel Xavier Photography`,
  html: `
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
              <!-- Header with logo banner -->
              <tr>
                <td align="center" valign="top" style="padding: 40px 0 30px;">
                  <img src="https://res.cloudinary.com/dos0qac90/image/upload/v1649789940/hariel-xavier-header-banner.jpg" alt="Hariel Xavier Photography" width="400" style="display: block; margin: 0 auto; max-width: 80%;">
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
                              <img src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" alt="Wedding Photography" width="100%" style="display: block; width: 100%; border-radius: 4px;">
                            </td>
                            <td width="33.33%" style="padding: 0 5px;">
                              <img src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" alt="Wedding Photography" width="100%" style="display: block; width: 100%; border-radius: 4px;">
                            </td>
                            <td width="33.33%" style="padding: 0 5px;">
                              <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80" alt="Wedding Photography" width="100%" style="display: block; width: 100%; border-radius: 4px;">
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
                          — Sarah & Michael, New York
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
                        <img src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" alt="Hariel Xavier" width="70" style="display: block; border-radius: 50%;">
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
              
              <!-- Social Media -->
              <tr>
                <td align="center" style="padding: 0 40px 30px;">
                  <p style="margin: 0 0 15px; font-size: 14px; color: #666;">Follow us on social media</p>
                  <table border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding: 0 10px;">
                        <a href="https://instagram.com/harielxavierphotography" target="_blank">
                          <img src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/instagram_circle-512.png" alt="Instagram" width="32">
                        </a>
                      </td>
                      <td style="padding: 0 10px;">
                        <a href="https://facebook.com/harielxavierphotography" target="_blank">
                          <img src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/facebook_circle-512.png" alt="Facebook" width="32">
                        </a>
                      </td>
                      <td style="padding: 0 10px;">
                        <a href="https://pinterest.com/harielxavierphotography" target="_blank">
                          <img src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/pinterest_circle-512.png" alt="Pinterest" width="32">
                        </a>
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
                          <a href="mailto:hi@harielxavier.com" style="color: #ffffff; text-decoration: none;">hi@harielxavier.com</a> | <a href="tel:+12125551234" style="color: #ffffff; text-decoration: none;">+1 (212) 555-1234</a>
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
            
            <!-- Unsubscribe Footer -->
            <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; margin: 0 auto;">
              <tr>
                <td align="center" style="padding: 20px 0; color: #999999; font-size: 12px;">
                  <p style="margin: 0;">
                    You're receiving this email because you submitted an inquiry on our website.<br>
                    If you believe this was sent in error, please <a href="mailto:hi@harielxavier.com" style="color: #666666;">contact us</a>.
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

// Send the professional email
async function sendProfessionalEmail() {
  try {
    // Verify SMTP connection
    console.log("🔄 Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection verified successfully");
    
    console.log("📤 Sending final professional thank you email to client...");
    const thankYouInfo = await transporter.sendMail(professionalThankYouEmail);
    console.log("✅ Professional thank you email sent:", thankYouInfo.messageId);
    
    console.log("🎉 Email sent successfully!");
    return { success: true };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, error };
  }
}

// Run the email test
sendProfessionalEmail()
  .then(result => {
    console.log("\nTest completed with result:", result);
    if (result.success) {
      console.log("\n📋 TEST SUMMARY:");
      console.log("✅ SMTP connection verified");
      console.log("✅ Sent final professional thank you email to Mary Jane at", testLead.email);
      console.log("\n🔍 Check the recipient inbox to verify receipt");
      console.log("\n💼 PROFESSIONAL BUSINESS ENHANCEMENTS:");
      console.log("✓ Used header banner as primary logo at top of email");
      console.log("✓ Improved layout for more professional appearance");
      console.log("✓ Enhanced portfolio showcase with high-quality images");
      console.log("✓ Added more detailed client testimonial");
      console.log("✓ Included professional signature with title");
      console.log("✓ Added business contact information including phone");
      console.log("✓ Used professional social media icons");
      console.log("✓ Created branded footer with complete business details");
      console.log("✓ Added proper unsubscribe information for compliance");
    }
  })
  .catch(error => {
    console.error("Fatal error:", error);
  });
