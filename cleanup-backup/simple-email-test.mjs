// Simple email test with minimal dependencies
import nodemailer from 'nodemailer';

// Create a test SMTP transporter with your credentials
const transporter = nodemailer.createTransport({
  host: 'mail.harielxavier.com',
  port: 465,
  secure: true,
  auth: {
    user: 'forms@harielxavier.com',
    pass: 'Vamos!!86'
  }
});

// Simple HTML email
const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Test Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    <div style="background-color: #000; padding: 20px; text-align: center;">
      <img src="https://harielxavier.com/logo.svg" alt="Hariel Xavier Photography" width="200">
    </div>
    <div style="padding: 20px; background-color: #fff;">
      <h1 style="color: #000;">This is a test email</h1>
      <p>If you can see this email with proper formatting and the logo above, the email system is working correctly.</p>
      <p>Time sent: ${new Date().toLocaleString()}</p>
    </div>
  </div>
</body>
</html>
`;

// Send the test email
async function sendTestEmail() {
  try {
    console.log('Sending test email...');
    
    const info = await transporter.sendMail({
      from: 'Hariel Xavier Photography <forms@harielxavier.com>',
      to: 'missiongeek@gmail.com', // Change this to your email
      subject: 'Simple Test Email',
      html: html
    });
    
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

// Run the test
sendTestEmail()
  .then(success => {
    console.log(success ? '✅ Test completed successfully!' : '❌ Test failed');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error during test:', err);
    process.exit(1);
  });
