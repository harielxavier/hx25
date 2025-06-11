import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';
import { Loader, Download, Heart, Share2, Lock, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getGalleryById, getGalleryImages } from '../../services/galleryService';

interface PhotoGalleryProps {
  galleryId?: string; 
}

interface GalleryImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  width: number;
  height: number;
  size: number;
  featured: boolean;
  tags: string[];
  clientSelected: boolean;
  photographerSelected: boolean;
  clientComment: string;
}

interface GalleryData {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  isPasswordProtected: boolean;
  password?: string; 
  allowDownloads: boolean;
  allowSharing: boolean;
  allowSelections: boolean;
  maxSelections?: number;
  clientName?: string;
  clientEmail?: string;
  eventDate?: string;
  eventLocation?: string;
  photographerNotes?: string;
  selectionDeadline?: Date;
}

export default function PhotoGallery({ galleryId }: PhotoGalleryProps) {
  const paramsGalleryId = useParams<{ galleryId: string }>().galleryId;
  const actualGalleryId = galleryId || paramsGalleryId;
  const navigate = useNavigate();
  
  const [gallery, setGallery] = useState<GalleryData | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const loadGallery = async () => {
      if (!actualGalleryId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const galleryData = await getGalleryById(actualGalleryId);
        
        if (!galleryData) {
          setError('Gallery not found');
          setLoading(false);
          return;
        }
        
        const galleryDataFormatted: GalleryData = {
          id: galleryData.id,
          title: galleryData.title,
          description: galleryData.description || '',
          coverImage: galleryData.coverImage || '',
          isPasswordProtected: galleryData.isPasswordProtected || false,
          password: galleryData.password || '',
          allowDownloads: galleryData.allowDownloads || false,
          allowSharing: galleryData.allowSharing || false,
          allowSelections: galleryData.isPublic || false, 
          clientName: galleryData.clientName || '',
          clientEmail: galleryData.clientEmail || '',
          eventDate: galleryData.location || '', 
          eventLocation: galleryData.location || '',
          photographerNotes: galleryData.description || '' 
        };
        
        setGallery(galleryDataFormatted);
        
        if (galleryDataFormatted.isPasswordProtected && !authenticated) {
          setLoading(false);
          return;
        }
        
        const galleryImages = await getGalleryImages(actualGalleryId);
        setImages(galleryImages as GalleryImage[]);
        
        const tags = new Set<string>();
        galleryImages.forEach(image => {
          if (image.tags && image.tags.length > 0) {
            image.tags.forEach(tag => tags.add(tag));
          }
        });
        setAvailableTags(Array.from(tags));
        
        const selectedIds = galleryImages
          .filter(img => img.clientSelected)
          .map(img => img.id);
        setSelectedImages(new Set(selectedIds));
        
      } catch (error) {
        console.error('Error loading gallery:', error);
        setError('Failed to load gallery. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadGallery();
  }, [actualGalleryId, authenticated]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!gallery) return;
    
    if (password === gallery.password) {
      setAuthenticated(true);
      toast.success('Access granted');
    } else {
      toast.error('Incorrect password');
    }
  };

  const toggleImageSelection = async (imageId: string) => {
    if (!gallery?.allowSelections) return;
    
    if (
      gallery.maxSelections && 
      !selectedImages.has(imageId) && 
      selectedImages.size >= gallery.maxSelections
    ) {
      toast.error(`You can only select up to ${gallery.maxSelections} images`);
      return;
    }
    
    const newSelectedImages = new Set(selectedImages);
    if (newSelectedImages.has(imageId)) {
      newSelectedImages.delete(imageId);
    } else {
      newSelectedImages.add(imageId);
    }
    setSelectedImages(newSelectedImages);
    
    try {
      const db = getFirestore();
      const imageRef = doc(db, 'galleries', actualGalleryId as string, 'images', imageId);
      await updateDoc(imageRef, {
        clientSelected: !selectedImages.has(imageId),
        updatedAt: new Date()
      });
      
      setImages(prevImages => 
        prevImages.map(img => 
          img.id === imageId 
            ? { ...img, clientSelected: !selectedImages.has(imageId) } 
            : img
        )
      );
      
      toast.success(
        selectedImages.has(imageId) 
          ? 'Image removed from selection' 
          : 'Image added to selection'
      );
    } catch (error) {
      console.error('Error updating selection:', error);
      toast.error('Failed to update selection');
      
      setSelectedImages(new Set(selectedImages));
    }
  };

  const downloadImage = async (image: GalleryImage) => {
    if (!gallery?.allowDownloads) {
      toast.error('Downloads are not allowed for this gallery');
      return;
    }
    
    try {
      const storage = getStorage();
      const imageRef = ref(storage, `galleries/${actualGalleryId}/${image.id}`);
      const downloadURL = await getDownloadURL(imageRef);
      
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = image.title || `image-${image.id}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Downloading image...');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image');
    }
  };

  const shareGallery = () => {
    if (!gallery?.allowSharing) {
      toast.error('Sharing is not allowed for this gallery');
      return;
    }
    
    if (navigator.share) {
      navigator.share({
        title: gallery.title,
        text: gallery.description,
        url: window.location.href
      })
      .then(() => toast.success('Shared successfully'))
      .catch(error => {
        console.error('Error sharing:', error);
        toast.error('Failed to share');
      });
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success('Link copied to clipboard'))
        .catch(() => toast.error('Failed to copy link'));
    }
  };

  const submitSelections = async () => {
    if (!gallery?.allowSelections || selectedImages.size === 0) return;
    
    try {
      toast.success('Your selections have been submitted');
      
      navigate(`/gallery/${actualGalleryId}/thank-you`);
    } catch (error) {
      console.error('Error submitting selections:', error);
      toast.error('Failed to submit selections');
    }
  };

  const filteredImages = filterTag 
    ? images.filter(img => img.tags && img.tags.includes(filterTag))
    : images;

  if (gallery?.isPasswordProtected && !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <Lock className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <h1 className="text-2xl font-bold">{gallery.title}</h1>
            <p className="text-gray-600">This gallery is password protected</p>
          </div>
          
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Enter Gallery
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader className="h-12 w-12 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error || !gallery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error || 'Gallery not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">{gallery.title}</h1>
          
          {showInfo && (
            <div className="mb-4">
              <p className="text-gray-600">{gallery.description}</p>
              
              {gallery.clientName && (
                <p className="text-sm text-gray-500 mt-2">
                  <span className="font-medium">Client:</span> {gallery.clientName}
                </p>
              )}
              
              {gallery.eventDate && (
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Date:</span> {gallery.eventDate}
                </p>
              )}
              
              {gallery.eventLocation && (
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Location:</span> {gallery.eventLocation}
                </p>
              )}
              
              {gallery.photographerNotes && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Photographer's Notes:</span><br />
                    {gallery.photographerNotes}
                  </p>
                </div>
              )}
            </div>
          )}
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {showInfo ? 'Hide Info' : 'Show Info'}
              </button>
              
              {availableTags.length > 0 && (
                <div className="relative">
                  <select
                    value={filterTag || ''}
                    onChange={(e) => setFilterTag(e.target.value || null)}
                    className="text-sm border border-gray-300 rounded-md px-3 py-1"
                  >
                    <option value="">All Images</option>
                    {availableTags.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                  title="Grid View"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`p-1 rounded ${viewMode === 'masonry' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                  title="Masonry View"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {gallery.allowSharing && (
                <button
                  onClick={shareGallery}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              )}
              
              {gallery.allowSelections && (
                <button
                  onClick={() => setSelectionMode(!selectionMode)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-md ${
                    selectionMode 
                      ? 'bg-blue-600 text-white' 
                      : 'text-blue-600 border border-blue-600'
                  }`}
                >
                  <Heart className="h-4 w-4" />
                  <span>{selectionMode ? 'Exit Selection' : 'Select Favorites'}</span>
                </button>
              )}
              
              {gallery.allowSelections && selectedImages.size > 0 && (
                <button
                  onClick={submitSelections}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <Check className="h-4 w-4" />
                  <span>Submit {selectedImages.size} Selection{selectedImages.size !== 1 ? 's' : ''}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No images found</p>
          </div>
        ) : (
          <Gallery>
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' 
                : 'columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4'
              }
            `}>
              {filteredImages.map(image => (
                <div 
                  key={image.id} 
                  className={`
                    relative group 
                    ${viewMode === 'grid' ? '' : 'break-inside-avoid mb-4'}
                  `}
                >
                  <Item
                    original={image.url}
                    thumbnail={image.thumbnailUrl}
                    width={image.width}
                    height={image.height}
                  >
                    {({ ref, open }) => (
                      <div className="relative">
                        <img
                          ref={ref as any}
                          src={image.thumbnailUrl}
                          alt={image.title}
                          className={`
                            w-full h-auto rounded-md cursor-pointer 
                            ${selectionMode ? 'opacity-70' : ''}
                          `}
                          onClick={selectionMode ? undefined : open}
                        />
                        
                        {selectionMode && (
                          <div 
                            className="absolute inset-0 flex items-center justify-center"
                            onClick={() => toggleImageSelection(image.id)}
                          >
                            <div className={`
                              w-12 h-12 rounded-full flex items-center justify-center
                              ${selectedImages.has(image.id) 
                                ? 'bg-red-500 text-white' 
                                : 'bg-white text-gray-400 border-2 border-gray-300'
                              }
                            `}>
                              <Heart 
                                className={`h-6 w-6 ${selectedImages.has(image.id) ? 'fill-current' : ''}`} 
                              />
                            </div>
                          </div>
                        )}
                        
                        {!selectionMode && (
                          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex space-x-1 bg-black bg-opacity-50 rounded-md p-1">
                              {gallery.allowDownloads && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    downloadImage(image);
                                  }}
                                  className="p-1 text-white hover:text-blue-300"
                                  title="Download"
                                >
                                  <Download className="h-4 w-4" />
                                </button>
                              )}
                              
                              {gallery.allowSelections && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleImageSelection(image.id);
                                  }}
                                  className={`p-1 ${
                                    selectedImages.has(image.id) 
                                      ? 'text-red-400' 
                                      : 'text-white hover:text-red-300'
                                  }`}
                                  title={selectedImages.has(image.id) ? 'Remove from favorites' : 'Add to favorites'}
                                >
                                  <Heart className={`h-4 w-4 ${selectedImages.has(image.id) ? 'fill-current' : ''}`} />
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Item>
                  
                  {selectedImages.has(image.id) && !selectionMode && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-red-500 text-white p-1 rounded-full">
                        <Heart className="h-4 w-4 fill-current" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Gallery>
        )}
      </div>
    </div>
  );
}
