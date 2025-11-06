import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Calendar, Clock, ArrowRight, Search, Eye, AlertCircle } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
// Firebase imports removed - using Supabase
import LeadMagnet from '../components/LeadMagnet';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';
import SEO from '../components/SEO';
import { BlogPost, getAllPosts, getFeaturedPosts } from '../services/supabaseBlogService';
import { initializeBlogPosts } from '../utils/blogInitializer';
import imageOptimizationUtils from '../utils/imageOptimizationUtils';
import 'react-lazy-load-image-component/src/effects/blur.css';

// Helper function to calculate read time
const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
};

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

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>(''); // Immediate input state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [initializing, setInitializing] = useState(false);
  const [initializationComplete, setInitializationComplete] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [postsPerPage] = useState(6); // Show 6 posts initially
  const [displayedPostsCount, setDisplayedPostsCount] = useState(6);

  // Debounce search input (wait 500ms after user stops typing)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        // Try to get all published posts
        let fetchedPosts: BlogPost[] = [];
        try {
          fetchedPosts = await getAllPosts(false); // false = only published posts
        } catch (err: any) {
          console.error('Error getting posts:', err);
          
          // If we get a "failed-precondition" error, it might mean the collection doesn't exist
          // or there are no posts yet
          if (err?.code === 'failed-precondition' && !initializing) {
            setInitializing(true);
            try {
              // Initialize blog posts
              await initializeBlogPosts();
              setInitializationComplete(true);
              
              // Wait a moment for Firestore to update
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              // Try fetching again
              try {
                fetchedPosts = await getAllPosts(false);
              } catch (fetchError) {
                console.error('Error fetching posts after initialization:', fetchError);
                // If we still can't fetch posts, try creating them one more time
                await initializeBlogPosts();
                // Wait again and try one final fetch
                await new Promise(resolve => setTimeout(resolve, 1000));
                fetchedPosts = await getAllPosts(false);
              }
            } catch (initError) {
              console.error('Error initializing blog posts:', initError);
              setError('Failed to initialize blog posts. Please try again later.');
              setInitializing(false);
              setLoading(false);
              return;
            }
          } else {
            throw err; // Re-throw if it's not a failed-precondition or we already tried initializing
          }
        }
        
        // Sanitize image URLs in all posts and ensure both field names exist
        fetchedPosts = fetchedPosts.map(post => {
          const imageUrl = post.featuredImage || post.featured_image || '';
          const sanitized = sanitizeImageUrl(imageUrl);
          return {
            ...post,
            featuredImage: sanitized,
            featured_image: sanitized
          };
        });
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(fetchedPosts.map(post => post.category))
        );
        
        // Extract all unique tags
        const allTagsSet = new Set<string>();
        fetchedPosts.forEach(post => {
          if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach(tag => allTagsSet.add(tag));
          }
        });
        
        setPosts(fetchedPosts);
        setCategories(uniqueCategories);
        setAllTags(Array.from(allTagsSet));
        
        // Get featured posts directly from the fetched posts to ensure consistency
        // This ensures what's shown in the admin interface matches what's on the blog page
        const featuredInFetched = fetchedPosts.filter(post => post.featured);
        let featuredPosts: BlogPost[] = [];
        
        if (featuredInFetched.length > 0) {
          // Use the featured posts from the fetched posts
          featuredPosts = [featuredInFetched[0]];
          console.log('Featured post found in fetched posts:', featuredInFetched[0].title);
        } else {
          // If no featured posts in fetched posts, try the getFeaturedPosts function
          try {
            featuredPosts = await getFeaturedPosts(1);
            console.log('Featured posts fetched from function:', featuredPosts);
          } catch (err) {
            console.error('Error getting featured posts:', err);
            // If all else fails and we have posts, use the first one
            if (fetchedPosts.length > 0) {
              featuredPosts = [fetchedPosts[0]];
              console.log('Using first post as featured:', fetchedPosts[0].title);
            }
          }
        }
        
        if (featuredPosts.length > 0) {
          setFeaturedPost(featuredPosts[0]);
          console.log('Featured post set:', featuredPosts[0].title);
        } else {
          setFeaturedPost(null);
          console.log('No featured post found');
        }
        
        // Get popular posts (sort by views)
        const popularPostsData = [...fetchedPosts]
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 3);
        setPopularPosts(popularPostsData);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
        setInitializing(false);
      }
    };

    // Fetch posts immediately when the component mounts
    fetchPosts();

    // Note: Removed excessive 30-second auto-refresh to improve performance
    // Blog will only refresh when component mounts or filters change
  }, [selectedCategory, searchQuery, activeTag]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
    setActiveTag(null);
  };

  const handleTagClick = (tag: string) => {
    setActiveTag(tag === activeTag ? null : tag);
    setSelectedCategory('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality is implemented in the filtering logic below
  };

  const handleRetry = () => {
    setError(null);
    setInitializing(false);
    setInitializationComplete(false);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterStatus('error');
      return;
    }

    setNewsletterStatus('submitting');

    try {
      await addDoc(collection(db, 'leads'), {
        email: newsletterEmail,
        source: 'blog_newsletter',
        status: 'new',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setNewsletterStatus('success');
      setNewsletterEmail('');
      
      setTimeout(() => {
        setNewsletterStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setNewsletterStatus('error');
      
      setTimeout(() => {
        setNewsletterStatus('idle');
      }, 3000);
    }
  };

  // Filter posts based on search, category, and tag
  const filteredPosts = posts.filter(post => {
    // Exclude the featured post from the regular posts list
    if (featuredPost && post.id === featuredPost.id) {
      return false;
    }
    
    // Filter by search query
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === '' || post.category === selectedCategory;
    
    // Filter by tag
    const matchesTag = activeTag === null || (post.tags && post.tags.includes(activeTag));
    
    return matchesSearch && matchesCategory && matchesTag;
  });

  // Pagination: Show only the first N posts
  const displayedPosts = filteredPosts.slice(0, displayedPostsCount);
  const hasMorePosts = filteredPosts.length > displayedPostsCount;

  const loadMorePosts = () => {
    setDisplayedPostsCount(prev => prev + postsPerPage);
  };

  // Reset displayed count when filters change
  useEffect(() => {
    setDisplayedPostsCount(postsPerPage);
  }, [selectedCategory, searchQuery, activeTag, postsPerPage]);

  return (
    <>
      <SEO
        title="Wedding Photography Blog | Tips & Insights | Hariel Xavier Photography"
        description="Explore our wedding photography blog for expert tips, venue guides, and inspiration for your NJ wedding day. Learn from a professional Sparta, NJ wedding photographer."
        keywords="wedding photography blog, NJ wedding tips, wedding photography inspiration, Sparta NJ photographer, wedding planning advice, Hariel Xavier Photography"
        ogImage="https://harielxavier.com/images/stock/blog/blog-art-of-wedding-storytelling.jpg"
        type="website"
        includeRSS={true}
      />
      <Navigation />
      
      {/* Initialization notification */}
      {initializing && (
        <div className="fixed top-20 right-4 z-50 bg-black text-white px-6 py-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            <p>Initializing blog posts...</p>
          </div>
        </div>
      )}
      
      {/* Success notification */}
      {initializationComplete && (
        <div className="fixed top-20 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="rounded-full h-4 w-4 flex items-center justify-center bg-white text-green-600 font-bold">✓</div>
            <p>Blog posts initialized successfully!</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section with Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Article</h2>
            <div className="bg-white rounded-xl overflow-hidden shadow-xl transform transition-transform hover:scale-[1.01]">
              <div className="relative h-96 w-full">
                <LazyLoadImage
                  src={sanitizeImageUrl(featuredPost.featuredImage || featuredPost.featured_image || '')}
                  alt={featuredPost.title}
                  effect="blur"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="bg-black/80 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {featuredPost.category}
                    </span>
                    <span className="flex items-center space-x-1 text-xs">
                      <Eye size={14} />
                      <span>{featuredPost.views} views</span>
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-3">{featuredPost.title}</h1>
                  <p className="text-gray-200 mb-4 line-clamp-2">{featuredPost.excerpt}</p>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} />
                      <span className="text-sm">
                        {featuredPost.publishedAt && 'seconds' in featuredPost.publishedAt 
                          ? new Date(featuredPost.publishedAt.seconds * 1000).toLocaleDateString() 
                          : 'Recently published'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock size={16} />
                      <span className="text-sm">{calculateReadTime(featuredPost.content)}</span>
                    </div>
                  </div>
                  <Link 
                    to={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span>Read Article</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - Blog Posts */}
          <div className="lg:w-2/3">
            {/* Search and Filter */}
            <div className="mb-8">
              <form onSubmit={handleSearch} className="flex mb-6">
                <input
                  type="text"
                  placeholder="Search blog posts..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="flex-grow px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-3 rounded-r-lg hover:bg-gray-800 transition-colors"
                  aria-label="Search blog posts"
                  title="Search"
                >
                  <Search size={20} />
                </button>
              </form>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => handleCategoryClick('')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === '' ? 'bg-black text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category ? 'bg-black text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Tag Cloud */}
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      activeTag === tag ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Blog Posts Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-8">
                <div className="flex items-center space-x-2">
                  <AlertCircle size={20} />
                  <p>{error}</p>
                </div>
                <button
                  onClick={handleRetry}
                  className="mt-4 bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600 mb-4">No posts found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchInput('');
                    setSelectedCategory('');
                    setActiveTag(null);
                  }}
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {displayedPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    <Link to={`/blog/${post.slug}`} className="block">
                      <div className="relative h-56">
                        <LazyLoadImage
                          src={post.featuredImage || post.featured_image || ''}
                          alt={post.title}
                          effect="blur"
                          className="w-full h-full object-cover"
                          placeholderSrc={(post.featuredImage || post.featured_image || '').startsWith('/') 
                            ? (post.featuredImage || post.featured_image) 
                            : (post.featuredImage || post.featured_image)}
                          wrapperClassName="w-full h-full"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-black/80 text-white px-3 py-1 rounded-full text-xs font-medium">
                            {post.category}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <div className="p-6">
                      <Link to={`/blog/${post.slug}`} className="block">
                        <h2 className="text-xl font-bold mb-2 hover:text-gray-700 transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                      </Link>
                      <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar size={14} />
                            <span className="text-xs text-gray-500">
                              {post.publishedAt && 'seconds' in post.publishedAt 
                                ? new Date(post.publishedAt.seconds * 1000).toLocaleDateString() 
                                : 'Recently published'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock size={14} />
                            <span className="text-xs text-gray-500">{calculateReadTime(post.content)}</span>
                          </div>
                        </div>
                        <Link
                          to={`/blog/${post.slug}`}
                          className="text-black font-medium hover:underline flex items-center space-x-1"
                        >
                          <span>Read</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Load More Button */}
              {hasMorePosts && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={loadMorePosts}
                    className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
                  >
                    <span>Load More Posts</span>
                    <ArrowRight size={16} />
                  </button>
                  <p className="ml-4 text-gray-600 self-center text-sm">
                    Showing {displayedPostsCount} of {filteredPosts.length}
                  </p>
                </div>
              )}
              </>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:w-1/3 space-y-8">
            {/* About the Blog */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2">About Our Blog</h3>
              <p className="text-gray-600 mb-4">
                Welcome to Hariel Xavier Photography's blog, where we share professional photography tips, 
                wedding inspiration, and behind-the-scenes insights from our photo sessions.
              </p>
              <div className="flex flex-col items-center">
                <img
                  src="https://res.cloudinary.com/dos0qac90/image/upload/v1761593379/hariel-xavier-photography/MoStuff/portrait.jpg"
                  alt="Hariel Xavier"
                  className="w-24 h-24 rounded-full object-cover border-2 border-black mb-2"
                  onError={(e) => {
                    e.currentTarget.src = 'https://res.cloudinary.com/dos0qac90/image/upload/v1761593379/hariel-xavier-photography/MoStuff/black.png';
                  }}
                />
                <h4 className="font-medium text-sm mt-2">Hariel Xavier</h4>
                <p className="text-xs text-gray-500">Professional Photographer</p>
              </div>
            </div>

            {/* Popular Posts */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2">Popular Posts</h3>
              <div className="space-y-4">
                {popularPosts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="flex items-start space-x-3 group">
                    <div className="w-20 h-20 flex-shrink-0">
                      <LazyLoadImage
                        src={post.featuredImage || post.featured_image || ''}
                        alt={post.title}
                        effect="blur"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium group-hover:text-gray-700 transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Eye size={12} className="text-gray-500" />
                        <span className="text-xs text-gray-500">{post.views} views</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className="flex items-center justify-between w-full py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium">{category}</span>
                    <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
                      {posts.filter(post => post.category === category).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-black text-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-gray-300 mb-4">
                Get the latest photography tips and exclusive content delivered to your inbox.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  disabled={newsletterStatus === 'submitting'}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
                  required
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'submitting'}
                  className="w-full bg-white text-black font-medium py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {newsletterStatus === 'submitting' ? 'Subscribing...' : 'Subscribe'}
                </button>
                {newsletterStatus === 'success' && (
                  <p className="text-green-400 text-sm">✓ Successfully subscribed!</p>
                )}
                {newsletterStatus === 'error' && (
                  <p className="text-red-400 text-sm">✗ Please enter a valid email</p>
                )}
              </form>
            </div>

            {/* Tags Cloud */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      activeTag === tag ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Lead Magnet Promotion */}
            <div className="bg-gradient-to-r from-gray-900 to-black text-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Free Photography Guide</h3>
                <p className="text-gray-300 mb-4">
                  Download our free guide on "What to Wear for Your Engagement Session"
                </p>
                <button
                  onClick={() => document.dispatchEvent(new Event('show-lead-magnet'))}
                  className="w-full bg-white text-black font-medium py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Get Free Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <LeadMagnet />
    </>
  );
}
