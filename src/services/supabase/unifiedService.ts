/**
 * Unified Supabase Service
 * Consolidates all database operations through Supabase
 * Replaces Firebase functionality
 */

import { supabase } from '../../lib/supabase';
import { User } from '@supabase/supabase-js';

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

export interface Gallery {
  id: string;
  title: string;
  description?: string;
  cover_image?: string;
  category?: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  order_index: number;
  tags?: string[];
  metadata?: any;
  seo_data?: any;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  gallery_id: string;
  url: string;
  cloudinary_id?: string;
  title?: string;
  description?: string;
  alt_text?: string;
  width?: number;
  height?: number;
  file_size?: number;
  order_index: number;
  metadata?: any;
  created_at: string;
}

export interface Client {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  wedding_date?: string;
  venue?: string;
  package_type?: string;
  package_price?: number;
  payment_status: 'pending' | 'partial' | 'paid' | 'overdue';
  total_paid: number;
  notes?: string;
  tags?: string[];
  status: 'lead' | 'booked' | 'active' | 'completed' | 'archived';
  source?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  client_id: string;
  event_date: string;
  event_time?: string;
  event_type: string;
  venue?: string;
  venue_address?: string;
  package_id?: string;
  package_details?: any;
  duration_hours?: number;
  photographer_assigned?: string;
  second_photographer?: string;
  status: 'tentative' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  timeline?: any[];
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  client_id: string;
  booking_id?: string;
  amount: number;
  payment_type?: 'deposit' | 'partial' | 'final' | 'additional';
  payment_method?: string;
  stripe_payment_id?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  notes?: string;
  receipt_url?: string;
  metadata?: any;
  paid_at?: string;
  created_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  event_date?: string;
  event_type?: string;
  venue?: string;
  budget_range?: string;
  message?: string;
  source?: string;
  source_details?: any;
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'won' | 'lost';
  assigned_to?: string;
  tags?: string[];
  score?: number;
  metadata?: any;
  contacted_at?: string;
  qualified_at?: string;
  converted_at?: string;
  created_at: string;
  updated_at: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// AUTHENTICATION SERVICE
// ═══════════════════════════════════════════════════════════════════════════

export const authService = {
  // Sign up new user
  async signUp(email: string, password: string, metadata?: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { data, error };
  },

  // Sign in existing user
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Get session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  // Reset password
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { data, error };
  },

  // Update user metadata
  async updateUser(updates: any) {
    const { data, error } = await supabase.auth.updateUser(updates);
    return { data, error };
  },

  // Check if user is admin
  async isAdmin(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    return data?.role === 'admin';
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// GALLERY SERVICE
// ═══════════════════════════════════════════════════════════════════════════

export const galleryService = {
  // Get all galleries
  async getGalleries(options?: {
    status?: string;
    featured?: boolean;
    category?: string;
    limit?: number;
  }) {
    let query = supabase.from('galleries').select('*');

    if (options?.status) query = query.eq('status', options.status);
    if (options?.featured !== undefined) query = query.eq('featured', options.featured);
    if (options?.category) query = query.eq('category', options.category);
    if (options?.limit) query = query.limit(options.limit);

    query = query.order('order_index', { ascending: true });

    const { data, error } = await query;
    return { data, error };
  },

  // Get single gallery
  async getGallery(id: string) {
    const { data, error } = await supabase
      .from('galleries')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  },

  // Get gallery images
  async getGalleryImages(galleryId: string) {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('gallery_id', galleryId)
      .order('order_index', { ascending: true });

    return { data, error };
  },

  // Create gallery
  async createGallery(gallery: Omit<Gallery, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('galleries')
      .insert(gallery)
      .select()
      .single();

    return { data, error };
  },

  // Update gallery
  async updateGallery(id: string, updates: Partial<Gallery>) {
    const { data, error } = await supabase
      .from('galleries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  // Delete gallery
  async deleteGallery(id: string) {
    const { error } = await supabase
      .from('galleries')
      .delete()
      .eq('id', id);

    return { error };
  },

  // Add images to gallery
  async addGalleryImages(images: Omit<GalleryImage, 'id' | 'created_at'>[]) {
    const { data, error } = await supabase
      .from('gallery_images')
      .insert(images)
      .select();

    return { data, error };
  },

  // Delete gallery image
  async deleteGalleryImage(id: string) {
    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id);

    return { error };
  },

  // Reorder gallery images
  async reorderGalleryImages(updates: { id: string; order_index: number }[]) {
    const promises = updates.map(({ id, order_index }) =>
      supabase
        .from('gallery_images')
        .update({ order_index })
        .eq('id', id)
    );

    const results = await Promise.all(promises);
    return results;
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// CLIENT SERVICE
// ═══════════════════════════════════════════════════════════════════════════

export const clientService = {
  // Get all clients
  async getClients(options?: { status?: string; limit?: number }) {
    let query = supabase.from('clients').select('*');

    if (options?.status) query = query.eq('status', options.status);
    if (options?.limit) query = query.limit(options.limit);

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    return { data, error };
  },

  // Get single client
  async getClient(id: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  },

  // Create client
  async createClient(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single();

    return { data, error };
  },

  // Update client
  async updateClient(id: string, updates: Partial<Client>) {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  // Delete client
  async deleteClient(id: string) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    return { error };
  },

  // Get client bookings
  async getClientBookings(clientId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('client_id', clientId)
      .order('event_date', { ascending: true });

    return { data, error };
  },

  // Get client payments
  async getClientPayments(clientId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    return { data, error };
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// BOOKING SERVICE
// ═══════════════════════════════════════════════════════════════════════════

export const bookingService = {
  // Get all bookings
  async getBookings(options?: {
    status?: string;
    date_from?: string;
    date_to?: string;
    photographer_id?: string;
  }) {
    let query = supabase.from('bookings').select('*');

    if (options?.status) query = query.eq('status', options.status);
    if (options?.date_from) query = query.gte('event_date', options.date_from);
    if (options?.date_to) query = query.lte('event_date', options.date_to);
    if (options?.photographer_id) {
      query = query.or(`photographer_assigned.eq.${options.photographer_id},second_photographer.eq.${options.photographer_id}`);
    }

    query = query.order('event_date', { ascending: true });

    const { data, error } = await query;
    return { data, error };
  },

  // Get single booking
  async getBooking(id: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, clients(*)')
      .eq('id', id)
      .single();

    return { data, error };
  },

  // Create booking
  async createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single();

    return { data, error };
  },

  // Update booking
  async updateBooking(id: string, updates: Partial<Booking>) {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  // Delete booking
  async deleteBooking(id: string) {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    return { error };
  },

  // Check availability
  async checkAvailability(date: string, photographer_id?: string) {
    let query = supabase
      .from('bookings')
      .select('*')
      .eq('event_date', date)
      .neq('status', 'cancelled');

    if (photographer_id) {
      query = query.or(`photographer_assigned.eq.${photographer_id},second_photographer.eq.${photographer_id}`);
    }

    const { data, error } = await query;
    return { available: !error && data?.length === 0, bookings: data, error };
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// PAYMENT SERVICE
// ═══════════════════════════════════════════════════════════════════════════

export const paymentService = {
  // Get all payments
  async getPayments(options?: {
    status?: string;
    client_id?: string;
    date_from?: string;
    date_to?: string;
  }) {
    let query = supabase.from('payments').select('*');

    if (options?.status) query = query.eq('status', options.status);
    if (options?.client_id) query = query.eq('client_id', options.client_id);
    if (options?.date_from) query = query.gte('created_at', options.date_from);
    if (options?.date_to) query = query.lte('created_at', options.date_to);

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    return { data, error };
  },

  // Create payment
  async createPayment(payment: Omit<Payment, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('payments')
      .insert(payment)
      .select()
      .single();

    // Update client payment status and total paid
    if (data && payment.status === 'completed') {
      await clientService.updateClient(payment.client_id, {
        total_paid: data.amount // This should add to existing, not replace
      });
    }

    return { data, error };
  },

  // Update payment
  async updatePayment(id: string, updates: Partial<Payment>) {
    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  // Get payment statistics
  async getPaymentStats(date_from?: string, date_to?: string) {
    let query = supabase
      .from('payments')
      .select('amount, status')
      .eq('status', 'completed');

    if (date_from) query = query.gte('created_at', date_from);
    if (date_to) query = query.lte('created_at', date_to);

    const { data, error } = await query;

    if (error) return { error };

    const total = data?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
    const count = data?.length || 0;
    const average = count > 0 ? total / count : 0;

    return { total, count, average, error: null };
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// LEAD SERVICE
// ═══════════════════════════════════════════════════════════════════════════

export const leadService = {
  // Get all leads
  async getLeads(options?: {
    status?: string;
    assigned_to?: string;
    limit?: number;
  }) {
    let query = supabase.from('leads').select('*');

    if (options?.status) query = query.eq('status', options.status);
    if (options?.assigned_to) query = query.eq('assigned_to', options.assigned_to);
    if (options?.limit) query = query.limit(options.limit);

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    return { data, error };
  },

  // Get single lead
  async getLead(id: string) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  },

  // Create lead
  async createLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('leads')
      .insert(lead)
      .select()
      .single();

    return { data, error };
  },

  // Update lead
  async updateLead(id: string, updates: Partial<Lead>) {
    // Track status changes for timestamps
    if (updates.status === 'contacted' && !updates.contacted_at) {
      updates.contacted_at = new Date().toISOString();
    }
    if (updates.status === 'qualified' && !updates.qualified_at) {
      updates.qualified_at = new Date().toISOString();
    }
    if (updates.status === 'won' && !updates.converted_at) {
      updates.converted_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  // Convert lead to client
  async convertToClient(leadId: string) {
    // Get lead data
    const { data: lead, error: leadError } = await this.getLead(leadId);
    if (leadError || !lead) return { error: leadError || 'Lead not found' };

    // Create client from lead
    const { data: client, error: clientError } = await clientService.createClient({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      wedding_date: lead.event_date,
      venue: lead.venue,
      status: 'booked',
      source: lead.source,
      metadata: { converted_from_lead: leadId }
    });

    if (clientError) return { error: clientError };

    // Update lead status
    await this.updateLead(leadId, {
      status: 'won',
      metadata: { ...lead.metadata, converted_to_client: client.id }
    });

    return { data: client, error: null };
  },

  // Get lead statistics
  async getLeadStats(date_from?: string, date_to?: string) {
    let query = supabase.from('leads').select('status');

    if (date_from) query = query.gte('created_at', date_from);
    if (date_to) query = query.lte('created_at', date_to);

    const { data, error } = await query;

    if (error) return { error };

    const stats = {
      total: data?.length || 0,
      new: data?.filter(l => l.status === 'new').length || 0,
      contacted: data?.filter(l => l.status === 'contacted').length || 0,
      qualified: data?.filter(l => l.status === 'qualified').length || 0,
      won: data?.filter(l => l.status === 'won').length || 0,
      lost: data?.filter(l => l.status === 'lost').length || 0,
    };

    stats.conversion_rate = stats.total > 0 ? (stats.won / stats.total) * 100 : 0;

    return { ...stats, error: null };
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// STORAGE SERVICE
// ═══════════════════════════════════════════════════════════════════════════

export const storageService = {
  // Upload file to storage
  async uploadFile(bucket: string, path: string, file: File) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) return { url: null, error };

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { url: publicUrl, error: null };
  },

  // Delete file from storage
  async deleteFile(bucket: string, path: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    return { error };
  },

  // Get file URL
  getFileUrl(bucket: string, path: string) {
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return publicUrl;
  },

  // List files in a folder
  async listFiles(bucket: string, folder: string) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder, {
        limit: 100,
        offset: 0,
      });

    return { data, error };
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// REAL-TIME SUBSCRIPTIONS
// ═══════════════════════════════════════════════════════════════════════════

export const realtimeService = {
  // Subscribe to gallery changes
  subscribeToGalleries(callback: (payload: any) => void) {
    return supabase
      .channel('galleries')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'galleries' }, callback)
      .subscribe();
  },

  // Subscribe to booking changes
  subscribeToBookings(callback: (payload: any) => void) {
    return supabase
      .channel('bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, callback)
      .subscribe();
  },

  // Subscribe to payment changes
  subscribeToPayments(callback: (payload: any) => void) {
    return supabase
      .channel('payments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, callback)
      .subscribe();
  },

  // Subscribe to lead changes
  subscribeToLeads(callback: (payload: any) => void) {
    return supabase
      .channel('leads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, callback)
      .subscribe();
  },

  // Unsubscribe from channel
  unsubscribe(channel: any) {
    return supabase.removeChannel(channel);
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT ALL SERVICES
// ═══════════════════════════════════════════════════════════════════════════

export default {
  auth: authService,
  galleries: galleryService,
  clients: clientService,
  bookings: bookingService,
  payments: paymentService,
  leads: leadService,
  storage: storageService,
  realtime: realtimeService
};