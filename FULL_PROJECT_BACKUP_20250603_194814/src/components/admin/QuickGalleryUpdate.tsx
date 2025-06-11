import React, { useState } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const QuickGalleryUpdate: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const updateWeddingGallery = async () => {
    setLoading(true);
    setStatus('Updating gallery...');
    
    try {
      // Find the first featured gallery
      const galleriesRef = collection(db, 'galleries');
      const featuredQuery = query(
        galleriesRef, 
        where('featured', '==', true)
      );
      
      const querySnapshot = await getDocs(featuredQuery);
      
      if (querySnapshot.empty) {
        setStatus('No featured galleries found.');
        setLoading(false);
        return;
      }
      
      // Get the first gallery (or the one with position-1 tag if it exists)
      let galleryDoc = querySnapshot.docs[0];
      
      // Check if any gallery has the position-1 tag
      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        if (data.tags && data.tags.includes('position-1')) {
          galleryDoc = doc;
          break;
        }
      }
      
      // Update the gallery
      const galleryRef = doc(db, 'galleries', galleryDoc.id);
      
      await updateDoc(galleryRef, {
        title: "Anna and Jose's Wedding",
        description: "Beautiful wedding photography featuring Anna and Jose's special day. Capturing precious moments of love and celebration.",
        clientName: "Anna and Jose",
        clientEmail: "annajose@example.com",
        category: "wedding",
        location: "Sunset Beach Resort"
      });
      
      setStatus(`Successfully updated gallery to "Anna and Jose's Wedding"`);
    } catch (error: any) {
      console.error('Error updating gallery:', error);
      setStatus(`Error: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Quick Gallery Update</h3>
        
        {status && (
          <div className={`p-2 mb-3 rounded text-sm ${
            status.includes('Error') 
              ? 'bg-red-100 text-red-700' 
              : status.includes('Success') 
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-100 text-blue-700'
          }`}>
            {status}
          </div>
        )}
        
        <button
          onClick={updateWeddingGallery}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Updating...' : "Update to 'Anna and Jose's Wedding'"}
        </button>
      </div>
    </div>
  );
};

export default QuickGalleryUpdate;
