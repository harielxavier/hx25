// Script to test sending emails for a lead using the admin-email module
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a require function
const require = createRequire(import.meta.url);

// Import the compiled JavaScript module (not the TypeScript source)
const adminEmailPath = join(__dirname, 'functions/lib/admin-email.js');
console.log(`Loading admin-email module from: ${adminEmailPath}`);

async function main() {
  try {
    // Check if the file exists
    const fs = require('fs');
    if (!fs.existsSync(adminEmailPath)) {
      console.error(`Error: The file ${adminEmailPath} does not exist.`);
      console.log('Make sure you have built the functions project with "npm run build" in the functions directory.');
      return;
    }

    // Import the module
    const { sendEmailsForLead } = require(adminEmailPath);
    
    // The lead ID from our test lead
    const leadId = 'gTXC0TTBYS80cgzgYkpr';
    
    console.log(`Sending emails for lead: ${leadId}`);
    
    // Send emails for the lead
    const result = await sendEmailsForLead(leadId);
    
    console.log('Result:', result);
    
    if (result.success) {
      console.log('Emails sent successfully!');
      console.log('Thank You Email Message ID:', result.thankYouMessageId);
      console.log('Admin Notification Email Message ID:', result.adminNotificationMessageId);
    } else {
      console.error('Failed to send emails:', result.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
