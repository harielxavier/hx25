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
Object.defineProperty(exports, "__esModule", { value: true });
exports.onLeadCreatedWithAdmin = exports.sendEmail = exports.sendEmailWithSMTP = void 0;
// Import all function modules
const emailFunctions = __importStar(require("./email"));
const functions = __importStar(require("firebase-functions"));
const admin_email_1 = require("./admin-email");
// import * as analyticsApi from "./analyticsApi"; // Import the new analytics API module - commented out due to build errors
// Export the original functions
exports.sendEmailWithSMTP = emailFunctions.sendEmailWithSMTP;
exports.sendEmail = emailFunctions.sendEmail;
// export const onLeadCreated = emailFunctions.onLeadCreated; // Disable the original trigger export
// Export the new analytics function - commented out due to build errors
// export const getAnalyticsData = analyticsApi.getAnalyticsData;
// Create a new Firestore trigger that uses our admin-email module
exports.onLeadCreatedWithAdmin = functions.firestore
    .document('leads/{leadId}')
    .onCreate(async (snapshot, context) => {
    const leadId = context.params.leadId;
    const leadData = snapshot.data();
    console.log(`onLeadCreatedWithAdmin: New lead created with ID ${leadId}`);
    try {
        // Send emails using the admin-email module
        const result = await (0, admin_email_1.sendLeadEmails)(leadId, leadData);
        console.log(`onLeadCreatedWithAdmin: Emails sent for lead ${leadId}:`, result);
        return result;
    }
    catch (error) {
        console.error(`onLeadCreatedWithAdmin: Error sending emails for lead ${leadId}:`, error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
});
//# sourceMappingURL=index.js.map