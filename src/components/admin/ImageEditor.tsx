import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { 
  Crop as CropIcon, 
  Filter, 
  Save, 
  XCircle,
  Undo,
  FlipHorizontal,
  FlipVertical,
  Type
} from 'lucide-react';
import { ImageMetadata } from '../../services/imageManagerService';

// Custom Slider component
const Slider = React.forwardRef<
  HTMLDivElement,
  {
    value: number[];
    min: number;
    max: number;
    step: number;
    onValueChange: (value: number[]) => void;
    className?: string;
  }
>(({ value, min, max, step, onValueChange, className }, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange([parseFloat(e.target.value)]);
  };

  return (
    <div ref={ref} className={`relative flex w-full touch-none select-none items-center ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={handleChange}
        className="h-2 w-full appearance-none rounded-full bg-gray-200 accent-blue-500"
      />
    </div>
  );
});
Slider.displayName = 'Slider';

interface ImageEditorProps {
  image: ImageMetadata;
  onSave: (editedImageUrl: string) => void;
  onCancel: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ image, onSave, onCancel }) => {
  // State
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [activeTab, setActiveTab] = useState<'crop' | 'adjust' | 'text'>('crop');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [textOverlay, setTextOverlay] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textSize, setTextSize] = useState(24);
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 });
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [textStartPosition, setTextStartPosition] = useState({ x: 0, y: 0 });
  
  // Refs
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  // Load the image
  useEffect(() => {
    if (image.url) {
      const img = new Image();
      img.src = image.url;
      img.onload = () => {
        // Set initial crop to maintain aspect ratio
        const aspectRatio = img.width / img.height;
        setCrop({
          unit: '%',
          width: 100,
          height: 100 / aspectRatio,
          x: 0,
          y: 0
        });
      };
    }
  }, [image.url]);
  
  // Generate preview when edits change
  useEffect(() => {
    if (!completedCrop || !canvasRef.current || !imgRef.current) return;
    
    const image = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    
    // Apply transformations
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    
    // Draw the image with crop
    ctx.drawImage(
      image,
      completedCrop.x,
      completedCrop.y,
      completedCrop.width,
      completedCrop.height,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );
    
    // Apply filters
    if (brightness !== 100 || contrast !== 100 || saturation !== 100) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        // Apply brightness
        if (brightness !== 100) {
          data[i] = Math.min(255, data[i] * (brightness / 100));
          data[i + 1] = Math.min(255, data[i + 1] * (brightness / 100));
          data[i + 2] = Math.min(255, data[i + 2] * (brightness / 100));
        }
        
        // Apply contrast
        if (contrast !== 100) {
          const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
          data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
          data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
          data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
        }
        
        // Apply saturation
        if (saturation !== 100) {
          const gray = 0.2989 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          data[i] = Math.min(255, Math.max(0, gray + (data[i] - gray) * (saturation / 100)));
          data[i + 1] = Math.min(255, Math.max(0, gray + (data[i + 1] - gray) * (saturation / 100)));
          data[i + 2] = Math.min(255, Math.max(0, gray + (data[i + 2] - gray) * (saturation / 100)));
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
    }
    
    // Add text overlay if specified
    if (textOverlay) {
      ctx.font = `${textSize}px Arial`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.fillText(
        textOverlay, 
        canvas.width * (textPosition.x / 100), 
        canvas.height * (textPosition.y / 100)
      );
    }
    
    ctx.restore();
    
    // Convert canvas to data URL for preview
    const dataUrl = canvas.toDataURL('image/jpeg');
    setPreviewUrl(dataUrl);
  }, [
    completedCrop, 
    rotation, 
    scale, 
    brightness, 
    contrast, 
    saturation, 
    flipHorizontal, 
    flipVertical,
    textOverlay,
    textColor,
    textSize,
    textPosition
  ]);
  
  // Handle text drag start
  const handleTextDragStart = (e: React.MouseEvent) => {
    if (!textRef.current) return;
    
    setIsDraggingText(true);
    setTextStartPosition({
      x: e.clientX,
      y: e.clientY
    });
  };
  
  // Handle text drag
  const handleTextDrag = (e: React.MouseEvent) => {
    if (!isDraggingText || !textRef.current) return;
    
    const deltaX = e.clientX - textStartPosition.x;
    const deltaY = e.clientY - textStartPosition.y;
    
    // Calculate new position as percentage of container
    const containerRect = textRef.current.parentElement?.getBoundingClientRect();
    if (!containerRect) return;
    
    const newX = Math.max(0, Math.min(100, textPosition.x + (deltaX / containerRect.width) * 100));
    const newY = Math.max(0, Math.min(100, textPosition.y + (deltaY / containerRect.height) * 100));
    
    setTextPosition({ x: newX, y: newY });
    setTextStartPosition({
      x: e.clientX,
      y: e.clientY
    });
  };
  
  // Handle text drag end
  const handleTextDragEnd = () => {
    setIsDraggingText(false);
  };
  
  // Handle save
  const handleSave = async () => {
    if (!previewUrl) return;
    
    try {
      // In a real implementation, you would upload the edited image
      // For this example, we'll just pass the data URL back
      onSave(previewUrl);
    } catch (error) {
      console.error('Error saving edited image:', error);
    }
  };
  
  // Reset all edits
  const handleReset = () => {
    setCrop({
      unit: '%',
      width: 100,
      height: 100,
      x: 0,
      y: 0
    });
    setRotation(0);
    setScale(1);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setFlipHorizontal(false);
    setFlipVertical(false);
    setTextOverlay('');
    setTextColor('#ffffff');
    setTextSize(24);
    setTextPosition({ x: 50, y: 50 });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Edit Image: {image.name}</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <XCircle size={24} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image preview */}
        <div className="lg:col-span-2 relative">
          <div className="border rounded-lg overflow-hidden">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={undefined}
            >
              <img
                ref={imgRef}
                src={image.url}
                alt={image.name}
                style={{
                  transform: `scale(${scale}) rotate(${rotation}deg) scaleX(${flipHorizontal ? -1 : 1}) scaleY(${flipVertical ? -1 : 1})`,
                  filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                  maxWidth: '100%',
                  maxHeight: '500px'
                }}
              />
            </ReactCrop>
            
            {/* Text overlay */}
            {textOverlay && (
              <div 
                ref={textRef}
                className="absolute cursor-move"
                style={{
                  left: `${textPosition.x}%`,
                  top: `${textPosition.y}%`,
                  transform: 'translate(-50%, -50%)',
                  color: textColor,
                  fontSize: `${textSize}px`,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  userSelect: 'none'
                }}
                onMouseDown={handleTextDragStart}
                onMouseMove={handleTextDrag}
                onMouseUp={handleTextDragEnd}
                onMouseLeave={handleTextDragEnd}
              >
                {textOverlay}
              </div>
            )}
          </div>
          
          {/* Canvas for generating the final image (hidden) */}
          <canvas
            ref={canvasRef}
            style={{ display: 'none' }}
          />
          
          {/* Preview */}
          {previewUrl && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Preview</h3>
              <div className="border rounded-lg overflow-hidden">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-w-full max-h-[200px] mx-auto"
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Edit controls */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-4">
            {/* Tabs */}
            <div className="flex border-b mb-4">
              <button
                className={`px-3 py-2 text-sm ${activeTab === 'crop' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                onClick={() => setActiveTab('crop')}
              >
                <CropIcon size={16} className="inline mr-1" />
                Crop & Rotate
              </button>
              <button
                className={`px-3 py-2 text-sm ${activeTab === 'adjust' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                onClick={() => setActiveTab('adjust')}
              >
                <Filter size={16} className="inline mr-1" />
                Adjust
              </button>
              <button
                className={`px-3 py-2 text-sm ${activeTab === 'text' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                onClick={() => setActiveTab('text')}
              >
                <Type size={16} className="inline mr-1" />
                Text
              </button>
            </div>
            
            {/* Crop & Rotate controls */}
            {activeTab === 'crop' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Rotation</label>
                  <div className="flex items-center">
                    <Slider
                      value={[rotation]}
                      min={-180}
                      max={180}
                      step={1}
                      onValueChange={(value: number[]) => setRotation(value[0])}
                      className="flex-1 mr-2"
                    />
                    <span className="text-sm w-8 text-right">{rotation}°</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Scale</label>
                  <div className="flex items-center">
                    <Slider
                      value={[scale]}
                      min={0.5}
                      max={2}
                      step={0.1}
                      onValueChange={(value: number[]) => setScale(value[0])}
                      className="flex-1 mr-2"
                    />
                    <span className="text-sm w-8 text-right">{scale.toFixed(1)}x</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFlipHorizontal(!flipHorizontal)}
                    className={`flex-1 py-2 px-3 border rounded ${flipHorizontal ? 'bg-blue-50 border-blue-500' : ''}`}
                  >
                    <FlipHorizontal size={16} className="inline mr-1" />
                    Flip H
                  </button>
                  <button
                    onClick={() => setFlipVertical(!flipVertical)}
                    className={`flex-1 py-2 px-3 border rounded ${flipVertical ? 'bg-blue-50 border-blue-500' : ''}`}
                  >
                    <FlipVertical size={16} className="inline mr-1" />
                    Flip V
                  </button>
                </div>
              </div>
            )}
            
            {/* Adjust controls */}
            {activeTab === 'adjust' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Brightness</label>
                  <div className="flex items-center">
                    <Slider
                      value={[brightness]}
                      min={0}
                      max={200}
                      step={1}
                      onValueChange={(value: number[]) => setBrightness(value[0])}
                      className="flex-1 mr-2"
                    />
                    <span className="text-sm w-8 text-right">{brightness}%</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Contrast</label>
                  <div className="flex items-center">
                    <Slider
                      value={[contrast]}
                      min={0}
                      max={200}
                      step={1}
                      onValueChange={(value: number[]) => setContrast(value[0])}
                      className="flex-1 mr-2"
                    />
                    <span className="text-sm w-8 text-right">{contrast}%</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Saturation</label>
                  <div className="flex items-center">
                    <Slider
                      value={[saturation]}
                      min={0}
                      max={200}
                      step={1}
                      onValueChange={(value: number[]) => setSaturation(value[0])}
                      className="flex-1 mr-2"
                    />
                    <span className="text-sm w-8 text-right">{saturation}%</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Text controls */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Text Overlay</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Enter text..."
                    value={textOverlay}
                    onChange={(e) => setTextOverlay(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Text Color</label>
                  <input
                    type="color"
                    className="w-full p-1 border rounded h-10"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Text Size</label>
                  <div className="flex items-center">
                    <Slider
                      value={[textSize]}
                      min={12}
                      max={72}
                      step={1}
                      onValueChange={(value: number[]) => setTextSize(value[0])}
                      className="flex-1 mr-2"
                    />
                    <span className="text-sm w-8 text-right">{textSize}px</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 italic">
                  Drag the text to position it on the image
                </p>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="mt-6 space-y-2">
              <button
                onClick={handleSave}
                className="w-full py-2 bg-blue-500 text-white rounded flex items-center justify-center"
                disabled={!previewUrl}
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </button>
              
              <button
                onClick={handleReset}
                className="w-full py-2 border rounded flex items-center justify-center"
              >
                <Undo size={16} className="mr-2" />
                Reset All
              </button>
              
              <button
                onClick={onCancel}
                className="w-full py-2 border-gray-300 border rounded text-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
