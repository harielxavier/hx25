/**
 * Lead Flow Test Script
 * 
 * This script tests the complete lead flow from form submission to email notification
 * It will use real SMTP if credentials are available, otherwise it will simulate emails
 * 
 * Usage:
 * 1. Update EMAIL_PASSWORD in .env with your actual Bluehost password
 * 2. Run: node scripts/test-lead-flow.js
 */

import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import chalk from 'chalk';
import { recordLead } from '../src/lib/api/leads.js';
import { verifyEmailConnection } from '../src/lib/api/email.js';

// Load environment variables
dotenv.config();

// Test configuration
const TEST_EMAIL = 'missiongeek@gmail.com';

// Mock form data
const testFormData = {
  name: 'Test User',
  email: TEST_EMAIL,
  phone: '555-123-4567',
  weddingDate: '2026-06-15',
  message: 'This is a test submission from the automated testing script.',
  source: 'website_contact_form',
  status: 'new'
};

// Test checklist
const checklist = {
  smtpConnection: { status: 'pending', details: null },
  leadRecording: { status: 'pending', details: null },
  adminNotification: { status: 'pending', details: null },
  leadAutoresponse: { status: 'pending', details: null }
};

// Run tests
async function runTests() {
  console.log(chalk.blue.bold('\n📋 LEAD FLOW TEST CHECKLIST'));
  console.log(chalk.blue('==========================================='));
  
  // Test 1: Verify SMTP connection if credentials are available
  console.log(chalk.cyan('\n🔍 TEST 1: Verifying SMTP connection...'));
  try {
    const smtpVerified = await verifyEmailConnection();
    if (smtpVerified) {
      checklist.smtpConnection.status = 'pass';
      console.log(chalk.green('✅ SMTP connection verified successfully!'));
    } else {
      checklist.smtpConnection.status = 'warning';
      console.log(chalk.yellow('⚠️ SMTP connection not available - emails will be simulated'));
    }
  } catch (error) {
    checklist.smtpConnection.status = 'fail';
    checklist.smtpConnection.details = error.message;
    console.error(chalk.red('❌ SMTP connection verification failed:'), error);
  }
  
  // Test 2: Record lead and trigger email notifications
  console.log(chalk.cyan('\n🔍 TEST 2: Recording lead and triggering notifications...'));
  try {
    console.log('Form data:', testFormData);
    const lead = await recordLead(testFormData);
    
    checklist.leadRecording.status = 'pass';
    console.log(chalk.green('✅ Lead recorded successfully!'));
    console.log('Lead ID:', lead.id);
    
    if (lead.emailStatus) {
      // Check admin notification status
      if (lead.emailStatus.adminNotificationSent) {
        checklist.adminNotification.status = 'pass';
        console.log(chalk.green('✅ Admin notification email sent successfully!'));
      } else {
        checklist.adminNotification.status = 'fail';
        console.log(chalk.red('❌ Admin notification email failed to send'));
      }
      
      // Check autoresponse status
      if (lead.emailStatus.autoresponseSent) {
        checklist.leadAutoresponse.status = 'pass';
        console.log(chalk.green('✅ Lead autoresponse email sent successfully!'));
      } else {
        checklist.leadAutoresponse.status = 'fail';
        console.log(chalk.red('❌ Lead autoresponse email failed to send'));
      }
    } else {
      checklist.adminNotification.status = 'unknown';
      checklist.leadAutoresponse.status = 'unknown';
      console.log(chalk.yellow('⚠️ Email status not tracked in lead object'));
    }
  } catch (error) {
    checklist.leadRecording.status = 'fail';
    checklist.leadRecording.details = error.message;
    console.error(chalk.red('❌ Lead recording failed:'), error);
  }
  
  // Final results
  console.log(chalk.blue('\n==========================================='));
  console.log(chalk.blue.bold('📋 TEST RESULTS SUMMARY'));
  displayTestResults();
  
  // Provide next steps
  console.log(chalk.blue('\n==========================================='));
  console.log(chalk.cyan('📝 NEXT STEPS:'));
  
  if (checklist.smtpConnection.status !== 'pass') {
    console.log('1. Update EMAIL_PASSWORD in .env with your actual Bluehost password');
    console.log('   Current value is either missing or set to the placeholder');
    console.log('2. Run this test again to verify real email sending');
  } else {
    console.log('1. Check your inbox at', chalk.bold(TEST_EMAIL));
    console.log('2. Verify both emails were received and look correct');
    console.log('3. Check for any formatting issues or broken links in the emails');
  }
  
  console.log('\nIf you want to test the actual contact form in the browser:');
  console.log('1. Start the development server: npm run dev');
  console.log('2. Navigate to the contact form page');
  console.log('3. Fill out and submit the form');
  console.log('4. Check the browser console and your email inbox');
}

// Helper function to display test results
function displayTestResults() {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass': return chalk.green('✅ PASS');
      case 'fail': return chalk.red('❌ FAIL');
      case 'warning': return chalk.yellow('⚠️ WARNING');
      case 'unknown': return chalk.gray('❓ UNKNOWN');
      default: return chalk.gray('⏳ PENDING');
    }
  };
  
  console.log('\n');
  Object.entries(checklist).forEach(([test, result]) => {
    const formattedTest = test
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .padEnd(25, ' ');
    
    console.log(`${getStatusIcon(result.status)} - ${formattedTest}`);
    if (result.details) {
      console.log(`   ${chalk.yellow('Details:')} ${result.details}`);
    }
  });
}

// Run the tests
console.log(chalk.blue.bold('\n🚀 Starting Lead Flow Tests...'));
runTests().catch(error => {
  console.error(chalk.red('\n❌ Test script error:'), error);
  process.exit(1);
});
