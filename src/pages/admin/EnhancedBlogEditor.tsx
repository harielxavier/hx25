import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, X, Eye, Image as ImageIcon, Video, Trash2, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../../styles/quill-custom.css';
import ImageUploadButton from '../../components/ImageUploadButton';

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  featured: boolean;
  author: {
    name: string;
    avatar: string;
    bio?: string;
  };
  video_embed?: string;
  share_enabled: boolean;
  comments_enabled: boolean;
}

const CATEGORIES = [
  'Wedding Venues',
  'Wedding Planning',
  'Engagement Photography',
  'Photography Tips',
  'Real Weddings',
  'Behind the Scenes',
  'Wedding Day Tips',
  'Pricing & Packages',
  'Style Guide',
  'Uncategorized'
];

export default function EnhancedBlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [newTag, setNewTag] = useState('');
  
  const [post, setPost] = useState<BlogPost>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category: 'Uncategorized',
    tags: [],
    status: 'draft',
    featured: false,
    author: {
      name: 'Hariel Xavier',
      avatar: '/images/hariel-xavier.jpg',
      bio: 'Award-winning wedding photographer with 10+ years capturing love stories in New Jersey'
    },
    video_embed: '',
    share_enabled: true,
    comments_enabled: true
  });

  // Quill editor modules configuration
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
    clipboard: {
      matchVisual: false
    }
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'align',
    'blockquote', 'code-block',
    'color', 'background'
  ];

  useEffect(() => {
    if (id && id !== 'new') {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) setPost(data);
    } catch (error: any) {
      toast.error('Failed to load post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setPost(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleSave = async (statusOverride?: 'draft' | 'published') => {
    if (!post.title || !post.content) {
      toast.error('Title and content are required');
      return;
    }

    setSaving(true);
    const finalStatus = statusOverride || post.status;

    try {
      const postData = {
        ...post,
        status: finalStatus,
        published_at: finalStatus === 'published' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      };

      if (id && id !== 'new') {
        // Update existing post
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', id);

        if (error) throw error;
        toast.success('Post updated successfully!');
      } else {
        // Create new post
        const { data, error } = await supabase
          .from('posts')
          .insert([{ ...postData, created_at: new Date().toISOString() }])
          .select()
          .single();

        if (error) throw error;
        toast.success('Post created successfully!');
        navigate(`/admin/blog/edit/${data.id}`);
      }
    } catch (error: any) {
      toast.error('Failed to save post: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || id === 'new') return;
    
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Post deleted successfully!');
      navigate('/admin/blog');
    } catch (error: any) {
      toast.error('Failed to delete post: ' + error.message);
    }
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (post.tags.includes(newTag.trim())) {
      toast.error('Tag already exists');
      return;
    }

    setPost(prev => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()]
    }));
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleFeaturedImageUpload = (url: string) => {
    setPost(prev => ({ ...prev, featured_image: url }));
    toast.success('Featured image set!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/blog')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold">
                {id === 'new' ? 'Create New Post' : 'Edit Post'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Eye className="w-5 h-5" />
                {showPreview ? 'Edit' : 'Preview'}
              </button>

              <button
                onClick={() => handleSave('draft')}
                disabled={saving}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                Save Draft
              </button>

              <button
                onClick={() => handleSave('published')}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Publishing...' : 'Publish'}
              </button>

              {id && id !== 'new' && (
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={post.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-3 text-2xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your post title..."
              />
              <p className="mt-2 text-sm text-gray-500">
                Slug: <span className="font-mono">{post.slug || 'auto-generated'}</span>
              </p>
            </div>

            {/* Excerpt */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                value={post.excerpt}
                onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Brief summary of your post (appears in blog listings)..."
              />
            </div>

            {/* Rich Text Editor */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Content * (Use the toolbar to format your text - no HTML knowledge needed!)
              </label>
              <div className="prose-editor">
                <ReactQuill
                  theme="snow"
                  value={post.content}
                  onChange={(content) => setPost(prev => ({ ...prev, content }))}
                  modules={modules}
                  formats={formats}
                  placeholder="Start writing your amazing blog post..."
                  className="bg-white"
                  style={{ minHeight: '400px' }}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <ImageIcon className="w-4 h-4 inline mr-2" />
                Featured Image
              </label>
              
              {post.featured_image && (
                <div className="mb-4">
                  <img
                    src={post.featured_image}
                    alt="Featured"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              <ImageUploadButton
                onImageUploaded={handleFeaturedImageUpload}
                label={post.featured_image ? "Change Image" : "Upload Image"}
                className="w-full justify-center"
              />

              <input
                type="url"
                value={post.featured_image}
                onChange={(e) => setPost(prev => ({ ...prev, featured_image: e.target.value }))}
                className="w-full px-3 py-2 mt-3 text-sm border border-gray-300 rounded-lg"
                placeholder="Or paste image URL..."
              />
            </div>

            {/* Category */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Category
              </label>
              <select
                value={post.category}
                onChange={(e) => setPost(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tags
              </label>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  placeholder="Add tag..."
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-blue-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Video Embed */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Video className="w-4 h-4 inline mr-2" />
                Video Embed
              </label>
              <input
                type="url"
                value={post.video_embed || ''}
                onChange={(e) => setPost(prev => ({ ...prev, video_embed: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                placeholder="YouTube or Vimeo URL..."
              />
            </div>

            {/* Post Settings */}
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
              <h3 className="font-medium text-gray-900">Post Settings</h3>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={post.featured}
                  onChange={(e) => setPost(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Featured Post</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={post.share_enabled}
                  onChange={(e) => setPost(prev => ({ ...prev, share_enabled: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Enable Sharing</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={post.comments_enabled}
                  onChange={(e) => setPost(prev => ({ ...prev, comments_enabled: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Enable Comments</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

