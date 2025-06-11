// Script to update the admin-email.ts file to use the plain email template
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

function updateAdminEmail() {
  try {
    console.log('Updating admin-email.ts to use the plain email template...');
    
    // Read the admin-email.ts file
    const adminEmailPath = path.join('functions', 'src', 'admin-email.ts');
    let content = readFileSync(adminEmailPath, 'utf8');
    
    // Replace the import statement
    content = content.replace(
      /import \{ createThankYouEmailTemplate, createAdminNotificationTemplate \} from '\.\/templates';/,
      "import { createAdminNotificationTemplate } from './templates';\nimport { createPlainThankYouEmailTemplate } from './plain-email-template';"
    );
    
    // Replace the usage of createThankYouEmailTemplate with createPlainThankYouEmailTemplate
    content = content.replace(
      /const thankYouHtml = createThankYouEmailTemplate\(firstName, email, eventType, eventDate, isDateAvailable\);/,
      "const thankYouHtml = createPlainThankYouEmailTemplate(firstName, email, eventType, eventDate, isDateAvailable);"
    );
    
    // Write the updated content back to the file
    writeFileSync(adminEmailPath, content);
    
    console.log('admin-email.ts updated successfully!');
  } catch (error) {
    console.error(`Error updating admin-email.ts: ${error.message}`);
  }
}

updateAdminEmail();
