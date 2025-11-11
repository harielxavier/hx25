import { supabase } from '../lib/supabase';
import { z } from 'zod';

// Zod schema for Lead Submission
const leadSubmissionSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().optional(),
  eventType: z.string().optional(),
  eventDate: z.string().optional(), // Could be further validated with z.date() or a regex
  eventLocation: z.string().optional(),
  guestCount: z.string().optional(), // Could be z.number() if parsed
  preferredStyle: z.array(z.string()).optional(),
  mustHaveShots: z.string().optional(),
  inspirationLinks: z.string().url({ message: "Invalid URL for inspiration links" }).optional().or(z.literal('')), // Allow empty string or valid URL
  budget: z.string().optional(),
  hearAboutUs: z.string().optional(),
  additionalInfo: z.string().optional(),
  source: z.string().optional(),
});

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
  createdAt: string; // Changed from Timestamp to ISO string
  updatedAt: string; // Changed from Timestamp to ISO string
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
 * Create a new lead in Supabase
 * @param leadData The lead data to save
 * @returns Promise with the created lead ID
 */
export const createLead = async (leadData: LeadSubmission): Promise<string> => {
  try {
    // Validate leadData against the schema
    const validatedData = leadSubmissionSchema.parse(leadData);

    const now = new Date().toISOString();

    // Transform to database schema
    const dbData = {
      name: `${validatedData.firstName} ${validatedData.lastName}`,
      email: validatedData.email,
      phone: validatedData.phone || null,
      event_type: validatedData.eventType || null,
      event_date: validatedData.eventDate || null,
      message: validatedData.additionalInfo || null,
      source: validatedData.source || 'website_form',
      status: 'new' as const,
      created_at: now,
      updated_at: now,
      // Store additional fields in metadata JSONB column if exists, or add them directly
      event_location: validatedData.eventLocation || null,
      guest_count: validatedData.guestCount || null,
      preferred_style: validatedData.preferredStyle || null,
      must_have_shots: validatedData.mustHaveShots || null,
      inspiration_links: validatedData.inspirationLinks || null,
      budget: validatedData.budget || null,
      hear_about_us: validatedData.hearAboutUs || null
    };

    const { data, error } = await supabase
      .from('leads')
      .insert([dbData])
      .select('id')
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from insert');

    console.log('Lead created with ID:', data.id);
    return data.id;
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Log Zod validation errors or rethrow as a custom error
      console.error('Lead data validation error:', error.errors);
      throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
    }
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
 * Get all leads
 * @returns Promise with all leads
 */
export const getAllLeads = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
};

/**
 * Get leads by status
 * @param status The lead status to filter by
 * @returns Promise with filtered leads
 */
export const getLeadsByStatus = async (status: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching leads by status:', error);
    throw error;
  }
};

/**
 * Update lead status
 * @param leadId The lead ID
 * @param status The new status
 * @returns Promise with success status
 */
export const updateLeadStatus = async (leadId: string, status: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('leads')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', leadId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating lead status:', error);
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
