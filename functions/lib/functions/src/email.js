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
exports.sendEmail = exports.onLeadCreated = exports.sendEmailWithSMTP = void 0;
const functions = __importStar(require("firebase-functions")); // Import the entire namespace
const firebase_functions_1 = require("firebase-functions"); // Import logger explicitly
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailTemplates_1 = require("../../src/services/emailTemplates"); // Import the template
/**
 * Cloud function to send email with custom SMTP configuration
 * Supports the Bluehost SMTP server specified in client requirements
 */
exports.sendEmailWithSMTP = functions.https.onCall(async (request, context) => {
    const data = request.data; // Access data from request.data
    try {
        // Parameters are implicitly validated by the interface, but runtime check is good practice
        if (!data.to || !data.subject || !data.html || !data.smtpConfig) {
            firebase_functions_1.logger.error('sendEmailWithSMTP: Missing required parameters', data);
            throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters: to, subject, html, smtpConfig');
        }
        // Create transporter with provided SMTP config
        const transporter = nodemailer_1.default.createTransport(data.smtpConfig);
        // Email options
        const mailOptions = {
            from: data.from || 'Hariel Xavier Photography <forms@harielxavier.com>',
            to: Array.isArray(data.to) ? data.to.join(',') : data.to,
            subject: data.subject,
            html: data.html,
            replyTo: data.replyTo || 'hi@harielxavier.com',
            attachments: data.attachments || []
        };
        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send email', error);
    }
});
const firestore_1 = require("firebase-functions/v2/firestore"); // Import v2 trigger
/**
 * Firestore trigger (v2) to send a thank you email when a new lead is created.
 */
exports.onLeadCreated = (0, firestore_1.onDocumentCreated)('leads/{leadId}', async (event) => {
    var _a, _b;
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const snapshot = event.data;
    if (!snapshot) {
        firebase_functions_1.logger.error("onLeadCreated: No data associated with the event");
        return;
    }
    const leadData = snapshot.data();
    const leadId = event.params.leadId; // Access params from event
    if (!leadData || !leadData.email || !leadData.firstName) {
        firebase_functions_1.logger.error(`onLeadCreated (${leadId}): Missing required lead data (email, firstName).`, leadData);
        return null; // Exit if essential data is missing
    }
    const { firstName, email, eventType, eventDate } = leadData;
    firebase_functions_1.logger.info(`onLeadCreated (${leadId}): Triggered for new lead: ${email}`);
    try {
        // Get SMTP configuration securely from Firebase Function config
        const smtpUser = (_a = functions.config().smtp) === null || _a === void 0 ? void 0 : _a.user;
        const smtpPass = (_b = functions.config().smtp) === null || _b === void 0 ? void 0 : _b.pass;
        if (!smtpUser || !smtpPass) {
            firebase_functions_1.logger.error(`onLeadCreated (${leadId}): SMTP configuration (smtp.user, smtp.pass) not set.`);
            throw new Error('Server configuration error: SMTP credentials not set.');
        }
        const smtpConfig = {
            host: 'mail.harielxavier.com',
            port: 465,
            secure: true,
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        };
        // Create transporter
        const transporter = nodemailer_1.default.createTransport(smtpConfig);
        // Generate email content
        const emailHtml = (0, emailTemplates_1.createThankYouEmailTemplate)(firstName, email, eventType, eventDate);
        // Email options
        const mailOptions = {
            from: `Hariel Xavier Photography <${smtpUser}>`,
            to: email,
            subject: 'Thank You for Your Inquiry | Hariel Xavier Photography',
            html: emailHtml,
            replyTo: 'hi@harielxavier.com',
        };
        // Send the email
        firebase_functions_1.logger.info(`onLeadCreated (${leadId}): Attempting to send thank you email to ${email}`);
        const info = await transporter.sendMail(mailOptions);
        firebase_functions_1.logger.log(`onLeadCreated (${leadId}): Thank you email sent successfully to ${email}. Message ID: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    }
    catch (error) {
        firebase_functions_1.logger.error(`onLeadCreated (${leadId}): Error sending thank you email to ${email}:`, error);
        // We don't rethrow here to prevent the function from retrying indefinitely on permanent errors
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
});
/**
 * Cloud function to send an email using securely configured SMTP settings.
 */
exports.sendEmail = functions.https.onCall(async (request, context) => {
    var _a, _b;
    const data = request.data; // Access data from request.data
    try {
        // Validate parameters
        if (!data.to || !data.subject || !data.html) {
            firebase_functions_1.logger.error('sendEmail: Missing required parameters', data);
            throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters: to, subject, html');
        }
        // Get SMTP configuration securely from Firebase Function config
        const smtpUser = (_a = functions.config().smtp) === null || _a === void 0 ? void 0 : _a.user;
        const smtpPass = (_b = functions.config().smtp) === null || _b === void 0 ? void 0 : _b.pass; // Type assertion
        if (!smtpUser || !smtpPass) {
            functions.logger.error('SMTP configuration (smtp.user, smtp.pass) not set in Firebase Function config.'); // Use functions.logger
            throw new functions.https.HttpsError('internal', 'Server configuration error: SMTP credentials not set.');
        }
        const smtpConfig = {
            host: 'mail.harielxavier.com',
            port: 465,
            secure: true,
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        };
        // Create transporter
        const transporter = nodemailer_1.default.createTransport(smtpConfig);
        // Verify connection configuration
        // try {
        //   await transporter.verify();
        //   functions.logger.info('SMTP Connection verified successfully.'); // Use functions.logger
        // } catch (verifyError) {
        //   functions.logger.error('SMTP Connection verification failed:', verifyError); // Use functions.logger
        //   throw new functions.https.HttpsError('internal', 'Failed to verify SMTP connection.', verifyError);
        // }
        // Temporarily commenting out verify() as it can sometimes cause issues with certain providers/firewalls
        // and isn't strictly necessary for sending. We rely on sendMail error handling.
        // Email options
        const mailOptions = {
            from: data.from || `Hariel Xavier Photography <${smtpUser}>`,
            to: Array.isArray(data.to) ? data.to.join(',') : data.to,
            subject: data.subject,
            html: data.html,
            replyTo: data.replyTo || 'hi@harielxavier.com',
            cc: data.cc ? (Array.isArray(data.cc) ? data.cc.join(',') : data.cc) : undefined,
            bcc: data.bcc ? (Array.isArray(data.bcc) ? data.bcc.join(',') : data.bcc) : undefined,
            attachments: data.attachments || [],
        };
        // Send the email
        functions.logger.info('Attempting to send email:', { to: mailOptions.to, subject: mailOptions.subject }); // Use functions.logger
        const info = await transporter.sendMail(mailOptions);
        functions.logger.log('Email sent successfully:', info.messageId); // Use functions.logger for general logs
        return { success: true, messageId: info.messageId };
    }
    catch (error) {
        functions.logger.error('Error sending email:', error); // Use functions.logger
        // Ensure error is an instance of Error before passing details
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        throw new functions.https.HttpsError('internal', `Failed to send email: ${errorMessage}`, error);
    }
});
//# sourceMappingURL=email.js.map