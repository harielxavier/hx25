import { useState, useEffect, useCallback, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import Navigation from '../components/landing/Navigation';
import SEO from '../components/SEO';
import { getPublicGalleries, Gallery } from '../services/galleryService';
import { Link } from 'react-router-dom';
import Footer from '../components/landing/Footer';
import Masonry from 'react-masonry-css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Search, Calendar, SortAsc, SortDesc, Camera, Heart } from 'lucide-react';

// Sorting options
type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc' | 'popular';

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showSortOptions, setShowSortOptions] = useState(false);
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Fetch galleries from Firebase
  const fetchGalleries = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedGalleries = await getPublicGalleries();
      setGalleries(fetchedGalleries);
      
      // Extract unique categories from galleries
      const uniqueCategories = ['All', ...new Set(fetchedGalleries.map(gallery => gallery.category))];
      setCategories(uniqueCategories);
      setError(null);
    } catch (err) {
      console.error('Error fetching galleries:', err);
      setError('Failed to load galleries. Please try again later.');
      
      // Auto-retry once after a short delay if we get a permission error
      if (retryCount < 1) {
        console.log('Automatically retrying gallery fetch...');
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  }, [retryCount]);
  
  useEffect(() => {
    fetchGalleries();
  }, [fetchGalleries]);

  // Filter galleries by category and search query
  const filteredGalleries = useMemo(() => {
    let result = galleries;
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(gallery => 
        gallery.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Apply search filter if there's a query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(gallery => 
        gallery.title.toLowerCase().includes(query) || 
        gallery.description.toLowerCase().includes(query) ||
        gallery.category.toLowerCase().includes(query) ||
        (gallery.tags && gallery.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    // Apply sorting
    return result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0);
        case 'oldest':
          return (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0);
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'popular':
          // Sort by featured first, then by imageCount
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (b.imageCount || 0) - (a.imageCount || 0);
        default:
          return 0;
      }
    });
  }, [galleries, selectedCategory, searchQuery, sortBy]);

  // Breakpoints for the masonry layout
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  // Sort option labels
  const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: 'newest', label: 'Newest First', icon: <Calendar size={16} /> },
    { value: 'oldest', label: 'Oldest First', icon: <Calendar size={16} /> },
    { value: 'title-asc', label: 'Title (A-Z)', icon: <SortAsc size={16} /> },
    { value: 'title-desc', label: 'Title (Z-A)', icon: <SortDesc size={16} /> },
    { value: 'popular', label: 'Most Popular', icon: <Heart size={16} /> }
  ];

  return (
    <>
      <SEO 
        title="Photography Portfolio | Hariel Xavier Photography"
        description="View our collection of wedding, engagement, and destination photography."
      />
      <Navigation />
      
      <main id="main-content" className="pt-24">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center">
          <div className="absolute inset-0">
            <LazyLoadImage
              src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92"
              alt="Photography Portfolio"
              className="w-full h-full object-cover"
              effect="blur"
              threshold={200}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50" />
          </div>
          <div className="relative text-center text-white">
            <h1 className="font-serif text-6xl mb-4">Portfolio</h1>
            <p className="text-xl font-light">A collection of visual stories</p>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
            
            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                  onClick={() => {
                    setRetryCount(0);
                    fetchGalleries();
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
            
            {/* Search and Filter Controls */}
            {!loading && !error && (
              <>
                <div className="mb-12">
                  {/* Search Bar */}
                  <div className="relative max-w-md mx-auto mb-8">
                    <input
                      type="text"
                      placeholder="Search galleries..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                  
                  {/* Categories */}
                  <div className="flex justify-center flex-wrap gap-8 mb-8">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category.toLowerCase())}
                        className={`text-sm tracking-wide transition-colors ${
                          selectedCategory === category.toLowerCase()
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-gray-500 hover:text-primary'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  
                  {/* Sort Controls */}
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      <button 
                        onClick={() => setShowSortOptions(!showSortOptions)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                      >
                        <span>Sort by: </span>
                        <span className="font-medium">
                          {sortOptions.find(option => option.value === sortBy)?.label}
                        </span>
                      </button>
                      
                      {/* Sort Options Dropdown */}
                      {showSortOptions && (
                        <div className="absolute z-10 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg">
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
                  
                  {/* Results Count */}
                  <div className="text-center text-gray-500 mb-8">
                    Showing {filteredGalleries.length} {filteredGalleries.length === 1 ? 'gallery' : 'galleries'}
                    {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                    {searchQuery && ` matching "${searchQuery}"`}
                  </div>
                </div>

                {/* Gallery Grid - Masonry Layout */}
                {filteredGalleries.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No galleries found with the current filters.</p>
                    <button 
                      onClick={() => {
                        setSelectedCategory('all');
                        setSearchQuery('');
                      }}
                      className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div ref={ref}>
                    <Masonry
                      breakpointCols={breakpointColumnsObj}
                      className="flex w-auto -ml-4"
                      columnClassName="pl-4 bg-clip-padding"
                    >
                      {filteredGalleries.map((gallery, index) => (
                        <Link
                          to={`/gallery/${gallery.slug}`}
                          key={gallery.id}
                          className={`group cursor-pointer transform transition-all duration-700 mb-8 ${
                            inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                          }`}
                          style={{ transitionDelay: `${index * 150}ms` }}
                        >
                          <div className="relative overflow-hidden mb-4">
                            {gallery.coverImage ? (
                              <LazyLoadImage
                                src={gallery.coverImage}
                                alt={gallery.title}
                                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                effect="blur"
                                threshold={200}
                                height={gallery.coverImageHeight || 400}
                                width="100%"
                              />
                            ) : (
                              <div className="w-full aspect-[3/4] bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400">No image available</span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                              <div className="p-4 text-white w-full">
                                <div className="flex justify-between items-center">
                                  <p className="font-light flex items-center gap-1">
                                    <Camera size={14} />
                                    {gallery.imageCount || 0} photos
                                  </p>
                                  {gallery.featured && (
                                    <span className="bg-primary text-white text-xs px-2 py-1 rounded">
                                      Featured
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-primary uppercase tracking-[0.2em] text-sm mb-2">
                            {gallery.category}
                          </p>
                          <h3 className="font-serif text-2xl mb-1 group-hover:text-primary transition-colors">
                            {gallery.title}
                          </h3>
                          <p className="text-gray-600 font-light line-clamp-2">{gallery.description}</p>
                          {/* Tags */}
                          {gallery.tags && gallery.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {gallery.tags.slice(0, 3).map((tag, i) => (
                                <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  {tag}
                                </span>
                              ))}
                              {gallery.tags.length > 3 && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  +{gallery.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </Link>
                      ))}
                    </Masonry>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}