import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  Check, X, Download, Send, Clock, Info, 
  ChevronLeft, ChevronRight, Filter, Heart, Share,
  CheckCircle, XCircle, AlertCircle, Package, User
} from 'lucide-react';
import { GalleryMedia } from '../../services/galleryService';
import { 
  getSelectionPackages,
  updatePackageStatus,
  getClientSelections,
  getClient,
  SelectionPackage,
  Client
} from '../../services/clientGalleryService';
import PhotoGallery from '../gallery/PhotoGallery';

interface PhotographerReviewDashboardProps {
  galleryId: string;
  onComplete?: () => void;
}

export default function PhotographerReviewDashboard({
  galleryId,
  onComplete
}: PhotographerReviewDashboardProps) {
  const [packages, setPackages] = useState<(SelectionPackage & { client?: Client })[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<SelectionPackage | null>(null);
  const [selectedImages, setSelectedImages] = useState<GalleryMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reviewComments, setReviewComments] = useState('');
  const [clients, setClients] = useState<Map<string, Client>>(new Map());
  
  const navigate = useNavigate();

  // Load all selection packages for this gallery
  useEffect(() => {
    const loadSelectionPackages = async () => {
      try {
        setIsLoading(true);
        
        // Get all clients with access to this gallery
        const clientsMap = new Map<string, Client>();
        
        // Get all selection packages for this gallery
        const allPackages: (SelectionPackage & { client?: Client })[] = [];
        
        // This would normally be a single API call to get all packages for a gallery
        // But for now we'll simulate it by getting packages for each client
        const clientsRef = await fetch(`/api/galleries/${galleryId}/clients`);
        const clientsData = await clientsRef.json();
        
        for (const clientData of clientsData) {
          const client = clientData as Client;
          clientsMap.set(client.id, client);
          
          const clientPackages = await getSelectionPackages(client.id, galleryId);
          
          // Add client info to each package
          clientPackages.forEach(pkg => {
            allPackages.push({
              ...pkg,
              client
            });
          });
        }
        
        setClients(clientsMap);
        setPackages(allPackages);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading selection packages:', error);
        toast.error('Failed to load selection packages');
        setIsLoading(false);
      }
    };
    
    loadSelectionPackages();
  }, [galleryId]);

  // Load selected images when a package is selected
  useEffect(() => {
    const loadSelectedImages = async () => {
      if (!selectedPackage) return;
      
      try {
        setIsLoading(true);
        
        // Get client selections for this gallery
        const selections = await getClientSelections(selectedPackage.clientId, galleryId);
        
        // Filter to only show the selected images in this package
        const packageImages = selections.filter(img => 
          selectedPackage.selectionIds.includes(img.id)
        );
        
        setSelectedImages(packageImages);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading selected images:', error);
        toast.error('Failed to load selected images');
        setIsLoading(false);
      }
    };
    
    loadSelectedImages();
  }, [selectedPackage, galleryId]);

  // Handle package status update
  const handleUpdateStatus = async (status: SelectionPackage['status']) => {
    if (!selectedPackage) return;
    
    try {
      setIsProcessing(true);
      
      await updatePackageStatus(
        selectedPackage.id,
        status,
        reviewComments
      );
      
      toast.success(`Selection package ${status === 'approved' ? 'approved' : 'delivered'}!`);
      
      // Update local state
      setPackages(prevPackages => 
        prevPackages.map(pkg => 
          pkg.id === selectedPackage.id 
            ? { ...pkg, status } 
            : pkg
        )
      );
      
      // Reset selection
      setSelectedPackage(null);
      setSelectedImages([]);
      setReviewComments('');
      setIsProcessing(false);
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error updating package status:', error);
      toast.error('Failed to update package status');
      setIsProcessing(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status: SelectionPackage['status']) => {
    switch (status) {
      case 'draft':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Draft</span>;
      case 'submitted':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Submitted</span>;
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Approved</span>;
      case 'delivered':
        return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Delivered</span>;
      default:
        return null;
    }
  };

  // Render package list
  const renderPackageList = () => (
    <div className="package-list">
      <h2 className="text-2xl font-semibold mb-6">Client Selection Packages</h2>
      
      {packages.length === 0 ? (
        <div className="bg-gray-50 p-8 text-center rounded-lg">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Selection Packages</h3>
          <p className="text-gray-500">
            No clients have submitted their selections yet.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Selections
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {pkg.client?.name || 'Unknown Client'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {pkg.client?.email || 'No email'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pkg.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(pkg.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pkg.selectionIds.length} images
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pkg.submittedAt ? new Date(pkg.submittedAt.seconds * 1000).toLocaleDateString() : 'Not submitted'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-rose-600 hover:text-rose-900 mr-4"
                      onClick={() => setSelectedPackage(pkg)}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // Render package review
  const renderPackageReview = () => {
    if (!selectedPackage) return null;
    
    const client = clients.get(selectedPackage.clientId);
    
    return (
      <div className="package-review">
        <div className="flex items-center justify-between mb-6">
          <button 
            className="flex items-center text-gray-600 hover:text-gray-900"
            onClick={() => {
              setSelectedPackage(null);
              setSelectedImages([]);
              setReviewComments('');
            }}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Packages
          </button>
          
          <div className="flex items-center">
            {getStatusBadge(selectedPackage.status)}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Review: {selectedPackage.name}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Client</h3>
              <p className="text-gray-900">{client?.name || 'Unknown Client'}</p>
              <p className="text-gray-600">{client?.email || 'No email'}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Submission Date</h3>
              <p className="text-gray-900">
                {selectedPackage.submittedAt 
                  ? new Date(selectedPackage.submittedAt.seconds * 1000).toLocaleDateString() 
                  : 'Not submitted'}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Selections</h3>
              <p className="text-gray-900">{selectedPackage.selectionIds.length} images</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
              <p className="text-gray-900">{selectedPackage.status.charAt(0).toUpperCase() + selectedPackage.status.slice(1)}</p>
            </div>
          </div>
          
          {selectedPackage.comments && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Client Comments</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700 whitespace-pre-line">{selectedPackage.comments}</p>
              </div>
            </div>
          )}
          
          {/* Review comments textarea */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Comments (will be sent to client)
            </label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
              rows={4}
              value={reviewComments}
              onChange={(e) => setReviewComments(e.target.value)}
              placeholder="Add any comments about the selections..."
            />
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-end space-x-4">
            {selectedPackage.status === 'submitted' && (
              <button 
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                onClick={() => handleUpdateStatus('approved')}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Selections
                  </>
                )}
              </button>
            )}
            
            {selectedPackage.status === 'approved' && (
              <button 
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                onClick={() => handleUpdateStatus('delivered')}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4 mr-2" />
                    Mark as Delivered
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* Selected images */}
        <h3 className="text-lg font-medium mb-4">Selected Images</h3>
        
        {selectedImages.length === 0 ? (
          <div className="bg-gray-50 p-8 text-center rounded-lg">
            <p className="text-gray-500">Loading selected images...</p>
          </div>
        ) : (
          <PhotoGallery 
            images={selectedImages.map(img => ({
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
            allowSelection={false}
          />
        )}
      </div>
    );
  };

  // Show loading state
  if (isLoading && !selectedPackage) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  // Render the appropriate view
  return (
    <div className="photographer-review-dashboard">
      {selectedPackage ? renderPackageReview() : renderPackageList()}
    </div>
  );
}
