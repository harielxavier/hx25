import { supabase } from '../lib/supabase';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  featuredImage?: string; // Compatibility alias
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  published_at: string | null;
  featured: boolean;
  author: {
    name: string;
    avatar: string;
    bio?: string;
  };
  views: number;
  read_time?: string;
  video_embed?: string;
  share_enabled?: boolean;
  comments_enabled?: boolean;
}

// Helper to convert DB format to component format
export const normalizeBlogPost = (post: any): BlogPost => {
  return {
    ...post,
    featuredImage: post.featured_image || post.featuredImage || '',
    featured_image: post.featured_image || post.featuredImage || ''
  };
};

// Get all blog posts (published only by default)
export const getAllPosts = async (includeUnpublished = false): Promise<BlogPost[]> => {
  try {
    console.log('📚 Fetching blog posts from Supabase...');
    
    let query = supabase
      .from('posts')
      .select('*')
      .order('published_at', { ascending: false });
    
    if (!includeUnpublished) {
      query = query.eq('status', 'published');
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching blog posts from Supabase:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      console.log('No blog posts found in Supabase');
      return [];
    }
    
    console.log(`✅ Found ${data.length} blog posts from Supabase`);
    return data.map(normalizeBlogPost);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};

// Get a single blog post by slug
export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    console.log(`🔍 Fetching post with slug: ${slug}`);
    
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error(`Error fetching post with slug ${slug}:`, error);
      return null;
    }
    
    console.log(`✅ Found post: ${data?.title}`);
    return data ? normalizeBlogPost(data) : null;
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return null;
  }
};

// Get a single blog post by ID
export const getPostById = async (id: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching post with ID ${id}:`, error);
      return null;
    }
    
    return data ? normalizeBlogPost(data) : null;
  } catch (error) {
    console.error(`Error fetching post with ID ${id}:`, error);
    return null;
  }
};

// Get featured blog posts
export const getFeaturedPosts = async (limitCount = 3): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .eq('featured', true)
      .order('published_at', { ascending: false })
      .limit(limitCount);
    
    if (error) {
      console.error('Error fetching featured posts:', error);
      return [];
    }
    
    return data as BlogPost[] || [];
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return [];
  }
};

// Get blog posts by category
export const getPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .eq('category', category)
      .order('published_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching posts by category ${category}:`, error);
      return [];
    }
    
    return data as BlogPost[] || [];
  } catch (error) {
    console.error(`Error fetching posts by category ${category}:`, error);
    return [];
  }
};

// Increment post views
export const incrementPostViews = async (id: string): Promise<boolean> => {
  try {
    // Try using the RPC function first
    const { error: rpcError } = await supabase.rpc('increment_post_views', { post_id: id });

    if (rpcError) {
      console.warn(`RPC increment_post_views failed for post ${id}, trying direct update:`, rpcError);

      // Fallback to direct update if RPC fails
      const { error: updateError } = await supabase
        .from('posts')
        .update({ views: supabase.sql`views + 1` })
        .eq('id', id);

      if (updateError) {
        console.error(`Error incrementing views for post ${id} via direct update:`, updateError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error(`Error incrementing views for post ${id}:`, error);
    return false;
  }
};

// Search posts
export const searchPosts = async (searchQuery: string): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
      .order('published_at', { ascending: false });
    
    if (error) {
      console.error('Error searching posts:', error);
      return [];
    }
    
    return data as BlogPost[] || [];
  } catch (error) {
    console.error('Error searching posts:', error);
    return [];
  }
};




