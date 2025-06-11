/**
 * Enhanced email templates with branding for Hariel Xavier Photography
 * These templates provide a consistent, professional look for all emails
 */

// Brand colors and styling constants
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

/**
 * Generate a client thank you email with enhanced branding
 * 
 * @param {Object} params - Parameters for the email
 * @param {string} params.name - Client's name
 * @param {string} params.eventType - Type of event (wedding, portrait, etc.)
 * @param {string} params.eventDate - Date of the event (optional)
 * @returns {string} HTML email content
 */
export function generateClientEmail(params) {
  const { name, eventType, eventDate } = params;
  
  // Format the event type for display
  const formattedEventType = eventType === 'other' ? 'Photography Services' : 
    eventType.charAt(0).toUpperCase() + eventType.slice(1) + ' Photography';
  
  // Create a personalized greeting
  const greeting = `Dear ${name.split(' ')[0]},`;
  
  return `
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
        <tr>
          <td align="center" style="padding: 25px 0; background-color: ${BRAND.lightGray};">
            <img src="${BRAND.logoUrl}" alt="Hariel Xavier Photography" width="220" style="display: block; margin: 0 auto;">
          </td>
        </tr>
        <tr>
          <td style="height: 5px; background: linear-gradient(to right, ${BRAND.primaryColor}, ${BRAND.secondaryColor}, ${BRAND.accentColor});"></td>
        </tr>
        
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
        
      </table>
    </body>
    </html>
  `;
}

/**
 * Generate an admin notification email with enhanced branding
 * 
 * @param {Object} params - Parameters for the email
 * @param {string} params.leadId - ID of the lead
 * @param {Object} params.leadData - Lead data object
 * @returns {string} HTML email content
 */
export function generateAdminEmail(params) {
  const { leadId, leadData } = params;
  
  // Format the event type for display
  const formattedEventType = leadData.eventType === 'other' ? 
    (leadData.customEventType || 'Custom Photography Services') : 
    leadData.eventType.charAt(0).toUpperCase() + leadData.eventType.slice(1) + ' Photography';
  
  // Format the lead data into a readable table
  const leadDataTable = `
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #ddd;">
      <tr>
        <td style="padding: 12px 15px; background-color: ${BRAND.primaryColor}; font-weight: bold; width: 30%; color: white; border: 1px solid #ddd;">Name</td>
        <td style="padding: 12px 15px; border: 1px solid #ddd;">${leadData.firstName} ${leadData.lastName}</td>
      </tr>
      <tr>
        <td style="padding: 12px 15px; background-color: ${BRAND.primaryColor}; font-weight: bold; color: white; border: 1px solid #ddd;">Email</td>
        <td style="padding: 12px 15px; border: 1px solid #ddd;">
          <a href="mailto:${leadData.email}" style="color: ${BRAND.primaryColor};">${leadData.email}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 15px; background-color: ${BRAND.primaryColor}; font-weight: bold; color: white; border: 1px solid #ddd;">Phone</td>
        <td style="padding: 12px 15px; border: 1px solid #ddd;">
          <a href="tel:${leadData.phone}" style="color: ${BRAND.primaryColor};">${leadData.phone || 'Not provided'}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 15px; background-color: ${BRAND.primaryColor}; font-weight: bold; color: white; border: 1px solid #ddd;">Service Type</td>
        <td style="padding: 12px 15px; border: 1px solid #ddd;">${formattedEventType}</td>
      </tr>
      <tr>
        <td style="padding: 12px 15px; background-color: ${BRAND.primaryColor}; font-weight: bold; color: white; border: 1px solid #ddd;">Event Date</td>
        <td style="padding: 12px 15px; border: 1px solid #ddd;">${leadData.eventDate || 'Not specified'}</td>
      </tr>
      <tr>
        <td style="padding: 12px 15px; background-color: ${BRAND.primaryColor}; font-weight: bold; color: white; border: 1px solid #ddd;">Location</td>
        <td style="padding: 12px 15px; border: 1px solid #ddd;">${leadData.eventLocation || 'Not specified'}</td>
      </tr>
      <tr>
        <td style="padding: 12px 15px; background-color: ${BRAND.primaryColor}; font-weight: bold; color: white; border: 1px solid #ddd;">Message</td>
        <td style="padding: 12px 15px; border: 1px solid #ddd;">${leadData.message || leadData.additionalInfo || 'No message provided'}</td>
      </tr>
      <tr>
        <td style="padding: 12px 15px; background-color: ${BRAND.primaryColor}; font-weight: bold; color: white; border: 1px solid #ddd;">Budget</td>
        <td style="padding: 12px 15px; border: 1px solid #ddd;">${leadData.budget || 'Not specified'}</td>
      </tr>
      <tr>
        <td style="padding: 12px 15px; background-color: ${BRAND.primaryColor}; font-weight: bold; color: white; border: 1px solid #ddd;">Heard About Us</td>
        <td style="padding: 12px 15px; border: 1px solid #ddd;">${leadData.hearAboutUs || 'Not specified'}</td>
      </tr>
      <tr>
        <td style="padding: 12px 15px; background-color: ${BRAND.primaryColor}; font-weight: bold; color: white; border: 1px solid #ddd;">Lead ID</td>
        <td style="padding: 12px 15px; border: 1px solid #ddd;">${leadId}</td>
      </tr>
    </table>
  `;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Lead: ${leadData.firstName} ${leadData.lastName} | Hariel Xavier Photography</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: ${BRAND.fontFamily}; color: ${BRAND.textColor}; background-color: #f9f9f9;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 650px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
        
        <!-- Header with Logo -->
        <tr>
          <td align="center" style="padding: 25px 0; background-color: ${BRAND.lightGray};">
            <img src="${BRAND.logoUrl}" alt="Hariel Xavier Photography" width="220" style="display: block; margin: 0 auto;">
          </td>
        </tr>
        <tr>
          <td style="height: 5px; background: linear-gradient(to right, ${BRAND.primaryColor}, ${BRAND.secondaryColor}, ${BRAND.accentColor});"></td>
        </tr>
        
        <!-- Main Content -->
        <tr>
          <td style="padding: 40px 30px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td>
                  <h1 style="color: ${BRAND.primaryColor}; font-size: 28px; margin-bottom: 5px; font-weight: 600;">New Lead Submission!</h1>
                  <p style="color: ${BRAND.accentColor}; font-size: 18px; margin-top: 0; margin-bottom: 25px;">
                    ${formattedEventType} - ${leadData.eventDate || 'Date TBD'}
                  </p>
                </td>
                <td align="right">
                  <div style="background-color: ${BRAND.accentColor}; color: white; border-radius: 50%; width: 60px; height: 60px; display: inline-block; text-align: center; line-height: 60px; font-size: 24px; font-weight: bold;">
                    NEW
                  </div>
                </td>
              </tr>
            </table>
            
            <p style="margin-bottom: 20px; line-height: 1.6; font-size: 16px;">
              A new lead has been submitted through the website form. Here are the details:
            </p>
            
            ${leadDataTable}
            
            <div style="background-color: ${BRAND.lightGray}; border-left: 4px solid ${BRAND.primaryColor}; padding: 20px; margin: 25px 0;">
              <p style="margin: 0 0 15px; line-height: 1.6; font-size: 16px; font-weight: bold; color: ${BRAND.primaryColor};">
                Next Steps:
              </p>
              
              <ul style="margin: 0; padding: 0 0 0 20px; line-height: 1.6; font-size: 16px;">
                <li style="margin-bottom: 8px;">The lead has been added to your CRM and calendar.</li>
                <li style="margin-bottom: 8px;">An automated thank you email was sent to the client.</li>
                <li style="margin-bottom: 0;">Follow up within 24-48 hours to discuss their needs.</li>
              </ul>
            </div>
            
            <!-- CTA Buttons -->
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td align="center" style="padding: 35px 0 20px;">
                  <a href="https://harielxavier.com/admin/leads/${leadId}" target="_blank" 
                     style="background-color: ${BRAND.primaryColor}; color: ${BRAND.lightText}; padding: 14px 35px; 
                            text-decoration: none; border-radius: 4px; font-weight: 500; display: inline-block; 
                            font-size: 16px; margin: 0 10px;">
                    View Lead Details
                  </a>
                  
                  <a href="mailto:${leadData.email}" 
                     style="background-color: ${BRAND.accentColor}; color: ${BRAND.lightText}; padding: 14px 35px; 
                            text-decoration: none; border-radius: 4px; font-weight: 500; display: inline-block; 
                            font-size: 16px; margin: 10px;">
                    Reply to Lead
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="height: 2px; background-color: ${BRAND.secondaryColor};"></td>
        </tr>
        <tr>
          <td style="background-color: ${BRAND.primaryColor}; padding: 30px 20px; text-align: center;">
            <p style="color: ${BRAND.lightText}; margin-bottom: 15px; font-size: 16px;">Hariel Xavier Photography</p>
            
            <p style="color: ${BRAND.lightText}; margin-top: 20px; font-size: 14px;">
              © ${new Date().getFullYear()} Hariel Xavier Photography. All rights reserved.
            </p>
          </td>
        </tr>
        
      </table>
    </body>
    </html>
  `;
}

export default {
  generateClientEmail,
  generateAdminEmail
};
