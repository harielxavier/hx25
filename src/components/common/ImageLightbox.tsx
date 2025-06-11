import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, Info, Camera, Clock, Aperture, Zap, Ruler } from 'lucide-react';
import Image from 'next/image';

interface LightboxImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  title?: string;
  description?: string;
  metadata?: {
    camera?: string;
    lens?: string;
    location?: string;
    aperture?: string;
    shutterSpeed?: string;
    iso?: number;
    focalLength?: string;
  };
}

interface ImageLightboxProps {
  images: LightboxImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  showDownload?: boolean;
  showInfo?: boolean;
}

export default function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onNavigate,
  showDownload = true,
  showInfo = true
}: ImageLightboxProps) {
  const [showMetadata, setShowMetadata] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Get current image
  const currentImage = images[currentIndex];
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        navigatePrev();
      } else if (e.key === 'ArrowRight') {
        navigateNext();
      } else if (e.key === 'i') {
        setShowMetadata(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Disable body scroll
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [currentIndex, images.length]);
  
  // Navigate to previous image
  const navigatePrev = () => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    } else {
      // Loop to the last image
      onNavigate(images.length - 1);
    }
  };
  
  // Navigate to next image
  const navigateNext = () => {
    if (currentIndex < images.length - 1) {
      onNavigate(currentIndex + 1);
    } else {
      // Loop to the first image
      onNavigate(0);
    }
  };
  
  // Handle touch events for swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      navigateNext();
    } else if (isRightSwipe) {
      navigatePrev();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };
  
  // Handle download
  const handleDownload = async () => {
    try {
      const response = await fetch(currentImage.src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = currentImage.title || `image-${currentIndex + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 focus:outline-none"
        onClick={onClose}
      >
        <X className="w-6 h-6" />
      </button>
      
      {/* Navigation buttons */}
      <button
        className="absolute left-4 z-50 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 focus:outline-none"
        onClick={(e) => {
          e.stopPropagation();
          navigatePrev();
        }}
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      
      <button
        className="absolute right-4 z-50 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 focus:outline-none"
        onClick={(e) => {
          e.stopPropagation();
          navigateNext();
        }}
      >
        <ChevronRight className="w-8 h-8" />
      </button>
      
      {/* Image container */}
      <div
        className="relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative max-w-[90vw] max-h-[85vh]">
          <Image
            src={currentImage.src}
            alt={currentImage.alt || `Image ${currentIndex + 1}`}
            width={currentImage.width}
            height={currentImage.height}
            className="max-w-full max-h-[85vh] object-contain"
            priority
          />
        </div>
      </div>
      
      {/* Info button */}
      {showInfo && (
        <button
          className="absolute bottom-4 left-4 z-50 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 focus:outline-none"
          onClick={(e) => {
            e.stopPropagation();
            setShowMetadata(prev => !prev);
          }}
        >
          <Info className="w-6 h-6" />
        </button>
      )}
      
      {/* Download button */}
      {showDownload && (
        <button
          className="absolute bottom-4 right-4 z-50 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 focus:outline-none"
          onClick={(e) => {
            e.stopPropagation();
            handleDownload();
          }}
        >
          <Download className="w-6 h-6" />
        </button>
      )}
      
      {/* Image counter */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
        {currentIndex + 1} / {images.length}
      </div>
      
      {/* Image metadata */}
      <AnimatePresence>
        {showMetadata && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-black bg-opacity-75 text-white p-4 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {currentImage.title && (
              <h3 className="text-lg font-medium mb-1">{currentImage.title}</h3>
            )}
            
            {currentImage.description && (
              <p className="text-sm text-gray-300 mb-3">{currentImage.description}</p>
            )}
            
            {currentImage.metadata && (
              <div className="space-y-2 text-sm">
                {currentImage.metadata.camera && (
                  <div className="flex items-center">
                    <Camera className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{currentImage.metadata.camera}</span>
                    {currentImage.metadata.lens && (
                      <span className="ml-1">+ {currentImage.metadata.lens}</span>
                    )}
                  </div>
                )}
                
                {currentImage.metadata.location && (
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400">
                        <path d="M12 2a6.5 6.5 0 0 1 6.5 6.5c0 2.5-2.5 7.5-6.5 12-4-4.5-6.5-9.5-6.5-12A6.5 6.5 0 0 1 12 2z" />
                        <circle cx="12" cy="8.5" r="2" />
                      </svg>
                    </div>
                    <span>{currentImage.metadata.location}</span>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                  {currentImage.metadata.aperture && (
                    <div className="flex items-center">
                      <Aperture className="w-4 h-4 mr-1 text-gray-400" />
                      <span>ƒ/{currentImage.metadata.aperture}</span>
                    </div>
                  )}
                  
                  {currentImage.metadata.shutterSpeed && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-gray-400" />
                      <span>{currentImage.metadata.shutterSpeed}s</span>
                    </div>
                  )}
                  
                  {currentImage.metadata.iso !== undefined && (
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 mr-1 text-gray-400" />
                      <span>ISO {currentImage.metadata.iso}</span>
                    </div>
                  )}
                  
                  {currentImage.metadata.focalLength && (
                    <div className="flex items-center">
                      <Ruler className="w-4 h-4 mr-1 text-gray-400" />
                      <span>{currentImage.metadata.focalLength}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
