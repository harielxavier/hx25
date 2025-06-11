import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import * as functions from 'firebase-functions'; // Import firebase-functions
import * as fs from 'fs';
import * as path from 'path';
import { createAdminNotificationTemplate } from './templates';

// Initialize Firebase Admin SDK -
// When deployed to Firebase, it automatically uses the project's default service account.
// For local development, ensure GOOGLE_APPLICATION_CREDENTIALS environment variable is set.
if (!admin.apps.length) {
  admin.initializeApp();
}

// Mailgun SMTP configuration
// IMPORTANT: Store sensitive credentials in Firebase environment configuration, not in code.
// To set up Mailgun SMTP credentials:
// 1. Get your Mailgun SMTP credentials from the Mailgun dashboard
// 2. Set them in Firebase config:
//    firebase functions:config:set mailgun.smtp.host="smtp.mailgun.org" mailgun.smtp.port="587" mailgun.smtp.user="postmaster@yourdomain.mailgun.org" mailgun.smtp.pass="yourpassword"
// 3. For local development, create a .runtimeconfig.json file in your functions directory with the same structure
const smtpConfig = {
  host: functions.config().mailgun?.smtp?.host,
  port: parseInt(functions.config().mailgun?.smtp?.port || '587', 10),
  secure: false, // Mailgun SMTP typically uses STARTTLS on port 587
  auth: {
    user: functions.config().mailgun?.smtp?.user,
    pass: functions.config().mailgun?.smtp?.pass,
  },
};

// Create transporter
const transporter = nodemailer.createTransport(smtpConfig);

// Mock function to check date availability
// In a real implementation, this would connect to your calendar service
const checkDateAvailability = async (date: string): Promise<boolean> => {
  // This is a simplified mock implementation
  // In a real scenario, you would use your calendar service to check availability
  
  // For demonstration purposes, let's consider some dates as booked
  const bookedDates = [
    '2025-05-10', // May 10, 2025
    '2025-05-17', // May 17, 2025
    '2025-05-24', // May 24, 2025
    '2025-06-07', // June 7, 2025
    '2025-06-14', // June 14, 2025
    '2025-06-21', // June 21, 2025
    '2025-07-05', // July 5, 2025
    '2025-07-12', // July 12, 2025
    '2025-07-19', // July 19, 2025
    '2025-08-02', // August 2, 2025
    '2025-08-09', // August 9, 2025
    '2025-08-16', // August 16, 2025
    '2025-08-30', // August 30, 2025
    '2025-09-06', // September 6, 2025
    '2025-09-13', // September 13, 2025
    '2025-09-27', // September 27, 2025
  ];
  
  // Check if the date is in the booked dates list
  return !bookedDates.includes(date);
};

// Function to send emails when a new lead is created
export async function sendLeadEmails(leadId: string, leadData: any) {
  try {
    console.log(`sendLeadEmails: Processing lead ${leadId}`);
    
    if (!leadData || !leadData.email || !leadData.firstName) {
      console.error(`sendLeadEmails: Missing required lead data (email, firstName) for lead ${leadId}`);
      return { success: false, error: 'Missing required lead data' };
    }

    const { firstName, email, eventType, eventDate } = leadData;

    console.log(`sendLeadEmails: Sending emails for lead ${leadId} (${email})`);

    // Check date availability if eventDate is provided
    let isDateAvailable: boolean | undefined = undefined;
    if (eventDate) {
      try {
        // Format date to YYYY-MM-DD if it's not already in that format
        const formattedDate = eventDate.includes('-') 
          ? eventDate 
          : new Date(eventDate).toISOString().split('T')[0];
        
        isDateAvailable = await checkDateAvailability(formattedDate);
        console.log(`sendLeadEmails: Date ${eventDate} availability check result: ${isDateAvailable ? 'Available' : 'Not Available'}`);
      } catch (error) {
        console.error(`sendLeadEmails: Error checking date availability for ${eventDate}:`, error);
        // Continue even if date checking fails
      }
    }

    // 1. Generate and send the thank you email to the lead
    const templatePath = path.join(__dirname, '../../email-templates/thank-you-email.html');
    let thankYouHtml = fs.readFileSync(templatePath, 'utf8');
    
    // Replace placeholders in the template
    thankYouHtml = thankYouHtml
      .replace(/{Name}/g, firstName)
      .replace(/{EventType}/g, eventType || 'photography session')
      .replace(/{EventDate}/g, eventDate || 'your selected date');

    const thankYouMailOptions = {
      from: `Hariel Xavier Photography <hi@harielxavier.com>`,
      to: email, // Send to the lead's email
      subject: 'Thank You for Your Inquiry | Hariel Xavier Photography',
      html: thankYouHtml,
      replyTo: 'hi@harielxavier.com',
    };

    // Send the thank you email
    console.log(`sendLeadEmails: Sending thank you email to ${email}`);
    const thankYouInfo = await transporter.sendMail(thankYouMailOptions);
    console.log(`sendLeadEmails: Thank you email sent successfully to ${email}. Message ID: ${thankYouInfo.messageId}`);

    // 2. Generate and send the admin notification email
    const adminEmails = ['missiongeek@gmail.com', 'Mauricio@harielxavier.com', 'dorismelvinas27@gmail.com'];
    
    // Create a comprehensive lead data object for the admin notification template
    const leadDataForNotification = {
      firstName,
      lastName: leadData.lastName || '',
      email,
      phone: leadData.phone || '',
      eventType,
      eventDate,
      venue: leadData.venue || '',
      guestCount: leadData.guestCount || '',
      photographyStyle: leadData.photographyStyle || [],
      mustHaveShots: leadData.mustHaveShots || [],
      additionalServices: leadData.additionalServices || [],
      hearAboutUs: leadData.hearAboutUs || '',
      budget: leadData.budget || '',
      message: leadData.message || leadData.additionalInfo || '',
      source: leadData.source || 'Website Form',
      dateAvailability: isDateAvailable !== undefined ? (isDateAvailable ? 'Available' : 'Not Available') : 'Not Checked'
    };
    
    const adminNotificationHtml = createAdminNotificationTemplate(leadDataForNotification, leadId);
    
    const adminMailOptions = {
      from: `Hariel Xavier Photography <hi@harielxavier.com>`,
      to: adminEmails, // Send to all admin emails
      subject: `New Lead: ${firstName} ${leadData.lastName || ''} - ${eventType || 'Photography Services'}`,
      html: adminNotificationHtml,
      replyTo: email, // Set reply-to as the lead's email for easy response
    };
    
    // Send the admin notification email
    console.log(`sendLeadEmails: Sending admin notification email to ${adminEmails.join(', ')}`);
    const adminInfo = await transporter.sendMail(adminMailOptions);
    console.log(`sendLeadEmails: Admin notification email sent successfully. Message ID: ${adminInfo.messageId}`);

    return { 
      success: true, 
      thankYouMessageId: thankYouInfo.messageId,
      adminNotificationMessageId: adminInfo.messageId,
      dateAvailability: isDateAvailable
    };
  } catch (error) {
    console.error(`sendLeadEmails: Error sending emails for lead ${leadId}:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Function to manually send emails for a specific lead
export async function sendEmailsForLead(leadId: string) {
  try {
    console.log(`sendEmailsForLead: Fetching lead ${leadId}`);
    
    // Get the lead data from Firestore
    const db = admin.firestore();
    const leadDoc = await db.collection('leads').doc(leadId).get();
    
    if (!leadDoc.exists) {
      console.error(`sendEmailsForLead: Lead ${leadId} not found`);
      return { success: false, error: 'Lead not found' };
    }
    
    const leadData = leadDoc.data();
    
    // Send emails
    return await sendLeadEmails(leadId, leadData);
  } catch (error) {
    console.error(`sendEmailsForLead: Error processing lead ${leadId}:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
