/**
 * Email Preview Script
 * Shows what the emails would look like when someone fills out the contact form
 */
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

// Sample form submission data
const sampleLead = {
  id: uuidv4(),
  name: 'Sarah Johnson',
  email: 'sarahjohnson@example.com',
  phone: '555-123-4567',
  weddingDate: '2026-06-15',
  message: 'Hi there! My fiancé and I are planning our wedding for next summer and we love your photography style. We\'re especially drawn to your candid shots and the way you capture natural light. We\'re having an outdoor ceremony at Sunset Gardens followed by a reception at The Grand Hall. Would you be available on our date? We\'d love to discuss packages and possibly schedule an engagement shoot as well.',
  source: 'website_contact_form',
  status: 'new',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Generate admin notification email
function generateAdminNotificationEmail(lead) {
  const subject = `New Lead: ${lead.name} - ${lead.source}`;
  
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
      <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Lead from Website</h2>
      <p><strong>Name:</strong> ${lead.name}</p>
      <p><strong>Email:</strong> ${lead.email}</p>
      ${lead.phone ? `<p><strong>Phone:</strong> ${lead.phone}</p>` : ''}
      ${lead.weddingDate ? `<p><strong>Wedding Date:</strong> ${lead.weddingDate}</p>` : ''}
      <p><strong>Source:</strong> ${lead.source}</p>
      ${lead.message ? `<p><strong>Message:</strong><br>${lead.message.replace(/\n/g, '<br>')}</p>` : ''}
      <p><strong>Received:</strong> ${format(new Date(lead.createdAt), 'MMMM d, yyyy h:mm a')}</p>
      <p><a href="https://www.harielxavier.com/admin/leads/${lead.id}" style="background-color: #4a6a8a; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 10px;">View Lead in Admin</a></p>
    </div>
  `;
  
  return { subject, body };
}

// Generate lead autoresponse email
function generateLeadAutoresponseEmail(lead) {
  const subject = 'Thank you for contacting Hariel Xavier Photography';
  
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
      <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Thank You for Reaching Out!</h2>
      
      <p>Hi ${lead.name.split(' ')[0]},</p>
      
      <p>Thank you for contacting Hariel Xavier Photography. We've received your inquiry and are excited to learn more about your photography needs.</p>
      
      ${lead.weddingDate ? `<p>We've noted your wedding date (${lead.weddingDate}) and will check our availability.</p>` : ''}
      
      <p>Here's what to expect next:</p>
      
      <ol>
        <li>We'll review your inquiry within 24-48 hours</li>
        <li>You'll receive a personalized response from our team</li>
        <li>We'll schedule a consultation to discuss your vision in detail</li>
      </ol>
      
      <p>In the meantime, feel free to browse our <a href="https://www.harielxavier.com/portfolio" style="color: #4a6a8a; text-decoration: underline;">portfolio</a> for inspiration.</p>
      
      <p>Looking forward to connecting with you soon!</p>
      
      <p>Warm regards,<br>
      Hariel Xavier<br>
      Hariel Xavier Photography<br>
      <a href="mailto:hi@harielxavier.com" style="color: #4a6a8a; text-decoration: underline;">hi@harielxavier.com</a><br>
      <a href="tel:+1234567890" style="color: #4a6a8a; text-decoration: underline;">(123) 456-7890</a></p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
        <p>This is an automatic response to your inquiry. Please do not reply to this email.</p>
      </div>
    </div>
  `;
  
  return { subject, body };
}

// Display the emails
console.log('\n=======================================================');
console.log('SAMPLE EMAILS FROM CONTACT FORM SUBMISSION');
console.log('=======================================================\n');

// Admin notification
const adminEmail = generateAdminNotificationEmail(sampleLead);
console.log('EMAIL 1: ADMIN NOTIFICATION');
console.log('---------------------------');
console.log('From: "Hariel Xavier Photography" <forms@harielxavier.com>');
console.log('To: hi@harielxavier.com');
console.log('BCC: missiongeek@gmail.com');
console.log(`Subject: ${adminEmail.subject}`);
console.log('\nBody:');
console.log(adminEmail.body);

// Lead autoresponse
const autoresponseEmail = generateLeadAutoresponseEmail(sampleLead);
console.log('\n\n=======================================================\n');
console.log('EMAIL 2: LEAD AUTORESPONSE');
console.log('-------------------------');
console.log('From: "Hariel Xavier Photography" <forms@harielxavier.com>');
console.log('To: sarahjohnson@example.com');
console.log('BCC: missiongeek@gmail.com');
console.log(`Subject: ${autoresponseEmail.subject}`);
console.log('\nBody:');
console.log(autoresponseEmail.body);

console.log('\n=======================================================');
console.log('NOTE: These emails will be sent automatically when someone submits the contact form.');
console.log('The admin notification goes to hi@harielxavier.com with a copy to missiongeek@gmail.com.');
console.log('The autoresponse goes to the lead\'s email with a copy to missiongeek@gmail.com.');
console.log('=======================================================');
