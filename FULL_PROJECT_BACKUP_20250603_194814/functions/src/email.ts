import * as functions from 'firebase-functions';
import { logger } from 'firebase-functions';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
// Removed problematic import for MessagesSendResult
import type { SendMailOptions, TransportOptions } from 'nodemailer'; // Keep for SendMailOptions['attachments'] type if needed for attachments

// Interface for sendEmailWithSMTP data payload (can be removed if not used elsewhere)
interface SendEmailWithSMTPData {
  to: string | string[];
  subject: string;
  html: string;
  smtpConfig: TransportOptions | string; // Nodemailer transport options
  from?: string;
  replyTo?: string;
  attachments?: SendMailOptions['attachments']; // Keep if attachments structure is similar
}

// Interface for sendEmail data payload
interface SendEmailData {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: SendMailOptions['attachments']; // Keep if attachments structure is similar
}

/**
 * Cloud function to send email with custom SMTP configuration (using Nodemailer)
 * This function remains as is, in case direct SMTP is still needed for some scenarios.
 * If it's to be fully replaced by Mailgun, this can be removed.
 */
export const sendEmailWithSMTP = functions.https.onCall(async (data: SendEmailWithSMTPData, context: functions.https.CallableContext) => {
  try {
    if (!data.to || !data.subject || !data.html || !data.smtpConfig) {
      logger.error('sendEmailWithSMTP: Missing required parameters', data);
      throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters: to, subject, html, smtpConfig');
    }
    // Dynamically import nodemailer only when this function is called
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport(data.smtpConfig);

    const mailOptions: SendMailOptions = {
      from: data.from || 'Hariel Xavier Photography <forms@harielxavier.com>',
      to: Array.isArray(data.to) ? data.to.join(',') : data.to,
      subject: data.subject,
      html: data.html,
      replyTo: data.replyTo || 'hi@harielxavier.com',
      attachments: data.attachments || []
    };
    
    const info = await transporter.sendMail(mailOptions);
    logger.log('Email sent successfully via SMTP:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Error sending email via SMTP:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send email via SMTP', error);
  }
});


/**
 * Cloud function to send an email using Mailgun.
 */
export const sendEmail = functions.https.onCall(async (data: SendEmailData, context: functions.https.CallableContext): Promise<{ success: boolean; messageId?: string }> => {
  try {
    if (!data.to || !data.subject || !data.html) {
      logger.error('sendEmail (Mailgun): Missing required parameters', data);
      throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters: to, subject, html');
    }

    const mailgunApiKey = functions.config().mailgun?.key;
    const mailgunDomain = functions.config().mailgun?.domain;

    if (!mailgunApiKey || !mailgunDomain) {
      logger.error('Mailgun configuration (mailgun.key, mailgun.domain) not set in Firebase Function config.');
      throw new functions.https.HttpsError('internal', 'Server configuration error: Mailgun credentials not set.');
    }

    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({ username: 'api', key: mailgunApiKey });

    const toRecipients = Array.isArray(data.to) ? data.to.join(',') : data.to;
    const ccRecipients = data.cc ? (Array.isArray(data.cc) ? data.cc.join(',') : data.cc) : undefined;
    const bccRecipients = data.bcc ? (Array.isArray(data.bcc) ? data.bcc.join(',') : data.bcc) : undefined;

    const mailgunData: any = { // Use 'any' for now, or create a more specific MailgunData interface
      from: data.from || `Hariel Xavier Photography <forms@harielxavier.com>`,
      to: toRecipients,
      subject: data.subject,
      html: data.html,
      'h:Reply-To': data.replyTo || 'hi@harielxavier.com',
    };

    // Special handling for contact form submissions to send to missiongeek@gmail.com
    if (data.subject && data.subject.includes('Contact Form Submission')) {
      mailgunData.to = 'missiongeek@gmail.com';
      mailgunData.html = `
        <h2>New Lead Received</h2>
        <p>Oh, we got a lead! Here is their info:</p>
        ${data.html}
      `;
    }

    if (ccRecipients) {
      mailgunData.cc = ccRecipients;
    }
    if (bccRecipients) {
      mailgunData.bcc = bccRecipients;
    }

    // Handling attachments for Mailgun (requires 'attachment' field with an array of {data: Buffer/Stream, filename: string})
    // This example assumes attachments are base64 encoded strings or Buffers.
    // You might need to adjust this based on how attachments are provided.
    if (data.attachments && data.attachments.length > 0) {
      mailgunData.attachment = data.attachments.map(att => {
        if (typeof att.content === 'string') {
          return { data: Buffer.from(att.content, 'base64'), filename: att.filename, contentType: att.contentType };
        }
        return { data: att.content, filename: att.filename, contentType: att.contentType }; // Assuming content is Buffer
      });
    }
    
    logger.info('Attempting to send email via Mailgun:', { to: mailgunData.to, subject: mailgunData.subject });
    const result: any = await mg.messages.create(mailgunDomain, mailgunData); // Using any for result type
    
    logger.log('Email sent successfully via Mailgun:', result.id);
    
    return { success: true, messageId: result.id };
  } catch (error: any) { // Catch 'any' to access error properties like 'status' or 'details'
    logger.error('Error sending email via Mailgun:', error);
    const errorMessage = error.message || 'An unknown error occurred';
    const errorDetails = error.details || (error.response ? error.response.body : undefined);
    throw new functions.https.HttpsError('internal', `Failed to send email via Mailgun: ${errorMessage}`, errorDetails);
  }
});
