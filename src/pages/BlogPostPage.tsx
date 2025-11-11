import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Bookmark, Heart, ChevronLeft, Share2, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';
// Using Supabase
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';
import SEO from '../components/SEO';
import LeadMagnet from '../components/LeadMagnet';
import Breadcrumbs from '../components/Breadcrumbs';
import BlogStructuredData from '../components/BlogStructuredData';
import BlogComments from '../components/BlogComments';
import ShareButtons from '../components/blog/ShareButtons';
import RelatedPosts from '../components/blog/RelatedPosts';
import 'react-lazy-load-image-component/src/effects/blur.css';
import '../styles/blog-content.css';
import { BlogPost, getPostBySlug, incrementPostViews, getPostsByCategory } from '../services/supabaseBlogService';
import { trackBlogEngagement } from '../utils/enhancedAnalytics';
// REMOVED FIREBASE: import { addDoc, collection, serverTimestamp // REMOVED FIREBASE
// REMOVED FIREBASE: import { db } from '../lib/firebase';
import { getStockImage } from '../utils/images';
import { ImageWithFallback } from '../components/ImageWithFallback';
import imageOptimizationUtils from '../utils/imageOptimizationUtils';
import { sanitizeHtml } from '../utils/sanitize';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Calculate read time based on content length
  const calculateReadTime = (content: string) => {
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

  // Reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;

      const progressBar = document.getElementById('reading-progress');
      if (progressBar) {
        progressBar.style.width = `${Math.min(progress, 100)}%`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      setLoading(true);
      setError(null);

      try {
        // Use the blog service to fetch post by slug
        const postData = await getPostBySlug(slug);

        if (!postData) {
          setError('Blog post not found');
          setLoading(false);
          return;
        }

        // Update view count
        await incrementPostViews(postData.id);

        // Ensure the post has a valid image (check both field names)
        if (!postData.featuredImage && !postData.featured_image) {
          postData.featuredImage = getStockImage('wedding');
          postData.featured_image = getStockImage('wedding');
        } else if (!postData.featuredImage) {
          // If only featured_image exists, copy it to featuredImage
          postData.featuredImage = postData.featured_image;
        } else if (!postData.featured_image) {
          // If only featuredImage exists, copy it to featured_image
          postData.featured_image = postData.featuredImage;
        }

        console.log('🖼️ Post image:', postData.featuredImage || postData.featured_image);

        setPost(postData);

        // Track blog post read
        const readTime = parseInt(calculateReadTime(postData.content));
        trackBlogEngagement('read', {
          postId: postData.id,
          postTitle: postData.title,
          postCategory: postData.category,
          readTime: readTime
        });

        // Fetch related posts (same category, excluding current post)
        if (postData.category) {
          const relatedData = await getPostsByCategory(postData.category);

          // Filter out the current post and limit to 3
          const filteredRelatedPosts = relatedData
            .filter(relatedPost => relatedPost.id !== postData.id)
            .slice(0, 3);

          // Ensure all related posts have valid images
          const relatedWithImages = filteredRelatedPosts.map(post => {
            const imageUrl = post.featuredImage || post.featured_image || '';
            const sanitized = sanitizeImageUrl(imageUrl);
            return {
              ...post,
              featuredImage: sanitized,
              featured_image: sanitized
            };
          });

          setRelatedPosts(relatedWithImages);
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setError('Failed to load blog post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Reset state when slug changes
    setPost(null);
    setRelatedPosts([]);

    fetchPost();

    // Scroll to top when navigating to a new post
    window.scrollTo(0, 0);
  }, [slug]);

  const handleShare = (platform: string) => {
    if (!post) return;

    const url = window.location.href;
    const title = post.title;

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this article: ${url}`)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank');
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // In a real app, you would save this to the user's profile
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // In a real app, you would update the like count in the database
  };

  const handleNavigateBack = () => {
    navigate('/blog');
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
        source: 'blog_post_newsletter',
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

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-2xl font-serif mb-4">{error || 'Blog post not found'}</h1>
          <p className="mb-8">The blog post you're looking for might have been removed or is temporarily unavailable.</p>
          <button
            onClick={handleNavigateBack}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Blog
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="blog-reading-progress" style={{ width: '0%' }} id="reading-progress"></div>

      <SEO
        title={post.seoTitle || `${post.title} | Hariel Xavier Photography`}
        description={post.seoDescription || post.excerpt}
        type="article"
        image={post.featuredImage || post.featured_image}
      />
      <BlogStructuredData post={post} />
      <Navigation />
      <LeadMagnet delay={60000} exitIntent={true} />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="relative h-[50vh] md:h-[60vh] flex items-center justify-center mb-12">
          <div className="absolute inset-0 overflow-hidden">
            <ImageWithFallback
              src={post.featuredImage || post.featured_image || ''}
              alt={post.title}
              category="wedding"
              className="w-full h-full object-cover"
              width={1920}
              height={1080}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          </div>
          <div className="relative text-center text-white z-10 px-4 max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1 border border-white/30 rounded-full text-sm mb-4 uppercase">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-serif mb-6">{post.title}</h1>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-white/80 mb-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{new Date(post.publishedAt?.toDate() || post.createdAt?.toDate() || Date.now()).toLocaleDateString()}</span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{calculateReadTime(post.content)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: 'Blog', path: '/blog' },
              { label: post.title }
            ]}
            className="mb-6"
          />

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Article Content */}
            <article className="lg:w-2/3 bg-white rounded-xl shadow-sm p-6 md:p-10">
              {/* Back to Blog Link */}
              <Link to="/blog" className="inline-flex items-center text-gray-600 hover:text-black mb-8">
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span>Back to Blog</span>
              </Link>

              {/* Article Body */}
              <div
                className="blog-content prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <Link
                        key={tag}
                        to={`/blog?tag=${tag}`}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Sharing */}
              <div className="mt-10 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setShowShareOptions(!showShareOptions)}
                      className="flex items-center space-x-2 text-gray-600 hover:text-black"
                    >
                      <Share2 className="h-5 w-5" />
                      <span>Share</span>
                    </button>
                    <button
                      onClick={handleSave}
                      className={`flex items-center space-x-2 ${isSaved ? 'text-blue-600' : 'text-gray-600 hover:text-black'}`}
                    >
                      <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                      <span>{isSaved ? 'Saved' : 'Save'}</span>
                    </button>
                    <button
                      onClick={handleLike}
                      className={`flex items-center space-x-2 ${isLiked ? 'text-red-600' : 'text-gray-600 hover:text-black'}`}
                    >
                      <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{isLiked ? 'Liked' : 'Like'}</span>
                    </button>
                  </div>
                </div>

                {/* Share Options Dropdown */}
                {showShareOptions && (
                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                      aria-label="Share on Facebook"
                      title="Share on Facebook"
                    >
                      <Facebook className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600"
                      aria-label="Share on Twitter"
                      title="Share on Twitter"
                    >
                      <Twitter className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800"
                      aria-label="Share on LinkedIn"
                      title="Share on LinkedIn"
                    >
                      <Linkedin className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleShare('email')}
                      className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700"
                      aria-label="Share via Email"
                      title="Share via Email"
                    >
                      <Mail className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Author Bio */}
              {post.author && (
                <div className="mt-10 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <ImageWithFallback
                      src={post.author.avatar}
                      alt={post.author.name}
                      category="wedding"
                      className="w-16 h-16 rounded-full object-cover"
                      width={64}
                      height={64}
                    />
                    <div>
                      <h3 className="font-medium text-lg">{post.author.name}</h3>
                      {post.author.bio && <p className="text-gray-600">{post.author.bio}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Comments Section */}
              {post.commentsEnabled !== false && (
                <BlogComments postId={post.id} postSlug={post.slug} />
              )}
            </article>

            {/* Sidebar */}
            <aside className="lg:w-1/3 space-y-8">
              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-medium mb-6">Related Articles</h3>
                  <div className="space-y-6">
                    {relatedPosts.map(relatedPost => (
                      <Link
                        key={relatedPost.id}
                        to={`/blog/${relatedPost.slug}`}
                        className="flex space-x-4 group"
                      >
                        <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                          <ImageWithFallback
                            src={relatedPost.featuredImage || relatedPost.featured_image || ''}
                            alt={relatedPost.title}
                            category="wedding"
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            width={96}
                            height={96}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium group-hover:text-gray-700 line-clamp-2">
                            {relatedPost.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(relatedPost.publishedAt?.toDate() || relatedPost.createdAt?.toDate() || Date.now()).toLocaleDateString()}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    to="/blog"
                    className="inline-flex items-center space-x-2 text-black hover:text-gray-700 mt-6"
                  >
                    <span>View all articles</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}

              {/* Newsletter Signup */}
              <div className="bg-black text-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-medium mb-4">Subscribe to Our Newsletter</h3>
                <p className="text-gray-300 mb-4">Get the latest photography tips, tutorials, and inspiration delivered to your inbox.</p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    disabled={newsletterStatus === 'submitting'}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50"
                    required
                  />
                  <button
                    type="submit"
                    disabled={newsletterStatus === 'submitting'}
                    className="w-full px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
