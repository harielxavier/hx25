import React, { useState } from 'react';
import './BeforeAfterSlider.css';

interface BeforeAfterProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
}

const BeforeAfterSlider: React.FC<BeforeAfterProps> = ({
  beforeImage,
  afterImage,
  beforeAlt = "Before editing",
  afterAlt = "After professional editing"
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percent)));
  };

  return (
    <div 
      className="before-after-container" 
      onMouseMove={handleMouseMove}
      onTouchMove={(e) => {
        const touch = e.touches[0];
        const rect = e.currentTarget.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const percent = (x / rect.width) * 100;
        setSliderPosition(Math.max(0, Math.min(100, percent)));
      }}
    >
      <div className="before-image-container">
        <img src={beforeImage} alt={beforeAlt} />
      </div>
      <div 
        className="after-image-container" 
        style={{ width: `${sliderPosition}%` }}
      >
        <img src={afterImage} alt={afterAlt} />
      </div>
      <div 
        className="slider-handle"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="slider-handle-line"></div>
        <div className="slider-handle-circle">
          <span className="slider-arrow-left">◀</span>
          <span className="slider-arrow-right">▶</span>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
