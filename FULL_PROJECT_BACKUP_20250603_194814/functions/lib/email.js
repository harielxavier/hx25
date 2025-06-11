"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.sendEmailWithSMTP = void 0;
const functions = __importStar(require("firebase-functions"));
const firebase_functions_1 = require("firebase-functions");
const form_data_1 = __importDefault(require("form-data"));
const mailgun_js_1 = __importDefault(require("mailgun.js"));
/**
 * Cloud function to send email with custom SMTP configuration (using Nodemailer)
 * This function remains as is, in case direct SMTP is still needed for some scenarios.
 * If it's to be fully replaced by Mailgun, this can be removed.
 */
exports.sendEmailWithSMTP = functions.https.onCall(async (data, context) => {
    try {
        if (!data.to || !data.subject || !data.html || !data.smtpConfig) {
            firebase_functions_1.logger.error('sendEmailWithSMTP: Missing required parameters', data);
            throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters: to, subject, html, smtpConfig');
        }
        // Dynamically import nodemailer only when this function is called
        const nodemailer = await Promise.resolve().then(() => __importStar(require('nodemailer')));
        const transporter = nodemailer.createTransport(data.smtpConfig);
        const mailOptions = {
            from: data.from || 'Hariel Xavier Photography <forms@harielxavier.com>',
            to: Array.isArray(data.to) ? data.to.join(',') : data.to,
            subject: data.subject,
            html: data.html,
            replyTo: data.replyTo || 'hi@harielxavier.com',
            attachments: data.attachments || []
        };
        const info = await transporter.sendMail(mailOptions);
        firebase_functions_1.logger.log('Email sent successfully via SMTP:', info.messageId);
        return { success: true, messageId: info.messageId };
    }
    catch (error) {
        firebase_functions_1.logger.error('Error sending email via SMTP:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send email via SMTP', error);
    }
});
/**
 * Cloud function to send an email using Mailgun.
 */
exports.sendEmail = functions.https.onCall(async (data, context) => {
    var _a, _b;
    try {
        if (!data.to || !data.subject || !data.html) {
            firebase_functions_1.logger.error('sendEmail (Mailgun): Missing required parameters', data);
            throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters: to, subject, html');
        }
        const mailgunApiKey = (_a = functions.config().mailgun) === null || _a === void 0 ? void 0 : _a.key;
        const mailgunDomain = (_b = functions.config().mailgun) === null || _b === void 0 ? void 0 : _b.domain;
        if (!mailgunApiKey || !mailgunDomain) {
            firebase_functions_1.logger.error('Mailgun configuration (mailgun.key, mailgun.domain) not set in Firebase Function config.');
            throw new functions.https.HttpsError('internal', 'Server configuration error: Mailgun credentials not set.');
        }
        const mailgun = new mailgun_js_1.default(form_data_1.default);
        const mg = mailgun.client({ username: 'api', key: mailgunApiKey });
        const toRecipients = Array.isArray(data.to) ? data.to.join(',') : data.to;
        const ccRecipients = data.cc ? (Array.isArray(data.cc) ? data.cc.join(',') : data.cc) : undefined;
        const bccRecipients = data.bcc ? (Array.isArray(data.bcc) ? data.bcc.join(',') : data.bcc) : undefined;
        const mailgunData = {
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
        firebase_functions_1.logger.info('Attempting to send email via Mailgun:', { to: mailgunData.to, subject: mailgunData.subject });
        const result = await mg.messages.create(mailgunDomain, mailgunData); // Using any for result type
        firebase_functions_1.logger.log('Email sent successfully via Mailgun:', result.id);
        return { success: true, messageId: result.id };
    }
    catch (error) { // Catch 'any' to access error properties like 'status' or 'details'
        firebase_functions_1.logger.error('Error sending email via Mailgun:', error);
        const errorMessage = error.message || 'An unknown error occurred';
        const errorDetails = error.details || (error.response ? error.response.body : undefined);
        throw new functions.https.HttpsError('internal', `Failed to send email via Mailgun: ${errorMessage}`, errorDetails);
    }
});
//# sourceMappingURL=email.js.map