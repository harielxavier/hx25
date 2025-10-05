import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Image as ImageIcon, Save, ArrowLeft, Globe, X, Tag, Upload, Video, Share, Link } from 'lucide-react';
import { db, storage } from '../../lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface Author {
  name: string;
  avatar: string;
  bio?: string;
}

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  createdAt: any;
  updatedAt: any;
  publishedAt: any;
  featured: boolean;
  author: Author;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
  views: number;
  readTime?: string;
  videoEmbed: string;
  shareEnabled: boolean;
  commentsEnabled: boolean;
}

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [post, setPost] = useState<BlogPost>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    category: 'Photography Tips',
    tags: [],
    status: 'draft',
    createdAt: null,
    updatedAt: null,
    publishedAt: null,
    featured: false,
    author: {
      name: "Hariel Xavier",
      avatar: "/images/author.jpg",
      bio: "Professional photographer with over 10 years of experience capturing life's precious moments."
    },
    seo: {
      title: '',
      description: '',
      keywords: [],
      ogImage: ''
    },
    views: 0,
    readTime: '5 min read',
    videoEmbed: '',
    shareEnabled: true,
    commentsEnabled: true
  });

  // Tag input state
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (id) {
      loadPost(id);
    }
  }, [id]);

  async function loadPost(postId: string) {
    try {
      setLoading(true);
      setError(null);
      const postRef = doc(db, 'posts', postId);
      const postSnap = await getDoc(postRef);
      
      if (postSnap.exists()) {
        setPost({
          id: postId,
          ...postSnap.data()
        } as BlogPost);
      } else {
        setError('Post not found');
        navigate('/admin/blog');
      }
    } catch (error) {
      console.error('Error loading post:', error);
      setError('Failed to load post. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleAddTag() {
    if (tagInput.trim() && !post.tags.includes(tagInput.trim().toLowerCase())) {
      setPost({
        ...post,
        tags: [...post.tags, tagInput.trim().toLowerCase()]
      });
      setTagInput('');
    }
  }

  function handleRemoveTag(tag: string) {
    setPost({
      ...post,
      tags: post.tags.filter(t => t !== tag)
    });
  }

  function calculateReadTime(content: string) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  }

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    try {
      setUploadingImage(true);
      setError(null);
      
      // Create a reference to the storage location
      const fileExtension = file.name.split('.').pop();
      const fileName = `blog-${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, `blog-images/${fileName}`);
      
      // Upload the file
      await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update the post state with the new image URL
      setPost({
        ...post,
        image: downloadURL
      });
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Insert video embed code
  const handleVideoEmbedChange = (url: string) => {
    setPost({
      ...post,
      videoEmbed: url
    });
  };

  // Generate embed code for preview
  const getEmbedCode = (url: string) => {
    if (!url) return '';
    
    // YouTube embed
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtube.com/watch?v=') 
        ? url.split('v=')[1].split('&')[0]
        : url.includes('youtu.be/') 
          ? url.split('youtu.be/')[1].split('?')[0] 
          : '';
      
      if (videoId) {
        return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      }
    }
    
    // Vimeo embed
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('/')[0]?.split('?')[0];
      
      if (videoId) {
        return `<iframe src="https://player.vimeo.com/video/${videoId}" width="560" height="315" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
      }
    }
    
    return '';
  };

  async function handleSave() {
    try {
      setSaving(true);
      setError(null);
      
      // Validate required fields
      if (!post.title) {
        setError('Title is required');
        return;
      }
      
      // Generate slug if empty
      let slug = post.slug;
      if (!slug) {
        slug = post.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      
      // Calculate read time
      const readTime = calculateReadTime(post.content);
      
      // Prepare SEO data if empty
      const seo = post.seo || {};
      if (!seo.title) seo.title = post.title;
      if (!seo.description) seo.description = post.excerpt;
      if (!seo.keywords || seo.keywords.length === 0) seo.keywords = post.tags;
      if (!seo.ogImage) seo.ogImage = post.image;
      
      // Prepare timestamps
      const now = Timestamp.now();
      const createdAt = post.createdAt || now;
      let publishedAt = post.publishedAt;
      
      // Set published_at if status is published and it wasn't before
      if (post.status === 'published' && !publishedAt) {
        publishedAt = now;
      }
      
      // Prepare post data
      const postData = {
        ...post,
        slug,
        readTime,
        seo,
        createdAt,
        updatedAt: now,
        publishedAt
      };
      
      // Save to Firestore
      const postRef = doc(db, 'posts', post.id || slug);
      await setDoc(postRef, postData, { merge: true });
      
      // Navigate back to blog list
      navigate('/admin/blog');
    } catch (error) {
      console.error('Error saving post:', error);
      setError('Failed to save post. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/blog')}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold">
              {id ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPost({ ...post, status: post.status === 'draft' ? 'published' : 'draft' })}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                post.status === 'published' 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-gray-50 text-gray-700 border-gray-200'
              }`}
            >
              <Globe size={18} />
              {post.status === 'published' ? 'Published' : 'Draft'}
            </button>
            
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Post'}
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <input
                type="text"
                placeholder="Post Title"
                value={post.title}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
                className="w-full bg-transparent text-2xl font-light text-gray-900 border-0 border-b border-gray-200 pb-4 mb-6 focus:ring-0 focus:border-gray-900"
              />
              
              <textarea
                placeholder="Post excerpt..."
                value={post.excerpt}
                onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
                className="w-full bg-transparent text-gray-900 border border-gray-200 rounded-lg p-4 mb-6 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                rows={3}
              />

              <textarea
                placeholder="Write your post content here..."
                value={post.content}
                onChange={(e) => setPost({ ...post, content: e.target.value })}
                className="w-full bg-transparent text-gray-900 border border-gray-200 rounded-lg p-4 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                rows={20}
              />
            </div>

            {/* Video Embed Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Video className="w-5 h-5" />
                Video Embed
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">YouTube or Vimeo URL</label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={post.videoEmbed}
                    onChange={(e) => handleVideoEmbedChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Paste a YouTube or Vimeo URL to embed a video in your post
                  </p>
                </div>
                
                {post.videoEmbed && getEmbedCode(post.videoEmbed) && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Video Preview</label>
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden" 
                         dangerouslySetInnerHTML={{ __html: getEmbedCode(post.videoEmbed) }}>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                SEO Settings
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                  <input
                    type="text"
                    placeholder="SEO Title (defaults to post title)"
                    value={post.seo?.title || ''}
                    onChange={(e) => setPost({ 
                      ...post, 
                      seo: { ...post.seo, title: e.target.value } 
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                  <textarea
                    placeholder="Meta description (defaults to post excerpt)"
                    value={post.seo?.description || ''}
                    onChange={(e) => setPost({ 
                      ...post, 
                      seo: { ...post.seo, description: e.target.value } 
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Post Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Post Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                  <input
                    type="text"
                    placeholder="post-url-slug"
                    value={post.slug}
                    onChange={(e) => setPost({ ...post, slug: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="Category"
                    value={post.category}
                    onChange={(e) => setPost({ ...post, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {uploadingImage ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Image
                        </>
                      )}
                    </button>
                    <span className="ml-2 text-xs text-gray-500">
                      Recommended size: 1200x630px (max 5MB)
                    </span>
                  </div>
                  
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Or use image URL</label>
                    <input
                      type="text"
                      placeholder="https://example.com/image.jpg"
                      value={post.image}
                      onChange={(e) => setPost({ ...post, image: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  {post.image && (
                    <div className="mt-2 relative aspect-video rounded-lg overflow-hidden">
                      <img 
                        src={post.image} 
                        alt="Featured" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://via.placeholder.com/800x450?text=Image+Not+Found";
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={post.featured}
                      onChange={(e) => setPost({ ...post, featured: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured Post</span>
                  </label>
                </div>
                
                <div className="flex items-center space-x-2 mb-4">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={post.shareEnabled}
                        onChange={() => setPost({...post, shareEnabled: !post.shareEnabled})}
                      />
                      <div className={`block w-10 h-6 rounded-full ${post.shareEnabled ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${post.shareEnabled ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                    <div className="ml-3 text-gray-700 font-medium">
                      Enable Social Sharing
                    </div>
                  </label>
                </div>
                
                <div className="flex items-center space-x-2 mb-6">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={post.commentsEnabled}
                        onChange={() => setPost({...post, commentsEnabled: !post.commentsEnabled})}
                      />
                      <div className={`block w-10 h-6 rounded-full ${post.commentsEnabled ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${post.commentsEnabled ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                    <div className="ml-3 text-gray-700 font-medium">
                      Enable Comments
                    </div>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Tags */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Tags
              </h2>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-400 hover:text-gray-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {post.tags.length === 0 && (
                    <span className="text-sm text-gray-400">No tags added yet</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Social Sharing Preview */}
            {post.shareEnabled && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Share className="w-5 h-5" />
                  Social Sharing
                </h2>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="aspect-video bg-gray-100">
                      {post.image ? (
                        <img 
                          src={post.image} 
                          alt="Social preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/800x450?text=Image+Not+Found";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ImageIcon className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 truncate">
                        {post.seo?.title || post.title || 'Post Title'}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {post.seo?.description || post.excerpt || 'Post description will appear here'}
                      </p>
                      <div className="flex items-center mt-2 text-xs text-gray-400">
                        <Link className="w-3 h-3 mr-1" />
                        yourdomain.com/blog/{post.slug || 'post-slug'}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    This is how your post will appear when shared on social media platforms
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}