import { useState } from 'react';
// REMOVED FIREBASE: import { doc, updateDoc // REMOVED FIREBASE
// REMOVED FIREBASE: import { db } from '../../firebase/config';
import { transformImageUrl } from '../../utils/imageOptimizationUtils';
import { toast } from 'react-hot-toast';

interface PortfolioImage {
  id: string;
  src: string;
  alt: string;
  section: string;
  featured: boolean;
  width: number;
  height: number;
  order?: number;
}

interface EnhancedGallerySelectorProps {
  portfolioId: string;
  images: PortfolioImage[];
  currentCoverImageId?: string;
  onClose: () => void;
}

const EnhancedGallerySelector = ({
  portfolioId,
  images,
  currentCoverImageId,
  onClose
}: EnhancedGallerySelectorProps) => {
  const [selectedImageId, setSelectedImageId] = useState<string | null>(currentCoverImageId || null);
  const [saving, setSaving] = useState(false);

  // Handle image selection
  const handleImageSelect = (imageId: string) => {
    setSelectedImageId(imageId);
  };

  // Save the selected image as the album cover
  const handleSave = async () => {
    if (!selectedImageId) {
      toast.error("Please select an image first");
      return;
    }

    try {
      setSaving(true);
      // Get the selected image
      const selectedImage = images.find(img => img.id === selectedImageId);
      if (!selectedImage) {
        toast.error("Selected image not found");
        setSaving(false);
        return;
      }

      // Update the portfolio document with the new cover image
      const portfolioRef = doc(db, 'portfolios', portfolioId);
      await updateDoc(portfolioRef, {
        coverImage: selectedImage.src
      });

      toast.success("Album cover updated successfully");
      setSaving(false);
      onClose();
    } catch (error) {
      console.error("Error updating album cover:", error);
      toast.error("Failed to update album cover");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">Select Album Cover Image</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Click on an image to select it as the album cover. Each image has a number identifier for easy reference.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div 
                key={image.id}
                className={`relative cursor-pointer rounded-lg overflow-hidden border-4 ${
                  selectedImageId === image.id ? 'border-blue-500' : 'border-transparent'
                }`}
                onClick={() => handleImageSelect(image.id)}
              >
                {/* Number Identifier */}
                <div className="absolute top-2 left-2 z-10 bg-black bg-opacity-70 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                
                {/* Selected Indicator */}
                {selectedImageId === image.id && (
                  <div className="absolute top-2 right-2 z-10 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                
                {/* Current Cover Indicator */}
                {currentCoverImageId === image.id && selectedImageId !== image.id && (
                  <div className="absolute top-2 right-2 z-10 bg-green-500 text-white rounded-full px-2 py-1 text-xs">
                    Current
                  </div>
                )}
                
                <div className="aspect-square">
                  <img 
                    src={transformImageUrl(image.src, 300)} 
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-sm truncate">
                  {image.alt || `Image ${index + 1}`}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedImageId || saving}
            className={`px-4 py-2 rounded-md text-white ${
              !selectedImageId || saving
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {saving ? 'Saving...' : 'Set as Album Cover'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedGallerySelector;
