import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Download, Package, CheckCircle, AlertCircle, 
  Image, FileText, Archive, ExternalLink
} from 'lucide-react';
import { GalleryMedia } from '../../services/galleryService';
import { 
  getSelectionPackages,
  generatePackageDownloadLinks,
  trackMediaDownload,
  SelectionPackage
} from '../../services/clientGalleryService';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface ClientDownloadCenterProps {
  galleryId: string;
  clientId: string;
}

interface DownloadLink {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
}

export default function ClientDownloadCenter({
  galleryId,
  clientId
}: ClientDownloadCenterProps) {
  const [packages, setPackages] = useState<SelectionPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<SelectionPackage | null>(null);
  const [downloadLinks, setDownloadLinks] = useState<DownloadLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Load selection packages
  useEffect(() => {
    const loadPackages = async () => {
      try {
        setIsLoading(true);
        const clientPackages = await getSelectionPackages(clientId, galleryId);
        
        // Filter to only show approved or delivered packages
        const availablePackages = clientPackages.filter(
          pkg => pkg.status === 'approved' || pkg.status === 'delivered'
        );
        
        setPackages(availablePackages);
        
        // Auto-select the first package if available
        if (availablePackages.length > 0) {
          setSelectedPackage(availablePackages[0]);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading packages:', error);
        toast.error('Failed to load your packages');
        setIsLoading(false);
      }
    };
    
    loadPackages();
  }, [galleryId, clientId]);

  // Load download links when a package is selected
  useEffect(() => {
    const loadDownloadLinks = async () => {
      if (!selectedPackage) return;
      
      try {
        setIsLoading(true);
        
        // Generate download links for the selected package
        const links = await generatePackageDownloadLinks(selectedPackage.id);
        setDownloadLinks(links);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error generating download links:', error);
        toast.error('Failed to generate download links');
        setIsLoading(false);
      }
    };
    
    loadDownloadLinks();
  }, [selectedPackage]);

  // Handle individual file download
  const handleDownloadFile = async (link: DownloadLink) => {
    try {
      // Track the download
      await trackMediaDownload(galleryId, link.id);
      
      // Trigger the download
      window.open(link.url, '_blank');
      
      toast.success('Download started!');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  // Handle batch download of all files
  const handleDownloadAll = async () => {
    if (!selectedPackage || downloadLinks.length === 0) return;
    
    try {
      setIsDownloading(true);
      setDownloadProgress(0);
      
      // Create a new zip file
      const zip = new JSZip();
      
      // Track progress
      let completedDownloads = 0;
      
      // Download each file and add to zip
      for (const link of downloadLinks) {
        try {
          // Fetch the file
          const response = await fetch(link.url);
          const blob = await response.blob();
          
          // Add to zip
          zip.file(link.filename, blob);
          
          // Track the download
          await trackMediaDownload(galleryId, link.id);
          
          // Update progress
          completedDownloads++;
          setDownloadProgress(Math.round((completedDownloads / downloadLinks.length) * 100));
        } catch (error) {
          console.error(`Error downloading ${link.filename}:`, error);
        }
      }
      
      // Generate the zip file
      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 5 }
      }, (metadata) => {
        setDownloadProgress(Math.round(metadata.percent));
      });
      
      // Save the zip file
      saveAs(zipBlob, `${selectedPackage.name.replace(/\s+/g, '-').toLowerCase()}.zip`);
      
      setIsDownloading(false);
      toast.success('All files downloaded successfully!');
    } catch (error) {
      console.error('Error downloading all files:', error);
      toast.error('Failed to download all files');
      setIsDownloading(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon based on type
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="w-5 h-5 text-blue-500" />;
    } else if (type === 'application/pdf') {
      return <FileText className="w-5 h-5 text-red-500" />;
    } else {
      return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  // Show empty state if no packages are available
  if (packages.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No Downloads Available</h2>
        <p className="text-gray-600 mb-6">
          You don't have any approved selections ready for download yet.
        </p>
      </div>
    );
  }

  return (
    <div className="client-download-center">
      {/* Package selector */}
      {packages.length > 1 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Package
          </label>
          <select 
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
            value={selectedPackage?.id || ''}
            onChange={(e) => {
              const selected = packages.find(pkg => pkg.id === e.target.value);
              setSelectedPackage(selected || null);
            }}
          >
            {packages.map(pkg => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name} ({pkg.status === 'approved' ? 'Approved' : 'Delivered'})
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Package info */}
      {selectedPackage && (
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{selectedPackage.name}</h2>
              <div className="flex items-center">
                {selectedPackage.status === 'approved' ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approved
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center">
                    <Package className="w-4 h-4 mr-1" />
                    Delivered
                  </span>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Images</p>
                <p className="font-medium">{downloadLinks.length} files</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Total Size</p>
                <p className="font-medium">
                  {formatFileSize(downloadLinks.reduce((total, link) => total + link.size, 0))}
                </p>
              </div>
            </div>
            
            {selectedPackage.comments && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-500 mb-1">Photographer Comments</p>
                <p className="text-gray-700 whitespace-pre-line">{selectedPackage.comments}</p>
              </div>
            )}
          </div>
          
          {/* Download all button */}
          <div className="p-6 bg-gray-50 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Download Options</p>
              <p className="text-xs text-gray-400">High-resolution images for printing and sharing</p>
            </div>
            
            <button 
              className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
              onClick={handleDownloadAll}
              disabled={isDownloading || downloadLinks.length === 0}
            >
              {isDownloading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {downloadProgress}% Downloading...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Download All Files
                </>
              )}
            </button>
          </div>
          
          {/* Progress bar for download */}
          {isDownloading && (
            <div className="px-6 pb-6">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-rose-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${downloadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">{downloadProgress}% Complete</p>
            </div>
          )}
        </div>
      )}
      
      {/* Individual files */}
      {selectedPackage && downloadLinks.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium">Individual Files</h3>
            <p className="text-sm text-gray-500">Download files individually</p>
          </div>
          
          <ul className="divide-y divide-gray-200">
            {downloadLinks.map((link) => (
              <li key={link.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getFileIcon(link.type)}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{link.filename}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(link.size)}</p>
                    </div>
                  </div>
                  
                  <button 
                    className="p-2 text-gray-600 hover:text-rose-600 rounded-full hover:bg-gray-100"
                    onClick={() => handleDownloadFile(link)}
                    title="Download file"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
