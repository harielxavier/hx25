/**
 * Email Test Script
 * 
 * This script tests the email functionality using the Bluehost SMTP server.
 * It sends a test email to verify the configuration and logs the results.
 * 
 * Usage: 
 * 1. Set EMAIL_PASSWORD environment variable or create a .env file
 * 2. Run: node scripts/test-email.js
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

// Test recipient email
const TEST_RECIPIENT = 'missiongeek@gmail.com';

// Create a transporter using Bluehost SMTP settings
const transporter = nodemailer.createTransport({
  host: 'mail.harielxavier.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'info@harielxavier.com',
    pass: process.env.EMAIL_PASSWORD || '' // Use environment variable for security
  },
  tls: {
    rejectUnauthorized: false // Needed for some self-signed certificates
  },
  debug: true // Enable debug output
});

// Test email content
const mailOptions = {
  from: '"Hariel Xavier Photography" <info@harielxavier.com>',
  to: TEST_RECIPIENT,
  subject: 'Email System Test - Contact Form',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
      <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Email System Test</h2>
      
      <p>This is a test email to verify the contact form email functionality.</p>
      
      <h3>Test Details:</h3>
      <ul>
        <li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
        <li><strong>SMTP Server:</strong> mail.harielxavier.com</li>
        <li><strong>From:</strong> info@harielxavier.com</li>
        <li><strong>To:</strong> ${TEST_RECIPIENT}</li>
      </ul>
      
      <p>If you received this email, the SMTP configuration is working correctly!</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">This is an automated test email. Please do not reply.</p>
      </div>
    </div>
  `
};

// Test functions
async function runTests() {
  console.log('🔍 Starting email system tests...');
  console.log('-------------------------------------');
  
  // Test 1: Verify SMTP connection
  console.log('Test 1: Verifying SMTP connection...');
  try {
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
  } catch (error) {
    console.error('❌ SMTP connection failed:', error);
    console.log('\nPossible issues:');
    console.log('- Check if EMAIL_PASSWORD environment variable is set correctly');
    console.log('- Verify that the SMTP server is accessible');
    console.log('- Check if port 587 is open and not blocked by firewall');
    process.exit(1);
  }
  
  // Test 2: Send test email
  console.log('\nTest 2: Sending test email...');
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log(`📤 Sent to: ${TEST_RECIPIENT}`);
    console.log('\n📋 Email delivery checklist:');
    console.log('1. Check if the email was received at', TEST_RECIPIENT);
    console.log('2. Verify the email appears correctly formatted');
    console.log('3. Check if the email went to spam/junk folder');
  } catch (error) {
    console.error('❌ Failed to send test email:', error);
    console.log('\nPossible issues:');
    console.log('- Check SMTP authentication credentials');
    console.log('- Verify the recipient email address is valid');
    console.log('- Check if there are sending limits on your hosting account');
    process.exit(1);
  }
  
  console.log('\n-------------------------------------');
  console.log('✨ Email system tests completed!');
}

// Run the tests
runTests().catch(console.error);
