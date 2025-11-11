import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderOpen, 
  Plus, 
  Upload, 
  Eye, 
  Grid,
  List,
  Search,
  Tag,
  HardDrive,
  Trash2,
  RefreshCw,
  AlertCircle,
  Mail
} from 'lucide-react';
import { 
  getAllGalleries, 
  getPublicGalleries, 
  Gallery,
  deleteGallery
} from '../../services/galleryService';
// REMOVED FIREBASE: import { ref, listAll, getMetadata // REMOVED FIREBASE
// REMOVED FIREBASE: import { storage } from '../../firebase/config';
// REMOVED FIREBASE: import { collection, onSnapshot // REMOVED FIREBASE
// REMOVED FIREBASE: import { db } from '../../firebase/config';
import GalleryNotificationSender from '../../components/admin/GalleryNotificationSender';

export default function GalleryManagementHub() {
  // State for galleries and images
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'client' | 'public' | 'images'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Firebase storage stats
  const [storageStats, setStorageStats] = useState({
    used: '0 MB',
    total: '5 GB',
    percentage: 0,
    files: 0,
    loading: true
  });
  
  // Real-time updates
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  
  // Gallery notification state
  const [notificationGalleryId, setNotificationGalleryId] = useState<string | null>(null);
  
  // Load galleries and set up real-time listener
  useEffect(() => {
    loadGalleries();
    
    // Set up real-time listener if enabled
    if (realTimeEnabled) {
      setupRealTimeListener();
    }
    
    return () => {
      // Clean up listener on unmount
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [realTimeEnabled]);
  
  // Set up real-time listener for galleries collection
  const setupRealTimeListener = () => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }
    
    const galleriesRef = collection(db, 'galleries');
    const unsubscribe = onSnapshot(galleriesRef, (snapshot) => {
      const updatedGalleries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Gallery));
      
      setGalleries(updatedGalleries);
      extractCategories(updatedGalleries);
      setLoading(false);
    }, (error) => {
      console.error('Error in real-time listener:', error);
      setError('Failed to set up real-time updates. Falling back to manual refresh.');
      setRealTimeEnabled(false);
      loadGalleries(); // Fall back to regular loading
    });
    
    unsubscribeRef.current = unsubscribe;
  };
  
  // Load galleries based on active tab
  const loadGalleries = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let fetchedGalleries: Gallery[] = [];
      
      switch (activeTab) {
        case 'all':
          fetchedGalleries = await getAllGalleries();
          break;
        case 'public':
          fetchedGalleries = await getPublicGalleries();
          break;
        case 'client':
          // Client galleries are private (not public)
          const allGalleries = await getAllGalleries();
          fetchedGalleries = allGalleries.filter(gallery => !gallery.isPublic);
          break;
        case 'images':
          // For images tab, we still need galleries to organize by
          fetchedGalleries = await getAllGalleries();
          break;
      }
      
      setGalleries(fetchedGalleries);
      extractCategories(fetchedGalleries);
      
      // Load storage stats
      loadStorageStats();
    } catch (err) {
      console.error('Error loading galleries:', err);
      setError('Failed to load galleries. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Extract unique categories from galleries
  const extractCategories = (galleries: Gallery[]) => {
    const uniqueCategories = Array.from(
      new Set(galleries.map(gallery => gallery.category).filter(Boolean))
    ) as string[];
    
    setCategories(uniqueCategories);
  };
  
  // Load Firebase storage statistics
  const loadStorageStats = async () => {
    try {
      // Get all files in galleries folder
      const galleriesRef = ref(storage, 'galleries');
      const galleryList = await listAll(galleriesRef);
      
      let totalSize = 0;
      let fileCount = 0;
      
      // Process each gallery folder
      for (const galleryRef of galleryList.prefixes) {
        const galleryFiles = await listAll(galleryRef);
        
        // Get size of each file
        for (const fileRef of galleryFiles.items) {
          try {
            const metadata = await getMetadata(fileRef);
            totalSize += metadata.size;
            fileCount++;
          } catch (error) {
            console.warn(`Couldn't get metadata for ${fileRef.fullPath}`, error);
          }
        }
      }
      
      // Convert bytes to readable format
      const usedMB = (totalSize / (1024 * 1024)).toFixed(2);
      const usedGB = (totalSize / (1024 * 1024 * 1024)).toFixed(2);
      
      // Assuming 5GB storage limit for Firebase free tier
      const totalGB = 5;
      const usagePercentage = (totalSize / (totalGB * 1024 * 1024 * 1024)) * 100;
      
      setStorageStats({
        used: totalSize > 1024 * 1024 * 1024 ? `${usedGB} GB` : `${usedMB} MB`,
        total: `${totalGB} GB`,
        percentage: Math.min(Math.round(usagePercentage), 100),
        files: fileCount,
        loading: false
      });
    } catch (error) {
      console.error('Error loading storage stats:', error);
      setStorageStats(prev => ({
        ...prev,
        loading: false
      }));
    }
  };
  
  // Filter galleries based on search and category
  const filteredGalleries = galleries.filter(gallery => {
    const matchesSearch = searchTerm === '' || 
      gallery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (gallery.description && gallery.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === '' || gallery.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Gallery Card Component
  const GalleryCard = ({ gallery }: { gallery: Gallery }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="relative h-48 bg-gray-200">
        {/* Placeholder or Cover Image */} 
        <FolderOpen className="absolute inset-0 m-auto w-16 h-16 text-gray-400" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 truncate">{gallery.title}</h3>
        <p className="text-sm text-gray-500 mb-2">
          {gallery.category && <Tag size={14} className="inline mr-1" />} 
          {gallery.category || 'Uncategorized'}
        </p>
        <div className="flex items-center text-xs text-gray-400 mb-3 space-x-2">
          <span>{gallery.imageCount || 0} items</span>
          <span>|</span>
          <span>{gallery.isPublic ? 'Public' : 'Client'}</span>
          <span>|</span>
          <span>{gallery.createdAt ? new Date(gallery.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center space-x-2">
          <Link 
            to={`/admin/gallery/${gallery.id}`} 
            className="flex-1 inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Eye size={14} className="mr-1" /> View
          </Link>
          <button
            onClick={() => setNotificationGalleryId(gallery.id)}
            className="flex-1 inline-flex items-center justify-center px-3 py-1 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            title="Send Notification"
          >
            <Mail size={14} className="mr-1" /> Notify
          </button>
          <button 
            onClick={() => handleDeleteGallery(gallery.id, gallery.title)}
            className="inline-flex items-center justify-center p-1.5 border border-transparent text-xs font-medium rounded text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            title="Delete Gallery"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  // Gallery List Item Component
  const GalleryListItem = ({ gallery }: { gallery: Gallery }) => (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition duration-200">
      <td className="py-4 pl-4 pr-2">
        <div className="flex items-center">
          <FolderOpen size={20} className="mr-2 text-gray-400" />
          <div>
            <h3 className="text-lg font-semibold">{gallery.title}</h3>
            <p className="text-sm text-gray-500">{gallery.category || 'Uncategorized'}</p>
          </div>
        </div>
      </td>
      <td className="py-4 pl-2 pr-4 text-center">
        <div className="flex items-center justify-center">
          <span className="text-sm">{gallery.imageCount || 0} items</span>
        </div>
      </td>
      <td className="py-4 pl-2 pr-4 text-center">
        <div className="flex items-center justify-center">
          <span className="text-sm">{gallery.isPublic ? 'Public' : 'Client'}</span>
        </div>
      </td>
      <td className="py-4 pl-2 pr-4 text-center">
        <div className="flex items-center justify-center">
          <span className="text-sm">{gallery.createdAt ? new Date(gallery.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</span>
        </div>
      </td>
      <td className="py-4 pl-2 pr-4 text-right">
        <div className="flex items-center justify-end space-x-2">
          <Link
            to={`/admin/gallery/${gallery.id}`}
            className="ml-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Eye size={16} className="mr-1" /> View Gallery
          </Link>
          <button
            onClick={() => setNotificationGalleryId(gallery.id)}
            className="inline-flex items-center justify-center px-3 py-1 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            title="Send Notification"
          >
            <Mail size={16} className="mr-1" /> Notify
          </button>
          <button 
            onClick={() => handleDeleteGallery(gallery.id, gallery.title)}
            className="inline-flex items-center justify-center p-1.5 border border-transparent text-xs font-medium rounded text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            title="Delete Gallery"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );

  // Handle gallery deletion with confirmation
  const handleDeleteGallery = async (galleryId: string, galleryTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${galleryTitle}"? This will permanently delete all images in this gallery.`)) {
      try {
        await deleteGallery(galleryId);
        
        // Refresh galleries if not using real-time updates
        if (!realTimeEnabled) {
          loadGalleries();
        }
      } catch (error) {
        console.error('Error deleting gallery:', error);
        setError('Failed to delete gallery. Please try again.');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gallery Management Hub</h1>
        
        <div className="flex items-center space-x-4">
          {/* Storage usage indicator */}
          <div className="flex items-center bg-white p-2 rounded-lg shadow">
            <HardDrive size={18} className="text-gray-500 mr-2" />
            <div>
              <div className="text-sm font-medium">Storage: {storageStats.loading ? 'Loading...' : `${storageStats.used} / ${storageStats.total}`}</div>
              <div className="w-36 h-2 bg-gray-200 rounded-full mt-1">
                <div 
                  className={`h-2 rounded-full ${storageStats.percentage > 80 ? 'bg-red-500' : 'bg-blue-500'}`} 
                  style={{ width: `${storageStats.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Real-time toggle */}
          <button 
            onClick={() => setRealTimeEnabled(!realTimeEnabled)} 
            className={`flex items-center p-2 rounded ${realTimeEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
          >
            <RefreshCw size={16} className={`mr-1 ${realTimeEnabled ? 'animate-spin' : ''}`} />
            {realTimeEnabled ? 'Real-time On' : 'Real-time Off'}
          </button>
          
          {/* View mode toggle */}
          <div className="flex bg-gray-100 rounded-lg">
            <button 
              onClick={() => setViewMode('grid')} 
              className={`p-2 rounded-l-lg ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')} 
              className={`p-2 rounded-r-lg ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
            >
              <List size={18} />
            </button>
          </div>
          
          {/* Create new gallery button */}
          <Link to="/admin/gallery" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
            <Plus size={18} className="mr-1" />
            New Gallery
          </Link>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 flex items-center">
          <AlertCircle size={18} className="mr-2" />
          {error}
        </div>
      )}
      
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button 
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 font-medium ${activeTab === 'all' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
        >
          All Galleries
        </button>
        <button 
          onClick={() => setActiveTab('client')}
          className={`px-4 py-2 font-medium ${activeTab === 'client' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
        >
          Client Galleries
        </button>
        <button 
          onClick={() => setActiveTab('public')}
          className={`px-4 py-2 font-medium ${activeTab === 'public' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
        >
          Public Galleries
        </button>
        <button 
          onClick={() => setActiveTab('images')}
          className={`px-4 py-2 font-medium ${activeTab === 'images' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
        >
          All Images
        </button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search galleries..."
            className="pl-10 pr-4 py-2 border rounded-lg w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Category filter */}
        <div className="relative">
          <Tag size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            className="pl-10 pr-4 py-2 border rounded-lg w-48 appearance-none"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        {/* Batch upload */}
        <div className="ml-auto">
          {/* State for file selection (if needed for future single uploads or other features) */}
          {/* const [selectedFiles, setSelectedFiles] = useState<File[]>([]); */}
          {/* const fileInputRef = useRef<HTMLInputElement>(null); */}
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            // ref={fileInputRef}
            // onChange={handleFileSelect}
          />
          <button
            // onClick={() => fileInputRef.current?.click()}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
            // disabled={uploading}
          >
            <Upload size={18} className="mr-1" />
            Batch Upload
          </button>
        </div>
      </div>
      
      {/* Selected files for upload */}
      {/* {selectedFiles.length > 0 && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">{selectedFiles.length} files selected for upload</h3>
            <button 
              onClick={() => setSelectedFiles([])}
              className="text-red-500 hover:text-red-700"
            >
              Clear
            </button>
          </div>
          
          {uploading ? (
            <div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-green-500 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="text-sm text-center mt-1">{uploadProgress}% complete</div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div key={index} className="text-sm bg-white px-2 py-1 rounded border">
                  {file.name.length > 20 ? `${file.name.substring(0, 20)}...` : file.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )} */}
      
      {/* Gallery grid/list */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading galleries...</p>
        </div>
      ) : filteredGalleries.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FolderOpen size={48} className="mx-auto text-gray-400" />
          <p className="mt-4 text-gray-500">No galleries found</p>
          <Link to="/admin/gallery" className="mt-2 inline-block text-blue-500 hover:underline">
            Create your first gallery
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGalleries.map(gallery => (
            <GalleryCard key={gallery.id} gallery={gallery} />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3 pl-4 pr-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title / Category
                </th>
                <th scope="col" className="py-3 px-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th scope="col" className="py-3 px-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="py-3 px-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="py-3 pl-2 pr-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGalleries.map(gallery => (
                <GalleryListItem key={gallery.id} gallery={gallery} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Gallery Notification Modal */}
      {notificationGalleryId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <GalleryNotificationSender 
              galleryId={notificationGalleryId} 
              onClose={() => setNotificationGalleryId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
