import { functions } from '../firebase/config';
import { httpsCallable } from 'firebase/functions';
// Nodemailer import removed - should not be used in frontend
// import nodemailer from 'nodemailer'; 
import { collection, addDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

// Brand styling constants for enhanced email templates
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

/**
 * Send an email using Firebase Cloud Functions
 * 
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param message - Email body content
 * @param attachments - Optional array of attachment objects
 * @returns Promise that resolves when the email is sent
 */
export const sendEmail = async (
  to: string,
  subject: string,
  message: string,
  attachments?: Array<{ filename: string, content: string, contentType: string }>
): Promise<void> => {
  try {
    // Call the Firebase Cloud Function
    const sendEmailFn = httpsCallable(functions, 'sendEmail');
    
    await sendEmailFn({
      to,
      subject,
      message,
      attachments
    });
    
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Send a template email using Firebase Cloud Functions
 * 
 * @param to - Recipient email address
 * @param templateId - Email template ID
 * @param templateData - Data to populate the template
 * @returns Promise that resolves when the email is sent
 */
export const sendTemplateEmail = async (
  to: string,
  templateId: string,
  templateData: Record<string, any>
): Promise<void> => {
  try {
    // Call the Firebase Cloud Function
    const sendTemplateEmailFn = httpsCallable(functions, 'sendTemplateEmail');
    
    await sendTemplateEmailFn({
      to,
      templateId,
      templateData
    });
    
    console.log(`Template email (${templateId}) sent to ${to}`);
  } catch (error) {
    console.error('Error sending template email:', error);
    throw error;
  }
};

/**
 * Send a notification to the photographer
 * 
 * @param subject - Notification subject
 * @param message - Notification message
 * @returns Promise that resolves when the notification is sent
 */
export const notifyPhotographer = async (
  subject: string,
  message: string
): Promise<void> => {
  try {
    // Call the Firebase Cloud Function
    const notifyPhotographerFn = httpsCallable(functions, 'notifyPhotographer');
    
    await notifyPhotographerFn({
      subject,
      message
    });
    
    console.log(`Photographer notification sent: ${subject}`);
  } catch (error) {
    console.error('Error sending photographer notification:', error);
    throw error;
  }
};

/**
 * Send a gallery notification to a client
 * 
 * @param clientEmail - Client's email address
 * @param galleryId - ID of the gallery
 * @param galleryTitle - Title of the gallery
 * @param galleryPassword - Optional password for the gallery
 * @param expiryDate - Optional expiry date for the gallery
 * @param customMessage - Optional custom message to include in the notification
 * @returns Promise that resolves when the notification is sent
 */
export const sendGalleryNotification = async (
  clientEmail: string,
  galleryId: string,
  galleryTitle: string,
  galleryPassword?: string,
  expiryDate?: Date | null,
  customMessage?: string
): Promise<void> => {
  try {
    // Format the expiry date if provided
    const formattedExpiryDate = expiryDate 
      ? `${expiryDate.getFullYear()}-${String(expiryDate.getMonth() + 1).padStart(2, '0')}-${String(expiryDate.getDate()).padStart(2, '0')}`
      : null;
    
    // Generate the gallery URL
    const galleryUrl = `${BRAND.websiteUrl}/gallery/${galleryId}`;
    
    // Create the subject line
    const subject = `Your Photo Gallery is Ready | ${galleryTitle} | Hariel Xavier Photography`;
    
    // Create the HTML email content
    const message = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Photo Gallery is Ready | Hariel Xavier Photography</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: ${BRAND.fontFamily}; color: ${BRAND.textColor}; background-color: #f9f9f9;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 650px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
          
          <!-- Header with Logo -->
          ${emailHeader}
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h1 style="color: ${BRAND.primaryColor}; font-size: 28px; margin-bottom: 25px; font-weight: 600; text-align: center;">Your Photo Gallery is Ready</h1>
              
              <p style="margin-bottom: 20px; line-height: 1.6; font-size: 16px;">Dear Client,</p>
              
              <p style="margin-bottom: 20px; line-height: 1.6; font-size: 16px;">
                I'm excited to share your photos from "${galleryTitle}" with you! Your gallery is now available to view and download.
              </p>
              
              ${customMessage ? `<p style="margin-bottom: 20px; line-height: 1.6; font-size: 16px;">${customMessage}</p>` : ''}
              
              <div style="background-color: ${BRAND.lightGray}; border-left: 4px solid ${BRAND.accentColor}; padding: 20px; margin: 25px 0;">
                <p style="margin: 0 0 10px 0; line-height: 1.6; font-size: 16px;">
                  <strong>Gallery Details:</strong>
                </p>
                <ul style="margin: 0; padding: 0 0 0 20px; line-height: 1.6; font-size: 16px;">
                  <li><strong>Gallery:</strong> ${galleryTitle}</li>
                  ${galleryPassword ? `<li><strong>Password:</strong> ${galleryPassword}</li>` : ''}
                  ${formattedExpiryDate ? `<li><strong>Available until:</strong> ${formattedExpiryDate}</li>` : ''}
                </ul>
              </div>
              
              <!-- CTA Button -->
              <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 35px 0;">
                    <a href="${galleryUrl}" target="_blank" 
                       style="background-color: ${BRAND.accentColor}; color: ${BRAND.lightText}; padding: 14px 35px; 
                              text-decoration: none; border-radius: 4px; font-weight: 500; display: inline-block; 
                              font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">
                      View Your Gallery
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="line-height: 1.6; font-size: 16px; margin-bottom: 10px;">
                Thank you for choosing Hariel Xavier Photography. I hope you love your photos as much as I enjoyed creating them for you.
              </p>
              
              <p style="line-height: 1.6; font-size: 16px; margin-bottom: 30px;">
                If you have any questions or need assistance with your gallery, please don't hesitate to reach out.
              </p>
              
              <p style="line-height: 1.6; font-size: 16px; margin-bottom: 10px;">
                Warmly,
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
    
    // Call the Firebase Cloud Function
    const sendEmailFn = httpsCallable(functions, 'sendEmail');
    
    await sendEmailFn({
      to: clientEmail,
      subject,
      html: message,
      from: 'Hariel Xavier Photography <gallery@harielxavier.com>',
      replyTo: 'hi@harielxavier.com'
    });
    
    console.log(`Gallery notification sent to client: ${clientEmail}`);
    
    // Add record to gallery_notifications collection
    await addDoc(collection(db, 'gallery_notifications'), {
      galleryId,
      clientEmail,
      sentAt: serverTimestamp(),
      expiryDate: expiryDate || null
    });
    
  } catch (error) {
    console.error('Error sending gallery notification:', error);
    throw error;
  }
};

/**
 * Send a thank you email to a lead with professional branding
 * 
 * @param params - Object containing lead information
 * @returns Promise that resolves when the email is sent
 */
export const sendEmailToClient = async (params: {
  to: string;
  name: string;
  eventType: string;
  eventDate: string;
  dateAvailable?: boolean; // Optional parameter for date availability
}): Promise<void> => {
  // DISABLED: Email sending is now handled by the Firebase Cloud Function
  console.log('FRONTEND EMAIL SENDING DISABLED: Would have sent client email to', params.to);
  console.log('Emails are now handled by the Firebase Cloud Function trigger only');
  return Promise.resolve();
};

/**
 * Send lead notification email to admin(s)
 * 
 * @param params - Object containing lead information
 * @returns Promise that resolves when all emails are sent
 */
export const sendEmailToAdmin = async (params: {
  leadId: string;
  leadData: any;
}): Promise<void> => {
  // DISABLED: Email sending is now handled by the Firebase Cloud Function
  console.log('FRONTEND EMAIL SENDING DISABLED: Would have sent admin email for lead ID:', params.leadId);
  console.log('Emails are now handled by the Firebase Cloud Function trigger only');
  return Promise.resolve();
};

export default {
  sendEmail,
  sendTemplateEmail,
  notifyPhotographer,
  sendGalleryNotification,
  sendEmailToClient,
  sendEmailToAdmin
};
