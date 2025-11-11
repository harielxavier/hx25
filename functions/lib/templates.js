"use strict";
// Email templates specifically for Cloud Functions
// Copied from ../src/services/emailTemplates.ts to keep functions self-contained
Object.defineProperty(exports, "__esModule", { value: true });
exports.createThankYouEmailTemplate = exports.createAdminNotificationTemplate = void 0;
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
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; background-color: #000000;">
      <!-- Main container -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; background-color: #000000;">
        <tr>
          <td align="center" valign="top">
            <!-- Email container -->
            <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 0; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
              <!-- Header with logo -->
              <tr>
                <td align="center" valign="top" style="padding: 40px 0 30px;">
                  <img src="https://harielxavier.com/MoStuff/black.png" alt="Hariel Xavier Photography" width="250" style="display: block; margin: 0 auto;">
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
                  <h1 style="color: #000000; font-size: 28px; margin: 0 0 20px; font-weight: 600; text-align: center; font-family: 'Playfair Display', Georgia, serif;">New Lead Notification</h1>
                  
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
                      <td style="padding: 8px 12px; border: 1px solid #ddd;">
                        ${leadData.eventDate}
                        ${leadData.dateAvailability ? `
                          <span style="margin-left: 10px; padding: 2px 6px; font-size: 12px; border-radius: 3px; ${leadData.dateAvailability === 'Available'
        ? 'background-color: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7;'
        : 'background-color: #ffebee; color: #c62828; border: 1px solid #ef9a9a;'}">
                            ${leadData.dateAvailability}
                          </span>
                        ` : ''}
                      </td>
                    </tr>
                    ` : ''}
                    ${leadData.venue ? `
                    <tr>
                      <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Venue</td>
                      <td style="padding: 8px 12px; border: 1px solid #ddd;">${leadData.venue}</td>
                    </tr>
                    ` : ''}
                    ${leadData.guestCount ? `
                    <tr>
                      <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Guest Count</td>
                      <td style="padding: 8px 12px; border: 1px solid #ddd;">${leadData.guestCount}</td>
                    </tr>
                    ` : ''}
                    ${leadData.budget ? `
                    <tr>
                      <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Budget</td>
                      <td style="padding: 8px 12px; border: 1px solid #ddd;">${leadData.budget}</td>
                    </tr>
                    ` : ''}
                    ${leadData.photographyStyle && leadData.photographyStyle.length > 0 ? `
                    <tr>
                      <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Photography Style</td>
                      <td style="padding: 8px 12px; border: 1px solid #ddd;">${leadData.photographyStyle.join(', ')}</td>
                    </tr>
                    ` : ''}
                    ${leadData.mustHaveShots && leadData.mustHaveShots.length > 0 ? `
                    <tr>
                      <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Must-Have Shots</td>
                      <td style="padding: 8px 12px; border: 1px solid #ddd;">${leadData.mustHaveShots.join(', ')}</td>
                    </tr>
                    ` : ''}
                    ${leadData.additionalServices && leadData.additionalServices.length > 0 ? `
                    <tr>
                      <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">Additional Services</td>
                      <td style="padding: 8px 12px; border: 1px solid #ddd;">${leadData.additionalServices.join(', ')}</td>
                    </tr>
                    ` : ''}
                    ${leadData.hearAboutUs ? `
                    <tr>
                      <td style="padding: 8px 12px; background-color: #f2f2f2; font-weight: bold;">How They Found Us</td>
                      <td style="padding: 8px 12px; border: 1px solid #ddd;">${leadData.hearAboutUs}</td>
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
                    <a href="https://harielxavier.com/admin/leads/${leadId}" style="background-color: #000000; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 0; font-weight: 500; display: inline-block; font-size: 16px;">
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
                <td style="background-color: #000000; padding: 30px 40px; border-bottom-left-radius: 0; border-bottom-right-radius: 0;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" style="color: #ffffff; font-size: 14px; line-height: 1.6;">
                        <p style="margin: 0 0 10px;">
                          Hariel Xavier Photography<br>
                          Sparta, NJ<br>
                          <a href="mailto:Hi@HarielXavier.com" style="color: #ffffff; text-decoration: none;">Hi@HarielXavier.com</a>
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
/**
 * Creates a thank you email template for client inquiries
 * @param name Client's name
 * @param email Client's email address
 * @param eventType Type of event (wedding, portrait, etc.)
 * @param eventDate Date of the event if provided
 * @param isDateAvailable Boolean indicating if the requested date is available
 * @returns HTML email template
 */
const createThankYouEmailTemplate = (name, email, eventType = 'wedding', eventDate, isDateAvailable) => {
    // Format the event type for display (unused but kept for reference)
    // const formattedEventTypeDisplay = eventType === 'other' ? 
    //   'Photography Services' : 
    //   eventType.charAt(0).toUpperCase() + eventType.slice(1) + ' Photography';
    // Determine availability message
    let availabilityMessage = '';
    if (eventDate && isDateAvailable !== undefined) {
        if (isDateAvailable) {
            availabilityMessage = `
        <div style="background-color: #f0f7ee; border-left: 4px solid #4caf50; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; font-size: 16px; color: #2e7d32; font-weight: 600;">
            I'm currently available for your wedding on ${eventDate}!
          </p>
          <p style="margin: 10px 0 0; font-size: 14px; color: #4a6a8a;">
            I'd love to learn more about what you're envisioning. What parts of the day are you most excited about? What do you want your photos to remind you of years from now?
          </p>
        </div>
      `;
        }
        else {
            availabilityMessage = `
        <div style="background-color: #fef6f6; border-left: 4px solid #f44336; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; font-size: 16px; color: #c62828; font-weight: 600;">
            I'm currently booked on ${eventDate}.
          </p>
          <p style="margin: 10px 0 0; font-size: 14px; color: #4a6a8a;">
            I'd love to recommend some talented photographer colleagues who might be available. Alternatively, if your date is flexible, let me know and we can check other dates.
          </p>
        </div>
      `;
        }
    }
    // NOTE: Image paths like "/logo.svg" or "/MoStuff/..." might not work correctly
    // when sent from a Cloud Function unless they are absolute URLs pointing to
    // publicly accessible resources (e.g., hosted on Firebase Hosting or a CDN).
    // Consider replacing relative paths with absolute URLs.
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
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; background-color: #000000;">
      <!-- Preheader text (hidden) -->
      <div style="display: none; max-height: 0px; overflow: hidden;">
        Thank you for your interest in Hariel Xavier Photography. We've received your inquiry and will be in touch soon.
      </div>
      
      <!-- Main container -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; background-color: #000000;">
        <tr>
          <td align="center" valign="top">
            <!-- Email container -->
            <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 0; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
              <!-- Header with logo -->
              <tr>
                <td align="center" valign="top" style="padding: 40px 0 30px;">
                  <img src="https://harielxavier.com/MoStuff/black.png" alt="Hariel Xavier Photography" width="250" style="display: block; margin: 0 auto;">
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
                  <h1 style="color: #000000; font-size: 28px; margin: 0 0 20px; font-weight: 600; text-align: center; font-family: 'Playfair Display', Georgia, serif;">Thank You for Your Inquiry</h1>
                  
                  <p style="margin: 0 0 20px; line-height: 1.6; font-size: 16px;">Hi ${name.split(' ')[0]},</p>
                  
                  <p style="margin: 0 0 20px; line-height: 1.6; font-size: 16px;">
                    Congratulations on your engagement — and thank you for reaching out to Hariel Xavier Photography. This is such an incredible chapter in your lives, and I'm truly honored to be considered as the one to document it.
                  </p>
                  
                  <p style="margin: 0 0 20px; line-height: 1.6; font-size: 16px;">
                    What I love most about this work is getting to know each couple and telling their story in a way that feels real, emotional, and true to who they are. Your wedding isn't just a day — it's a collection of moments, glances, laughter, and love that deserves to be remembered exactly as it felt.
                  </p>
                  
                  ${availabilityMessage}
                  
                  <p style="margin: 0 0 20px; line-height: 1.6; font-size: 16px;">
                    I'd love to learn more about what you're envisioning. What parts of the day are you most excited about? What do you want your photos to remind you of years from now?
                  </p>
                  
                  <p style="margin: 0 0 20px; line-height: 1.6; font-size: 16px;">
                    Attached, you'll find my wedding collections and pricing to help you get started. You can also take a look at some recent stories I've had the honor of capturing on <a href="https://www.instagram.com/harielxaviermedia/" style="color: #d4af37; text-decoration: underline;">Instagram</a>.
                  </p>
                  
                  <p style="margin: 0 0 30px; line-height: 1.6; font-size: 16px;">
                    Feel free to reply with any questions — I'd love to hear from you and connect further.
                  </p>
                </td>
              </tr>
              
              <!-- Signature -->
              <tr>
                <td style="padding: 0 40px 40px;">
                    <p style="margin: 0 0 5px; line-height: 1.6; font-size: 16px;">
                      Warmly,
                    </p>
                  
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 20px;">
                    <tr>
                      <td width="80" style="vertical-align: top;">
                        <img src="https://harielxavier.com/view/Portrait.png" alt="Mauricio Fernandez" width="70" style="display: block; border-radius: 50%;">
                      </td>
                      <td style="vertical-align: middle;">
                        <p style="margin: 0 0 5px; font-size: 18px; font-weight: 600; color: #333; font-family: Georgia, serif;">
                          Mauricio Fernandez
                        </p>
                        <p style="margin: 0; font-size: 14px; color: #666;">
                          Hariel Xavier Photography<br>
                          Phone: (862) 355-3502<br>
                          Email: Hi@HarielXavier.com
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #000000; padding: 30px 40px; border-bottom-left-radius: 0; border-bottom-right-radius: 0;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" style="color: #ffffff; font-size: 14px; line-height: 1.6;">
                        <p style="margin: 0 0 10px;">
                          Hariel Xavier Photography<br>
                          Sparta, NJ<br>
                          <a href="mailto:Hi@HarielXavier.com" style="color: #ffffff; text-decoration: none;">Hi@HarielXavier.com</a>
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
                    If you believe this was sent in error, please <a href="mailto:Hi@HarielXavier.com" style="color: #666666;">contact us</a>.
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
// NOTE: createAdminNotificationTemplate was not copied as it's not needed for the onLeadCreated trigger.
//# sourceMappingURL=templates.js.map