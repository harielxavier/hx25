import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

// Import email service
interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

// Import the actual email service
import { sendEmail } from './email';

// Lead status types
export type LeadStatus = 
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal_sent'
  | 'converted'
  | 'lost';

// Lead source types
export type LeadSource = 
  | 'website_contact_form'
  | 'instagram'
  | 'facebook'
  | 'google'
  | 'referral'
  | 'wedding_fair'
  | 'other';

// Lead interface
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  weddingDate?: string;
  eventType?: string;
  message?: string;
  source: LeadSource;
  status: LeadStatus;
  notes?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  lastContactedAt?: string; // ISO string
  emailStatus?: {
    adminNotificationSent: boolean;
    autoresponseSent: boolean;
    sentAt: string;
  };
}

// Mock leads storage
let leads: Lead[] = [];

/**
 * Get all leads
 */
export const getLeads = async (): Promise<Lead[]> => {
  // In a real implementation, this would fetch from a database
  return leads;
};

/**
 * Get lead by ID
 */
export const getLeadById = async (id: string): Promise<Lead | null> => {
  const lead = leads.find(l => l.id === id);
  return lead || null;
};

/**
 * Record a new lead from the contact form
 */
export const recordLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> => {
  const now = new Date().toISOString();
  
  const newLead: Lead = {
    ...leadData,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now
  };
  
  leads.push(newLead);
  
  // Send notification email to admin
  try {
    const adminNotificationSent = await sendLeadNotificationEmail(newLead);
    const autoresponseSent = await sendLeadAutoresponseEmail(newLead);
    
    console.log('Email status:', {
      adminNotification: adminNotificationSent ? 'sent' : 'failed',
      autoresponse: autoresponseSent ? 'sent' : 'failed'
    });
    
    // Add email status to lead data
    newLead.emailStatus = {
      adminNotificationSent,
      autoresponseSent,
      sentAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error sending lead notification email:', error);
    // Continue even if email fails
  }
  
  return newLead;
};

/**
 * Update lead status
 */
export const updateLeadStatus = async (id: string, status: LeadStatus): Promise<Lead | null> => {
  const index = leads.findIndex(l => l.id === id);
  if (index === -1) return null;
  
  const updatedLead = {
    ...leads[index],
    status,
    updatedAt: new Date().toISOString()
  };
  
  leads[index] = updatedLead;
  return updatedLead;
};

/**
 * Update lead
 */
export const updateLead = async (id: string, updates: Partial<Lead>): Promise<Lead | null> => {
  const index = leads.findIndex(l => l.id === id);
  if (index === -1) return null;
  
  const updatedLead = {
    ...leads[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  leads[index] = updatedLead;
  return updatedLead;
};

/**
 * Record lead contact
 */
export const recordLeadContact = async (id: string, notes?: string): Promise<Lead | null> => {
  const index = leads.findIndex(l => l.id === id);
  if (index === -1) return null;
  
  const now = new Date().toISOString();
  
  const updatedLead = {
    ...leads[index],
    lastContactedAt: now,
    notes: notes ? `${leads[index].notes || ''}\n${format(new Date(), 'yyyy-MM-dd HH:mm')}: ${notes}` : leads[index].notes,
    updatedAt: now
  };
  
  leads[index] = updatedLead;
  return updatedLead;
};

/**
 * Delete lead
 */
export const deleteLead = async (id: string): Promise<boolean> => {
  const initialLength = leads.length;
  leads = leads.filter(l => l.id !== id);
  return leads.length < initialLength;
};

/**
 * Send lead notification email to admin
 */
const sendLeadNotificationEmail = async (lead: Lead): Promise<boolean> => {
  const subject = `New Lead: ${lead.name} - ${lead.source}`;
  
  const body = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>New Lead Notification - Hariel Xavier Photography</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; background-color: #f7f7f7;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header with logo -->
        <tr>
          <td style="padding: 0;">
            <table width="100%" style="border-spacing: 0; background-color: #1a1a1a;">
              <tr>
                <td style="padding: 30px 30px; text-align: center;">
                  <img src="https://harielxavier.com/logo.png" alt="Hariel Xavier Photography" width="180" style="max-width: 100%; height: auto;">
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Content section -->
        <tr>
          <td style="padding: 30px 30px 20px 30px;">
            <h1 style="margin: 0 0 20px 0; font-size: 28px; line-height: 32px; font-weight: 300; color: #333333; text-align: center;">New Lead from Website</h1>
            
            <div style="background-color: #f9f9f9; border-left: 4px solid #4a6a8a; padding: 20px; margin-bottom: 20px;">
              <table width="100%" style="border-spacing: 0;">
                <tr>
                  <td width="120" style="padding: 5px 0; font-weight: bold;">Name:</td>
                  <td style="padding: 5px 0;">${lead.name}</td>
                </tr>
                <tr>
                  <td width="120" style="padding: 5px 0; font-weight: bold;">Email:</td>
                  <td style="padding: 5px 0;">${lead.email}</td>
                </tr>
                ${lead.phone ? `
                <tr>
                  <td width="120" style="padding: 5px 0; font-weight: bold;">Phone:</td>
                  <td style="padding: 5px 0;">${lead.phone}</td>
                </tr>` : ''}
                ${lead.weddingDate ? `
                <tr>
                  <td width="120" style="padding: 5px 0; font-weight: bold;">Event Date:</td>
                  <td style="padding: 5px 0;">${lead.weddingDate}</td>
                </tr>` : ''}
                ${lead.eventType ? `
                <tr>
                  <td width="120" style="padding: 5px 0; font-weight: bold;">Event Type:</td>
                  <td style="padding: 5px 0;">${lead.eventType}</td>
                </tr>` : ''}
                <tr>
                  <td width="120" style="padding: 5px 0; font-weight: bold;">Source:</td>
                  <td style="padding: 5px 0;">${lead.source}</td>
                </tr>
                <tr>
                  <td width="120" style="padding: 5px 0; font-weight: bold;">Received:</td>
                  <td style="padding: 5px 0;">${format(new Date(lead.createdAt), 'MMMM d, yyyy h:mm a')}</td>
                </tr>
              </table>
            </div>
            
            ${lead.message ? `
            <div style="margin-bottom: 20px;">
              <h3 style="margin: 0 0 10px 0; font-size: 18px; color: #4a6a8a;">Message from Lead:</h3>
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; line-height: 1.6;">
                ${lead.message.replace(/\n/g, '<br>')}
              </div>
            </div>` : ''}
          </td>
        </tr>
        
        <!-- CTA Button -->
        <tr>
          <td style="padding: 0 30px 30px 30px;">
            <table border="0" cellspacing="0" cellpadding="0" width="100%">
              <tr>
                <td style="padding: 0 0 20px 0; text-align: center;">
                  <a href="https://www.harielxavier.com/admin/leads/${lead.id}" style="background: #4a6a8a; color: #ffffff; display: inline-block; font-size: 16px; text-decoration: none; padding: 12px 30px; border-radius: 3px;">View Lead in Admin</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="padding: 20px 30px; text-align: center; font-size: 12px; color: #666666; background-color: #f0f0f0;">
            <p style="margin: 0 0 5px 0;">© ${new Date().getFullYear()} Hariel Xavier Photography. All rights reserved.</p>
            <p style="margin: 0;">This is an automated notification from your website contact form.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
  
  // Send actual email using our email service
  return await sendEmail({
    to: 'hi@harielxavier.com',
    bcc: 'missiongeek@gmail.com',
    subject,
    html: body
  });
};

/**
 * Send autoresponse email to lead
 */
const sendLeadAutoresponseEmail = async (lead: Lead): Promise<boolean> => {
  const subject = 'Thank you for contacting Hariel Xavier Photography';
  
  // Create a more impressive branded email template
  const body = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Thank You from Hariel Xavier Photography</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; background-color: #f7f7f7;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header with logo -->
        <tr>
          <td style="padding: 0;">
            <table width="100%" style="border-spacing: 0; background-color: #1a1a1a;">
              <tr>
                <td style="padding: 30px 30px; text-align: center;">
                  <img src="https://harielxavier.com/logo.png" alt="Hariel Xavier Photography" width="180" style="max-width: 100%; height: auto;">
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Hero section with image -->
        <tr>
          <td style="padding: 0;">
            <img src="https://harielxavier.com/email-header.jpg" alt="Hariel Xavier Photography" width="600" style="width: 100%; height: auto; display: block;">
          </td>
        </tr>
        
        <!-- Content section -->
        <tr>
          <td style="padding: 30px 30px 20px 30px;">
            <h1 style="margin: 0 0 20px 0; font-size: 28px; line-height: 32px; font-weight: 300; color: #333333; text-align: center;">Thank You for Reaching Out!</h1>
            
            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px;">Hi ${lead.name.split(' ')[0]},</p>
            
            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px;">Thank you for contacting Hariel Xavier Photography. We've received your inquiry and are excited to learn more about your photography needs.</p>
            
            ${lead.weddingDate ? `<p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px;">We've noted your wedding date (${lead.weddingDate}) and will check our availability.</p>` : ''}
            
            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px;">Here's what to expect next:</p>
            
            <table width="100%" style="border-spacing: 0;">
              <tr>
                <td style="padding: 0 0 20px 0;">
                  <table style="border-spacing: 0; width: 100%;">
                    <tr>
                      <td style="padding: 10px 15px; background-color: #f0f0f0; border-left: 4px solid #4a6a8a; font-size: 16px;">
                        <strong style="color: #4a6a8a;">1.</strong> We'll review your inquiry within 24-48 hours
                      </td>
                    </tr>
                    <tr><td style="padding: 5px 0;"></td></tr>
                    <tr>
                      <td style="padding: 10px 15px; background-color: #f0f0f0; border-left: 4px solid #4a6a8a; font-size: 16px;">
                        <strong style="color: #4a6a8a;">2.</strong> You'll receive a personalized response from our team
                      </td>
                    </tr>
                    <tr><td style="padding: 5px 0;"></td></tr>
                    <tr>
                      <td style="padding: 10px 15px; background-color: #f0f0f0; border-left: 4px solid #4a6a8a; font-size: 16px;">
                        <strong style="color: #4a6a8a;">3.</strong> We'll schedule a consultation to discuss your vision in detail
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            
            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px;">In the meantime, feel free to browse our <a href="https://www.harielxavier.com/portfolio" style="color: #4a6a8a; text-decoration: underline;">portfolio</a> for inspiration.</p>
            
            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px;">Looking forward to connecting with you soon!</p>
          </td>
        </tr>
        
        <!-- CTA Button -->
        <tr>
          <td style="padding: 0 30px 30px 30px;">
            <table border="0" cellspacing="0" cellpadding="0" width="100%">
              <tr>
                <td style="padding: 0 0 20px 0; text-align: center;">
                  <a href="https://www.harielxavier.com/portfolio" style="background: #4a6a8a; color: #ffffff; display: inline-block; font-size: 16px; text-decoration: none; padding: 12px 30px; border-radius: 3px;">View Our Portfolio</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Signature section -->
        <tr>
          <td style="padding: 0 30px 30px 30px; border-top: 1px solid #eee;">
            <table width="100%" style="border-spacing: 0;">
              <tr>
                <td style="padding: 20px 0 0 0; width: 140px; vertical-align: top;">
                  <img src="https://harielxavier.com/signature.png" alt="Mauricio Fernandez" width="120" style="width: 120px; height: auto;">
                </td>
                <td style="padding: 20px 0 0 0; vertical-align: top;">
                  <p style="margin: 0 0 5px 0; font-size: 16px; line-height: 22px; font-weight: bold;">Mauricio Fernandez</p>
                  <p style="margin: 0 0 5px 0; font-size: 14px; line-height: 20px;">Hariel Xavier Photography</p>
                  <p style="margin: 0 0 5px 0; font-size: 14px; line-height: 20px;">
                    <a href="mailto:hi@harielxavier.com" style="color: #4a6a8a; text-decoration: none;">hi@harielxavier.com</a>
                  </p>
                  <p style="margin: 0; font-size: 14px; line-height: 20px;">
                    <a href="tel:+18622904349" style="color: #4a6a8a; text-decoration: none;">(862) 290-4349</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Social media icons -->
        <tr>
          <td style="padding: 0 30px 30px 30px; text-align: center;">
            <a href="https://www.instagram.com/harielxaviermedia/" style="text-decoration: none; margin: 0 5px;">
              <img src="https://harielxavier.com/instagram.png" alt="Instagram" width="32" height="32" style="width: 32px; height: 32px;">
            </a>
            <a href="https://www.facebook.com/harielxavierphotography" style="text-decoration: none; margin: 0 5px;">
              <img src="https://harielxavier.com/facebook.png" alt="Facebook" width="32" height="32" style="width: 32px; height: 32px;">
            </a>
            <a href="https://www.pinterest.com/harielxavierphotography" style="text-decoration: none; margin: 0 5px;">
              <img src="https://harielxavier.com/pinterest.png" alt="Pinterest" width="32" height="32" style="width: 32px; height: 32px;">
            </a>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="padding: 20px 30px; text-align: center; font-size: 12px; color: #666666; background-color: #f0f0f0;">
            <p style="margin: 0 0 5px 0;">© ${new Date().getFullYear()} Hariel Xavier Photography. All rights reserved.</p>
            <p style="margin: 0;">This is an automatic response to your inquiry. Please do not reply to this email.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
  
  // Send actual email using our email service
  return await sendEmail({
    to: lead.email,
    bcc: 'missiongeek@gmail.com',
    subject,
    html: body
  });
};

export default {
  getLeads,
  getLeadById,
  recordLead,
  updateLeadStatus,
  updateLead,
  recordLeadContact,
  deleteLead
};
