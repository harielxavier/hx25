import { supabase } from '../../lib/supabase';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  published_at: string | null;
  featured: boolean;
  author: string;
  views: number;
  seo_title?: string;
  seo_description?: string;
}

export const blogService = {
  // Get all blog posts
  async getAllPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get published posts only
  async getPublishedPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get post by slug
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    
    // Increment view count
    if (data) {
      await supabase
        .from('posts')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', data.id);
    }
    
    return data;
  },

  // Get post by ID
  async getPostById(id: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  // Create new post
  async createPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('posts')
      .insert([{
        ...post,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update post
  async updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('posts')
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

  // Delete post
  async deletePost(id: string): Promise<void> {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Get featured posts
  async getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
    const { data, error} = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .eq('featured', true)
      .order('published_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  },

  // Get posts by category
  async getPostsByCategory(category: string): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('category', category)
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Search posts
  async searchPosts(searchTerm: string): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`)
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
};

export default blogService;
