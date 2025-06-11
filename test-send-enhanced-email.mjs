#!/usr/bin/env node

/**
 * Test script to send an enhanced email using Firebase Cloud Functions
 * This will send a real email with the new branded templates
 */

import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize Firebase with your config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

// If running locally, connect to the Firebase emulator
// Comment this out if you're testing against production
// connectFunctionsEmulator(functions, "localhost", 5001);

// Import the email templates from the file we created
// Brand colors and styling constants
const BRAND = {
  primaryColor: '#3d5a80',
  secondaryColor: '#98c1d9',
  accentColor: '#ee6c4d',
  textColor: '#293241',
  lightGray: '#e0fbfc',
  darkGray: '#333333',
  lightText: '#ffffff',
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  logoUrl: 'https://res.cloudinary.com/dos0qac90/image/upload/v1649789940/hariel-xavier-logo.png',
  instagramUrl: 'https://instagram.com/harielxavierphotography',
  facebookUrl: 'https://facebook.com/harielxavierphotography',
  websiteUrl: 'https://harielxavier.com'
};

// Common email components
const emailHeader = `
  <tr>
    <td align="center" style="padding: 25px 0; background-color: ${BRAND.lightGray};">
      <img src="${BRAND.logoUrl}" alt="Hariel Xavier Photography" width="220" style="display: block; margin: 0 auto;">
    </td>
  </tr>
  <tr>
    <td style="height: 5px; background: linear-gradient(to right, ${BRAND.primaryColor}, ${BRAND.secondaryColor}, ${BRAND.accentColor});"></td>
  </tr>
`;

const emailFooter = `
  <tr>
    <td style="height: 2px; background-color: ${BRAND.secondaryColor};"></td>
  </tr>
  <tr>
    <td style="background-color: ${BRAND.primaryColor}; padding: 30px 20px; text-align: center;">
      <p style="color: ${BRAND.lightText}; margin-bottom: 15px; font-size: 16px;">Connect with us</p>
      
      <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
        <tr>
          <td style="padding: 0 10px;">
            <a href="${BRAND.instagramUrl}" target="_blank" style="display: inline-block;">
              <img src="https://res.cloudinary.com/dos0qac90/image/upload/v1649789940/icons/instagram-white.png" alt="Instagram" width="32" height="32">
            </a>
          </td>
          <td style="padding: 0 10px;">
            <a href="${BRAND.facebookUrl}" target="_blank" style="display: inline-block;">
              <img src="https://res.cloudinary.com/dos0qac90/image/upload/v1649789940/icons/facebook-white.png" alt="Facebook" width="32" height="32">
            </a>
          </td>
          <td style="padding: 0 10px;">
            <a href="${BRAND.websiteUrl}" target="_blank" style="display: inline-block;">
              <img src="https://res.cloudinary.com/dos0qac90/image/upload/v1649789940/icons/website-white.png" alt="Website" width="32" height="32">
            </a>
          </td>
        </tr>
      </table>
      
      <p style="color: ${BRAND.lightText}; margin-top: 20px; font-size: 14px;">
        © ${new Date().getFullYear()} Hariel Xavier Photography. All rights reserved.
      </p>
    </td>
  </tr>
`;

/**
 * Generate a client thank you email with enhanced branding
 */
const generateClientEmail = (params) => {
  const { name, eventType, eventDate } = params;
  
  // Format the event type for display
  const formattedEventType = eventType === 'other' ? 'Photography Services' : 
    eventType.charAt(0).toUpperCase() + eventType.slice(1) + ' Photography';
  
  // Create a personalized greeting
  const greeting = `Dear ${name.split(' ')[0]},`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You for Your Inquiry | Hariel Xavier Photography</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: ${BRAND.fontFamily}; color: ${BRAND.textColor}; background-color: #f9f9f9;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 650px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
        
        <!-- Header with Logo -->
        ${emailHeader}
        
        <!-- Hero Image -->
        <tr>
          <td>
            <img src="https://res.cloudinary.com/dos0qac90/image/upload/c_fill,g_auto,h_300,w_650/v1649789940/email-header-image.jpg" 
                 alt="Hariel Xavier Photography" width="100%" style="display: block;">
          </td>
        </tr>
        
        <!-- Main Content -->
        <tr>
          <td style="padding: 40px 30px;">
            <h1 style="color: ${BRAND.primaryColor}; font-size: 28px; margin-bottom: 25px; font-weight: 600; text-align: center;">Thank You for Your Inquiry</h1>
            
            <p style="margin-bottom: 20px; line-height: 1.6; font-size: 16px;">${greeting}</p>
            
            <p style="margin-bottom: 20px; line-height: 1.6; font-size: 16px;">
              Thank you for reaching out to Hariel Xavier Photography about your ${formattedEventType.toLowerCase()} needs${eventDate ? ` for ${eventDate}` : ''}. I'm excited about the opportunity to capture your special moments!
            </p>
            
            <div style="background-color: ${BRAND.lightGray}; border-left: 4px solid ${BRAND.accentColor}; padding: 20px; margin: 25px 0;">
              <p style="margin: 0; line-height: 1.6; font-size: 16px;">
                <strong>What happens next:</strong><br>
                I'll be reviewing your details within the next 24-48 hours and will get back to you with more information about how we can work together to create beautiful, lasting memories.
              </p>
            </div>
            
            <p style="margin-bottom: 30px; line-height: 1.6; font-size: 16px;">
              While you wait, I'd love to know: what inspired you to capture these moments with professional photography? Understanding your vision helps me tailor my services to your specific needs.
            </p>
            
            <!-- Portfolio Showcase -->
            <h3 style="color: ${BRAND.primaryColor}; font-size: 20px; margin: 30px 0 15px; font-weight: 600; text-align: center;">From My Portfolio</h3>
            
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td width="32%" style="padding-right: 2%;">
                  <img src="https://res.cloudinary.com/dos0qac90/image/upload/c_fill,g_faces,h_200,w_200/v1649789940/portfolio/sample1.jpg" 
                       alt="Portfolio Image 1" width="100%" style="display: block; border-radius: 4px;">
                </td>
                <td width="32%" style="padding-right: 2%;">
                  <img src="https://res.cloudinary.com/dos0qac90/image/upload/c_fill,g_faces,h_200,w_200/v1649789940/portfolio/sample2.jpg" 
                       alt="Portfolio Image 2" width="100%" style="display: block; border-radius: 4px;">
                </td>
                <td width="32%">
                  <img src="https://res.cloudinary.com/dos0qac90/image/upload/c_fill,g_faces,h_200,w_200/v1649789940/portfolio/sample3.jpg" 
                       alt="Portfolio Image 3" width="100%" style="display: block; border-radius: 4px;">
                </td>
              </tr>
            </table>
            
            <!-- CTA Button -->
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td align="center" style="padding: 35px 0;">
                  <a href="https://harielxavier.com/pricing" target="_blank" 
                     style="background-color: ${BRAND.accentColor}; color: ${BRAND.lightText}; padding: 14px 35px; 
                            text-decoration: none; border-radius: 4px; font-weight: 500; display: inline-block; 
                            font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">
                    View Pricing & Packages
                  </a>
                </td>
              </tr>
            </table>
            
            <p style="line-height: 1.6; font-size: 16px; margin-bottom: 10px;">
              Looking forward to connecting with you soon,
            </p>
            
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 20px;">
              <tr>
                <td width="80" style="vertical-align: top;">
                  <img src="https://res.cloudinary.com/dos0qac90/image/upload/c_fill,g_face,h_80,w_80,r_max/v1649789940/hariel-signature-photo.jpg" 
                       alt="Hariel Xavier" width="70" height="70" style="border-radius: 50%; display: block;">
                </td>
                <td style="vertical-align: middle; padding-left: 15px;">
                  <p style="margin: 0; line-height: 1.4; font-size: 18px; font-weight: 600; color: ${BRAND.primaryColor};">
                    Hariel Xavier
                  </p>
                  <p style="margin: 5px 0 0; line-height: 1.4; font-size: 14px; color: ${BRAND.darkGray};">
                    Photographer & Founder<br>
                    Hariel Xavier Photography
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Footer -->
        ${emailFooter}
        
      </table>
    </body>
    </html>
  `;
};

// Function to send an email using Firebase Cloud Functions
async function sendEmail(to, subject, html) {
  try {
    // Call the Firebase Cloud Function
    const sendEmailFn = httpsCallable(functions, 'sendEmail');
    
    const result = await sendEmailFn({
      to,
      subject,
      html,
      from: 'Hariel Xavier Photography <hello@harielxavier.com>',
      replyTo: 'hello@harielxavier.com'
    });
    
    console.log('Email sent successfully!');
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Sample data for testing
const sampleClientData = {
  name: 'Test User',  // Replace with your test recipient's name
  eventType: 'wedding',
  eventDate: 'June 15, 2025'
};

// Get recipient email from command line arguments or use default
const recipientEmail = process.argv[2] || 'your-test-email@example.com'; // Replace with your email

// Generate the email content
const emailHtml = generateClientEmail(sampleClientData);
const emailSubject = `Thank You for Your Wedding Photography Inquiry | Hariel Xavier Photography`;

// Send the test email
console.log(`Sending enhanced test email to: ${recipientEmail}`);
sendEmail(recipientEmail, emailSubject, emailHtml)
  .then(() => {
    console.log('Enhanced email sent successfully!');
  })
  .catch(error => {
    console.error('Failed to send email:', error);
  });
