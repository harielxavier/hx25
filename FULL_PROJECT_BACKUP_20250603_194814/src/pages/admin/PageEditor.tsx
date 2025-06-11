import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Layout, 
  Image as ImageIcon, 
  Type, 
  CheckCircle, 
  AlertCircle,
  Settings,
  Layers,
  Code,
  Search
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

// Rich text editor component (simplified for this example)
const RichTextEditor = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  return (
    <div className="border border-gray-300 rounded-md">
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex items-center space-x-1">
        <button className="p-1 hover:bg-gray-200 rounded">
          <Type className="h-4 w-4" />
        </button>
        <button className="p-1 hover:bg-gray-200 rounded">
          <ImageIcon className="h-4 w-4" />
        </button>
        <button className="p-1 hover:bg-gray-200 rounded">
          <Layout className="h-4 w-4" />
        </button>
        <button className="p-1 hover:bg-gray-200 rounded">
          <Code className="h-4 w-4" />
        </button>
      </div>
      <textarea
        className="w-full p-4 min-h-[300px] focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start writing your content here..."
      />
    </div>
  );
};

// SEO Panel component
const SEOPanel = ({ 
  title, 
  description, 
  keywords,
  onTitleChange,
  onDescriptionChange,
  onKeywordsChange
}: { 
  title: string; 
  description: string; 
  keywords: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onKeywordsChange: (value: string) => void;
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          SEO Title
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="SEO Title (appears in search results)"
        />
        <div className="mt-1 text-sm text-gray-500 flex items-center justify-between">
          <span>Recommended: 50-60 characters</span>
          <span className={`${title.length > 60 ? 'text-red-500' : 'text-gray-500'}`}>
            {title.length}/60
          </span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Meta Description
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Meta description (appears in search results)"
          rows={3}
        />
        <div className="mt-1 text-sm text-gray-500 flex items-center justify-between">
          <span>Recommended: 150-160 characters</span>
          <span className={`${description.length > 160 ? 'text-red-500' : 'text-gray-500'}`}>
            {description.length}/160
          </span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Keywords
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={keywords}
          onChange={(e) => onKeywordsChange(e.target.value)}
          placeholder="Comma-separated keywords"
        />
        <div className="mt-1 text-sm text-gray-500">
          Separate keywords with commas
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">SEO Preview</h3>
        <div className="border border-gray-200 rounded-md p-4 bg-white">
          <div className="text-blue-600 text-lg font-medium truncate">
            {title || 'Page Title'}
          </div>
          <div className="text-green-600 text-sm truncate">
            https://example.com/page-url
          </div>
          <div className="text-gray-600 text-sm mt-1 line-clamp-2">
            {description || 'Add a meta description to improve your search engine results.'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PageEditor() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageId = queryParams.get('id');
  
  // State for page data
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [featuredImage, setFeaturedImage] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState('content');

  // Load page data if editing an existing page
  useEffect(() => {
    if (pageId) {
      // This would normally be an API call to fetch the page data
      // For this example, we'll use sample data
      const samplePages = [
        {
          id: '1',
          title: 'Home',
          slug: '/',
          content: '<h1>Welcome to our website</h1><p>This is the home page content.</p>',
          status: 'published',
          featuredImage: '/images/sample-featured.jpg',
          seo: {
            title: 'Home | Photography Studio',
            description: 'Welcome to our photography studio website. We specialize in wedding, portrait, and commercial photography.',
            keywords: 'photography, studio, wedding, portrait, commercial'
          }
        },
        {
          id: '2',
          title: 'About',
          slug: '/about',
          content: '<h1>About Us</h1><p>Learn more about our studio and team.</p>',
          status: 'published',
          featuredImage: '/images/about-featured.jpg',
          seo: {
            title: 'About Us | Photography Studio',
            description: 'Learn about our photography studio, our team, and our approach to capturing your special moments.',
            keywords: 'about, team, photography, studio, approach'
          }
        }
      ];
      
      const page = samplePages.find(p => p.id === pageId);
      
      if (page) {
        setTitle(page.title);
        setSlug(page.slug);
        setContent(page.content);
        setStatus(page.status);
        setFeaturedImage(page.featuredImage);
        setSeoTitle(page.seo.title);
        setSeoDescription(page.seo.description);
        setSeoKeywords(page.seo.keywords);
      }
    }
  }, [pageId]);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  // Handle title change and auto-generate slug if empty
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    if (!slug || slug === '/' || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle));
    }
  };

  // Handle save
  const handleSave = (saveAndPublish = false) => {
    setIsSaving(true);
    
    // Validation
    if (!title) {
      setSaveMessage({ type: 'error', text: 'Title is required' });
      setIsSaving(false);
      return;
    }
    
    if (!slug) {
      setSaveMessage({ type: 'error', text: 'URL slug is required' });
      setIsSaving(false);
      return;
    }
    
    // This would normally be an API call to save the page
    setTimeout(() => {
      if (saveAndPublish) {
        setStatus('published');
      }
      
      setSaveMessage({ type: 'success', text: 'Page saved successfully' });
      setIsSaving(false);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    }, 1000);
  };

  return (
    <AdminLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/pages')}
                className="mr-4 text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {pageId ? 'Edit Page' : 'Create New Page'}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {pageId ? 'Update your page content and settings' : 'Create a new page for your website'}
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              {saveMessage && (
                <div 
                  className={`flex items-center px-3 py-2 rounded-md text-sm ${
                    saveMessage.type === 'success' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {saveMessage.type === 'success' ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mr-2" />
                  )}
                  {saveMessage.text}
                </div>
              )}
              <button
                onClick={() => window.open(`https://example.com${slug}`, '_blank')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={status !== 'published'}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </button>
              <div className="relative">
                <button
                  onClick={() => handleSave(false)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleSave(true)}
                  className="mt-2 md:mt-0 md:ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  disabled={isSaving}
                >
                  {status === 'published' ? 'Update' : 'Publish'}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {/* Page Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeTab === 'content'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Layout className="inline-block h-4 w-4 mr-2" />
                  Content
                </button>
                <button
                  onClick={() => setActiveTab('seo')}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeTab === 'seo'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Search className="inline-block h-4 w-4 mr-2" />
                  SEO
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeTab === 'settings'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Settings className="inline-block h-4 w-4 mr-2" />
                  Settings
                </button>
                <button
                  onClick={() => setActiveTab('advanced')}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeTab === 'advanced'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Layers className="inline-block h-4 w-4 mr-2" />
                  Advanced
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Content Tab */}
              {activeTab === 'content' && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Page Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={title}
                      onChange={handleTitleChange}
                      placeholder="Enter page title"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                      URL Slug
                    </label>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1">https://example.com/</span>
                      <input
                        type="text"
                        id="slug"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="page-url"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                      Page Content
                    </label>
                    <RichTextEditor
                      value={content}
                      onChange={setContent}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-1">
                      Featured Image
                    </label>
                    <div className="mt-1 flex items-center">
                      {featuredImage ? (
                        <div className="relative">
                          <img
                            src={featuredImage}
                            alt="Featured"
                            className="h-32 w-48 object-cover rounded-md"
                          />
                          <button
                            onClick={() => setFeaturedImage('')}
                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => setFeaturedImage('/images/sample-featured.jpg')}
                        >
                          <ImageIcon className="mr-2 h-4 w-4" />
                          Select Image
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* SEO Tab */}
              {activeTab === 'seo' && (
                <SEOPanel
                  title={seoTitle}
                  description={seoDescription}
                  keywords={seoKeywords}
                  onTitleChange={setSeoTitle}
                  onDescriptionChange={setSeoDescription}
                  onKeywordsChange={setSeoKeywords}
                />
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Page Status
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                    <p className="mt-1 text-sm text-gray-500">
                      Draft pages are not visible to the public
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Visibility
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="visibility-public"
                          name="visibility"
                          type="radio"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          defaultChecked
                        />
                        <label htmlFor="visibility-public" className="ml-3 block text-sm font-medium text-gray-700">
                          Public
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="visibility-password"
                          name="visibility"
                          type="radio"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="visibility-password" className="ml-3 block text-sm font-medium text-gray-700">
                          Password Protected
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="visibility-private"
                          name="visibility"
                          type="radio"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="visibility-private" className="ml-3 block text-sm font-medium text-gray-700">
                          Private
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parent Page
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      defaultValue=""
                    >
                      <option value="">No Parent (Top Level)</option>
                      <option value="1">Home</option>
                      <option value="2">About</option>
                      <option value="3">Services</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Menu Settings
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="menu-main"
                          name="menu-main"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="menu-main" className="ml-3 block text-sm font-medium text-gray-700">
                          Show in Main Menu
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="menu-footer"
                          name="menu-footer"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="menu-footer" className="ml-3 block text-sm font-medium text-gray-700">
                          Show in Footer Menu
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Advanced Tab */}
              {activeTab === 'advanced' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Custom CSS
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                      rows={6}
                      placeholder="Add custom CSS for this page"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Custom JavaScript
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                      rows={6}
                      placeholder="Add custom JavaScript for this page"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Headers
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                      rows={4}
                      placeholder="Add custom meta tags, link tags, etc."
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      These will be added to the &lt;head&gt; section of the page
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
