import { supabase } from '../../lib/supabase';

export interface Gallery {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  cover_image?: string;
  images: any[];
  category?: string;
  date?: string;
  location?: string;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export const galleryService = {
  // Get all galleries
  async getAllGalleries(): Promise<Gallery[]> {
    const { data, error } = await supabase
      .from('galleries')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get published galleries
  async getPublishedGalleries(): Promise<Gallery[]> {
    const { data, error } = await supabase
      .from('galleries')
      .select('*')
      .eq('published', true)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get gallery by ID
  async getGalleryById(id: string): Promise<Gallery | null> {
    const { data, error } = await supabase
      .from('galleries')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  // Get gallery by slug
  async getGalleryBySlug(slug: string): Promise<Gallery | null> {
    const { data, error } = await supabase
      .from('galleries')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  // Create gallery
  async createGallery(gallery: Omit<Gallery, 'id' | 'created_at' | 'updated_at'>): Promise<Gallery> {
    const { data, error } = await supabase
      .from('galleries')
      .insert([{
        ...gallery,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update gallery
  async updateGallery(id: string, updates: Partial<Gallery>): Promise<Gallery> {
    const { data, error } = await supabase
      .from('galleries')
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

  // Delete gallery
  async deleteGallery(id: string): Promise<void> {
    const { error } = await supabase
      .from('galleries')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Get featured galleries
  async getFeaturedGalleries(limit: number = 6): Promise<Gallery[]> {
    const { data, error } = await supabase
      .from('galleries')
      .select('*')
      .eq('published', true)
      .eq('featured', true)
      .order('date', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  },

  // Get galleries by category
  async getGalleriesByCategory(category: string): Promise<Gallery[]> {
    const { data, error } = await supabase
      .from('galleries')
      .select('*')
      .eq('category', category)
      .eq('published', true)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
};

export default galleryService;
