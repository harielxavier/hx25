import { db } from '../firebase/config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  increment,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt: Timestamp | null;
  featured: boolean;
  author: {
    name: string;
    avatar: string;
    bio?: string;
  };
  views: number;
  readTime?: string;
  videoEmbed?: string;
  shareEnabled?: boolean;
  commentsEnabled?: boolean;
}

// Helper function to convert Firestore document to BlogPost
const convertDocToBlogPost = (doc: QueryDocumentSnapshot<DocumentData>): BlogPost => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title || '',
    slug: data.slug || '',
    excerpt: data.excerpt || '',
    content: data.content || '',
    featuredImage: data.featuredImage || '',
    category: data.category || 'Uncategorized',
    tags: data.tags || [],
    status: data.status || 'draft',
    createdAt: data.createdAt || Timestamp.now(),
    updatedAt: data.updatedAt || Timestamp.now(),
    publishedAt: data.publishedAt || null,
    featured: data.featured || false,
    author: data.author || {
      name: 'Admin',
      avatar: '/images/default-avatar.png'
    },
    views: data.views || 0,
    readTime: data.readTime || '',
    videoEmbed: data.videoEmbed || '',
    shareEnabled: data.shareEnabled !== undefined ? data.shareEnabled : true,
    commentsEnabled: data.commentsEnabled !== undefined ? data.commentsEnabled : true
  };
};

// Get all blog posts (published only by default)
export const getAllPosts = async (includeUnpublished = false): Promise<BlogPost[]> => {
  try {
    console.log('Fetching all blog posts...');
    
    // Use a simpler query that doesn't require composite indexes
    const postsRef = collection(db, 'posts');
    const postsSnapshot = await getDocs(postsRef);
    
    if (postsSnapshot.empty) {
      console.log('No blog posts found');
      return [];
    }
    
    // Convert documents to BlogPost objects
    let posts = postsSnapshot.docs.map(convertDocToBlogPost);
    
    // Filter and sort client-side instead of using complex Firestore queries
    if (!includeUnpublished) {
      posts = posts.filter(post => post.status === 'published');
    }
    
    // Sort by publishedAt date (newest first)
    posts.sort((a, b) => {
      const aTime = a.publishedAt ? a.publishedAt.seconds : 0;
      const bTime = b.publishedAt ? b.publishedAt.seconds : 0;
      return bTime - aTime;
    });
    
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
    // Query for the post with the matching slug
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log(`No post found with slug: ${slug}`);
      return null;
    }
    
    // Convert the first matching document to a BlogPost
    const post = convertDocToBlogPost(querySnapshot.docs[0]);
    return post;
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    throw new Error(`Failed to fetch post with slug ${slug}`);
  }
};

// Get a single blog post by ID
export const getPostById = async (id: string): Promise<BlogPost | null> => {
  try {
    const postRef = doc(db, 'posts', id);
    const postSnap = await getDoc(postRef);
    
    if (!postSnap.exists()) {
      console.log(`No post found with ID: ${id}`);
      return null;
    }
    
    // Convert the document to a BlogPost
    const data = postSnap.data();
    const post: BlogPost = {
      id: postSnap.id,
      title: data.title || '',
      slug: data.slug || '',
      excerpt: data.excerpt || '',
      content: data.content || '',
      featuredImage: data.featuredImage || '',
      category: data.category || 'Uncategorized',
      tags: data.tags || [],
      status: data.status || 'draft',
      createdAt: data.createdAt || Timestamp.now(),
      updatedAt: data.updatedAt || Timestamp.now(),
      publishedAt: data.publishedAt || null,
      featured: data.featured || false,
      author: data.author || {
        name: 'Admin',
        avatar: '/images/default-avatar.png'
      },
      views: data.views || 0,
      readTime: data.readTime || '',
      videoEmbed: data.videoEmbed || '',
      shareEnabled: data.shareEnabled !== undefined ? data.shareEnabled : true,
      commentsEnabled: data.commentsEnabled !== undefined ? data.commentsEnabled : true
    };
    
    return post;
  } catch (error) {
    console.error(`Error fetching post with ID ${id}:`, error);
    throw new Error(`Failed to fetch post with ID ${id}`);
  }
};

// Get featured blog posts
export const getFeaturedPosts = async (limit = 3): Promise<BlogPost[]> => {
  try {
    // Get all posts and filter client-side
    const allPosts = await getAllPosts(false);
    
    // Filter for featured posts and limit the number
    const featuredPosts = allPosts
      .filter(post => post.featured)
      .slice(0, limit);
    
    return featuredPosts;
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    throw new Error('Failed to fetch featured posts');
  }
};

// Get blog posts by category
export const getPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  try {
    // Get all posts and filter client-side
    const allPosts = await getAllPosts(false);
    
    // Filter for posts in the specified category
    const categoryPosts = allPosts.filter(
      post => post.category.toLowerCase() === category.toLowerCase()
    );
    
    return categoryPosts;
  } catch (error) {
    console.error(`Error fetching posts for category ${category}:`, error);
    throw new Error(`Failed to fetch posts for category ${category}`);
  }
};

// Get blog posts by tag
export const getPostsByTag = async (tag: string): Promise<BlogPost[]> => {
  try {
    // Get all posts and filter client-side
    const allPosts = await getAllPosts(false);
    
    // Filter for posts with the specified tag
    const tagPosts = allPosts.filter(
      post => post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
    
    return tagPosts;
  } catch (error) {
    console.error(`Error fetching posts for tag ${tag}:`, error);
    throw new Error(`Failed to fetch posts for tag ${tag}`);
  }
};

// Search blog posts
export const searchPosts = async (query: string): Promise<BlogPost[]> => {
  try {
    // Get all published posts
    const allPosts = await getAllPosts(false);
    
    // Filter posts that match the search query
    const searchResults = allPosts.filter(post => {
      const searchableText = `${post.title} ${post.excerpt} ${post.content} ${post.category} ${post.tags.join(' ')}`.toLowerCase();
      return searchableText.includes(query.toLowerCase());
    });
    
    return searchResults;
  } catch (error) {
    console.error(`Error searching posts for "${query}":`, error);
    throw new Error(`Failed to search posts for "${query}"`);
  }
};

// Create a new blog post
export const createPost = async (postData: Omit<BlogPost, 'id'>): Promise<string> => {
  try {
    const postsRef = collection(db, 'posts');
    const docRef = await addDoc(postsRef, {
      ...postData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      views: 0
    });
    
    console.log(`Created new post with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post');
  }
};

// Update an existing blog post
export const updatePost = async (id: string, postData: Partial<BlogPost>): Promise<boolean> => {
  try {
    const postRef = doc(db, 'posts', id);
    
    // Add updatedAt timestamp
    const updateData = {
      ...postData,
      updatedAt: Timestamp.now()
    };
    
    await updateDoc(postRef, updateData);
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
    const postRef = doc(db, 'posts', id);
    await deleteDoc(postRef);
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
    const postRef = doc(db, 'posts', id);
    await updateDoc(postRef, {
      views: increment(1)
    });
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
    // Get all published posts
    const allPosts = await getAllPosts(false);
    
    // Filter out the current post
    const otherPosts = allPosts.filter(post => post.id !== currentPost.id);
    
    // Score each post based on relevance
    const scoredPosts = otherPosts.map(post => {
      let score = 0;
      
      // Same category
      if (post.category === currentPost.category) {
        score += 3;
      }
      
      // Shared tags
      const sharedTags = post.tags.filter(tag => currentPost.tags.includes(tag));
      score += sharedTags.length * 2;
      
      return { post, score };
    });
    
    // Sort by score (highest first) and take the top 'limit' posts
    const relatedPosts = scoredPosts
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.post);
    
    return relatedPosts;
  } catch (error) {
    console.error('Error fetching related posts:', error);
    throw new Error('Failed to fetch related posts');
  }
};
