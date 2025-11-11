import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Trash2, 
  Edit, 
  Eye, 
  Upload, 
  Globe, 
  Lock, 
  Image as ImageIcon,
  Star,
  SortAsc,
  SortDesc,
  Clock
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  getAllGalleries, 
  createGallery, 
  deleteGallery, 
  Gallery, 
  createSampleGalleries,
  updateGallery
} from '../../services/galleryService';
// REMOVED FIREBASE: import { Timestamp // REMOVED FIREBASE

export default function AdminGallery() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sortBy, setSortBy] = useState<string>('createdAt-desc');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [newGallery, setNewGallery] = useState({
    title: '',
    description: '',
    clientName: '',
    clientEmail: '',
    category: 'wedding',
    isPublic: true,
    isPasswordProtected: false,
    password: '',
    allowDownloads: true,
    allowSharing: true,
    featured: false,
    eventDate: new Date(),
    location: '',
    tags: [] as string[]
  });
  const [currentTag, setCurrentTag] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedGalleries, setSelectedGalleries] = useState<string[]>([]);
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [showBatchActions, setShowBatchActions] = useState(false);
  const navigate = useNavigate();

  // Load galleries
  useEffect(() => {
    loadGalleries();
  }, []);

  const loadGalleries = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedGalleries = await getAllGalleries();
      setGalleries(fetchedGalleries);
    } catch (error) {
      console.error('Error loading galleries:', error);
      setError('Failed to load galleries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Create sample galleries if none exist
  const handleCreateSampleGalleries = async () => {
    try {
      setLoading(true);
      await createSampleGalleries();
      await loadGalleries();
    } catch (error) {
      console.error('Error creating sample galleries:', error);
      setError('Failed to create sample galleries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle create gallery form submission
  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Generate slug from title
      const slug = newGallery.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      
      // Create gallery in Firestore
      await createGallery({
        title: newGallery.title,
        slug,
        description: newGallery.description,
        coverImage: '',
        thumbnailImage: '',
        clientName: newGallery.clientName,
        clientEmail: newGallery.clientEmail,
        eventDate: Timestamp.fromDate(newGallery.eventDate),
        expiresAt: null,
        password: newGallery.isPasswordProtected ? newGallery.password : null,
        isPublic: newGallery.isPublic,
        isPasswordProtected: newGallery.isPasswordProtected,
        allowDownloads: newGallery.allowDownloads,
        allowSharing: newGallery.allowSharing,
        category: newGallery.category,
        location: newGallery.location,
        featured: newGallery.featured,
        tags: newGallery.tags
      });
      
      // Reset form and close modal
      setNewGallery({
        title: '',
        description: '',
        clientName: '',
        clientEmail: '',
        category: 'wedding',
        isPublic: true,
        isPasswordProtected: false,
        password: '',
        allowDownloads: true,
        allowSharing: true,
        featured: false,
        eventDate: new Date(),
        location: '',
        tags: []
      });
      setShowCreateModal(false);
      
      // Reload galleries
      await loadGalleries();
    } catch (error) {
      console.error('Error creating gallery:', error);
      setError('Failed to create gallery. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete gallery
  const handleDeleteGallery = async (galleryId: string) => {
    if (!confirm('Are you sure you want to delete this gallery? This action cannot be undone.')) {
      return;
    }
    
    try {
      setDeleting(galleryId);
      await deleteGallery(galleryId);
      await loadGalleries();
    } catch (error) {
      console.error('Error deleting gallery:', error);
      setError('Failed to delete gallery. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  // Handle tag input
  const handleAddTag = () => {
    if (currentTag.trim() && !newGallery.tags.includes(currentTag.trim())) {
      setNewGallery({
        ...newGallery,
        tags: [...newGallery.tags, currentTag.trim()]
      });
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewGallery({
      ...newGallery,
      tags: newGallery.tags.filter(t => t !== tag)
    });
  };

  // Sort options
  const sortOptions = [
    { value: 'createdAt-desc', label: 'Newest First', icon: <Clock size={16} /> },
    { value: 'createdAt-asc', label: 'Oldest First', icon: <Clock size={16} /> },
    { value: 'title-asc', label: 'Title (A-Z)', icon: <SortAsc size={16} /> },
    { value: 'title-desc', label: 'Title (Z-A)', icon: <SortDesc size={16} /> },
    { value: 'category-asc', label: 'Category (A-Z)', icon: <ImageIcon size={16} /> },
    { value: 'imageCount-desc', label: 'Most Images', icon: <ImageIcon size={16} /> },
    { value: 'featured-desc', label: 'Featured First', icon: <Star size={16} /> }
  ];

  // Get unique categories from galleries
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    galleries.forEach(gallery => {
      if (gallery.category) {
        uniqueCategories.add(gallery.category);
      }
    });
    return Array.from(uniqueCategories).sort();
  }, [galleries]);

  // Filter galleries based on search term, category, status and apply sorting
  const filteredGalleries = useMemo(() => {
    // First filter by search term, category, and status
    const filtered = galleries.filter(gallery => {
      const matchesSearch = 
        gallery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gallery.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gallery.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || gallery.category === categoryFilter;
      
      let matchesStatus = true;
      if (statusFilter === 'public') {
        matchesStatus = gallery.isPublic === true;
      } else if (statusFilter === 'private') {
        matchesStatus = gallery.isPublic === false;
      } else if (statusFilter === 'password') {
        matchesStatus = gallery.isPasswordProtected === true;
      } else if (statusFilter === 'featured') {
        matchesStatus = gallery.featured === true;
      }
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
    
    // Then apply sorting
    const [sortField, sortDirection] = sortBy.split('-');
    
    return [...filtered].sort((a, b) => {
      // Handle different sort fields
      switch (sortField) {
        case 'title':
          return sortDirection === 'asc' 
            ? a.title.localeCompare(b.title) 
            : b.title.localeCompare(a.title);
        
        case 'category':
          return sortDirection === 'asc' 
            ? a.category.localeCompare(b.category) 
            : b.category.localeCompare(a.category);
        
        case 'imageCount':
          return sortDirection === 'asc' 
            ? (a.imageCount || 0) - (b.imageCount || 0) 
            : (b.imageCount || 0) - (a.imageCount || 0);
        
        case 'featured':
          if (sortDirection === 'desc') {
            // Featured galleries first
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
          } else {
            // Non-featured galleries first
            if (a.featured && !b.featured) return 1;
            if (!a.featured && b.featured) return -1;
          }
          // If both are featured or both are not featured, sort by creation date
          return sortDirection === 'asc'
            ? (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0)
            : (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0);
        
        case 'createdAt':
        default:
          return sortDirection === 'asc'
            ? (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0)
            : (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0);
      }
    });
  }, [galleries, searchTerm, categoryFilter, statusFilter, sortBy]);

  // Handle batch selection
  const handleSelectAll = () => {
    if (selectedGalleries.length === filteredGalleries.length) {
      // If all are selected, deselect all
      setSelectedGalleries([]);
    } else {
      // Otherwise select all
      setSelectedGalleries(filteredGalleries.map(gallery => gallery.id));
    }
  };

  const handleSelectGallery = (galleryId: string) => {
    if (selectedGalleries.includes(galleryId)) {
      // If already selected, deselect it
      setSelectedGalleries(selectedGalleries.filter(id => id !== galleryId));
    } else {
      // Otherwise select it
      setSelectedGalleries([...selectedGalleries, galleryId]);
    }
  };

  // Batch operations
  const handleBatchDelete = async () => {
    if (!selectedGalleries.length) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedGalleries.length} galleries? This action cannot be undone.`)) {
      return;
    }
    
    try {
      setBatchProcessing(true);
      
      // Delete each selected gallery
      for (const galleryId of selectedGalleries) {
        await deleteGallery(galleryId);
      }
      
      // Reset selection and reload galleries
      setSelectedGalleries([]);
      await loadGalleries();
      
      // Show success message
      setError(null);
    } catch (error) {
      console.error('Error deleting galleries:', error);
      setError('Failed to delete galleries. Please try again.');
    } finally {
      setBatchProcessing(false);
    }
  };

  const handleBatchToggleFeatured = async (featured: boolean) => {
    if (!selectedGalleries.length) return;
    
    try {
      setBatchProcessing(true);
      
      // Update each selected gallery
      for (const galleryId of selectedGalleries) {
        const gallery = galleries.find(g => g.id === galleryId);
        if (gallery) {
          await updateGallery(galleryId, { featured });
        }
      }
      
      // Reset selection and reload galleries
      setSelectedGalleries([]);
      await loadGalleries();
      
      // Show success message
      setError(null);
    } catch (error) {
      console.error('Error updating galleries:', error);
      setError('Failed to update galleries. Please try again.');
    } finally {
      setBatchProcessing(false);
    }
  };

  const handleBatchToggleVisibility = async (isPublic: boolean) => {
    if (!selectedGalleries.length) return;
    
    try {
      setBatchProcessing(true);
      
      // Update each selected gallery
      for (const galleryId of selectedGalleries) {
        const gallery = galleries.find(g => g.id === galleryId);
        if (gallery) {
          await updateGallery(galleryId, { isPublic });
        }
      }
      
      // Reset selection and reload galleries
      setSelectedGalleries([]);
      await loadGalleries();
      
      // Show success message
      setError(null);
    } catch (error) {
      console.error('Error updating galleries:', error);
      setError('Failed to update galleries. Please try again.');
    } finally {
      setBatchProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Gallery Management</h1>
            <p className="text-gray-500">Manage your photography galleries</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <PlusCircle size={16} />
              Create Gallery
            </button>
            
            {galleries.length === 0 && (
              <button
                onClick={handleCreateSampleGalleries}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-white border border-primary rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <Upload size={16} />
                Create Sample Galleries
              </button>
            )}
          </div>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
            <div className="flex-shrink-0 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-medium">{error}</p>
              <button 
                onClick={() => setError(null)} 
                className="text-sm underline mt-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search galleries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          
          {/* Filter Button */}
          <div className="relative">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Filter size={16} />
              <span>Filters</span>
              {(categoryFilter !== 'all' || statusFilter !== 'all') && (
                <span className="flex items-center justify-center w-5 h-5 ml-1 text-xs text-white bg-primary rounded-full">
                  {(categoryFilter !== 'all' ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0)}
                </span>
              )}
            </button>
            
            {showFilters && (
              <div className="absolute right-0 z-10 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg">
                <div className="p-3">
                  <h3 className="font-medium text-sm text-gray-700 mb-2">Filter by Category</h3>
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="category-all"
                        name="category"
                        checked={categoryFilter === 'all'}
                        onChange={() => setCategoryFilter('all')}
                        className="mr-2"
                      />
                      <label htmlFor="category-all" className="text-sm">All Categories</label>
                    </div>
                    {categories.map(category => (
                      <div key={category} className="flex items-center">
                        <input
                          type="radio"
                          id={`category-${category}`}
                          name="category"
                          checked={categoryFilter === category}
                          onChange={() => setCategoryFilter(category)}
                          className="mr-2"
                        />
                        <label htmlFor={`category-${category}`} className="text-sm capitalize">{category}</label>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="font-medium text-sm text-gray-700 mb-2">Filter by Status</h3>
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="status-all"
                        name="status"
                        checked={statusFilter === 'all'}
                        onChange={() => setStatusFilter('all')}
                        className="mr-2"
                      />
                      <label htmlFor="status-all" className="text-sm">All Statuses</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="status-public"
                        name="status"
                        checked={statusFilter === 'public'}
                        onChange={() => setStatusFilter('public')}
                        className="mr-2"
                      />
                      <label htmlFor="status-public" className="text-sm flex items-center">
                        <Globe size={14} className="mr-1 text-green-500" />
                        Public
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="status-private"
                        name="status"
                        checked={statusFilter === 'private'}
                        onChange={() => setStatusFilter('private')}
                        className="mr-2"
                      />
                      <label htmlFor="status-private" className="text-sm flex items-center">
                        <Lock size={14} className="mr-1 text-red-500" />
                        Private
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="status-password"
                        name="status"
                        checked={statusFilter === 'password'}
                        onChange={() => setStatusFilter('password')}
                        className="mr-2"
                      />
                      <label htmlFor="status-password" className="text-sm flex items-center">
                        <Lock size={14} className="mr-1 text-yellow-500" />
                        Password Protected
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="status-featured"
                        name="status"
                        checked={statusFilter === 'featured'}
                        onChange={() => setStatusFilter('featured')}
                        className="mr-2"
                      />
                      <label htmlFor="status-featured" className="text-sm flex items-center">
                        <Star size={14} className="mr-1 text-yellow-400" />
                        Featured
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setCategoryFilter('all');
                        setStatusFilter('all');
                      }}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Reset Filters
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-xs text-primary hover:text-primary-dark"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Sort Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowSortOptions(!showSortOptions)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Filter size={16} />
              <span>Sort: {sortOptions.find(option => option.value === sortBy)?.label}</span>
            </button>
            
            {showSortOptions && (
              <div className="absolute right-0 z-10 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg">
                <ul className="py-1">
                  {sortOptions.map((option) => (
                    <li key={option.value}>
                      <button
                        className={`flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 ${
                          sortBy === option.value ? 'bg-gray-50 text-primary' : ''
                        }`}
                        onClick={() => {
                          setSortBy(option.value);
                          setShowSortOptions(false);
                        }}
                      >
                        {option.icon}
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {/* Active Filters Display */}
        {(categoryFilter !== 'all' || statusFilter !== 'all') && (
          <div className="flex flex-wrap gap-2 items-center text-sm">
            <span className="text-gray-500">Active filters:</span>
            
            {categoryFilter !== 'all' && (
              <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                <span className="mr-1">Category: {categoryFilter}</span>
                <button 
                  onClick={() => setCategoryFilter('all')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            {statusFilter !== 'all' && (
              <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                <span className="mr-1">Status: {statusFilter}</span>
                <button 
                  onClick={() => setStatusFilter('all')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            <button 
              onClick={() => {
                setCategoryFilter('all');
                setStatusFilter('all');
              }}
              className="text-primary hover:text-primary-dark text-xs"
            >
              Clear all filters
            </button>
          </div>
        )}
        
        {/* Results Count */}
        <div className="text-sm text-gray-500">
          Showing {filteredGalleries.length} {filteredGalleries.length === 1 ? 'gallery' : 'galleries'}
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
        
        {/* Batch Actions */}
        {selectedGalleries.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 p-3 rounded-md">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">
                  {selectedGalleries.length} {selectedGalleries.length === 1 ? 'gallery' : 'galleries'} selected
                </span>
                <button
                  onClick={() => setSelectedGalleries([])}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear selection
                </button>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowBatchActions(!showBatchActions)}
                  disabled={batchProcessing}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {batchProcessing ? 'Processing...' : 'Batch Actions'}
                </button>
                
                {showBatchActions && (
                  <div className="absolute right-0 z-10 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                    <ul className="py-1">
                      <li>
                        <button
                          onClick={() => {
                            handleBatchToggleFeatured(true);
                            setShowBatchActions(false);
                          }}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Star size={16} className="text-yellow-400" />
                          Mark as Featured
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            handleBatchToggleFeatured(false);
                            setShowBatchActions(false);
                          }}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Star size={16} className="text-gray-400" />
                          Remove Featured
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            handleBatchToggleVisibility(true);
                            setShowBatchActions(false);
                          }}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Globe size={16} className="text-green-500" />
                          Make Public
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            handleBatchToggleVisibility(false);
                            setShowBatchActions(false);
                          }}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Lock size={16} className="text-red-500" />
                          Make Private
                        </button>
                      </li>
                      <li className="border-t border-gray-200">
                        <button
                          onClick={() => {
                            handleBatchDelete();
                            setShowBatchActions(false);
                          }}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                          Delete Selected
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Gallery List */}
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-gray-500">Loading galleries...</p>
            </div>
          ) : filteredGalleries.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No galleries found.</p>
              {(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                    setStatusFilter('all');
                  }}
                  className="mt-2 text-primary hover:text-primary-dark text-sm"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedGalleries.length === filteredGalleries.length && filteredGalleries.length > 0}
                          onChange={handleSelectAll}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gallery
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Images
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredGalleries.map((gallery) => (
                    <tr key={gallery.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedGalleries.includes(gallery.id)}
                          onChange={() => handleSelectGallery(gallery.id)}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 mr-3">
                            {gallery.thumbnailImage ? (
                              <img
                                src={gallery.thumbnailImage}
                                alt={gallery.title}
                                className="h-10 w-10 rounded-md object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                                <ImageIcon size={20} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">{gallery.title}</div>
                              {gallery.featured && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                  <Star size={12} className="mr-1" />
                                  Featured
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {gallery.clientName && `Client: ${gallery.clientName}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                          {gallery.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {gallery.isPublic ? (
                            <span className="inline-flex items-center text-xs text-green-700">
                              <Globe size={14} className="mr-1" />
                              Public
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-xs text-red-700">
                              <Lock size={14} className="mr-1" />
                              Private
                            </span>
                          )}
                          {gallery.isPasswordProtected && (
                            <span className="inline-flex items-center text-xs text-yellow-700">
                              <Lock size={14} className="mr-1" />
                              Password
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {gallery.eventDate ? new Date(gallery.eventDate.toMillis()).toLocaleDateString() : 'No date'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {gallery.imageCount || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/gallery/${gallery.id}`)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit Gallery"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => window.open(`/gallery/${gallery.slug || gallery.id}`, '_blank')}
                            className="text-green-600 hover:text-green-900"
                            title="View Gallery"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteGallery(gallery.id)}
                            disabled={deleting === gallery.id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            title="Delete Gallery"
                          >
                            {deleting === gallery.id ? (
                              <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 size={18} />
                            )}
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
        
        {/* Create Gallery Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Create New Gallery</h2>
                  <button 
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    &times;
                  </button>
                </div>
                
                <form onSubmit={handleCreateGallery}>
                  <div className="space-y-4">
                    {/* Gallery Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Gallery Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={newGallery.title}
                        onChange={(e) => setNewGallery({...newGallery, title: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-white focus:ring-1 focus:ring-white"
                        placeholder="Summer Wedding 2024"
                      />
                    </div>
                    
                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        value={newGallery.description}
                        onChange={(e) => setNewGallery({...newGallery, description: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-white focus:ring-1 focus:ring-white"
                        placeholder="Beautiful summer wedding in Miami"
                        rows={3}
                      />
                    </div>
                    
                    {/* Client Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Client Name
                        </label>
                        <input
                          type="text"
                          value={newGallery.clientName}
                          onChange={(e) => setNewGallery({...newGallery, clientName: e.target.value})}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-white focus:ring-1 focus:ring-white"
                          placeholder="John & Sarah"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Client Email
                        </label>
                        <input
                          type="email"
                          value={newGallery.clientEmail}
                          onChange={(e) => setNewGallery({...newGallery, clientEmail: e.target.value})}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-white focus:ring-1 focus:ring-white"
                          placeholder="client@example.com"
                        />
                      </div>
                    </div>
                    
                    {/* Event Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Event Date
                        </label>
                        <input
                          type="date"
                          value={newGallery.eventDate.toISOString().split('T')[0]}
                          onChange={(e) => setNewGallery({
                            ...newGallery, 
                            eventDate: e.target.value ? new Date(e.target.value) : new Date()
                          })}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-white focus:ring-1 focus:ring-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={newGallery.location}
                          onChange={(e) => setNewGallery({...newGallery, location: e.target.value})}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-white focus:ring-1 focus:ring-white"
                          placeholder="Miami Beach, FL"
                        />
                      </div>
                    </div>
                    
                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Category
                      </label>
                      <select
                        value={newGallery.category}
                        onChange={(e) => setNewGallery({...newGallery, category: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-white focus:ring-1 focus:ring-white"
                      >
                        <option value="wedding">Wedding</option>
                        <option value="portrait">Portrait</option>
                        <option value="family">Family</option>
                        <option value="event">Event</option>
                        <option value="commercial">Commercial</option>
                        <option value="landscape">Landscape</option>
                        <option value="travel">Travel</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Tags
                      </label>
                      <div className="flex items-center mb-2">
                        <input
                          type="text"
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-500 focus:border-white focus:ring-1 focus:ring-white"
                          placeholder="Add a tag"
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        />
                        <button
                          type="button"
                          onClick={handleAddTag}
                          className="px-4 py-2 bg-gray-700 text-white rounded-r-lg hover:bg-gray-600"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {newGallery.tags.map((tag) => (
                          <span 
                            key={tag} 
                            className="bg-gray-700 text-white text-sm px-2 py-1 rounded-full flex items-center"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 text-gray-400 hover:text-white"
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Gallery Options */}
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isPublic"
                          checked={newGallery.isPublic}
                          onChange={(e) => setNewGallery({...newGallery, isPublic: e.target.checked})}
                          className="w-4 h-4 bg-gray-800 border-gray-700 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="isPublic" className="ml-2 text-sm text-gray-300">
                          Public Gallery (visible in portfolio)
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isPasswordProtected"
                          checked={newGallery.isPasswordProtected}
                          onChange={(e) => setNewGallery({...newGallery, isPasswordProtected: e.target.checked})}
                          className="w-4 h-4 bg-gray-800 border-gray-700 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="isPasswordProtected" className="ml-2 text-sm text-gray-300">
                          Password Protected
                        </label>
                      </div>
                      
                      {newGallery.isPasswordProtected && (
                        <div className="ml-6">
                          <input
                            type="text"
                            value={newGallery.password}
                            onChange={(e) => setNewGallery({...newGallery, password: e.target.value})}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-white focus:ring-1 focus:ring-white"
                            placeholder="Enter password"
                            required={newGallery.isPasswordProtected}
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="allowDownloads"
                          checked={newGallery.allowDownloads}
                          onChange={(e) => setNewGallery({...newGallery, allowDownloads: e.target.checked})}
                          className="w-4 h-4 bg-gray-800 border-gray-700 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="allowDownloads" className="ml-2 text-sm text-gray-300">
                          Allow Downloads
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="allowSharing"
                          checked={newGallery.allowSharing}
                          onChange={(e) => setNewGallery({...newGallery, allowSharing: e.target.checked})}
                          className="w-4 h-4 bg-gray-800 border-gray-700 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="allowSharing" className="ml-2 text-sm text-gray-300">
                          Allow Sharing
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={newGallery.featured}
                          onChange={(e) => setNewGallery({...newGallery, featured: e.target.checked})}
                          className="w-4 h-4 bg-gray-800 border-gray-700 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="featured" className="ml-2 text-sm text-gray-300">
                          Featured Gallery (shown on homepage)
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100"
                      disabled={loading}
                    >
                      {loading ? 'Creating...' : 'Create Gallery'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}