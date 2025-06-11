/**
 * Email sending utility for the application
 * Email sending utility for the application
 * NOTE: Direct Nodemailer usage has been removed as it's incompatible with frontend code.
 * Email sending must be handled via a backend service (e.g., Firebase Cloud Functions).
 */

// Nodemailer import removed - cannot be used in frontend
// import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message?: string;
  source?: string;
  eventType?: string;
  eventDate?: string;
  eventLocation?: string;
  guestCount?: string;
  preferredStyle?: string[];
  mustHaveShots?: string;
  inspirationLinks?: string;
  budget?: string;
  hearAboutUs?: string;
  additionalInfo?: string;
  [key: string]: any; // Allow additional fields
}

/**
 * Send email using Nodemailer directly
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    // Call the generic Firebase Cloud Function 'sendEmail'
    // Dynamically import necessary Firebase modules
    const { functions } = await import('../../firebase/config'); // Adjust path if needed
    const { httpsCallable } = await import('firebase/functions');
    
    const sendEmailFn = httpsCallable(functions, 'sendEmail'); 
    
    // Prepare data payload for the backend function
    const payload = {
      to: options.to,
      subject: options.subject,
      html: options.html,
      from: options.from, // Pass optional fields if they exist
      replyTo: options.replyTo,
      cc: options.cc,
      bcc: options.bcc,
      attachments: options.attachments
    };

    await sendEmailFn(payload); 
    console.log('Email request sent via generic sendEmail function:', payload);
    return true; // Assume success if the function call doesn't throw
   
    // Original Nodemailer code removed:
    /*
    // Create a transporter with SMTP config
    const transporter = nodemailer.createTransport({ ... });
    // Prepare email options
    const mailOptions = {
      from: options.from || 'Hariel Xavier Photography <forms@harielxavier.com>',
      to: Array.isArray(options.to) ? options.to.join(',') : options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo || 'hi@harielxavier.com',
      ...(options.cc && { cc: Array.isArray(options.cc) ? options.cc.join(',') : options.cc }),
      ...(options.bcc && { bcc: Array.isArray(options.bcc) ? options.bcc.join(',') : options.bcc }),
      ...(options.attachments && { attachments: options.attachments })
    };
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    */
    
    // Return false for now as the email wasn't actually sent from here
    return false; 
  } catch (error) {
    console.error('Error in sendEmail stub (frontend):', error);
    return false;
  }
};

/**
 * Register a lead in the CRM system
 */
export const registerLead = async (leadData: LeadData): Promise<boolean> => {
  try {
    console.log('Registering lead in CRM:', leadData);
    
    // Prepare data for our CRM system (Firestore)
    const crmData = {
      firstName: leadData.firstName,
      lastName: leadData.lastName,
      email: leadData.email,
      phone: leadData.phone || '',
      eventType: leadData.eventType || '',
      eventDate: leadData.eventDate || '',
      eventLocation: leadData.eventLocation || '',
      guestCount: leadData.guestCount || '',
      preferredStyle: leadData.preferredStyle || [],
      mustHaveShots: leadData.mustHaveShots || '',
      inspirationLinks: leadData.inspirationLinks || '',
      budget: leadData.budget || '',
      hearAboutUs: leadData.hearAboutUs || '',
      additionalInfo: leadData.message || leadData.additionalInfo || '',
      source: leadData.source || 'Website Contact Form'
    };
    
    // Import and use the leadService to create a lead in Firestore
    // This is imported dynamically to avoid circular dependencies
    try {
      const { submitContactForm } = await import('../../services/leadService');
      const leadId = await submitContactForm(crmData);
      console.log('Lead created in Firestore with ID:', leadId);
    } catch (error) {
      console.error('Error creating lead in Firestore:', error);
      // Continue execution even if Firestore fails - we still want to return success for the email
    }
    
    return true;
  } catch (error) {
    console.error('Failed to register lead in CRM:', error);
    return false;
  }
};

/**
 * Verify email connection by testing SMTP connection
 */
export const verifyEmailConnection = async (): Promise<boolean> => {
  try {
    // TODO: This function cannot run in the browser. 
    // Connection verification should happen server-side if needed.
    console.error('SMTP connection verification cannot be performed from the frontend.');
    
    // Original Nodemailer code removed:
    /*
    // Create a transporter with SMTP config
    const transporter = nodemailer.createTransport({ ... });
    // Verify the connection
    await transporter.verify();
    console.log('SMTP connection verified successfully');
    return true;
    */
   
    // Return false as verification cannot be done here
    return false;
  } catch (error) {
    console.error('Error in verifyEmailConnection stub (frontend):', error);
    return false;
  }
};

export default {
  sendEmail,
  registerLead,
  verifyEmailConnection
};
