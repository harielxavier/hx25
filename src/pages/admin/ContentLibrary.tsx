import React, { useState, useEffect } from 'react';
// REMOVED FIREBASE: import { collection, getDocs, query, where, orderBy // REMOVED FIREBASE
// REMOVED FIREBASE: import { db } from '../../firebase/config';
import AdminLayout from '../../components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { 
  Image, 
  FolderOpen, 
  BookOpen, 
  Camera, 
  Calendar, 
  Users, 
  FileText, 
  Search, 
  Filter, 
  Plus,
  ArrowUpRight,
  Edit,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import cloudinaryService from '../../services/cloudinaryService';

// Content types
type ContentType = 'portfolio' | 'gallery' | 'blog' | 'page' | 'contract';

interface ContentItem {
  id: string;
  title: string;
  description?: string;
  type: ContentType;
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'published' | 'draft' | 'archived';
  author?: string;
  slug?: string;
  itemCount?: number; // Number of images, posts, etc.
  category?: string;
}

const ContentLibrary: React.FC = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ContentType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Load all content
  useEffect(() => {
    const fetchAllContent = async () => {
      setLoading(true);
      try {
        const items: ContentItem[] = [];
        
        // 1. Portfolio Categories
        const portfolioQuery = query(collection(db, 'portfolioCategories'), orderBy('createdAt', 'desc'));
        const portfolioSnapshot = await getDocs(portfolioQuery);
        portfolioSnapshot.forEach(doc => {
          const data = doc.data();
          items.push({
            id: doc.id,
            title: data.name,
            description: data.description,
            type: 'portfolio',
            coverImage: data.coverImage,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            status: data.isPublished ? 'published' : 'draft',
            slug: data.slug,
            itemCount: data.imageCount || 0
          });
        });
        
        // 2. Client Galleries
        const galleriesQuery = query(collection(db, 'galleries'), orderBy('createdAt', 'desc'));
        const galleriesSnapshot = await getDocs(galleriesQuery);
        galleriesSnapshot.forEach(doc => {
          const data = doc.data();
          items.push({
            id: doc.id,
            title: data.title,
            description: data.description,
            type: 'gallery',
            coverImage: data.coverImage,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            status: data.isPublic ? 'published' : 'draft',
            slug: data.slug,
            itemCount: data.imageCount || 0
          });
        });
        
        // 3. Blog Posts
        const blogQuery = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'));
        const blogSnapshot = await getDocs(blogQuery);
        blogSnapshot.forEach(doc => {
          const data = doc.data();
          items.push({
            id: doc.id,
            title: data.title,
            description: data.excerpt || data.description,
            type: 'blog',
            coverImage: data.featuredImage,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            status: data.status || 'draft',
            author: data.author,
            slug: data.slug,
            category: data.category
          });
        });
        
        // 4. Pages
        const pagesQuery = query(collection(db, 'pages'), orderBy('createdAt', 'desc'));
        const pagesSnapshot = await getDocs(pagesQuery);
        pagesSnapshot.forEach(doc => {
          const data = doc.data();
          items.push({
            id: doc.id,
            title: data.title,
            description: data.description,
            type: 'page',
            coverImage: data.featuredImage,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            status: data.status || 'published',
            slug: data.slug
          });
        });
        
        // 5. Contracts & Forms
        const contractsQuery = query(collection(db, 'contracts'), orderBy('createdAt', 'desc'));
        const contractsSnapshot = await getDocs(contractsQuery);
        contractsSnapshot.forEach(doc => {
          const data = doc.data();
          items.push({
            id: doc.id,
            title: data.title,
            description: data.description,
            type: 'contract',
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            status: data.isActive ? 'published' : 'archived'
          });
        });
        
        setContentItems(items);
        setFilteredItems(items);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllContent();
  }, []);
  
  // Filter items when tab, search, or status changes
  useEffect(() => {
    let filtered = [...contentItems];
    
    // Filter by type (tab)
    if (activeTab !== 'all') {
      filtered = filtered.filter(item => item.type === activeTab);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.description?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query)
      );
    }
    
    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    setFilteredItems(filtered);
  }, [contentItems, activeTab, searchQuery, statusFilter]);
  
  // Get content type icon
  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'portfolio':
        return <FolderOpen className="w-5 h-5" />;
      case 'gallery':
        return <Camera className="w-5 h-5" />;
      case 'blog':
        return <BookOpen className="w-5 h-5" />;
      case 'page':
        return <FileText className="w-5 h-5" />;
      case 'contract':
        return <FileText className="w-5 h-5" />;
      default:
        return <Image className="w-5 h-5" />;
    }
  };
  
  // Get content type label
  const getContentTypeLabel = (type: ContentType) => {
    switch (type) {
      case 'portfolio':
        return 'Portfolio Category';
      case 'gallery':
        return 'Client Gallery';
      case 'blog':
        return 'Blog Post';
      case 'page':
        return 'Page';
      case 'contract':
        return 'Contract/Form';
      default:
        return type;
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Published</span>;
      case 'draft':
        return <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">Draft</span>;
      case 'archived':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Archived</span>;
      default:
        return null;
    }
  };
  
  // Get edit link based on content type
  const getEditLink = (item: ContentItem) => {
    switch (item.type) {
      case 'portfolio':
        return `/admin/portfolio-categories/edit/${item.id}`;
      case 'gallery':
        return `/admin/galleries/edit/${item.id}`;
      case 'blog':
        return `/admin/blog/edit/${item.id}`;
      case 'page':
        return `/admin/pages/edit/${item.id}`;
      case 'contract':
        return `/admin/contracts/edit/${item.id}`;
      default:
        return '#';
    }
  };
  
  // Get view link based on content type
  const getViewLink = (item: ContentItem) => {
    switch (item.type) {
      case 'portfolio':
        return `/portfolio/${item.slug || item.id}`;
      case 'gallery':
        return `/gallery/${item.slug || item.id}`;
      case 'blog':
        return `/blog/${item.slug || item.id}`;
      case 'page':
        return `/${item.slug}`;
      default:
        return '#';
    }
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Content Library</h1>
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter || ''}
                onChange={(e) => setStatusFilter(e.target.value || null)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="dropdown relative">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                <span>Create New</span>
              </button>
              {/* Dropdown menu would go here */}
            </div>
          </div>
        </div>
        
        {/* Search */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search content by title, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {/* Tabs for different content types */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as ContentType | 'all')} className="mb-6">
          <TabsList className="bg-white shadow rounded-lg p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              All Content
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              Galleries
            </TabsTrigger>
            <TabsTrigger value="blog" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              Blog
            </TabsTrigger>
            <TabsTrigger value="page" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              Pages
            </TabsTrigger>
            <TabsTrigger value="contract" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              Contracts
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Content display */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No content found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Content
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden">
                            {item.coverImage ? (
                              <img 
                                src={cloudinaryService.getCloudinaryUrl(
                                  item.coverImage,
                                  cloudinaryService.CloudinaryPreset.THUMBNAIL
                                )} 
                                alt={item.title} 
                                className="h-10 w-10 object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 bg-gray-200 flex items-center justify-center">
                                {getContentTypeIcon(item.type)}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.title}</div>
                            {item.description && (
                              <div className="text-sm text-gray-500 truncate max-w-md">
                                {item.description.substring(0, 60)}
                                {item.description.length > 60 ? '...' : ''}
                              </div>
                            )}
                            {item.category && (
                              <div className="text-xs text-gray-500 mt-1">
                                Category: {item.category}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getContentTypeIcon(item.type)}
                          <span className="ml-2 text-sm text-gray-500">
                            {getContentTypeLabel(item.type)}
                          </span>
                        </div>
                        {item.itemCount !== undefined && (
                          <div className="text-xs text-gray-400 mt-1">
                            {item.itemCount} items
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.updatedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          {item.type !== 'contract' && (
                            <Link 
                              to={getViewLink(item)}
                              target="_blank"
                              className="text-indigo-600 hover:text-indigo-900"
                              title="View"
                            >
                              <ArrowUpRight className="w-5 h-5" />
                            </Link>
                          )}
                          <Link 
                            to={getEditLink(item)}
                            className="text-amber-600 hover:text-amber-900"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
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
    </AdminLayout>
  );
};

export default ContentLibrary;
