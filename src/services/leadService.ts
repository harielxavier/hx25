import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export interface Lead {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  eventType?: string;
  eventDate?: string;
  eventLocation?: string;
  guestCount?: string;
  preferredStyle?: string[];
  mustHaveShots?: string;
  inspirationLinks?: string;
  budget?: string;
  hearAboutUs?: string;
  additionalInfo?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface LeadSubmission {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  eventType?: string;
  eventDate?: string;
  eventLocation?: string;
  guestCount?: string;
  preferredStyle?: string[];
  mustHaveShots?: string;
  inspirationLinks?: string;
  budget?: string;
  hearAboutUs?: string;
  additionalInfo?: string;
  source?: string;
}

/**
 * Create a new lead in Firestore
 * @param leadData The lead data to save
 * @returns Promise with the created lead ID
 */
export const createLead = async (leadData: LeadSubmission): Promise<string> => {
  try {
    const leadsRef = collection(db, 'leads');
    
    const lead: Omit<Lead, 'id'> = {
      ...leadData,
      status: 'new',
      source: leadData.source || 'website_form',
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp
    };
    
    const docRef = await addDoc(leadsRef, lead);
    console.log('Lead created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
};

/**
 * Submit a contact form and create a lead
 * @param formData The form data from the contact form
 * @returns Promise with the created lead ID
 */
export const submitContactForm = async (formData: LeadSubmission): Promise<string> => {
  try {
    // You could add additional processing here if needed
    // For example, sending an email notification, etc.
    
    const leadId = await createLead(formData);
    return leadId;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};

/**
 * Create sample test leads for testing the CRM
 * @returns Promise with success status
 */
export const createTestLeads = async (): Promise<boolean> => {
  try {
    const testLeads = [
      {
        firstName: 'Test',
        lastName: 'A',
        email: 'testa@example.com',
        phone: '555-123-4567',
        eventType: 'wedding',
        eventDate: '2025-06-15',
        eventLocation: 'Sparta, NJ',
        guestCount: '150',
        preferredStyle: ['Traditional', 'Candid'],
        mustHaveShots: 'First look, family portraits, dance floor moments',
        inspirationLinks: 'https://pinterest.com/myboard',
        budget: '3500-5000',
        hearAboutUs: 'instagram',
        additionalInfo: 'Looking forward to our big day!',
        source: 'test_data'
      },
      {
        firstName: 'Test',
        lastName: 'B',
        email: 'testb@example.com',
        phone: '555-987-6543',
        eventType: 'engagement',
        eventDate: '2025-04-30',
        eventLocation: 'Central Park, NY',
        guestCount: '2',
        preferredStyle: ['Artistic', 'Natural/Lifestyle'],
        mustHaveShots: 'Sunset photos, candid moments',
        inspirationLinks: '',
        budget: '2000-3500',
        hearAboutUs: 'google',
        additionalInfo: 'We want a mix of urban and nature settings',
        source: 'test_data'
      },
      {
        firstName: 'Test',
        lastName: 'C',
        email: 'testc@example.com',
        phone: '555-456-7890',
        eventType: 'family',
        eventDate: '2025-05-10',
        eventLocation: 'Client Home',
        guestCount: '5',
        preferredStyle: ['Candid', 'Natural/Lifestyle'],
        mustHaveShots: 'Family group shots, individual portraits of children',
        inspirationLinks: 'https://instagram.com/familyphotos',
        budget: 'under-2000',
        hearAboutUs: 'referral',
        additionalInfo: 'We have a newborn and 2 toddlers',
        source: 'test_data'
      }
    ];
    
    for (const lead of testLeads) {
      await createLead(lead as LeadSubmission);
      console.log(`Created test lead for ${lead.firstName} ${lead.lastName}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error creating test leads:', error);
    return false;
  }
};
