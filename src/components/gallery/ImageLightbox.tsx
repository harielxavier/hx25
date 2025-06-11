import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Heart, ZoomIn, ZoomOut } from 'lucide-react';
import { GalleryImage } from '../../services/galleryService';

interface ImageLightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onFavorite: (imageId: string) => void;
  onDownload: (image: GalleryImage) => void;
  favorites: string[];
  allowDownloads: boolean;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
  onFavorite,
  onDownload,
  favorites,
  allowDownloads
}) => {
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const currentImage = images[currentIndex];

  // Reset zoom and position when changing images
  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setImageLoaded(false);
  }, [currentIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        onNext();
      } else if (e.key === 'ArrowLeft') {
        onPrev();
      } else if (e.key === '+') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, onNext, onPrev]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.25, 1);
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setDragging(true);
      setStartPosition({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging && zoom > 1) {
      setPosition({
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoom > 1) {
      setDragging(true);
      setStartPosition({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragging && zoom > 1) {
      setPosition({
        x: e.touches[0].clientX - startPosition.x,
        y: e.touches[0].clientY - startPosition.y
      });
    }
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <div className="flex items-center">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full"
          >
            <X size={24} />
          </button>
          <div className="ml-4">
            <div className="text-sm opacity-80">
              {currentIndex + 1} / {images.length}
            </div>
            {currentImage.title && (
              <div className="text-lg font-medium">{currentImage.title}</div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onFavorite(currentImage.id)}
            className="p-2 hover:bg-gray-800 rounded-full"
          >
            <Heart 
              size={24} 
              fill={favorites.includes(currentImage.id) ? 'currentColor' : 'none'} 
              className={favorites.includes(currentImage.id) ? 'text-red-500' : 'text-white'}
            />
          </button>
          
          {allowDownloads && (
            <button
              onClick={() => onDownload(currentImage)}
              className="p-2 hover:bg-gray-800 rounded-full"
            >
              <Download size={24} />
            </button>
          )}
          
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-800 rounded-full"
            disabled={zoom >= 3}
          >
            <ZoomIn size={24} className={zoom >= 3 ? 'opacity-50' : ''} />
          </button>
          
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-800 rounded-full"
            disabled={zoom <= 1}
          >
            <ZoomOut size={24} className={zoom <= 1 ? 'opacity-50' : ''} />
          </button>
        </div>
      </div>
      
      {/* Image Container */}
      <div className="flex-1 flex items-center justify-center overflow-hidden relative">
        {/* Previous Button */}
        <button
          onClick={onPrev}
          className="absolute left-4 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
        >
          <ChevronLeft size={24} />
        </button>
        
        {/* Image */}
        <div 
          className={`relative transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
            cursor: zoom > 1 ? 'grab' : 'default',
            transform: `scale(${zoom})`,
            transition: dragging ? 'none' : 'transform 0.3s ease'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={currentImage.url}
            alt={currentImage.title || `Image ${currentIndex + 1}`}
            className="max-h-[calc(100vh-120px)] max-w-full object-contain"
            style={{
              transform: zoom > 1 ? `translate(${position.x}px, ${position.y}px)` : 'none',
              transition: dragging ? 'none' : 'transform 0.3s ease'
            }}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        
        {/* Next Button */}
        <button
          onClick={onNext}
          className="absolute right-4 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      
      {/* Caption */}
      {currentImage.description && (
        <div className="p-4 text-white text-center max-w-3xl mx-auto">
          <p>{currentImage.description}</p>
        </div>
      )}
      
      {/* Thumbnails */}
      <div className="bg-black p-2 overflow-x-auto">
        <div className="flex space-x-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => {
                setZoom(1);
                setPosition({ x: 0, y: 0 });
                setImageLoaded(false);
                onNext();
                // We use onNext here because it's easier than creating a new function
                // to set the current index directly. This will be overridden below.
                setTimeout(() => {
                  const event = new KeyboardEvent('keydown', {
                    key: index > currentIndex ? 'ArrowRight' : 'ArrowLeft',
                    repeat: true,
                    keyCode: index > currentIndex ? 39 : 37
                  });
                  window.dispatchEvent(event);
                }, 0);
              }}
              className={`relative flex-shrink-0 w-16 h-16 ${
                index === currentIndex ? 'ring-2 ring-white' : ''
              }`}
            >
              <img
                src={image.thumbnailUrl}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {favorites.includes(image.id) && (
                <div className="absolute top-1 right-1">
                  <Heart size={12} fill="currentColor" className="text-red-500" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageLightbox;
