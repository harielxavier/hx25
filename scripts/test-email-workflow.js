/**
 * Email Workflow Test Script
 * 
 * This script tests the email workflow for lead submissions using direct API calls:
 * 1. Tests sending email notifications to both client and admin with the updated lead structure
 * 2. Verifies the emails are sent correctly
 * 
 * Note: This script doesn't actually create leads in Firestore to avoid cluttering the database
 */

import dotenv from 'dotenv';
import { SMTPClient } from '@emailjs/nodejs';

// Load environment variables
dotenv.config();

// EmailJS configuration - use environment variables or fallback to defaults
// Note: In production, always use environment variables and never hardcode credentials
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_7uy4gxp';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_jnz9d7c';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'Ug_QVnpJhpeDYZBtR';

// Create EmailJS SMTP client
const client = new SMTPClient({
  user: 'forms@harielxavier.com',
  password: process.env.EMAIL_PASSWORD || 'your_password_here', // Use environment variable in production
  host: 'box5804.bluehost.com',
  ssl: true
});

// Log the EmailJS configuration
console.log('EmailJS Configuration:');
console.log('Service ID:', EMAILJS_SERVICE_ID);
console.log('Template ID:', EMAILJS_TEMPLATE_ID);
console.log('Public Key:', EMAILJS_PUBLIC_KEY);

// Test lead data with the updated structure
const testLead = {
  firstName: 'Test',
  lastName: 'Client',
  email: 'test@example.com', // Use a real email for actual testing
  phone: '(555) 123-4567',
  eventType: 'wedding',
  eventDate: '2025-06-15',
  eventLocation: 'New York City, NY',
  guestCount: '150',
  preferredStyle: ['Traditional', 'Candid'],
  mustHaveShots: 'First look, family portraits',
  budget: '3000-5000',
  hearAboutUs: 'google',
  additionalInfo: 'This is a test lead submission to verify the email workflow.',
  source: 'test_script'
};

/**
 * Send an admin notification email using EmailJS
 */
async function sendAdminNotification(leadData) {
  console.log('🔍 Sending admin notification email...');
  
  try {
    // Format the lead data for the email template
    const templateParams = {
      to_email: 'missiongeek@gmail.com', // Admin email
      subject: `New Lead: ${leadData.firstName} ${leadData.lastName} - Wedding Inquiry`,
      from_name: 'Hariel Xavier Photography',
      lead_name: `${leadData.firstName} ${leadData.lastName}`,
      lead_email: leadData.email,
      lead_phone: leadData.phone,
      event_type: leadData.eventType,
      event_date: leadData.eventDate,
      event_location: leadData.eventLocation,
      preferred_style: Array.isArray(leadData.preferredStyle) ? leadData.preferredStyle.join(', ') : leadData.preferredStyle,
      must_have_shots: leadData.mustHaveShots,
      additional_info: leadData.additionalInfo,
      source: leadData.hearAboutUs
    };
    
    // Send the email using SMTP client
    const result = await client.send({
      from: 'Hariel Xavier Photography <forms@harielxavier.com>',
      to: templateParams.to_email,
      subject: templateParams.subject,
      text: `New lead from ${templateParams.lead_name}. Email: ${templateParams.lead_email}, Phone: ${templateParams.lead_phone}`,
      html: `
        <h2>New Lead Submission</h2>
        <p><strong>Name:</strong> ${templateParams.lead_name}</p>
        <p><strong>Email:</strong> ${templateParams.lead_email}</p>
        <p><strong>Phone:</strong> ${templateParams.lead_phone}</p>
        <p><strong>Event Type:</strong> ${templateParams.event_type}</p>
        <p><strong>Event Date:</strong> ${templateParams.event_date}</p>
        <p><strong>Location:</strong> ${templateParams.event_location}</p>
        <p><strong>Photography Style:</strong> ${templateParams.preferred_style}</p>
        <p><strong>Must-Have Shots:</strong> ${templateParams.must_have_shots}</p>
        <p><strong>Additional Info:</strong> ${templateParams.additional_info}</p>
        <p><strong>Source:</strong> ${templateParams.source}</p>
      `
    });
    
    console.log('✅ Admin notification sent successfully:', result.status, result.text);
    return true;
  } catch (error) {
    console.error('❌ Error sending admin notification:', error);
    return false;
  }
}

/**
 * Send a client autoresponse email using EmailJS
 */
async function sendClientAutoResponse(leadData) {
  console.log('🔍 Sending client autoresponse email...');
  
  try {
    // Format the lead data for the email template
    const templateParams = {
      to_email: leadData.email,
      subject: `Thank You for Your Inquiry - Hariel Xavier Photography`,
      from_name: 'Hariel Xavier Photography',
      first_name: leadData.firstName,
      event_type: leadData.eventType
    };
    
    // Send the email using SMTP client
    const result = await client.send({
      from: 'Hariel Xavier Photography <forms@harielxavier.com>',
      to: templateParams.to_email,
      subject: templateParams.subject,
      text: `Thank you for your inquiry, ${templateParams.first_name}. We'll be in touch soon!`,
      html: `
        <h2>Thank You for Your Inquiry</h2>
        <p>Dear ${templateParams.first_name},</p>
        <p>Thank you for reaching out to Hariel Xavier Photography. We've received your ${templateParams.event_type} photography inquiry.</p>
        <p>We'll review your information and get back to you within 24-48 hours.</p>
        <p>Best regards,<br>Hariel Xavier Photography Team</p>
      `
    });
    
    console.log('✅ Client autoresponse sent successfully:', result.status, result.text);
    return true;
  } catch (error) {
    console.error('❌ Error sending client autoresponse:', error);
    return false;
  }
}

/**
 * Test sending email notifications
 */
async function testEmailNotifications() {
  console.log('🔍 Testing email notifications...');
  
  try {
    // Test admin notification
    console.log('Sending admin notification...');
    const adminSuccess = await sendAdminNotification(testLead);
    
    // Test client autoresponse
    console.log('Sending client autoresponse...');
    const clientSuccess = await sendClientAutoResponse(testLead);
    
    if (adminSuccess && clientSuccess) {
      console.log('✅ All email notifications sent successfully');
      return true;
    } else {
      console.log('⚠️ Some email notifications failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending email notifications:', error);
    return false;
  }
}

/**
 * Run the email notification test
 */
async function runEmailTest() {
  console.log('🚀 Starting email notification test...');
  console.log('==============================');
  console.log('Test lead data:', JSON.stringify(testLead, null, 2));
  console.log('==============================');
  
  try {
    // Test email notifications
    const emailsSent = await testEmailNotifications();
    
    // Summary
    console.log('\n==============================');
    console.log('📋 Email Test Summary:');
    console.log('------------------------------');
    console.log(`Email Notifications: ${emailsSent ? '✅ Success' : '❌ Failed'}`);
    console.log('==============================');
    
    if (emailsSent) {
      console.log('🎉 Email test passed!');
      console.log('The email workflow is working correctly with the updated lead structure.');
    } else {
      console.log('⚠️ Email test failed.');
      console.log('Please check the EmailJS configuration and templates.');
    }
  } catch (error) {
    console.error('❌ Email test failed with error:', error);
  }
}

// Run the test
runEmailTest();
