// Test script for the updated email service
import nodemailer from 'nodemailer';

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

async function testEmailService() {
  try {
    console.log('Creating transporter with SMTP config...');
    const transporter = nodemailer.createTransport(BLUEHOST_SMTP_CONFIG);
    
    console.log('Verifying SMTP connection...');
    const verified = await transporter.verify();
    console.log('SMTP connection verified:', verified);
    
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: 'Hariel Xavier Photography <forms@harielxavier.com>',
      to: 'missiongeek@gmail.com', // Your email for testing
      subject: 'Test Email from Updated Email Service',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
          <h1 style="color: #333;">Email Service Test</h1>
          <p>This is a test email from the updated email service using Nodemailer directly.</p>
          <p>If you're receiving this, it means the email functionality is working correctly!</p>
          <p>Time sent: ${new Date().toLocaleString()}</p>
        </div>
      `
    });
    
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    
    return { success: true, info };
  } catch (error) {
    console.error('Error sending test email:', error);
    return { success: false, error: error.message };
  }
}

// Run the test
testEmailService()
  .then(result => {
    if (result.success) {
      console.log('✅ Email service is working correctly!');
    } else {
      console.log('❌ Email service test failed.');
    }
  })
  .catch(err => {
    console.error('Unexpected error during test:', err);
  });
