import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Gallery } from '../../services/galleryService';

const UpdateGalleryTitle: React.FC = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const fetchGalleries = async () => {
      setLoading(true);
      try {
        const galleriesRef = collection(db, 'galleries');
        const galleriesQuery = query(galleriesRef, where('isPublic', '==', true));
        const querySnapshot = await getDocs(galleriesQuery);
        
        const galleryData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Gallery));
        
        setGalleries(galleryData);
      } catch (error) {
        console.error('Error fetching galleries:', error);
        setMessage({ text: 'Failed to load galleries', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    
    fetchGalleries();
  }, []);

  const updateGalleryTitle = async (galleryId: string, newTitle: string, newDescription?: string) => {
    setLoading(true);
    try {
      const galleryRef = doc(db, 'galleries', galleryId);
      const updateData: any = { title: newTitle };
      
      if (newDescription) {
        updateData.description = newDescription;
      }
      
      await updateDoc(galleryRef, updateData);
      
      // Update local state
      setGalleries(prev => 
        prev.map(gallery => 
          gallery.id === galleryId 
            ? { ...gallery, title: newTitle, description: newDescription || gallery.description }
            : gallery
        )
      );
      
      setMessage({ text: 'Gallery updated successfully', type: 'success' });
    } catch (error) {
      console.error('Error updating gallery:', error);
      setMessage({ text: 'Failed to update gallery', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-medium mb-6">Update Gallery Titles</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 
          message.type === 'error' ? 'bg-red-100 text-red-800' : 
          'bg-blue-100 text-blue-800'
        }`}>
          {message.text}
        </div>
      )}
      
      {loading && <p className="text-gray-600">Loading...</p>}
      
      {galleries.length === 0 && !loading ? (
        <p className="text-gray-600">No galleries found.</p>
      ) : (
        <div className="space-y-6">
          {galleries.map(gallery => (
            <div key={gallery.id} className="border p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">{gallery.title}</h3>
              <p className="text-gray-600 mb-4">{gallery.description}</p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="text" 
                  placeholder="New title"
                  className="flex-1 p-2 border rounded"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const target = e.target as HTMLInputElement;
                      updateGalleryTitle(gallery.id, target.value);
                      target.value = '';
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector(`div[key="${gallery.id}"] input`) as HTMLInputElement;
                    if (input && input.value) {
                      updateGalleryTitle(gallery.id, input.value);
                      input.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpdateGalleryTitle;
