import { useState, useEffect, useRef } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After'
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const mouseX = e.clientX - containerRect.left;
    
    // Calculate position as percentage
    let newPosition = (mouseX / containerWidth) * 100;
    
    // Clamp position between 0 and 100
    newPosition = Math.max(0, Math.min(100, newPosition));
    
    setSliderPosition(newPosition);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const touchX = e.touches[0].clientX - containerRect.left;
    
    // Calculate position as percentage
    let newPosition = (touchX / containerWidth) * 100;
    
    // Clamp position between 0 and 100
    newPosition = Math.max(0, Math.min(100, newPosition));
    
    setSliderPosition(newPosition);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove as any);
      window.addEventListener('touchend', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove as any);
      window.removeEventListener('touchend', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove as any);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[3/2] overflow-hidden cursor-ew-resize group"
    >
      {/* Before Image (Full Width) */}
      <div className="absolute inset-0">
        <img 
          src={beforeImage} 
          alt={beforeLabel}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 text-sm rounded">
          {beforeLabel}
        </div>
      </div>
      
      {/* After Image (Partial Width based on slider) */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={afterImage} 
          alt={afterLabel}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 text-sm rounded">
          {afterLabel}
        </div>
      </div>
      
      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-md cursor-ew-resize z-10 group-hover:w-2 transition-all"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="flex flex-col gap-1">
            <span className="w-1 h-3 bg-gray-400 rounded-full"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
