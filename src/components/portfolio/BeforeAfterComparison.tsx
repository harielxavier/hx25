import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeftRight } from 'lucide-react';
import cloudinaryService from '../../services/cloudinaryService';
import { PortfolioImage } from '../../services/portfolioCategoryService';

interface BeforeAfterComparisonProps {
  beforeImage: PortfolioImage;
  afterImage: PortfolioImage;
  sliderPosition?: number; // 0-100, default 50
  showLabels?: boolean;
  className?: string;
}

export default function BeforeAfterComparison({
  beforeImage,
  afterImage,
  sliderPosition = 50,
  showLabels = true,
  className = ''
}: BeforeAfterComparisonProps) {
  const [position, setPosition] = useState(sliderPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle mouse/touch events for slider
  const handleMouseDown = () => {
    setIsDragging(true);
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    
    // Get client X position based on event type
    let clientX: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    
    // Calculate position relative to container
    const x = clientX - containerRect.left;
    const newPosition = Math.max(0, Math.min(100, (x / containerWidth) * 100));
    
    setPosition(newPosition);
  };
  
  // Add global event listeners for dragging
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);
    
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, []);
  
  // Handle keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setPosition(prev => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setPosition(prev => Math.min(100, prev + 5));
    }
  };
  
  return (
    <div 
      className={`relative overflow-hidden rounded-lg ${className}`}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={position}
      aria-label="Before/After comparison slider"
    >
      {/* Before image (full width) */}
      <div className="relative w-full">
        <Image
          src={cloudinaryService.getOptimizedUrl(beforeImage.imagePath, {
            width: 1200,
            height: 800,
            crop: 'limit',
            quality: 'auto',
            fetchFormat: 'auto'
          })}
          alt={beforeImage.title || 'Before'}
          width={beforeImage.width}
          height={beforeImage.height}
          className="w-full h-auto"
          priority
        />
        
        {/* After image (clipped) */}
        <div 
          className="absolute top-0 left-0 h-full overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <Image
            src={cloudinaryService.getOptimizedUrl(afterImage.imagePath, {
              width: 1200,
              height: 800,
              crop: 'limit',
              quality: 'auto',
              fetchFormat: 'auto'
            })}
            alt={afterImage.title || 'After'}
            width={afterImage.width}
            height={afterImage.height}
            className="w-full h-auto"
            style={{ width: `${100 / (position / 100)}%`, maxWidth: 'none' }}
            priority
          />
        </div>
        
        {/* Slider handle */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-lg"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center cursor-ew-resize">
            <ArrowLeftRight className="w-4 h-4 text-gray-700" />
          </div>
        </div>
        
        {/* Labels */}
        {showLabels && (
          <>
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              Before
            </div>
            <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              After
            </div>
          </>
        )}
      </div>
    </div>
  );
}
