/**
 * Simple Email Test Script
 * 
 * This script tests the email functionality using Bluehost SMTP
 * It will send test emails to verify your configuration
 */

import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Load environment variables
dotenv.config();

// Check if email password is set
const emailPassword = process.env.EMAIL_PASSWORD;
if (!emailPassword || emailPassword === 'your_email_password') {
  console.error('\n❌ ERROR: EMAIL_PASSWORD not set correctly in .env file');
  console.log('\nPlease update the EMAIL_PASSWORD in your .env file with your actual Bluehost password.');
  console.log('Current value:', emailPassword === 'your_email_password' ? '"your_email_password" (placeholder)' : 'missing');
  process.exit(1);
}

// Test configuration
const config = {
  smtpHost: 'mail.harielxavier.com',
  smtpPort: 587,
  smtpUser: 'info@harielxavier.com',
  smtpPass: emailPassword,
  testRecipient: 'missiongeek@gmail.com'
};

console.log('\n📧 Email Test - Using Bluehost SMTP');
console.log('=====================================');
console.log('SMTP Host:', config.smtpHost);
console.log('SMTP Port:', config.smtpPort);
console.log('SMTP User:', config.smtpUser);
console.log('Test Recipient:', config.testRecipient);

// Create transporter
const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  secure: false,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true
});

// Test functions
async function runTests() {
  // Test 1: Verify connection
  console.log('\n🔍 TEST 1: Verifying SMTP connection...');
  try {
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
  } catch (error) {
    console.error('❌ SMTP connection failed:', error.message);
    console.log('\nPossible issues:');
    console.log('- Check if EMAIL_PASSWORD in .env is correct');
    console.log('- Verify that the SMTP server is accessible');
    console.log('- Check if port 587 is open and not blocked by firewall');
    process.exit(1);
  }
  
  // Test 2: Send test email
  console.log('\n🔍 TEST 2: Sending test email...');
  
  const mailOptions = {
    from: `"Hariel Xavier Photography" <${config.smtpUser}>`,
    to: config.testRecipient,
    subject: 'Email System Test - ' + new Date().toLocaleString(),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Email System Test</h2>
        
        <p>This is a test email to verify the email functionality.</p>
        
        <h3>Test Details:</h3>
        <ul>
          <li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
          <li><strong>SMTP Server:</strong> ${config.smtpHost}</li>
          <li><strong>From:</strong> ${config.smtpUser}</li>
          <li><strong>To:</strong> ${config.testRecipient}</li>
        </ul>
        
        <p>If you received this email, the SMTP configuration is working correctly!</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">This is an automated test email. Please do not reply.</p>
        </div>
      </div>
    `
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    console.log('\n📋 Email delivery checklist:');
    console.log('1. Check if the email was received at', config.testRecipient);
    console.log('2. Verify the email appears correctly formatted');
    console.log('3. Check if the email went to spam/junk folder');
  } catch (error) {
    console.error('❌ Failed to send test email:', error.message);
    console.log('\nPossible issues:');
    console.log('- Check SMTP authentication credentials');
    console.log('- Verify the recipient email address is valid');
    console.log('- Check if there are sending limits on your hosting account');
    process.exit(1);
  }
  
  console.log('\n✨ Email tests completed!');
}

// Run the tests
console.log('\n🚀 Starting Email Tests...');
runTests().catch(error => {
  console.error('\n❌ Test script error:', error);
  process.exit(1);
});
