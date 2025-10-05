import { supabase } from '../../lib/supabase';

export interface Lead {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  event_type?: string;
  event_date?: string;
  message?: string;
  source?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const leadService = {
  // Get all leads
  async getAllLeads(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get lead by ID
  async getLeadById(id: string): Promise<Lead | null> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  // Create lead
  async createLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .insert([{
        ...lead,
        status: lead.status || 'new',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update lead
  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete lead
  async deleteLead(id: string): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Get leads by status
  async getLeadsByStatus(status: string): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false});
    
    if (error) throw error;
    return data || [];
  },
};

export default leadService;
