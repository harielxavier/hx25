// Test script for the plain email template
import nodemailer from 'nodemailer';
import { createPlainThankYouEmailTemplate } from './functions/src/plain-email-template.js';

// Bluehost SMTP configuration
const BLUEHOST_SMTP_CONFIG = {
  host: 'mail.harielxavier.com',
  port: 465,
  secure: true,
  auth: {
    user: 'forms@harielxavier.com',
    pass: 'Vamos!!86'
  }
};

async function testPlainEmailTemplate() {
  try {
    console.log('Creating transporter with SMTP config...');
    const transporter = nodemailer.createTransport(BLUEHOST_SMTP_CONFIG);
    
    console.log('Verifying SMTP connection...');
    const verified = await transporter.verify();
    console.log('SMTP connection verified:', verified);
    
    // Test data
    const name = 'Test User';
    const email = 'missiongeek@gmail.com';
    const eventType = 'wedding';
    const eventDate = '2025-05-15';
    const isDateAvailable = true;
    
    // Generate the email HTML using the plain template
    const emailHtml = createPlainThankYouEmailTemplate(
      name,
      email,
      eventType,
      eventDate,
      isDateAvailable
    );
    
    console.log('Sending test email with plain template...');
    const info = await transporter.sendMail({
      from: 'Hariel Xavier Photography <forms@harielxavier.com>',
      to: email,
      subject: 'Test Email with Plain Template',
      html: emailHtml
    });
    
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    
    return { success: true, info };
  } catch (error) {
    console.error('Error sending test email:', error);
    return { success: false, error: error.message };
  }
}

// Run the test
testPlainEmailTemplate()
  .then(result => {
    if (result.success) {
      console.log('✅ Plain email template test is successful!');
    } else {
      console.log('❌ Plain email template test failed.');
    }
  })
  .catch(err => {
    console.error('Unexpected error during test:', err);
  });
