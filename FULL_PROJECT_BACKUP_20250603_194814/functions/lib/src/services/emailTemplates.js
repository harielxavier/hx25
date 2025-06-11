"use strict";
// Email templates for Hariel Xavier Photography
// Uses actual project assets and branding
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminNotificationTemplate = exports.createThankYouEmailTemplate = void 0;
/**
 * Creates a thank you email template for client inquiries
 * @param name Client's name
 * @param email Client's email address
 * @param eventType Type of event (wedding, portrait, etc.)
 * @param eventDate Date of the event if provided
 * @returns HTML email template
 */
const createThankYouEmailTemplate = (name, email, eventType = 'wedding', eventDate) => {
    // Format the event type for display
    const formattedEventType = eventType === 'other' ?
        'Photography Services' :
        eventType.charAt(0).toUpperCase() + eventType.slice(1) + ' Photography';
    return `
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
                  <img src="/logo.svg" alt="Hariel Xavier Photography" width="250" style="display: block; margin: 0 auto;">
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
                  
                  <p style="margin: 0 0 20px; line-height: 1.6; font-size: 16px;">Dear ${name.split(' ')[0]},</p>
                  
                  <p style="margin: 0 0 20px; line-height: 1.6; font-size: 16px;">
                    Thank you for reaching out to Hariel Xavier Photography about your ${eventType} photography needs${eventDate ? ` for ${eventDate}` : ''}. I'm truly excited about the opportunity to capture your special moments and create timeless memories for you.
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
                              <img src="/MoStuff/Featured Wedding/Ansimon & Mina's Wedding/Annie & Steve Ansimon & Mina Wedding additional-1028_websize.jpg" alt="Wedding Photography" width="100%" style="display: block; width: 100%; border-radius: 4px;">
                            </td>
                            <td width="33.33%" style="padding: 0 5px;">
                              <img src="/MoStuff/Featured Wedding/Ansimon & Mina's Wedding/Annie & Steve Ansimon & Mina Wedding additional-1069_websize.jpg" alt="Wedding Photography" width="100%" style="display: block; width: 100%; border-radius: 4px;">
                            </td>
                            <td width="33.33%" style="padding: 0 5px;">
                              <img src="/MoStuff/Featured Wedding/Ansimon & Mina's Wedding/Annie & Steve Ansimon & Mina Wedding additional-1156_websize.jpg" alt="Wedding Photography" width="100%" style="display: block; width: 100%; border-radius: 4px;">
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
                        <img src="/MoStuff/portrait.jpg" alt="Hariel Xavier" width="70" style="display: block; border-radius: 50%;">
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
  `;
};
exports.createThankYouEmailTemplate = createThankYouEmailTemplate;
/**
 * Creates an admin notification email template for new leads
 * @param leadData Lead data including name, email, event details
 * @param leadId Firestore lead ID
 * @returns HTML email template
 */
const createAdminNotificationTemplate = (leadData, leadId) => {
    // Format the event type for display
    const formattedEventType = !leadData.eventType ? 'Photography Services' :
        leadData.eventType === 'other' ?
            'Custom Photography Services' :
            leadData.eventType.charAt(0).toUpperCase() + leadData.eventType.slice(1) + ' Photography';
    return `
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
                  <img src="/logo.svg" alt="Hariel Xavier Photography" width="250" style="display: block; margin: 0 auto;">
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
                  
                  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr>
                      <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold; width: 30%;">Name</td>
                      <td style="padding: 8px 12px; border: 1px solid #ddd;">${leadData.firstName} ${leadData.lastName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Email</td>
                      <td style="padding: 8px 12px; border: 1px solid #ddd;">${leadData.email}</td>
                    </tr>
                    ${leadData.phone ? `
                    <tr>
                      <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Phone</td>
                      <td style="padding: 8px 12px; border: 1px solid #ddd;">${leadData.phone}</td>
                    </tr>
                    ` : ''}
                    <tr>
                      <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Event Type</td>
                      <td style="padding: 8px 12px; border: 1px solid #ddd;">${formattedEventType}</td>
                    </tr>
                    ${leadData.eventDate ? `
                    <tr>
                      <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Event Date</td>
                      <td style="padding: 8px 12px; border: 1px solid #ddd;">${leadData.eventDate}</td>
                    </tr>
                    ` : ''}
                    ${leadData.message ? `
                    <tr>
                      <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Message</td>
                      <td style="padding: 8px 12px; border: 1px solid #ddd;">${leadData.message}</td>
                    </tr>
                    ` : ''}
                    <tr>
                      <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Source</td>
                      <td style="padding: 8px 12px; border: 1px solid #ddd;">${leadData.source || 'Website Inquiry'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Lead ID</td>
                      <td style="padding: 8px 12px; border: 1px solid #ddd;">${leadId}</td>
                    </tr>
                  </table>
                  
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
};
exports.createAdminNotificationTemplate = createAdminNotificationTemplate;
//# sourceMappingURL=emailTemplates.js.map