/**
 * EmailJS Service - Direct email sending without backend
 * Uses EmailJS to send emails directly from the browser
 */

import emailjs from '@emailjs/browser';

// EmailJS Configuration
// Sign up at https://www.emailjs.com/ and get your keys
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_default';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_default';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

// Initialize EmailJS
if (EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  eventDate?: string;
  eventLocation?: string;
  jobType?: string;
  budget?: string;
  message: string;
  partnerName?: string;
  weddingStyle?: string;
  hearAboutUs?: string;
}

/**
 * Send contact form email via EmailJS
 */
export const sendContactEmail = async (formData: ContactFormData): Promise<boolean> => {
  try {
    // If EmailJS is not configured, save to Firestore only
    if (!EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY === '') {
      console.warn('EmailJS not configured. Saving to Firestore only.');
      await saveToFirestore(formData);
      return true;
    }

    // Prepare template parameters for EmailJS
    const templateParams = {
      to_name: 'Hariel Xavier Photography',
      from_name: `${formData.firstName} ${formData.lastName}`,
      from_email: formData.email,
      phone: formData.phone,
      event_date: formData.eventDate || 'Not specified',
      event_location: formData.eventLocation || 'Not specified',
      job_type: formData.jobType || 'General Inquiry',
      budget: formData.budget || 'Not specified',
      message: formData.message,
      partner_name: formData.partnerName || '',
      wedding_style: formData.weddingStyle || '',
      hear_about_us: formData.hearAboutUs || '',
      reply_to: formData.email
    };

    // Send email via EmailJS
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('Email sent successfully via EmailJS:', response);

    // Also save to Firestore
    await saveToFirestore(formData);

    return true;
  } catch (error) {
    console.error('Error sending email via EmailJS:', error);
    
    // Even if email fails, try to save to Firestore
    try {
      await saveToFirestore(formData);
      console.log('Saved to Firestore despite email failure');
      return true; // Consider it success if we at least saved the lead
    } catch (firestoreError) {
      console.error('Failed to save to Firestore:', firestoreError);
      return false;
    }
  }
};

/**
 * Save contact form data to Firestore
 */
async function saveToFirestore(formData: ContactFormData): Promise<void> {
  try {
    const { db } = await import('../firebase/config');
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');

    const leadData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      eventDate: formData.eventDate || '',
      eventLocation: formData.eventLocation || '',
      jobType: formData.jobType || 'General Inquiry',
      budget: formData.budget || '',
      message: formData.message,
      partnerName: formData.partnerName || '',
      weddingStyle: formData.weddingStyle || '',
      hearAboutUs: formData.hearAboutUs || '',
      source: 'Website Contact Form',
      status: 'new',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db!, 'leads'), leadData);
    console.log('Lead saved to Firestore with ID:', docRef.id);
  } catch (error) {
    console.error('Error saving to Firestore:', error);
    throw error;
  }
}

/**
 * Send booking confirmation email
 */
export const sendBookingEmail = async (bookingData: any): Promise<boolean> => {
  try {
    if (!EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY === '') {
      console.warn('EmailJS not configured for booking emails.');
      return true; // Still consider success since booking is saved to Firestore
    }

    const templateParams = {
      to_name: `${bookingData.firstName} ${bookingData.lastName}`,
      to_email: bookingData.email,
      service_name: bookingData.serviceName,
      booking_date: bookingData.date,
      booking_time: bookingData.startTime,
      location: bookingData.location || 'To be determined',
      total_amount: bookingData.totalAmount,
      deposit_amount: bookingData.depositAmount
    };

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      'template_booking', // Use a specific booking confirmation template
      templateParams
    );

    console.log('Booking confirmation email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending booking email:', error);
    return false; // Don't fail the booking if email fails
  }
};

export default {
  sendContactEmail,
  sendBookingEmail
};
