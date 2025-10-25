import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { Client } from '../types/client';
import { Job } from '../types/job';
import { Payment } from '../types/payment';

// Email template types
export type EmailTemplateType = 
  | 'inquiry_response'
  | 'booking_confirmation'
  | 'session_preparation'
  | 'session_reminder'
  | 'gallery_delivery'
  | 'payment_reminder'
  | 'thank_you'
  | 'review_request'
  | 'referral_request'
  | 'anniversary';

// Email sequence types
export type SequenceType = 
  | 'booking_workflow'
  | 'gallery_delivery'
  | 'payment_collection'
  | 'post_session_followup'
  | 'client_nurture';

// Email template interface
export interface EmailTemplate {
  id: string;
  name: string;
  type: EmailTemplateType;
  subject: string;
  body: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Email sequence step interface
export interface SequenceStep {
  id: string;
  sequenceId: string;
  templateId: string;
  delayDays: number;
  condition?: string; // JSON string with conditions
  active: boolean;
  order: number;
}

// Email sequence interface
export interface EmailSequence {
  id: string;
  name: string;
  type: SequenceType;
  description: string;
  triggerEvent: string;
  active: boolean;
  steps: SequenceStep[];
  createdAt: Date;
  updatedAt: Date;
}

// Scheduled email interface
export interface ScheduledEmail {
  id: string;
  templateId: string;
  clientId: string;
  jobId?: string;
  scheduledDate: Date;
  sent: boolean;
  sentDate?: Date;
  opened?: boolean;
  clicked?: boolean;
  sequenceId?: string;
  sequenceStepId?: string;
}

// Mock email templates
const emailTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Initial Inquiry Response',
    type: 'inquiry_response',
    subject: 'Thank you for your interest in Hariel Xavier Photography',
    body: `Dear {{client.firstName}},

Thank you for reaching out to Hariel Xavier Photography! I'm excited to learn more about your {{job.type}} needs.

I'd love to schedule a time to chat about your vision and answer any questions you might have. You can book a consultation directly using my online calendar: [BOOKING_LINK]

In the meantime, you might want to check out my portfolio at [PORTFOLIO_LINK] to get a better sense of my style.

Looking forward to connecting with you soon!

Warm regards,
Hariel Xavier
Hariel Xavier Photography
[CONTACT_INFO]`,
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Booking Confirmation',
    type: 'booking_confirmation',
    subject: 'Your {{job.type}} Session is Confirmed!',
    body: `Dear {{client.firstName}},

I'm thrilled to confirm your {{job.type}} session with Hariel Xavier Photography!

Here are the details:
- Date: {{job.date}}
- Time: {{job.startTime}} - {{job.endTime}}
- Location: {{job.location}}

What to expect next:
1. I'll send you a preparation guide {{job.type === 'wedding' ? '3 months' : '1 week'}} before your session
2. A reminder email will be sent 2 days before your session
3. After your session, your images will be ready for viewing within {{job.type === 'wedding' ? '4-6 weeks' : '2 weeks'}}

If you have any questions before your session, please don't hesitate to reach out!

Warm regards,
Hariel Xavier
Hariel Xavier Photography
[CONTACT_INFO]`,
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Session Preparation Guide',
    type: 'session_preparation',
    subject: 'Preparing for Your Upcoming {{job.type}} Session',
    body: `Dear {{client.firstName}},

Your {{job.type}} session is coming up on {{job.date}} at {{job.startTime}}, and I want to make sure you're fully prepared!

Here's a quick preparation guide:

{{#if job.type === 'wedding'}}
1. We'll follow the timeline we discussed during our planning meeting
2. Please share this timeline with your wedding party and key family members
3. Designate someone (not in the wedding party) to be my point person for family formal photos
4. Remember to bring all details you want photographed (invitation, rings, special items)
{{else}}
1. Plan to arrive 10 minutes early to get settled
2. Bring 2-3 outfit options if you'd like variety in your images
3. For family sessions, bring small snacks and toys for young children
4. Consider the weather and dress appropriately for comfort
{{/if}}

Location details:
{{job.location}}
{{job.locationNotes}}

If you have any questions before your session, please don't hesitate to reach out!

Looking forward to capturing beautiful memories with you!

Warm regards,
Hariel Xavier
Hariel Xavier Photography
[CONTACT_INFO]`,
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Gallery Delivery',
    type: 'gallery_delivery',
    subject: 'Your {{job.type}} Photos Are Ready!',
    body: `Dear {{client.firstName}},

I'm excited to share that your {{job.type}} photos are now ready for viewing!

You can access your private online gallery here:
[GALLERY_LINK]

Your gallery password: {{client.galleryPassword}}

Your gallery will be available for {{job.type === 'wedding' ? '12 months' : '3 months'}} from today. During this time, you can:
- View all your images
- Download your included digital files
- Share with friends and family
- Order prints and products directly from the gallery

{{#if job.type === 'wedding'}}
Remember that your wedding package includes [X] digital images of your choice. Please select these through the "favorites" feature in your gallery within 30 days.
{{/if}}

If you have any questions about your gallery or need assistance with selecting images or ordering products, please don't hesitate to reach out!

Thank you again for choosing Hariel Xavier Photography to capture these special moments.

Warm regards,
Hariel Xavier
Hariel Xavier Photography
[CONTACT_INFO]`,
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    name: 'Payment Reminder',
    type: 'payment_reminder',
    subject: 'Reminder: Payment Due for Your {{job.type}} Session',
    body: `Dear {{client.firstName}},

I hope this email finds you well. I wanted to send a friendly reminder that a payment of ${{payment.amount}} is due on {{payment.dueDate}} for your {{job.type}} session.

Payment details:
- Amount due: ${{payment.amount}}
- Due date: {{payment.dueDate}}
- Invoice #: {{payment.invoiceId}}

You can easily make your payment online through your client portal:
[PAYMENT_LINK]

If you have any questions about your invoice or would like to discuss payment options, please don't hesitate to contact me.

Thank you for your prompt attention to this matter.

Warm regards,
Hariel Xavier
Hariel Xavier Photography
[CONTACT_INFO]`,
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    name: 'Thank You',
    type: 'thank_you',
    subject: 'Thank You for Choosing Hariel Xavier Photography',
    body: `Dear {{client.firstName}},

I wanted to take a moment to sincerely thank you for choosing Hariel Xavier Photography for your {{job.type}} session.

It was truly a pleasure working with you{{client.partnerName ? ' and ' + client.partnerName : ''}}{{client.familyMembers ? ' and your family' : ''}}. I hope you love your photos as much as I enjoyed creating them for you!

As a small business owner, I rely heavily on word-of-mouth referrals and reviews. If you were happy with your experience, I would be incredibly grateful if you could:

1. Leave a review on [Google](https://g.page/review/harielxavierphotography)
2. Share your experience on [Facebook](https://facebook.com/harielxavierphotography)
3. Tag @harielxavierphotography if you share your photos on social media

Thank you again for trusting me to capture these special moments in your life. I hope to work with you again in the future!

Warm regards,
Hariel Xavier
Hariel Xavier Photography
[CONTACT_INFO]`,
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '7',
    name: 'Anniversary',
    type: 'anniversary',
    subject: 'Happy Anniversary from Hariel Xavier Photography',
    body: `Dear {{client.firstName}}{{client.partnerName ? ' and ' + client.partnerName : ''}},

Happy Anniversary! It's been one year since your beautiful {{job.type}} session, and I wanted to reach out to wish you a wonderful day of celebration.

It was such a joy to capture those special moments for you, and I hope the photographs continue to bring back wonderful memories.

As a small token of appreciation for your continued support, I'd like to offer you a special anniversary discount of 20% off your next session with me. This offer is valid for the next 3 months.

I hope to see you again soon!

Warm wishes,
Hariel Xavier
Hariel Xavier Photography
[CONTACT_INFO]`,
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock email sequences
const emailSequences: EmailSequence[] = [
  {
    id: '1',
    name: 'Wedding Client Workflow',
    type: 'booking_workflow',
    description: 'Complete email sequence for wedding clients from booking to delivery',
    triggerEvent: 'job_created',
    active: true,
    steps: [
      {
        id: '1-1',
        sequenceId: '1',
        templateId: '2', // Booking confirmation
        delayDays: 0,
        active: true,
        order: 1
      },
      {
        id: '1-2',
        sequenceId: '1',
        templateId: '3', // Session preparation
        delayDays: 7,
        condition: JSON.stringify({
          job: {
            type: 'wedding',
            daysUntil: { lessThan: 90, moreThan: 0 }
          }
        }),
        active: true,
        order: 2
      },
      {
        id: '1-3',
        sequenceId: '1',
        templateId: '4', // Gallery delivery
        delayDays: 30,
        condition: JSON.stringify({
          job: {
            status: 'completed'
          }
        }),
        active: true,
        order: 3
      },
      {
        id: '1-4',
        sequenceId: '1',
        templateId: '6', // Thank you
        delayDays: 7,
        condition: JSON.stringify({
          gallery: {
            delivered: true,
            daysDelivered: { moreThan: 7 }
          }
        }),
        active: true,
        order: 4
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Portrait Session Workflow',
    type: 'booking_workflow',
    description: 'Email sequence for portrait clients',
    triggerEvent: 'job_created',
    active: true,
    steps: [
      {
        id: '2-1',
        sequenceId: '2',
        templateId: '2', // Booking confirmation
        delayDays: 0,
        active: true,
        order: 1
      },
      {
        id: '2-2',
        sequenceId: '2',
        templateId: '3', // Session preparation
        delayDays: 5,
        condition: JSON.stringify({
          job: {
            type: { in: ['family', 'portrait', 'newborn'] },
            daysUntil: { lessThan: 7, moreThan: 0 }
          }
        }),
        active: true,
        order: 2
      },
      {
        id: '2-3',
        sequenceId: '2',
        templateId: '4', // Gallery delivery
        delayDays: 14,
        condition: JSON.stringify({
          job: {
            status: 'completed'
          }
        }),
        active: true,
        order: 3
      },
      {
        id: '2-4',
        sequenceId: '2',
        templateId: '6', // Thank you
        delayDays: 3,
        condition: JSON.stringify({
          gallery: {
            delivered: true,
            daysDelivered: { moreThan: 3 }
          }
        }),
        active: true,
        order: 4
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Payment Collection',
    type: 'payment_collection',
    description: 'Sequence for payment reminders',
    triggerEvent: 'payment_due',
    active: true,
    steps: [
      {
        id: '3-1',
        sequenceId: '3',
        templateId: '5', // Payment reminder
        delayDays: -7, // 7 days before due
        active: true,
        order: 1
      },
      {
        id: '3-2',
        sequenceId: '3',
        templateId: '5', // Payment reminder
        delayDays: 0, // On due date
        active: true,
        order: 2
      },
      {
        id: '3-3',
        sequenceId: '3',
        templateId: '5', // Payment reminder
        delayDays: 3, // 3 days after due
        condition: JSON.stringify({
          payment: {
            status: 'overdue'
          }
        }),
        active: true,
        order: 3
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock scheduled emails
let scheduledEmails: ScheduledEmail[] = [];

/**
 * Get all email templates
 */
export const getEmailTemplates = async (): Promise<EmailTemplate[]> => {
  // In a real implementation, this would fetch from a database
  return emailTemplates;
};

/**
 * Get email template by ID
 */
export const getEmailTemplateById = async (id: string): Promise<EmailTemplate | null> => {
  const template = emailTemplates.find(t => t.id === id);
  return template || null;
};

/**
 * Create a new email template
 */
export const createEmailTemplate = async (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmailTemplate> => {
  const newTemplate: EmailTemplate = {
    ...template,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  emailTemplates.push(newTemplate);
  return newTemplate;
};

/**
 * Update an email template
 */
export const updateEmailTemplate = async (id: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate | null> => {
  const index = emailTemplates.findIndex(t => t.id === id);
  if (index === -1) return null;
  
  const updatedTemplate = {
    ...emailTemplates[index],
    ...updates,
    updatedAt: new Date()
  };
  
  emailTemplates[index] = updatedTemplate;
  return updatedTemplate;
};

/**
 * Get all email sequences
 */
export const getEmailSequences = async (): Promise<EmailSequence[]> => {
  return emailSequences;
};

/**
 * Get email sequence by ID
 */
export const getEmailSequenceById = async (id: string): Promise<EmailSequence | null> => {
  const sequence = emailSequences.find(s => s.id === id);
  return sequence || null;
};

/**
 * Create a new email sequence
 */
export const createEmailSequence = async (sequence: Omit<EmailSequence, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmailSequence> => {
  const newSequence: EmailSequence = {
    ...sequence,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  emailSequences.push(newSequence);
  return newSequence;
};

/**
 * Update an email sequence
 */
export const updateEmailSequence = async (id: string, updates: Partial<EmailSequence>): Promise<EmailSequence | null> => {
  const index = emailSequences.findIndex(s => s.id === id);
  if (index === -1) return null;
  
  const updatedSequence = {
    ...emailSequences[index],
    ...updates,
    updatedAt: new Date()
  };
  
  emailSequences[index] = updatedSequence;
  return updatedSequence;
};

/**
 * Get scheduled emails for a client
 */
export const getScheduledEmailsForClient = async (clientId: string): Promise<ScheduledEmail[]> => {
  return scheduledEmails.filter(e => e.clientId === clientId);
};

/**
 * Schedule an email
 */
export const scheduleEmail = async (email: Omit<ScheduledEmail, 'id'>): Promise<ScheduledEmail> => {
  const newEmail: ScheduledEmail = {
    ...email,
    id: uuidv4()
  };
  
  scheduledEmails.push(newEmail);
  return newEmail;
};

/**
 * Cancel a scheduled email
 */
export const cancelScheduledEmail = async (id: string): Promise<boolean> => {
  const initialLength = scheduledEmails.length;
  scheduledEmails = scheduledEmails.filter(e => e.id !== id);
  return scheduledEmails.length < initialLength;
};

/**
 * Mark email as sent
 */
export const markEmailAsSent = async (id: string): Promise<ScheduledEmail | null> => {
  const index = scheduledEmails.findIndex(e => e.id === id);
  if (index === -1) return null;
  
  scheduledEmails[index] = {
    ...scheduledEmails[index],
    sent: true,
    sentDate: new Date()
  };
  
  return scheduledEmails[index];
};

/**
 * Process email template with client/job data
 */
export const processEmailTemplate = (
  template: EmailTemplate, 
  data: { 
    client?: Client, 
    job?: Job, 
    payment?: Payment,
    gallery?: { url: string, password: string }
  }
): { subject: string, body: string } => {
  let subject = template.subject;
  let body = template.body;
  
  // Process client data
  if (data.client) {
    subject = subject.replace(/{{client\.firstName}}/g, data.client.firstName || '');
    subject = subject.replace(/{{client\.lastName}}/g, data.client.lastName || '');
    subject = subject.replace(/{{client\.email}}/g, data.client.email || '');
    
    body = body.replace(/{{client\.firstName}}/g, data.client.firstName || '');
    body = body.replace(/{{client\.lastName}}/g, data.client.lastName || '');
    body = body.replace(/{{client\.email}}/g, data.client.email || '');
    body = body.replace(/{{client\.phone}}/g, data.client.phone || '');
    body = body.replace(/{{client\.partnerName}}/g, data.client.partnerName || '');
    body = body.replace(/{{client\.galleryPassword}}/g, data.client.galleryPassword || '');
  }
  
  // Process job data
  if (data.job) {
    subject = subject.replace(/{{job\.type}}/g, data.job.type || '');
    
    body = body.replace(/{{job\.type}}/g, data.job.type || '');
    body = body.replace(/{{job\.date}}/g, data.job.date ? format(new Date(data.job.date), 'MMMM d, yyyy') : '');
    body = body.replace(/{{job\.startTime}}/g, data.job.startTime || '');
    body = body.replace(/{{job\.endTime}}/g, data.job.endTime || '');
    body = body.replace(/{{job\.location}}/g, data.job.location || '');
    body = body.replace(/{{job\.locationNotes}}/g, data.job.locationNotes || '');
    
    // Handle conditional blocks (very basic implementation)
    const conditionalRegex = /{{#if ([^}]+)}}([\s\S]*?){{else}}([\s\S]*?){{\/if}}/g;
    body = body.replace(conditionalRegex, (match, condition, ifBlock, elseBlock) => {
      if (condition.startsWith('job.type === ')) {
        const jobType = condition.replace('job.type === ', '').replace(/'/g, '').replace(/"/g, '');
        return data.job.type === jobType ? ifBlock : elseBlock;
      }
      return ifBlock; // Default to if block if condition not recognized
    });
  }
  
  // Process payment data
  if (data.payment) {
    body = body.replace(/{{payment\.amount}}/g, data.payment.amount.toString() || '');
    body = body.replace(/{{payment\.dueDate}}/g, data.payment.dueDate ? format(new Date(data.payment.dueDate), 'MMMM d, yyyy') : '');
    body = body.replace(/{{payment\.invoiceId}}/g, data.payment.invoiceId || '');
  }
  
  // Process gallery data
  if (data.gallery) {
    body = body.replace(/\[GALLERY_LINK\]/g, data.gallery.url || '');
  }
  
  // Replace placeholders with default values
  body = body.replace(/\[BOOKING_LINK\]/g, 'https://calendly.com/harielxavier');
  body = body.replace(/\[PORTFOLIO_LINK\]/g, 'https://www.harielxavier.com/portfolio');
  body = body.replace(/\[PAYMENT_LINK\]/g, 'https://www.harielxavier.com/client-portal');
  body = body.replace(/\[CONTACT_INFO\]/g, 'Email: info@harielxavier.com\nPhone: (555) 123-4567\nWebsite: www.harielxavier.com');
  
  return { subject, body };
};

/**
 * Trigger an email sequence for a client
 */
export const triggerEmailSequence = async (
  sequenceId: string,
  clientId: string,
  jobId?: string
): Promise<ScheduledEmail[]> => {
  const sequence = await getEmailSequenceById(sequenceId);
  if (!sequence) throw new Error('Sequence not found');
  
  const scheduledEmails: ScheduledEmail[] = [];
  
  for (const step of sequence.steps) {
    if (!step.active) continue;
    
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + step.delayDays);
    
    const newEmail = await scheduleEmail({
      templateId: step.templateId,
      clientId,
      jobId,
      scheduledDate,
      sent: false,
      sequenceId: sequence.id,
      sequenceStepId: step.id
    });
    
    scheduledEmails.push(newEmail);
  }
  
  return scheduledEmails;
};

/**
 * Send a test email
 */
export const sendTestEmail = async (
  templateId: string,
  testEmail: string,
  testData: {
    client?: Partial<Client>,
    job?: Partial<Job>,
    payment?: Partial<Payment>,
    gallery?: { url: string, password: string }
  }
): Promise<boolean> => {
  const template = await getEmailTemplateById(templateId);
  if (!template) throw new Error('Template not found');
  
  // Create mock data for testing
  const mockClient: Client = {
    id: 'test-client',
    firstName: testData.client?.firstName || 'Test',
    lastName: testData.client?.lastName || 'Client',
    email: testData.client?.email || testEmail,
    phone: testData.client?.phone || '(555) 123-4567',
    partnerName: testData.client?.partnerName || 'Partner Name',
    galleryPassword: testData.client?.galleryPassword || 'gallery123',
    ...testData.client
  } as Client;
  
  const mockJob: Job = {
    id: 'test-job',
    clientId: 'test-client',
    type: testData.job?.type || 'wedding',
    date: testData.job?.date || new Date().toISOString(),
    startTime: testData.job?.startTime || '10:00 AM',
    endTime: testData.job?.endTime || '4:00 PM',
    location: testData.job?.location || 'Test Location',
    locationNotes: testData.job?.locationNotes || 'Location notes here',
    ...testData.job
  } as Job;
  
  const mockPayment: Payment = {
    id: 'test-payment',
    clientId: 'test-client',
    jobId: 'test-job',
    amount: testData.payment?.amount || 1000,
    dueDate: testData.payment?.dueDate || new Date().toISOString(),
    invoiceId: testData.payment?.invoiceId || 'INV-12345',
    ...testData.payment
  } as Payment;
  
  const mockGallery = testData.gallery || {
    url: 'https://gallery.harielxavier.com/test-gallery',
    password: 'gallery123'
  };
  
  // Process the template
  const { subject, body } = processEmailTemplate(template, {
    client: mockClient,
    job: mockJob,
    payment: mockPayment,
    gallery: mockGallery
  });
  
  // In a real implementation, this would send an actual email
  console.log(`Test email would be sent to: ${testEmail}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  
  return true;
};

/**
 * Get pending emails that need to be sent
 */
export const getPendingEmails = async (): Promise<ScheduledEmail[]> => {
  const now = new Date();
  return scheduledEmails.filter(email => 
    !email.sent && 
    email.scheduledDate <= now
  );
};

/**
 * Process and send pending emails
 * This would typically be called by a cron job or scheduled function
 */
export const processPendingEmails = async (): Promise<number> => {
  const pendingEmails = await getPendingEmails();
  let sentCount = 0;
  
  for (const email of pendingEmails) {
    try {
      // In a real implementation, this would fetch the client, job, etc.
      // and send the actual email
      
      // Mark as sent
      await markEmailAsSent(email.id);
      sentCount++;
    } catch (error) {
      console.error(`Error sending email ${email.id}:`, error);
    }
  }
  
  return sentCount;
};

export default {
  getEmailTemplates,
  getEmailTemplateById,
  createEmailTemplate,
  updateEmailTemplate,
  getEmailSequences,
  getEmailSequenceById,
  createEmailSequence,
  updateEmailSequence,
  getScheduledEmailsForClient,
  scheduleEmail,
  cancelScheduledEmail,
  markEmailAsSent,
  processEmailTemplate,
  triggerEmailSequence,
  sendTestEmail,
  getPendingEmails,
  processPendingEmails
};
