// Import all function modules
import * as emailFunctions from "./email";
import * as functions from "firebase-functions";
import { sendLeadEmails } from "./admin-email";
// import * as analyticsApi from "./analyticsApi"; // Import the new analytics API module - commented out due to build errors

// Export the original functions
export const sendEmailWithSMTP = emailFunctions.sendEmailWithSMTP;
export const sendEmail = emailFunctions.sendEmail;
// export const onLeadCreated = emailFunctions.onLeadCreated; // Disable the original trigger export

// Export the new analytics function - commented out due to build errors
// export const getAnalyticsData = analyticsApi.getAnalyticsData;

// Create a new Firestore trigger that uses our admin-email module
export const onLeadCreatedWithAdmin = functions.firestore
  .document('leads/{leadId}')
  .onCreate(async (snapshot, context) => {
    const leadId = context.params.leadId;
    const leadData = snapshot.data();
    
    console.log(`onLeadCreatedWithAdmin: New lead created with ID ${leadId}`);
    
    try {
      // Send emails using the admin-email module
      const result = await sendLeadEmails(leadId, leadData);
      
      console.log(`onLeadCreatedWithAdmin: Emails sent for lead ${leadId}:`, result);
      
      return result;
    } catch (error) {
      console.error(`onLeadCreatedWithAdmin: Error sending emails for lead ${leadId}:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });
