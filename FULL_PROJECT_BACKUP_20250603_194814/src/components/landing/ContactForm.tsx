import React, { useState } from 'react';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const emailService = await import('../../lib/api/email');
      const emailData = {
        to: 'info@harielxavier.com', // This will be overridden on the server side for contact form submissions
        subject: 'Contact Form Submission',
        html: `
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Message:</strong> ${formData.message}</p>
        `,
      };
      const success = await emailService.sendEmail(emailData);
      if (success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        alert('There was an error sending your message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error sending your message. Please try again.');
    }
  };

  return (
    <div id="contact-form">
      <h2>Contact Us</h2>
      {submitted ? (
        <p>Thank you for your message! We'll get back to you soon.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Send</button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
