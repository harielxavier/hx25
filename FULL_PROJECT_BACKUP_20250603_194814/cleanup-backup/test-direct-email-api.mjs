// Test script for the updated email API
import { sendEmail } from './src/lib/api/email.js';

// Create a professional-looking email template
const createThankYouEmailTemplate = (name) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
    }
    .header {
      background-color: #000;
      padding: 20px;
      text-align: center;
    }
    .logo {
      max-width: 200px;
    }
    .content {
      padding: 30px;
      background-color: #fff;
    }
    .footer {
      background-color: #f7f7f7;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    h1 {
      color: #333;
      margin-top: 0;
    }
    .button {
      display: inline-block;
      background-color: #000;
      color: #fff;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 4px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://harielxavier.com/logo.svg" alt="Hariel Xavier Photography" class="logo">
    </div>
    <div class="content">
      <h1>Thank You for Contacting Us!</h1>
      <p>Hello ${name},</p>
      <p>Thank you for reaching out to Hariel Xavier Photography. We've received your inquiry and appreciate your interest in our services.</p>
      <p>Our team will review your message and get back to you within 24-48 hours to discuss how we can best capture your special moments.</p>
      <p>In the meantime, feel free to explore our portfolio to see more of our work.</p>
      <a href="https://harielxavier.com/portfolio" class="button">View Portfolio</a>
      <p>Best regards,<br>Hariel Xavier<br>Hariel Xavier Photography</p>
    </div>
    <div class="footer">
      <p>© 2025 Hariel Xavier Photography. All rights reserved.</p>
      <p>123 Photography Lane, Miami, FL 33101</p>
    </div>
  </div>
</body>
</html>
`;

// Test function to send email
async function testEmailAPI() {
  try {
    console.log('Testing updated email API...');
    
    const success = await sendEmail({
      to: 'missiongeek@gmail.com', // Replace with your email
      subject: 'Thank You for Contacting Hariel Xavier Photography',
      html: createThankYouEmailTemplate('Test User'),
      from: 'Hariel Xavier Photography <forms@harielxavier.com>',
      replyTo: 'hi@harielxavier.com'
    });
    
    if (success) {
      console.log('✅ Email API test completed successfully!');
      return true;
    } else {
      console.log('❌ Email API test failed.');
      return false;
    }
  } catch (error) {
    console.error('Error testing email API:', error);
    return false;
  }
}

// Run the test
testEmailAPI()
  .then(result => {
    console.log(`Test completed with result: ${result ? 'SUCCESS' : 'FAILURE'}`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
