import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Gallery, GalleryMedia } from '../../services/galleryService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface GalleryWithSampleMedia extends Gallery {
  sampleMedia?: Partial<GalleryMedia>;
}

const VerifyMigration: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [galleries, setGalleries] = useState<GalleryWithSampleMedia[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedGallery, setSelectedGallery] = useState<string | null>(null);
  const [mediaItems, setMediaItems] = useState<Partial<GalleryMedia>[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        setLoading(true);
        const galleriesRef = collection(db, 'galleries');
        const snapshot = await getDocs(galleriesRef);
        
        if (snapshot.empty) {
          setGalleries([]);
          setError('No galleries found');
          setLoading(false);
          return;
        }
        
        const galleriesData: GalleryWithSampleMedia[] = [];
        
        for (const galleryDoc of snapshot.docs) {
          const galleryData = { id: galleryDoc.id, ...galleryDoc.data() } as GalleryWithSampleMedia;
          
          // Get one sample media item to check if migration worked
          const mediaRef = collection(db, 'galleries', galleryDoc.id, 'media');
          const mediaSnapshot = await getDocs(mediaRef);
          
          if (!mediaSnapshot.empty) {
            galleryData.sampleMedia = mediaSnapshot.docs[0].data() as Partial<GalleryMedia>;
          }
          
          galleriesData.push(galleryData);
        }
        
        setGalleries(galleriesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching galleries:', err);
        setError('Failed to load galleries');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGalleries();
  }, []);
  
  const fetchGalleryMedia = async (galleryId: string) => {
    try {
      setMediaLoading(true);
      setSelectedGallery(galleryId);
      
      const mediaRef = collection(db, 'galleries', galleryId, 'media');
      const mediaSnapshot = await getDocs(mediaRef);
      
      if (mediaSnapshot.empty) {
        setMediaItems([]);
        return;
      }
      
      const items = mediaSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Partial<GalleryMedia>[];
      
      setMediaItems(items);
    } catch (err) {
      console.error('Error fetching media:', err);
      setError('Failed to load media items');
    } finally {
      setMediaLoading(false);
    }
  };
  
  const renderMigrationStatus = (gallery: GalleryWithSampleMedia) => {
    if (!gallery.sampleMedia) {
      return <span className="text-gray-500">No media found</span>;
    }
    
    const hasNewFields = 
      gallery.sampleMedia.viewCount !== undefined && 
      gallery.sampleMedia.downloadCount !== undefined &&
      gallery.sampleMedia.exposureData !== undefined;
    
    if (hasNewFields) {
      return <span className="text-green-600 font-medium">✓ Migration successful</span>;
    } else {
      return <span className="text-red-600 font-medium">✗ Not migrated</span>;
    }
  };

  return (
    <div className="container py-4">
      <h1 className="text-3xl font-bold mb-6">Verify Migration</h1>
      
      {loading ? (
        <div className="flex justify-center my-8">
          <LoadingSpinner size="md" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
          {error}
        </div>
      ) : (
        <>
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Gallery Migration Status</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gallery
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Migration Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {galleries.map((gallery) => (
                      <tr key={gallery.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{gallery.title}</div>
                          <div className="text-sm text-gray-500">{gallery.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderMigrationStatus(gallery)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button 
                            onClick={() => fetchGalleryMedia(gallery.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View Media
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {selectedGallery && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Media Items for {galleries.find(g => g.id === selectedGallery)?.title}
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                {mediaLoading ? (
                  <div className="flex justify-center my-8">
                    <LoadingSpinner size="md" />
                  </div>
                ) : mediaItems.length === 0 ? (
                  <p className="text-gray-500">No media items found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Image
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Filename
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            View Count
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Download Count
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Metadata
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mediaItems.slice(0, 10).map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.thumbnailUrl && (
                                <img 
                                  src={item.thumbnailUrl} 
                                  alt={item.filename || 'Gallery image'} 
                                  className="h-12 w-12 object-cover rounded"
                                />
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{item.filename}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{item.viewCount ?? 'Not set'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{item.downloadCount ?? 'Not set'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {item.exposureData ? (
                                  <span className="text-green-600">✓ Present</span>
                                ) : (
                                  <span className="text-red-600">✗ Missing</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {mediaItems.length > 10 && (
                      <div className="py-3 px-6 text-sm text-gray-500">
                        Showing 10 of {mediaItems.length} items
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VerifyMigration;
