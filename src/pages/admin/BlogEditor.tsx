import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, X, Eye, Image as ImageIcon, Link as LinkIcon, Trash2, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

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

export default function BlogEditor() {
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

  const handleSave = async (status: 'draft' | 'published') => {
    if (!post.title || !post.content) {
      toast.error('Title and content are required');
      return;
    }

    setSaving(true);
    try {
      const postData = {
        ...post,
        status,
        published_at: status === 'published' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      };

      let error;
      if (id && id !== 'new') {
        const result = await supabase
          .from('posts')
          .update(postData)
          .eq('id', id);
        error = result.error;
      } else {
        const result = await supabase
          .from('posts')
          .insert([postData])
          .select()
          .single();
        error = result.error;
        if (result.data) {
          navigate(`/admin/blog/edit/${result.data.id}`, { replace: true });
        }
      }

      if (error) throw error;
      toast.success(`Post ${status === 'published' ? 'published' : 'saved'} successfully!`);
    } catch (error: any) {
      toast.error('Failed to save: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Post deleted successfully');
      navigate('/admin/blog');
    } catch (error: any) {
      toast.error('Failed to delete: ' + error.message);
    }
  };

  const addTag = () => {
    if (newTag && !post.tags.includes(newTag)) {
      setPost(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const insertFormatting = (type: string) => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = post.content.substring(start, end);
    let replacement = '';

    switch (type) {
      case 'h2':
        replacement = `<h2>${selectedText || 'Heading'}</h2>`;
        break;
      case 'h3':
        replacement = `<h3>${selectedText || 'Subheading'}</h3>`;
        break;
      case 'p':
        replacement = `<p>${selectedText || 'Paragraph'}</p>`;
        break;
      case 'bold':
        replacement = `<strong>${selectedText || 'bold text'}</strong>`;
        break;
      case 'italic':
        replacement = `<em>${selectedText || 'italic text'}</em>`;
        break;
      case 'link':
        const url = prompt('Enter URL:');
        replacement = `<a href="${url || '#'}">${selectedText || 'link text'}</a>`;
        break;
      case 'ul':
        replacement = `<ul>\n  <li>${selectedText || 'List item'}</li>\n</ul>`;
        break;
      case 'ol':
        replacement = `<ol>\n  <li>${selectedText || 'List item'}</li>\n</ol>`;
        break;
      case 'image':
        const imgUrl = prompt('Enter image URL:');
        replacement = `<img src="${imgUrl || ''}" alt="${selectedText || 'Image description'}" />`;
        break;
    }

    const newContent = post.content.substring(0, start) + replacement + post.content.substring(end);
    setPost(prev => ({ ...prev, content: newContent }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/blog')}
                className="text-gray-600 hover:text-black"
              >
                <X className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold">
                {id === 'new' ? 'New Post' : 'Edit Post'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </button>
              
              <button
                onClick={() => handleSave('draft')}
                disabled={saving}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Save Draft
              </button>
              
              <button
                onClick={() => handleSave('published')}
                disabled={saving}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Publishing...' : 'Publish'}</span>
              </button>
              
              {id && id !== 'new' && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {showPreview ? (
          /* Preview Mode */
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
            {post.featured_image && (
              <img src={post.featured_image} alt={post.title} className="w-full rounded-lg mb-6" />
            )}
            <div 
              className="blog-content prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        ) : (
          /* Edit Mode */
          <div className="grid grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="col-span-2 space-y-6">
              {/* Title */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={post.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full text-3xl font-bold border-none focus:ring-0 focus:outline-none"
                  placeholder="Enter post title..."
                />
              </div>

              {/* Slug */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <label className="block text-sm font-medium mb-2">URL Slug</label>
                <div className="flex items-center space-x-2 text-gray-600">
                  <span>harielxavier.co/blog/</span>
                  <input
                    type="text"
                    value={post.slug}
                    onChange={(e) => setPost(prev => ({ ...prev, slug: e.target.value }))}
                    className="flex-1 border-b border-gray-300 focus:border-black focus:ring-0 focus:outline-none"
                    placeholder="post-url-slug"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <label className="block text-sm font-medium mb-2">Excerpt</label>
                <textarea
                  value={post.excerpt}
                  onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                  className="w-full h-24 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Brief description for SEO and preview..."
                />
              </div>

              {/* Content Editor */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <label className="block text-sm font-medium mb-2">Content</label>
                
                {/* Formatting Toolbar */}
                <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                  <button onClick={() => insertFormatting('h2')} className="px-3 py-1 bg-white border rounded hover:bg-gray-100" title="Heading 2">
                    H2
                  </button>
                  <button onClick={() => insertFormatting('h3')} className="px-3 py-1 bg-white border rounded hover:bg-gray-100" title="Heading 3">
                    H3
                  </button>
                  <button onClick={() => insertFormatting('p')} className="px-3 py-1 bg-white border rounded hover:bg-gray-100" title="Paragraph">
                    P
                  </button>
                  <button onClick={() => insertFormatting('bold')} className="px-3 py-1 bg-white border rounded hover:bg-gray-100 font-bold" title="Bold">
                    B
                  </button>
                  <button onClick={() => insertFormatting('italic')} className="px-3 py-1 bg-white border rounded hover:bg-gray-100 italic" title="Italic">
                    I
                  </button>
                  <button onClick={() => insertFormatting('link')} className="px-3 py-1 bg-white border rounded hover:bg-gray-100" title="Link">
                    <LinkIcon className="h-4 w-4" />
                  </button>
                  <button onClick={() => insertFormatting('ul')} className="px-3 py-1 bg-white border rounded hover:bg-gray-100" title="Bullet List">
                    UL
                  </button>
                  <button onClick={() => insertFormatting('ol')} className="px-3 py-1 bg-white border rounded hover:bg-gray-100" title="Numbered List">
                    OL
                  </button>
                  <button onClick={() => insertFormatting('image')} className="px-3 py-1 bg-white border rounded hover:bg-gray-100" title="Image">
                    <ImageIcon className="h-4 w-4" />
                  </button>
                </div>

                <textarea
                  id="content-editor"
                  value={post.content}
                  onChange={(e) => setPost(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full h-96 border border-gray-300 rounded-lg p-4 font-mono text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Write your content in HTML..."
                />
                <p className="text-sm text-gray-500 mt-2">
                  Use HTML tags for formatting. The toolbar above helps insert common tags.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-medium mb-4">Status</h3>
                <select
                  value={post.status}
                  onChange={(e) => setPost(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                  className="w-full border border-gray-300 rounded-lg p-2"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              {/* Featured Image */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-medium mb-4">Featured Image</h3>
                <input
                  type="text"
                  value={post.featured_image}
                  onChange={(e) => setPost(prev => ({ ...prev, featured_image: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-2 mb-2"
                  placeholder="Image URL..."
                />
                {post.featured_image && (
                  <img src={post.featured_image} alt="Preview" className="w-full rounded-lg mt-2" />
                )}
              </div>

              {/* Category */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-medium mb-4">Category</h3>
                <select
                  value={post.category}
                  onChange={(e) => setPost(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-2"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-medium mb-4">Tags</h3>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 border border-gray-300 rounded-lg p-2"
                    placeholder="Add tag..."
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-gray-500 hover:text-black"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Video Embed */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-medium mb-4">Video Embed (Optional)</h3>
                <input
                  type="text"
                  value={post.video_embed || ''}
                  onChange={(e) => setPost(prev => ({ ...prev, video_embed: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="YouTube/Vimeo URL..."
                />
              </div>

              {/* Options */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-medium mb-4">Options</h3>
                <label className="flex items-center space-x-2 mb-3">
                  <input
                    type="checkbox"
                    checked={post.featured}
                    onChange={(e) => setPost(prev => ({ ...prev, featured: e.target.checked }))}
                    className="rounded"
                  />
                  <span>Featured Post</span>
                </label>
                <label className="flex items-center space-x-2 mb-3">
                  <input
                    type="checkbox"
                    checked={post.share_enabled}
                    onChange={(e) => setPost(prev => ({ ...prev, share_enabled: e.target.checked }))}
                    className="rounded"
                  />
                  <span>Enable Sharing</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={post.comments_enabled}
                    onChange={(e) => setPost(prev => ({ ...prev, comments_enabled: e.target.checked }))}
                    className="rounded"
                  />
                  <span>Enable Comments</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
