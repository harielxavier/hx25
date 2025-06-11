// Direct email test using Nodemailer
import nodemailer from 'nodemailer';

// Create a test SMTP transporter
const transporter = nodemailer.createTransport({
  host: 'mail.harielxavier.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'forms@harielxavier.com',
    pass: 'Vamos!!86'
  }
});

// Create a professional email template
const createEmailTemplate = (name) => `
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

// Send a test email
async function sendTestEmail() {
  try {
    console.log('Sending direct test email...');
    
    // Define email options
    const mailOptions = {
      from: 'Hariel Xavier Photography <forms@harielxavier.com>',
      to: 'missiongeek@gmail.com', // Replace with your email
      subject: 'Test Email - Direct Nodemailer',
      html: createEmailTemplate('Test User'),
      replyTo: 'hi@harielxavier.com'
    };
    
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

// Run the test
sendTestEmail()
  .then(success => {
    if (success) {
      console.log('✅ Direct email test completed successfully!');
    } else {
      console.log('❌ Direct email test failed.');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Error during test:', err);
    process.exit(1);
  });
