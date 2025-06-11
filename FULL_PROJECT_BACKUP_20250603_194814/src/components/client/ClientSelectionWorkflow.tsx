import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  Check, X, Download, Send, Clock, Info, 
  ChevronLeft, ChevronRight, Filter, Heart, Share 
} from 'lucide-react';
import { GalleryMedia } from '../../services/galleryService';
import { 
  getClientSelections, 
  toggleClientSelection, 
  createSelectionPackage, 
  getSelectionPackages,
  SelectionPackage
} from '../../services/clientGalleryService';
import PhotoGallery from '../gallery/PhotoGallery';

interface ClientSelectionWorkflowProps {
  galleryId: string;
  clientId: string;
  maxSelections?: number | null;
  deadlineDate?: Date | null;
  onComplete?: () => void;
}

export default function ClientSelectionWorkflow({
  galleryId,
  clientId,
  maxSelections = null,
  deadlineDate = null,
  onComplete
}: ClientSelectionWorkflowProps) {
  const [images, setImages] = useState<GalleryMedia[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [packages, setPackages] = useState<SelectionPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentView, setCurrentView] = useState<'selection' | 'review' | 'confirmation'>('selection');
  const [comments, setComments] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  
  const navigate = useNavigate();

  // Load client selections
  useEffect(() => {
    const loadSelections = async () => {
      try {
        setIsLoading(true);
        const selections = await getClientSelections(clientId, galleryId);
        setImages(selections);
        
        // Extract selected image IDs
        const selected = selections
          .filter(img => img.clientSelected)
          .map(img => img.id);
        setSelectedIds(selected);
        
        // Extract all unique tags for filtering
        const tags = selections.reduce((allTags: string[], img) => {
          if (img.tags && Array.isArray(img.tags)) {
            img.tags.forEach(tag => {
              if (!allTags.includes(tag)) {
                allTags.push(tag);
              }
            });
          }
          return allTags;
        }, []);
        setAvailableTags(tags);
        
        // Load existing selection packages
        const existingPackages = await getSelectionPackages(clientId, galleryId);
        setPackages(existingPackages);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading selections:', error);
        toast.error('Failed to load your selections');
        setIsLoading(false);
      }
    };
    
    loadSelections();
  }, [galleryId, clientId]);

  // Handle selection changes
  const handleSelectionChange = async (selectedImageIds: string[]) => {
    try {
      setSelectedIds(selectedImageIds);
      
      // If max selections is set, enforce the limit
      if (maxSelections !== null && selectedImageIds.length > maxSelections) {
        toast.error(`You can only select up to ${maxSelections} images`);
        // Remove the last selected image
        const newSelection = [...selectedImageIds];
        newSelection.pop();
        setSelectedIds(newSelection);
        return;
      }
      
      // Find the image that was just toggled
      const lastToggled = images.find(img => 
        (selectedImageIds.includes(img.id) && !img.clientSelected) || 
        (!selectedImageIds.includes(img.id) && img.clientSelected)
      );
      
      if (lastToggled) {
        const isSelected = selectedImageIds.includes(lastToggled.id);
        
        // Update in Firebase
        await toggleClientSelection(
          clientId,
          galleryId,
          lastToggled.id,
          isSelected
        );
        
        // Update local state
        setImages(prevImages => 
          prevImages.map(img => 
            img.id === lastToggled.id 
              ? { ...img, clientSelected: isSelected } 
              : img
          )
        );
      }
    } catch (error) {
      console.error('Error updating selection:', error);
      toast.error('Failed to update your selection');
    }
  };

  // Submit selections
  const handleSubmitSelections = async () => {
    try {
      setIsSubmitting(true);
      
      // Create a selection package
      const packageName = `Selection ${packages.length + 1}`;
      await createSelectionPackage(galleryId, clientId, {
        name: packageName,
        status: 'submitted',
        selectionIds: selectedIds,
        comments,
        submittedAt: new Date() as any
      });
      
      toast.success('Your selections have been submitted!');
      setCurrentView('confirmation');
      setIsSubmitting(false);
      
      // Refresh packages
      const updatedPackages = await getSelectionPackages(clientId, galleryId);
      setPackages(updatedPackages);
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error submitting selections:', error);
      toast.error('Failed to submit your selections');
      setIsSubmitting(false);
    }
  };

  // Filter images by tag
  const filteredImages = activeFilter 
    ? images.filter(img => img.tags && img.tags.includes(activeFilter))
    : images;

  // Deadline information
  const hasDeadline = deadlineDate !== null;
  const deadlineHasPassed = hasDeadline && deadlineDate && new Date() > deadlineDate;
  const daysUntilDeadline = hasDeadline && deadlineDate 
    ? Math.ceil((deadlineDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Render selection view
  const renderSelectionView = () => (
    <div className="selection-view">
      {/* Selection header with counts and filters */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Heart className="w-5 h-5 text-rose-500 mr-2" />
            <span className="font-medium">
              {selectedIds.length} selected
              {maxSelections !== null && ` of ${maxSelections} maximum`}
            </span>
          </div>
          
          {hasDeadline && (
            <div className="flex items-center">
              <Clock className={`w-5 h-5 mr-2 ${deadlineHasPassed ? 'text-red-500' : 'text-amber-500'}`} />
              <span className={`font-medium ${deadlineHasPassed ? 'text-red-500' : ''}`}>
                {deadlineHasPassed 
                  ? 'Selection deadline has passed' 
                  : `${daysUntilDeadline} days remaining`}
              </span>
            </div>
          )}
        </div>
        
        {/* Filter dropdown */}
        <div className="relative">
          <button 
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
            onClick={() => document.getElementById('filter-dropdown')?.classList.toggle('hidden')}
          >
            <Filter className="w-4 h-4" />
            <span>{activeFilter || 'Filter by tag'}</span>
          </button>
          
          <div id="filter-dropdown" className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden">
            <div className="py-1">
              <button 
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setActiveFilter(null);
                  document.getElementById('filter-dropdown')?.classList.add('hidden');
                }}
              >
                All images
              </button>
              
              {availableTags.map(tag => (
                <button 
                  key={tag}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setActiveFilter(tag);
                    document.getElementById('filter-dropdown')?.classList.add('hidden');
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Photo gallery with selection capability */}
      <PhotoGallery 
        images={filteredImages.map(img => ({
          id: img.id,
          url: img.url,
          thumbnailUrl: img.thumbnailUrl,
          title: img.title,
          description: img.description,
          width: img.width,
          height: img.height,
          featured: img.featured,
          tags: img.tags,
          clientSelected: img.clientSelected,
          photographerSelected: img.photographerSelected
        }))}
        allowSelection={true}
        onSelectionChange={handleSelectionChange}
        initialSelectedIds={selectedIds}
      />
      
      {/* Action buttons */}
      <div className="mt-8 flex justify-between">
        <button 
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="w-5 h-5 inline mr-2" />
          Back
        </button>
        
        <button 
          className="px-6 py-3 bg-rose-600 text-white rounded-md hover:bg-rose-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={() => setCurrentView('review')}
          disabled={selectedIds.length === 0 || (maxSelections !== null && selectedIds.length !== maxSelections)}
        >
          Review Selections
          <ChevronRight className="w-5 h-5 inline ml-2" />
        </button>
      </div>
    </div>
  );

  // Render review view
  const renderReviewView = () => (
    <div className="review-view">
      <h2 className="text-2xl font-semibold mb-4">Review Your Selections</h2>
      
      {/* Selected images grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {selectedIds.map(id => {
          const image = images.find(img => img.id === id);
          if (!image) return null;
          
          return (
            <div key={id} className="relative">
              <img 
                src={image.thumbnailUrl} 
                alt={image.title || 'Selected image'} 
                className="w-full h-40 object-cover rounded-md"
              />
              <button 
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                onClick={() => handleSelectionChange(selectedIds.filter(imgId => imgId !== id))}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          );
        })}
      </div>
      
      {/* Comments textarea */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add any comments or special requests (optional)
        </label>
        <textarea 
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
          rows={4}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Any special requests or comments about your selections..."
        />
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-between">
        <button 
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          onClick={() => setCurrentView('selection')}
        >
          <ChevronLeft className="w-5 h-5 inline mr-2" />
          Back to Selection
        </button>
        
        <button 
          className="px-6 py-3 bg-rose-600 text-white rounded-md hover:bg-rose-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
          onClick={handleSubmitSelections}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            <>
              Submit Selections
              <Send className="w-5 h-5 inline ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );

  // Render confirmation view
  const renderConfirmationView = () => (
    <div className="confirmation-view text-center py-12">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="w-10 h-10 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-semibold mb-2">Selections Submitted!</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Thank you for submitting your selections. Your photographer will review them and get back to you soon.
      </p>
      
      <div className="flex justify-center space-x-4">
        <button 
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          onClick={() => navigate(-1)}
        >
          Return to Gallery
        </button>
        
        <button 
          className="px-6 py-3 bg-rose-600 text-white rounded-md hover:bg-rose-700"
          onClick={() => setCurrentView('selection')}
        >
          Make New Selections
        </button>
      </div>
    </div>
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  // Render the appropriate view
  return (
    <div className="client-selection-workflow">
      {currentView === 'selection' && renderSelectionView()}
      {currentView === 'review' && renderReviewView()}
      {currentView === 'confirmation' && renderConfirmationView()}
    </div>
  );
}
