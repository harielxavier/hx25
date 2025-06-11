/**
 * Email Test Script for Hariel Xavier Photography
 * Tests sending emails using the correct SMTP configuration
 */
import nodemailer from 'nodemailer';

// Create transporter with the correct settings
const transporter = nodemailer.createTransport({
  host: 'mail.harielxavier.com', // Using the mail subdomain instead of forms
  port: 587,
  secure: false,
  auth: {
    user: 'forms@harielxavier.com',
    pass: 'Vamos!!86'
  },
  tls: {
    rejectUnauthorized: false // For self-signed certificates
  }
});

// Test function
async function testEmail() {
  console.log('🔍 Testing SMTP connection...');
  
  try {
    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
    
    // Send test email
    console.log('📧 Sending test email...');
    const info = await transporter.sendMail({
      from: '"Hariel Xavier Photography" <forms@harielxavier.com>',
      to: 'missiongeek@gmail.com',
      cc: 'hi@harielxavier.com',
      subject: 'Test Email - ' + new Date().toISOString(),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #333;">Email Test Successful</h2>
          <p>This confirms that your email system is working correctly with the following configuration:</p>
          <ul>
            <li><strong>SMTP Host:</strong> forms.harielxavier.com</li>
            <li><strong>SMTP User:</strong> forms@harielxavier.com</li>
            <li><strong>From:</strong> forms@harielxavier.com</li>
            <li><strong>To:</strong> missiongeek@gmail.com</li>
            <li><strong>CC:</strong> hi@harielxavier.com</li>
            <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
          </ul>
          <p>Your contact form should now be sending emails correctly.</p>
        </div>
      `
    });
    
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the test
console.log('🚀 Starting email test...');
testEmail();
