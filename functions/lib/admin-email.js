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
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailsForLead = exports.sendLeadEmails = void 0;
const admin = __importStar(require("firebase-admin"));
const nodemailer = __importStar(require("nodemailer"));
const functions = __importStar(require("firebase-functions")); // Import firebase-functions
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const templates_1 = require("./templates");
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
    host: (_b = (_a = functions.config().mailgun) === null || _a === void 0 ? void 0 : _a.smtp) === null || _b === void 0 ? void 0 : _b.host,
    port: parseInt(((_d = (_c = functions.config().mailgun) === null || _c === void 0 ? void 0 : _c.smtp) === null || _d === void 0 ? void 0 : _d.port) || '587', 10),
    secure: false,
    auth: {
        user: (_f = (_e = functions.config().mailgun) === null || _e === void 0 ? void 0 : _e.smtp) === null || _f === void 0 ? void 0 : _f.user,
        pass: (_h = (_g = functions.config().mailgun) === null || _g === void 0 ? void 0 : _g.smtp) === null || _h === void 0 ? void 0 : _h.pass,
    },
};
// Create transporter
const transporter = nodemailer.createTransport(smtpConfig);
// Mock function to check date availability
// In a real implementation, this would connect to your calendar service
const checkDateAvailability = async (date) => {
    // This is a simplified mock implementation
    // In a real scenario, you would use your calendar service to check availability
    // For demonstration purposes, let's consider some dates as booked
    const bookedDates = [
        '2025-05-10',
        '2025-05-17',
        '2025-05-24',
        '2025-06-07',
        '2025-06-14',
        '2025-06-21',
        '2025-07-05',
        '2025-07-12',
        '2025-07-19',
        '2025-08-02',
        '2025-08-09',
        '2025-08-16',
        '2025-08-30',
        '2025-09-06',
        '2025-09-13',
        '2025-09-27', // September 27, 2025
    ];
    // Check if the date is in the booked dates list
    return !bookedDates.includes(date);
};
// Function to send emails when a new lead is created
async function sendLeadEmails(leadId, leadData) {
    try {
        console.log(`sendLeadEmails: Processing lead ${leadId}`);
        if (!leadData || !leadData.email || !leadData.firstName) {
            console.error(`sendLeadEmails: Missing required lead data (email, firstName) for lead ${leadId}`);
            return { success: false, error: 'Missing required lead data' };
        }
        const { firstName, email, eventType, eventDate } = leadData;
        console.log(`sendLeadEmails: Sending emails for lead ${leadId} (${email})`);
        // Check date availability if eventDate is provided
        let isDateAvailable = undefined;
        if (eventDate) {
            try {
                // Format date to YYYY-MM-DD if it's not already in that format
                const formattedDate = eventDate.includes('-')
                    ? eventDate
                    : new Date(eventDate).toISOString().split('T')[0];
                isDateAvailable = await checkDateAvailability(formattedDate);
                console.log(`sendLeadEmails: Date ${eventDate} availability check result: ${isDateAvailable ? 'Available' : 'Not Available'}`);
            }
            catch (error) {
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
            to: email,
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
        const adminNotificationHtml = (0, templates_1.createAdminNotificationTemplate)(leadDataForNotification, leadId);
        const adminMailOptions = {
            from: `Hariel Xavier Photography <hi@harielxavier.com>`,
            to: adminEmails,
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
    }
    catch (error) {
        console.error(`sendLeadEmails: Error sending emails for lead ${leadId}:`, error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
exports.sendLeadEmails = sendLeadEmails;
// Function to manually send emails for a specific lead
async function sendEmailsForLead(leadId) {
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
    }
    catch (error) {
        console.error(`sendEmailsForLead: Error processing lead ${leadId}:`, error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
exports.sendEmailsForLead = sendEmailsForLead;
//# sourceMappingURL=admin-email.js.map