import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Eye, Plus, Search, Filter, AlertCircle, BookPlus, Star, StarOff, Globe, FileText, Link, Copy, Check } from 'lucide-react';
import { BlogPost, getAllPosts, incrementPostViews } from '../../services/supabaseBlogService';
import { supabase } from '../../lib/supabase';
import { createEnhancedBlogPosts } from '../../utils/enhancedBlogInitializer';
import imageOptimizationUtils from '../../utils/imageOptimizationUtils';
import './BlogManagerFix.css'; // Import the CSS fix

// Helper function to sanitize image URLs
const sanitizeImageUrl = (url: string | undefined): string => {
  // If URL is undefined, null, or empty string, return a default image
  if (!url || url === '') {
    return '/images/stock/blog/blog-art-of-wedding-storytelling.jpg';
  }
  
  // If it's a relative path starting with /, it's a valid local image
  if (url.startsWith('/')) {
    return url;
  }
  
  try {
    // Check if URL is valid
    new URL(url);
    
    // Additional validation for common issues
    if (url.includes('undefined') || url === 'null') {
      return '/images/stock/blog/blog-art-of-wedding-storytelling.jpg';
    }
    
    // Use our image optimization utility to transform the URL
    return imageOptimizationUtils.transformImageUrl(url);
  } catch (error) {
    // Return a default image if the URL is invalid without logging the error
    return '/images/stock/blog/blog-art-of-wedding-storytelling.jpg';
  }
};

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [creatingPosts, setCreatingPosts] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get all posts (including unpublished for admin)
      const fetchedPosts = await getAllPosts(true);
      
      // Sanitize image URLs in all posts
      const sanitizedPosts = fetchedPosts.map(post => ({
        ...post,
        featuredImage: sanitizeImageUrl(post.featuredImage)
      }));
      
      setPosts(sanitizedPosts);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(fetchedPosts.map(post => post.category))
      );
      setCategories(['All', ...uniqueCategories]);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load blog posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const { error } = await supabase
          .from('posts')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        setPosts(posts.filter(post => post.id !== id));
      } catch (error) {
        console.error('Error deleting post:', error);
        setError('Failed to delete post. Please try again.');
      }
    }
  };

  const handleViewPost = async (id: string, slug: string) => {
    try {
      // Increment view count
      await incrementPostViews(id);
      // Open post in a new tab
      window.open(`/blog/${slug}`, '_blank');
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };
  
  const handleToggleStatus = async (post: BlogPost) => {
    try {
      setError(null);
      const newStatus = post.status === 'published' ? 'draft' : 'published';
      
      // Update the post status
      const { error } = await supabase
        .from('posts')
        .update({ status: newStatus })
        .eq('id', post.id);
      
      if (error) throw error;
      
      // Update the local state
      setPosts(posts.map(p => 
        p.id === post.id ? { ...p, status: newStatus } : p
      ));
      
      setSuccessMessage(`Post "${post.title}" is now ${newStatus}`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error updating post status:', error);
      setError('Failed to update post status. Please try again.');
    }
  };
  
  const handleToggleFeatured = async (post: BlogPost) => {
    try {
      setError(null);
      const newFeatured = !post.featured;
      
      if (newFeatured) {
        // If we're featuring this post, we need to un-feature any other posts
        const currentlyFeaturedPosts = posts.filter(p => p.featured && p.id !== post.id);
        
        // First update the clicked post to be featured
        const { error: error1 } = await supabase
          .from('posts')
          .update({ featured: true })
          .eq('id', post.id);
        
        if (error1) throw error1;
        
        // Then un-feature any previously featured posts
        for (const featuredPost of currentlyFeaturedPosts) {
          await supabase
            .from('posts')
            .update({ featured: false })
            .eq('id', featuredPost.id);
        }
        
        // Update the local state to reflect all changes
        setPosts(posts.map(p => {
          if (p.id === post.id) {
            return { ...p, featured: true };
          } else if (p.featured) {
            return { ...p, featured: false };
          }
          return p;
        }));
        
        setSuccessMessage(`Post "${post.title}" is now featured and any previously featured posts have been unfeatured`);
      } else {
        // Just un-featuring a post
        const { error } = await supabase
          .from('posts')
          .update({ featured: false })
          .eq('id', post.id);
        
        if (error) throw error;
        
        // Update the local state
        setPosts(posts.map(p => 
          p.id === post.id ? { ...p, featured: false } : p
        ));
        
        setSuccessMessage(`Post "${post.title}" is now unfeatured`);
      }
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error updating featured status:', error);
      setError('Failed to update featured status. Please try again.');
    }
  };

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/blog/${slug}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopiedSlug(slug);
        setTimeout(() => setCopiedSlug(null), 2000);
      })
      .catch(err => {
        console.error('Failed to copy URL: ', err);
        setError('Failed to copy URL to clipboard');
      });
  };

  const handleCreateNewPosts = async () => {
    if (window.confirm('Are you sure you want to create 7 new sample blog posts? This will add modern photography blog content with one featured post and distributed publication dates.')) {
      setCreatingPosts(true);
      setError(null);
      setSuccessMessage(null);
      
      try {
        await createEnhancedBlogPosts();
        setSuccessMessage('Successfully created 7 new blog posts with distributed dates! Refreshing list...');
        // Refresh the posts list
        await fetchPosts();
      } catch (error: any) {
        console.error('Error creating new blog posts:', error);
        // Provide more specific error messages based on the error type
        if (error.code === 'permission-denied' || error.message?.includes('Permission denied')) {
          setError('Permission denied: You must be logged in as an admin to create blog posts.');
        } else if (error.code?.includes('auth/popup-blocked')) {
          setError('Authentication popup was blocked. Please allow popups for this site and try again.');
        } else if (error.code?.includes('auth/')) {
          setError('Authentication error: Please make sure you are logged in with admin privileges.');
        } else {
          setError(`Failed to create new blog posts: ${error.message || 'Unknown error'}`);
        }
      } finally {
        setCreatingPosts(false);
      }
    }
  };

  const filteredPosts = posts
    .filter(post => 
      selectedCategory === 'all' || post.category.toLowerCase() === selectedCategory.toLowerCase()
    )
    .filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Blog Management</h1>
          <div className="flex gap-3">
            <button
              onClick={handleCreateNewPosts}
              disabled={creatingPosts}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BookPlus size={18} />
              {creatingPosts ? 'Creating...' : 'Create 7 Sample Posts'}
            </button>
            <button
              onClick={() => navigate('/admin/blog-editor')}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus size={18} />
              New Post
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <AlertCircle size={18} className="mr-2" />
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <AlertCircle size={18} className="mr-2" />
            {successMessage}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-black transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:border-black transition-colors"
              >
                {categories.map(category => (
                  <option key={category} value={category.toLowerCase()}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No posts found. Try adjusting your search or create a new post.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 blog-manager-table">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Featured
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      URL
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{post.excerpt}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => handleToggleStatus(post)}
                          className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full transition-colors ${
                            post.status === 'published' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                          title={post.status === 'published' ? 'Click to unpublish' : 'Click to publish'}
                        >
                          {post.status === 'published' ? (
                            <>
                              <Globe size={14} />
                              Published
                            </>
                          ) : (
                            <>
                              <FileText size={14} />
                              Draft
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleFeatured(post)}
                          className={`p-2 rounded-full transition-colors ${
                            post.featured 
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                          title={post.featured ? 'Remove from featured' : 'Add to featured'}
                        >
                          {post.featured ? <Star size={16} /> : <StarOff size={16} />}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 truncate max-w-[120px]">/blog/{post.slug}</span>
                          <button
                            onClick={() => handleCopyLink(post.slug)}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                            title="Copy link to clipboard"
                          >
                            {copiedSlug === post.slug ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-gray-500" />}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.publishedAt && 'seconds' in post.publishedAt 
                        ? new Date(post.publishedAt.seconds * 1000).toLocaleDateString() 
                        : 'Not published'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.views || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-3 blog-manager-actions">
                          <button
                            onClick={() => handleViewPost(post.id, post.slug)}
                            className="text-blue-600 hover:text-blue-900 view-button"
                            title="View Post"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/blog-editor/${post.id}`)}
                            className="text-indigo-600 hover:text-indigo-900 edit-button"
                            title="Edit Post"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="text-red-600 hover:text-red-900 delete-button"
                            title="Delete Post"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
