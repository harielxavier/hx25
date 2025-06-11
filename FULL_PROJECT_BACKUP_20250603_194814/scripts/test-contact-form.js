/**
 * Contact Form Test Script
 * 
 * This script tests the full contact form submission flow including:
 * 1. Verifying SMTP connection
 * 2. Testing admin notification email
 * 3. Testing lead autoresponse email
 * 4. Checking for common email delivery issues
 * 
 * Usage: 
 * 1. Set EMAIL_PASSWORD in .env file
 * 2. Run: node scripts/test-contact-form.js
 */

import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import chalk from 'chalk'; // For colored console output

dotenv.config();

// Test configuration
const config = {
  smtpHost: 'mail.harielxavier.com',
  smtpPort: 587,
  smtpUser: 'info@harielxavier.com',
  smtpPass: process.env.EMAIL_PASSWORD,
  testRecipient: 'missiongeek@gmail.com',
  adminEmail: 'info@harielxavier.com'
};

// Create a transporter using Bluehost SMTP settings
const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass
  },
  tls: {
    rejectUnauthorized: false // Needed for some self-signed certificates
  },
  debug: true // Enable debug output
});

// Mock lead data for testing
const testLead = {
  id: uuidv4(),
  name: 'Test User',
  email: config.testRecipient,
  phone: '555-123-4567',
  weddingDate: '2026-06-15',
  eventType: 'Wedding',
  message: 'This is a test submission from the automated testing script.',
  source: 'website_contact_form',
  status: 'new',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Test functions
async function runTests() {
  console.log(chalk.blue.bold('\n📋 CONTACT FORM EMAIL TEST CHECKLIST'));
  console.log(chalk.blue('==========================================='));
  
  // Check if password is set
  if (!config.smtpPass) {
    console.error(chalk.red('❌ ERROR: EMAIL_PASSWORD not set in .env file'));
    console.log(chalk.yellow('Please add EMAIL_PASSWORD=your_password to your .env file'));
    process.exit(1);
  }

  // Test 1: Verify SMTP connection
  console.log(chalk.cyan('\n🔍 TEST 1: Verifying SMTP connection...'));
  try {
    await transporter.verify();
    console.log(chalk.green('✅ SMTP connection successful!'));
    logChecklistItem('SMTP Connection', 'PASS');
  } catch (error) {
    console.error(chalk.red('❌ SMTP connection failed:'), error);
    console.log(chalk.yellow('\nPossible issues:'));
    console.log('- Check if EMAIL_PASSWORD environment variable is correct');
    console.log('- Verify that the SMTP server is accessible');
    console.log('- Check if port 587 is open and not blocked by firewall');
    logChecklistItem('SMTP Connection', 'FAIL', error.message);
    process.exit(1);
  }
  
  // Test 2: Send admin notification email
  console.log(chalk.cyan('\n🔍 TEST 2: Sending admin notification email...'));
  try {
    const adminEmailResult = await sendAdminNotificationEmail(testLead);
    console.log(chalk.green('✅ Admin notification email sent successfully!'));
    console.log(`📧 Message ID: ${adminEmailResult.messageId}`);
    logChecklistItem('Admin Notification Email', 'PASS');
  } catch (error) {
    console.error(chalk.red('❌ Failed to send admin notification email:'), error);
    logChecklistItem('Admin Notification Email', 'FAIL', error.message);
  }
  
  // Test 3: Send lead autoresponse email
  console.log(chalk.cyan('\n🔍 TEST 3: Sending lead autoresponse email...'));
  try {
    const autoresponseEmailResult = await sendLeadAutoresponseEmail(testLead);
    console.log(chalk.green('✅ Lead autoresponse email sent successfully!'));
    console.log(`📧 Message ID: ${autoresponseEmailResult.messageId}`);
    logChecklistItem('Lead Autoresponse Email', 'PASS');
  } catch (error) {
    console.error(chalk.red('❌ Failed to send lead autoresponse email:'), error);
    logChecklistItem('Lead Autoresponse Email', 'FAIL', error.message);
  }
  
  // Test 4: Check email headers and content
  console.log(chalk.cyan('\n🔍 TEST 4: Email headers and content check...'));
  console.log(chalk.yellow('⚠️ Manual verification required:'));
  console.log('- Check if emails were received at', chalk.bold(config.testRecipient));
  console.log('- Verify emails appear correctly formatted');
  console.log('- Check if emails went to spam/junk folder');
  console.log('- Verify all images and links work correctly');
  
  // Final results
  console.log(chalk.blue('\n==========================================='));
  console.log(chalk.blue.bold('📋 TEST RESULTS SUMMARY'));
  displayTestResults();
  
  console.log(chalk.blue('\n==========================================='));
  console.log(chalk.cyan('📝 NEXT STEPS:'));
  console.log('1. Check your inbox at', chalk.bold(config.testRecipient));
  console.log('2. Verify both emails were received and look correct');
  console.log('3. If any tests failed, review the error messages above');
  console.log('4. Update your email configuration as needed');
}

// Helper function to send admin notification email
async function sendAdminNotificationEmail(lead) {
  const subject = `New Lead: ${lead.name} - ${lead.source}`;
  
  const body = `
    <h2>New Lead from Website</h2>
    <p><strong>Name:</strong> ${lead.name}</p>
    <p><strong>Email:</strong> ${lead.email}</p>
    ${lead.phone ? `<p><strong>Phone:</strong> ${lead.phone}</p>` : ''}
    ${lead.weddingDate ? `<p><strong>Wedding Date:</strong> ${lead.weddingDate}</p>` : ''}
    ${lead.eventType ? `<p><strong>Event Type:</strong> ${lead.eventType}</p>` : ''}
    <p><strong>Source:</strong> ${lead.source}</p>
    ${lead.message ? `<p><strong>Message:</strong><br>${lead.message.replace(/\n/g, '<br>')}</p>` : ''}
    <p><strong>Received:</strong> ${new Date(lead.createdAt).toLocaleString()}</p>
    <p><a href="https://www.harielxavierphotography.com/admin/leads/${lead.id}">View Lead in Admin</a></p>
  `;
  
  const mailOptions = {
    from: `"Hariel Xavier Photography" <${config.smtpUser}>`,
    to: config.adminEmail,
    bcc: config.testRecipient,
    subject,
    html: body
  };
  
  return await transporter.sendMail(mailOptions);
}

// Helper function to send lead autoresponse email
async function sendLeadAutoresponseEmail(lead) {
  const subject = 'Thank you for contacting Hariel Xavier Photography';
  
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Thank You for Reaching Out!</h2>
      
      <p>Hi ${lead.name.split(' ')[0]},</p>
      
      <p>Thank you for contacting Hariel Xavier Photography. We've received your inquiry and are excited to learn more about your photography needs.</p>
      
      ${lead.weddingDate ? `<p>We've noted your wedding date (${lead.weddingDate}) and will check our availability.</p>` : ''}
      
      <p>Here's what to expect next:</p>
      
      <ol>
        <li>We'll review your inquiry within 24-48 hours</li>
        <li>You'll receive a personalized response from our team</li>
        <li>We'll schedule a consultation to discuss your vision in detail</li>
      </ol>
      
      <p>In the meantime, feel free to browse our <a href="https://www.harielxavierphotography.com/portfolio">portfolio</a> for inspiration.</p>
      
      <p>Looking forward to connecting with you soon!</p>
      
      <p>Warm regards,<br>
      Hariel Xavier<br>
      Hariel Xavier Photography<br>
      <a href="mailto:info@harielxavierphotography.com">info@harielxavierphotography.com</a><br>
      <a href="tel:+1234567890">(123) 456-7890</a></p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
        <p>This is an automatic response to your inquiry. Please do not reply to this email.</p>
      </div>
    </div>
  `;
  
  const mailOptions = {
    from: `"Hariel Xavier Photography" <${config.smtpUser}>`,
    to: lead.email,
    subject,
    html: body
  };
  
  return await transporter.sendMail(mailOptions);
}

// Test results tracking
const testResults = [];

function logChecklistItem(test, status, errorMessage = null) {
  testResults.push({
    test,
    status,
    errorMessage
  });
}

function displayTestResults() {
  console.log('\n');
  testResults.forEach(result => {
    const statusColor = result.status === 'PASS' ? chalk.green : chalk.red;
    console.log(`${statusColor(result.status)} - ${result.test}`);
    if (result.errorMessage) {
      console.log(`   ${chalk.yellow('Error:')} ${result.errorMessage}`);
    }
  });
}

// Run the tests
console.log(chalk.blue.bold('\n🚀 Starting Contact Form Email Tests...'));
runTests().catch(error => {
  console.error(chalk.red('\n❌ Test script error:'), error);
  process.exit(1);
});
