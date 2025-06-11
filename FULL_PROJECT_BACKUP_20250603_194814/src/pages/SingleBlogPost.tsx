import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Calendar, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Copy, Youtube, Video } from 'lucide-react';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';
import SEO from '../components/SEO';
import { BlogPost, getPostBySlug, incrementPostViews } from '../services/blogService';

export default function SingleBlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      setLoading(true);
      try {
        const fetchedPost = await getPostBySlug(slug);
        
        if (fetchedPost) {
          setPost(fetchedPost);
          // Increment view count
          await incrementPostViews(fetchedPost.id);
        } else {
          setError('Post not found');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [slug]);

  // Reset copy success message after 2 seconds
  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title || 'Blog Post',
        text: post?.excerpt || '',
        url: window.location.href,
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // Toggle share options dropdown
      setShowShareOptions(!showShareOptions);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setShowShareOptions(false), 2000);
      })
      .catch(err => console.error('Error copying to clipboard:', err));
  };

  const handleSocialShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post?.title || 'Blog Post');
    const text = encodeURIComponent(post?.excerpt || '');
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      default:
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      setShowShareOptions(false);
    }
  };

  // Generate embed code for video preview
  const getEmbedCode = (url: string) => {
    if (!url) return '';
    
    // YouTube embed
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtube.com/watch?v=') 
        ? url.split('v=')[1]?.split('&')[0]
        : url.includes('youtu.be/') 
          ? url.split('youtu.be/')[1]?.split('?')[0] 
          : '';
      
      if (videoId) {
        return `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      }
    }
    
    // Vimeo embed
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('/')[0]?.split('?')[0];
      
      if (videoId) {
        return `<iframe src="https://player.vimeo.com/video/${videoId}" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
      }
    }
    
    return '';
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Navigation />
        <div className="flex flex-col justify-center items-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">{error || 'Post not found'}</h1>
          <Link to="/blog" className="text-black underline">
            Return to Blog
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title={`${post.title} | Hariel Xavier Photography`}
        description={post.excerpt}
        type="article"
        keywords={post.tags.join(', ')}
        ogImage={post.image}
      />
      
      <Navigation />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="container mx-auto px-4 mb-12">
          <Link to="/blog" className="inline-flex items-center text-gray-600 hover:text-black mb-8">
            <ArrowLeft size={18} className="mr-2" />
            Back to Blog
          </Link>
          
          <article className="max-w-4xl mx-auto" itemScope itemType="http://schema.org/BlogPosting">
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-serif mb-4" itemProp="headline">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  <time dateTime={post.date} itemProp="datePublished">
                    {post.date}
                  </time>
                </div>
                
                <div className="flex items-center">
                  <Clock size={16} className="mr-2" />
                  <span>{post.readTime}</span>
                </div>
                
                <div className="relative">
                  <button 
                    onClick={handleShare}
                    className="flex items-center hover:text-black transition-colors"
                    aria-label="Share this post"
                  >
                    <Share2 size={16} className="mr-2" />
                    Share
                  </button>
                  
                  {showShareOptions && (
                    <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 right-0">
                      <button 
                        onClick={() => handleSocialShare('facebook')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Facebook size={16} className="mr-2" />
                        Facebook
                      </button>
                      <button 
                        onClick={() => handleSocialShare('twitter')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Twitter size={16} className="mr-2" />
                        Twitter
                      </button>
                      <button 
                        onClick={() => handleSocialShare('linkedin')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Linkedin size={16} className="mr-2" />
                        LinkedIn
                      </button>
                      <button 
                        onClick={handleCopyLink}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Copy size={16} className="mr-2" />
                        {copySuccess ? 'Copied!' : 'Copy Link'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center mb-6">
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                  itemProp="image"
                />
                <div>
                  <p className="font-medium" itemProp="author" itemScope itemType="http://schema.org/Person">
                    <span itemProp="name">{post.author.name}</span>
                  </p>
                  <p className="text-sm text-gray-500">Photographer & Writer</p>
                </div>
              </div>
            </header>
            
            <figure className="mb-10 aspect-[16/9] relative overflow-hidden rounded-lg">
              <LazyLoadImage
                src={post.image}
                alt={post.title}
                effect="blur"
                className="w-full h-full object-cover"
                itemProp="image"
              />
            </figure>
            
            {/* Video Embed (if available) */}
            {post.videoEmbed && getEmbedCode(post.videoEmbed) && (
              <div className="mb-10">
                <div className="flex items-center gap-2 text-lg font-medium mb-4">
                  <Video className="w-5 h-5" />
                  <h2>Featured Video</h2>
                </div>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden" 
                     dangerouslySetInnerHTML={{ __html: getEmbedCode(post.videoEmbed) }}>
                </div>
              </div>
            )}
            
            <div 
              className="prose prose-lg max-w-none mb-12"
              itemProp="articleBody"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            <footer className="border-t border-gray-200 pt-8">
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map(tag => (
                  <Link 
                    key={tag}
                    to={`/blog?tag=${tag}`}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
              
              {/* Social Sharing Section */}
              {post.shareEnabled && (
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                  <h3 className="text-xl font-serif mb-4">Share this post</h3>
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => handleSocialShare('facebook')}
                      className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-md hover:bg-opacity-90 transition-colors"
                    >
                      <Facebook size={18} />
                      Facebook
                    </button>
                    <button 
                      onClick={() => handleSocialShare('twitter')}
                      className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-md hover:bg-opacity-90 transition-colors"
                    >
                      <Twitter size={18} />
                      Twitter
                    </button>
                    <button 
                      onClick={() => handleSocialShare('linkedin')}
                      className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-md hover:bg-opacity-90 transition-colors"
                    >
                      <Linkedin size={18} />
                      LinkedIn
                    </button>
                    <button 
                      onClick={handleCopyLink}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-opacity-90 transition-colors"
                    >
                      <Copy size={18} />
                      {copySuccess ? 'Copied!' : 'Copy Link'}
                    </button>
                  </div>
                </div>
              )}
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-serif mb-4">About the Author</h3>
                <div className="flex items-start">
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name}
                    className="w-16 h-16 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <p className="font-medium mb-2">{post.author.name}</p>
                    <p className="text-gray-600 mb-4">
                      {post.author.bio || "Hariel Xavier is a professional photographer specializing in weddings, portraits, and lifestyle photography. With a passion for capturing authentic moments, Hariel brings a unique perspective to every shoot."}
                    </p>
                    <Link 
                      to="/about"
                      className="text-black font-medium hover:underline"
                    >
                      Learn more
                    </Link>
                  </div>
                </div>
              </div>
            </footer>
          </article>
        </div>
        
        <Footer />
      </main>
    </>
  );
}
