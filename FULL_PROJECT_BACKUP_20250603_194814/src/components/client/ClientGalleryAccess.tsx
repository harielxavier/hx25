import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Image, 
  Download, 
  Heart, 
  Share2, 
  Eye, 
  Star,
  Grid,
  List,
  Filter,
  Search
} from 'lucide-react';
import { Job } from '../../services/jobsService';

interface ClientGalleryAccessProps {
  clientId: string;
  job: Job;
}

interface GalleryImage {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  category: 'engagement' | 'wedding' | 'portraits' | 'details';
  isFavorite: boolean;
  downloadUrl?: string;
  metadata: {
    camera: string;
    lens: string;
    settings: string;
    location: string;
  };
}

const ClientGalleryAccess: React.FC<ClientGalleryAccessProps> = ({ clientId, job }) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'favorites' | 'engagement' | 'wedding' | 'portraits' | 'details'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockImages: GalleryImage[] = [
      {
        id: '1',
        url: '/MoStuff/amanda/hero.jpg',
        thumbnail: '/MoStuff/amanda/thumb.jpg',
        title: 'First Look',
        category: 'wedding',
        isFavorite: true,
        downloadUrl: '/MoStuff/amanda/hero.jpg',
        metadata: {
          camera: 'Canon EOS R5',
          lens: '85mm f/1.4',
          settings: 'f/2.8, 1/250s, ISO 400',
          location: 'Garden Ceremony'
        }
      },
      {
        id: '2',
        url: '/MoStuff/amanda/ch1.jpg',
        thumbnail: '/MoStuff/amanda/ch1.jpg',
        title: 'Ceremony Kiss',
        category: 'wedding',
        isFavorite: false,
        downloadUrl: '/MoStuff/amanda/ch1.jpg',
        metadata: {
          camera: 'Canon EOS R5',
          lens: '70-200mm f/2.8',
          settings: 'f/3.2, 1/500s, ISO 800',
          location: 'Main Altar'
        }
      },
      {
        id: '3',
        url: '/MoStuff/amanda/ch2.jpg',
        thumbnail: '/MoStuff/amanda/ch2.jpg',
        title: 'Ring Exchange',
        category: 'wedding',
        isFavorite: true,
        downloadUrl: '/MoStuff/amanda/ch2.jpg',
        metadata: {
          camera: 'Canon EOS R5',
          lens: '85mm f/1.4',
          settings: 'f/2.0, 1/320s, ISO 640',
          location: 'Ceremony'
        }
      },
      {
        id: '4',
        url: '/MoStuff/amanda/ch3.jpg',
        thumbnail: '/MoStuff/amanda/ch3.jpg',
        title: 'Reception Dance',
        category: 'wedding',
        isFavorite: false,
        downloadUrl: '/MoStuff/amanda/ch3.jpg',
        metadata: {
          camera: 'Canon EOS R5',
          lens: '24-70mm f/2.8',
          settings: 'f/2.8, 1/125s, ISO 1600',
          location: 'Reception Hall'
        }
      }
    ];

    setTimeout(() => {
      setImages(mockImages);
      setLoading(false);
    }, 1000);
  }, [clientId, job]);

  const filteredImages = images.filter(image => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'favorites' && image.isFavorite) ||
                         image.category === filter;
    
    const matchesSearch = searchTerm === '' || 
                         image.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const toggleFavorite = (imageId: string) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, isFavorite: !img.isFavorite } : img
    ));
  };

  const downloadImage = (image: GalleryImage) => {
    if (image.downloadUrl) {
      const link = document.createElement('a');
      link.href = image.downloadUrl;
      link.download = `${job.name}_${image.title}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadAll = () => {
    filteredImages.forEach(image => {
      if (image.downloadUrl) {
        setTimeout(() => downloadImage(image), 100);
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Your Gallery</h2>
            <p className="text-gray-600">{images.length} photos from your {job.type}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={downloadAll}
              className="flex items-center space-x-2 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download All</span>
            </button>
            
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">All Photos</option>
              <option value="favorites">Favorites</option>
              <option value="engagement">Engagement</option>
              <option value="wedding">Wedding</option>
              <option value="portraits">Portraits</option>
              <option value="details">Details</option>
            </select>
          </div>
          
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search photos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <motion.div
                key={image.id}
                className="relative group cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedImage(image)}
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={image.thumbnail}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(image.id);
                      }}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${image.isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadImage(image);
                      }}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                    
                    <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                
                {image.isFavorite && (
                  <div className="absolute top-2 right-2">
                    <Heart className="w-5 h-5 text-red-500 fill-current" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredImages.map((image) => (
              <div key={image.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={image.thumbnail}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{image.title}</h3>
                  <p className="text-sm text-gray-500 capitalize">{image.category}</p>
                  <p className="text-xs text-gray-400">{image.metadata.settings}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleFavorite(image.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${image.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                  </button>
                  
                  <button
                    onClick={() => downloadImage(image)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4 text-gray-400" />
                  </button>
                  
                  <button
                    onClick={() => setSelectedImage(image)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <span className="text-2xl">×</span>
            </button>
            
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="max-w-full max-h-full object-contain"
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <div className="text-white">
                <h3 className="text-xl font-semibold mb-2">{selectedImage.title}</h3>
                <div className="flex items-center justify-between">
                  <div className="text-sm opacity-75">
                    <p>{selectedImage.metadata.camera} • {selectedImage.metadata.lens}</p>
                    <p>{selectedImage.metadata.settings} • {selectedImage.metadata.location}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleFavorite(selectedImage.id)}
                      className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                    >
                      <Heart className={`w-5 h-5 ${selectedImage.isFavorite ? 'text-red-500 fill-current' : 'text-white'}`} />
                    </button>
                    
                    <button
                      onClick={() => downloadImage(selectedImage)}
                      className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                    >
                      <Download className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientGalleryAccess;
