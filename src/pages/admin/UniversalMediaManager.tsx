import React, { useState, useEffect } from 'react';
// REMOVED FIREBASE: import { collection, getDocs, query, where // REMOVED FIREBASE
// REMOVED FIREBASE: import { db } from '../../firebase/config';
import AdminLayout from '../../components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { 
  Image, 
  FolderOpen, 
  Filter, 
  Upload, 
  Tag, 
  Search, 
  Grid, 
  List, 
  SlidersHorizontal,
  Trash2,
  Download,
  Copy,
  Edit,
  Star
} from 'lucide-react';
import cloudinaryService from '../../services/cloudinaryService';

// Types for our media items
interface MediaItem {
  id: string;
  filename: string;
  url: string;
  thumbnailUrl?: string;
  type: 'image' | 'video';
  size: number;
  width?: number;
  height?: number;
  createdAt: Date;
  tags: string[];
  source: 'portfolio' | 'gallery' | 'blog' | 'marketing';
  category?: string;
  categoryId?: string;
  featured?: boolean;
}

const UniversalMediaManager: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Load all media from different sources
  useEffect(() => {
    const fetchAllMedia = async () => {
      setLoading(true);
      try {
        // Collect media from different sources
        const items: MediaItem[] = [];
        const tags = new Set<string>();
        
        // 1. Portfolio images
        const portfolioImagesQuery = query(collection(db, 'portfolioImages'));
        const portfolioSnapshot = await getDocs(portfolioImagesQuery);
        portfolioSnapshot.forEach(doc => {
          const data = doc.data();
          const item: MediaItem = {
            id: doc.id,
            filename: data.filename,
            url: data.url,
            thumbnailUrl: data.thumbnailUrl,
            type: 'image',
            size: data.size || 0,
            width: data.width,
            height: data.height,
            createdAt: data.createdAt?.toDate() || new Date(),
            tags: data.tags || [],
            source: 'portfolio',
            category: data.categoryName,
            categoryId: data.categoryId,
            featured: data.featured || false
          };
          
          items.push(item);
          
          // Collect tags
          if (data.tags && Array.isArray(data.tags)) {
            data.tags.forEach((tag: string) => tags.add(tag));
          }
        });
        
        // 2. Gallery images
        const galleriesQuery = query(collection(db, 'galleries'));
        const galleriesSnapshot = await getDocs(galleriesQuery);
        
        for (const galleryDoc of galleriesSnapshot.docs) {
          const galleryData = galleryDoc.data();
          const imagesQuery = query(collection(db, 'galleries', galleryDoc.id, 'media'));
          const imagesSnapshot = await getDocs(imagesQuery);
          
          imagesSnapshot.forEach(doc => {
            const data = doc.data();
            const item: MediaItem = {
              id: doc.id,
              filename: data.filename,
              url: data.url,
              thumbnailUrl: data.thumbnailUrl,
              type: data.type || 'image',
              size: data.size || 0,
              width: data.width,
              height: data.height,
              createdAt: data.createdAt?.toDate() || new Date(),
              tags: data.tags || [],
              source: 'gallery',
              category: galleryData.title,
              categoryId: galleryDoc.id
            };
            
            items.push(item);
            
            // Collect tags
            if (data.tags && Array.isArray(data.tags)) {
              data.tags.forEach((tag: string) => tags.add(tag));
            }
          });
        }
        
        // 3. Blog images
        const blogImagesQuery = query(collection(db, 'blogImages'));
        const blogSnapshot = await getDocs(blogImagesQuery);
        blogSnapshot.forEach(doc => {
          const data = doc.data();
          const item: MediaItem = {
            id: doc.id,
            filename: data.filename,
            url: data.url,
            thumbnailUrl: data.thumbnailUrl,
            type: 'image',
            size: data.size || 0,
            width: data.width,
            height: data.height,
            createdAt: data.createdAt?.toDate() || new Date(),
            tags: data.tags || [],
            source: 'blog',
            category: data.postTitle,
            categoryId: data.postId
          };
          
          items.push(item);
          
          // Collect tags
          if (data.tags && Array.isArray(data.tags)) {
            data.tags.forEach((tag: string) => tags.add(tag));
          }
        });
        
        // Set media items and tags
        setMediaItems(items);
        setFilteredItems(items);
        setAllTags(Array.from(tags));
      } catch (error) {
        console.error('Error fetching media:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllMedia();
  }, []);
  
  // Filter items when tab, search, or tags change
  useEffect(() => {
    let filtered = [...mediaItems];
    
    // Filter by source (tab)
    if (activeTab !== 'all') {
      filtered = filtered.filter(item => item.source === activeTab);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.filename.toLowerCase().includes(query) || 
        item.category?.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(item => 
        selectedTags.every(tag => item.tags.includes(tag))
      );
    }
    
    setFilteredItems(filtered);
  }, [mediaItems, activeTab, searchQuery, selectedTags]);
  
  // Toggle selection of an item
  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };
  
  // Toggle tag selection for filtering
  const toggleTagSelection = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  // Clear all selections
  const clearSelections = () => {
    setSelectedItems([]);
  };
  
  // Select all visible items
  const selectAllVisible = () => {
    setSelectedItems(filteredItems.map(item => item.id));
  };
  
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Universal Media Manager</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Search and filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by filename, category, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={selectAllVisible}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Select All
              </button>
              <button 
                onClick={clearSelections}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                disabled={selectedItems.length === 0}
              >
                Clear
              </button>
              <button className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                <Upload className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Tags filter */}
          {allTags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTagSelection(tag)}
                  className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Tabs for different sources */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-white shadow rounded-lg p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              All Media
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              Client Galleries
            </TabsTrigger>
            <TabsTrigger value="blog" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              Blog
            </TabsTrigger>
            <TabsTrigger value="marketing" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              Marketing
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Media display */}
        <div className="bg-white rounded-lg shadow p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No media found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredItems.map(item => (
                <div 
                  key={item.id}
                  onClick={() => toggleItemSelection(item.id)}
                  className={`relative rounded-lg overflow-hidden border ${
                    selectedItems.includes(item.id) 
                      ? 'border-blue-500 ring-2 ring-blue-300' 
                      : 'border-gray-200'
                  } hover:shadow-md transition-all cursor-pointer group`}
                >
                  <div className="aspect-square bg-gray-100 relative">
                    <img 
                      src={item.thumbnailUrl || item.url}
                      alt={item.filename}
                      className="w-full h-full object-cover"
                    />
                    {item.featured && (
                      <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-800 p-1 rounded-full">
                        <Star className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <div className="p-2 bg-white">
                    <p className="text-xs font-medium truncate">{item.filename}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">{formatFileSize(item.size)}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                        {item.source}
                      </span>
                    </div>
                  </div>
                  
                  {/* Quick actions overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 bg-white rounded-full text-gray-700 hover:text-blue-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 bg-white rounded-full text-gray-700 hover:text-blue-600">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 bg-white rounded-full text-gray-700 hover:text-blue-600">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 bg-white rounded-full text-gray-700 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Media
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map(item => (
                    <tr 
                      key={item.id}
                      onClick={() => toggleItemSelection(item.id)}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedItems.includes(item.id) ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden">
                            <img 
                              src={item.thumbnailUrl || item.url}
                              alt={item.filename}
                              className="h-10 w-10 object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 flex items-center">
                              {item.filename}
                              {item.featured && (
                                <Star className="w-3 h-3 ml-1 text-yellow-500" />
                              )}
                            </div>
                            <div className="text-sm text-gray-500 flex flex-wrap gap-1 mt-1">
                              {item.tags.map(tag => (
                                <span key={tag} className="px-1.5 py-0.5 bg-gray-100 rounded-full text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                          {item.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.category || 'Uncategorized'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatFileSize(item.size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.createdAt.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="w-4 h-4" />
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
        
        {/* Selected items actions */}
        {selectedItems.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 flex justify-between items-center">
            <div className="text-sm font-medium">
              {selectedItems.length} items selected
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                <Copy className="w-4 h-4 mr-1 inline-block" /> Copy to...
              </button>
              <button className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200">
                <Download className="w-4 h-4 mr-1 inline-block" /> Download
              </button>
              <button className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200">
                <Trash2 className="w-4 h-4 mr-1 inline-block" /> Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UniversalMediaManager;
