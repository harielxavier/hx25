import { supabase } from '../lib/supabase';

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

// Convert database row to BlogPost
const convertRowToBlogPost = (row: Record<string, unknown>): BlogPost => {
  const authorData = row.author as Record<string, unknown> | undefined;
  const author = {
    name: (authorData?.name as string) || 'Admin',
    avatar: (authorData?.avatar as string) || '/images/default-avatar.png',
    bio: (authorData?.bio as string) || undefined
  };

  return {
    id: (row.id as string) || '',
    title: (row.title as string) || '',
    slug: (row.slug as string) || '',
    excerpt: (row.excerpt as string) || '',
    content: (row.content as string) || '',
    featured_image: (row.featured_image as string) || '',
    category: (row.category as string) || 'Uncategorized',
    tags: (row.tags as string[]) || [],
    status: (row.status as 'draft' | 'published') || 'draft',
    created_at: (row.created_at as string) || new Date().toISOString(),
    updated_at: (row.updated_at as string) || new Date().toISOString(),
    published_at: (row.published_at as string | null) || null,
    featured: (row.featured as boolean) || false,
    author,
    views: (row.views as number) || 0,
    read_time: (row.read_time as string) || '',
    video_embed: (row.video_embed as string) || '',
    share_enabled: (row.share_enabled as boolean) !== false,
    comments_enabled: (row.comments_enabled as boolean) !== false
  };
};

// Get all blog posts (published only by default)
export const getAllPosts = async (includeUnpublished = false): Promise<BlogPost[]> => {
  try {
    console.log('Fetching all blog posts...');

    let query = supabase.from('blogs').select('*');

    if (!includeUnpublished) {
      query = query.eq('status', 'published');
    }

    const { data, error } = await query.order('published_at', { ascending: false });

    if (error) throw error;
    if (!data) {
      console.log('No blog posts found');
      return [];
    }

    const posts = data.map(convertRowToBlogPost);
    console.log(`Found ${posts.length} blog posts`);
    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw new Error('Failed to fetch blog posts');
  }
};

// Get a single blog post by slug
export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.log(`No post found with slug: ${slug}`);
      return null;
    }

    return convertRowToBlogPost(data);
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    throw new Error(`Failed to fetch post with slug ${slug}`);
  }
};

// Get a single blog post by ID
export const getPostById = async (id: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.log(`No post found with ID: ${id}`);
      return null;
    }

    return convertRowToBlogPost(data);
  } catch (error) {
    console.error(`Error fetching post with ID ${id}:`, error);
    throw new Error(`Failed to fetch post with ID ${id}`);
  }
};

// Get featured blog posts
export const getFeaturedPosts = async (limit = 3): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('featured', true)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    if (!data) return [];

    return data.map(convertRowToBlogPost);
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    throw new Error('Failed to fetch featured posts');
  }
};

// Get blog posts by category
export const getPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('category', category)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    return data.map(convertRowToBlogPost);
  } catch (error) {
    console.error(`Error fetching posts for category ${category}:`, error);
    throw new Error(`Failed to fetch posts for category ${category}`);
  }
};

// Get blog posts by tag
export const getPostsByTag = async (tag: string): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .contains('tags', [tag])
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    return data.map(convertRowToBlogPost);
  } catch (error) {
    console.error(`Error fetching posts for tag ${tag}:`, error);
    throw new Error(`Failed to fetch posts for tag ${tag}`);
  }
};

// Search blog posts
export const searchPosts = async (queryStr: string): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('status', 'published')
      .or(`title.ilike.%${queryStr}%,excerpt.ilike.%${queryStr}%,content.ilike.%${queryStr}%`)
      .order('published_at', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    return data.map(convertRowToBlogPost);
  } catch (error) {
    console.error(`Error searching posts for "${queryStr}":`, error);
    throw new Error(`Failed to search posts for "${queryStr}"`);
  }
};

// Create a new blog post
export const createPost = async (postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .insert([
        {
          ...postData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          views: 0
        }
      ])
      .select('id')
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned');

    console.log(`Created new post with ID: ${data.id}`);
    return data.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post');
  }
};

// Update an existing blog post
export const updatePost = async (id: string, postData: Partial<BlogPost>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('blogs')
      .update({
        ...postData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    console.log(`Updated post with ID: ${id}`);
    return true;
  } catch (error) {
    console.error(`Error updating post with ID ${id}:`, error);
    throw new Error(`Failed to update post with ID ${id}`);
  }
};

// Delete a blog post
export const deletePost = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    console.log(`Deleted post with ID: ${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting post with ID ${id}:`, error);
    throw new Error(`Failed to delete post with ID ${id}`);
  }
};

// Increment post view count
export const incrementPostViews = async (id: string): Promise<boolean> => {
  try {
    const { data, error: getError } = await supabase
      .from('blogs')
      .select('views')
      .eq('id', id)
      .single();

    if (getError) throw getError;

    const newViewCount = ((data?.views as number) || 0) + 1;

    const { error: updateError } = await supabase
      .from('blogs')
      .update({ views: newViewCount })
      .eq('id', id);

    if (updateError) throw updateError;
    console.log(`Incremented view count for post with ID: ${id}`);
    return true;
  } catch (error) {
    console.error(`Error incrementing view count for post with ID ${id}:`, error);
    // Don't throw an error for view count failures, just log it
    return false;
  }
};

// Get related posts based on category and tags
export const getRelatedPosts = async (currentPost: BlogPost, limit = 3): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('status', 'published')
      .neq('id', currentPost.id)
      .order('published_at', { ascending: false })
      .limit(limit * 2);

    if (error) throw error;
    if (!data) return [];

    // Score and sort by relevance
    const scoredPosts = data.map((row: Record<string, unknown>) => {
      const post = convertRowToBlogPost(row);
      let score = 0;

      if (post.category === currentPost.category) {
        score += 3;
      }

      const sharedTags = post.tags.filter(tag => currentPost.tags.includes(tag));
      score += sharedTags.length * 2;

      return { post, score };
    });

    return scoredPosts
      .sort((a: { post: BlogPost; score: number }, b: { post: BlogPost; score: number }) => b.score - a.score)
      .slice(0, limit)
      .map((item: { post: BlogPost; score: number }) => item.post);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    throw new Error('Failed to fetch related posts');
  }
};
