import React, { useState, useEffect } from 'react';
import { Save, Upload, Info, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const WeddingSliderSettings: React.FC = () => {
  const [leftImage, setLeftImage] = useState<string>('');
  const [rightImage, setRightImage] = useState<string>('');
  const [leftImageFile, setLeftImageFile] = useState<File | null>(null);
  const [rightImageFile, setRightImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previousImages, setPreviousImages] = useState<{url: string, name: string}[]>([]);

  const storage = getStorage();
  const db = getFirestore();

  // Load current slider images from Firestore
  useEffect(() => {
    const fetchSliderSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'weddingSlider');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setLeftImage(data.leftImage || '');
          setRightImage(data.rightImage || '');
        }
      } catch (error) {
        console.error('Error fetching slider settings:', error);
      }
    };

    const fetchPreviousImages = async () => {
      try {
        const imagesRef = ref(storage, 'wedding-slider');
        const result = await listAll(imagesRef);
        
        const imagePromises = result.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return { url, name: itemRef.name };
        });
        
        const images = await Promise.all(imagePromises);
        setPreviousImages(images);
      } catch (error) {
        console.error('Error fetching previous images:', error);
      }
    };

    fetchSliderSettings();
    fetchPreviousImages();
  }, [db, storage]);

  // Handle file selection for left image
  const handleLeftImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLeftImageFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLeftImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle file selection for right image
  const handleRightImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setRightImageFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setRightImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Select a previous image for the left side
  const selectLeftImage = (url: string) => {
    setLeftImage(url);
    setLeftImageFile(null);
  };

  // Select a previous image for the right side
  const selectRightImage = (url: string) => {
    setRightImage(url);
    setRightImageFile(null);
  };

  // Upload and save settings
  const handleSave = async () => {
    setIsSaving(true);
    setIsUploading(true);
    setSaveMessage(null);
    
    try {
      let leftImageUrl = leftImage;
      let rightImageUrl = rightImage;
      
      // Upload left image if a new file was selected
      if (leftImageFile) {
        const leftImageRef = ref(storage, `wedding-slider/${Date.now()}-left.jpg`);
        await uploadBytes(leftImageRef, leftImageFile);
        leftImageUrl = await getDownloadURL(leftImageRef);
      }
      
      // Upload right image if a new file was selected
      if (rightImageFile) {
        const rightImageRef = ref(storage, `wedding-slider/${Date.now()}-right.jpg`);
        await uploadBytes(rightImageRef, rightImageFile);
        rightImageUrl = await getDownloadURL(rightImageRef);
      }
      
      // Save settings to Firestore
      await setDoc(doc(db, 'settings', 'weddingSlider'), {
        leftImage: leftImageUrl,
        rightImage: rightImageUrl,
        updatedAt: new Date().toISOString()
      });
      
      // Refresh the list of previous images
      const imagesRef = ref(storage, 'wedding-slider');
      const result = await listAll(imagesRef);
      
      const imagePromises = result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return { url, name: itemRef.name };
      });
      
      const images = await Promise.all(imagePromises);
      setPreviousImages(images);
      
      // Clear file selections
      setLeftImageFile(null);
      setRightImageFile(null);
      
      // Show success message
      setSaveMessage({
        type: 'success',
        text: 'Wedding slider images saved successfully!'
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error saving slider settings:', error);
      setSaveMessage({
        type: 'error',
        text: 'Failed to save settings. Please try again.'
      });
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  // Delete an image from storage
  const deleteImage = async (imageName: string) => {
    try {
      const imageRef = ref(storage, `wedding-slider/${imageName}`);
      await deleteObject(imageRef);
      
      // Update the list of previous images
      setPreviousImages(previousImages.filter(img => img.name !== imageName));
      
      // Show success message
      setSaveMessage({
        type: 'success',
        text: 'Image deleted successfully!'
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error deleting image:', error);
      setSaveMessage({
        type: 'error',
        text: 'Failed to delete image. Please try again.'
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Wedding Slider Settings</h1>
        <p className="text-gray-600">Manage the images for the wedding photography slider on the landing page</p>
      </div>
      
      {saveMessage && (
        <div className={`mb-4 p-4 rounded-md ${saveMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {saveMessage.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{saveMessage.text}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <Info className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-lg font-medium">Image Requirements</h3>
            </div>
            <ul className="list-disc pl-10 text-gray-600 text-sm">
              <li>Recommended size: 1920 x 1080 pixels (16:9 aspect ratio)</li>
              <li>Maximum file size: 2MB</li>
              <li>Supported formats: JPG, PNG</li>
              <li>For best results, use high-quality images with good contrast</li>
              <li>Left image represents "Documentary Style" photography</li>
              <li>Right image represents "Directed Style" photography</li>
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Image (Documentary Style) */}
            <div>
              <h3 className="text-lg font-medium mb-4">Left Image (Documentary Style)</h3>
              
              <div className="mb-4 aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden relative">
                {leftImage ? (
                  <img 
                    src={leftImage} 
                    alt="Documentary Style" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400">No image selected</p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center">
                <label className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Image
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/jpeg,image/png"
                    onChange={handleLeftImageChange}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>
            
            {/* Right Image (Directed Style) */}
            <div>
              <h3 className="text-lg font-medium mb-4">Right Image (Directed Style)</h3>
              
              <div className="mb-4 aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden relative">
                {rightImage ? (
                  <img 
                    src={rightImage} 
                    alt="Directed Style" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400">No image selected</p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center">
                <label className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Image
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/jpeg,image/png"
                    onChange={handleRightImageChange}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>
          </div>
          
          {/* Preview of the slider */}
          <div className="mt-12 mb-8">
            <h3 className="text-lg font-medium mb-4">Slider Preview</h3>
            
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-gray-200">
              {/* Left Image (Documentary) */}
              <div 
                className="absolute inset-0 z-0"
                style={{ 
                  clipPath: `polygon(0 0, 50% 0, 50% 100%, 0 100%)`,
                }}
              >
                {leftImage ? (
                  <img 
                    src={leftImage} 
                    alt="Documentary Style" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">Left Image</p>
                  </div>
                )}
              </div>
              
              {/* Right Image (Directed) */}
              <div 
                className="absolute inset-0 z-0"
                style={{ 
                  clipPath: `polygon(50% 0, 100% 0, 100% 100%, 50% 100%)`,
                }}
              >
                {rightImage ? (
                  <img 
                    src={rightImage} 
                    alt="Directed Style" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <p className="text-gray-500">Right Image</p>
                  </div>
                )}
              </div>
              
              {/* Overlay Gradient */}
              <div 
                className="absolute inset-0 z-10"
                style={{
                  background: `linear-gradient(to right, 
                    rgba(0, 0, 0, 0.8) 0%, 
                    rgba(0, 0, 0, 0.6) 30%, 
                    rgba(0, 0, 0, 0.4) 50%, 
                    rgba(0, 0, 0, 0.6) 70%, 
                    rgba(0, 0, 0, 0.8) 100%)`
                }}
              ></div>
              
              {/* Slider Line */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-white z-20"
                style={{ 
                  left: `50%`,
                  boxShadow: '0 0 15px rgba(255, 255, 255, 0.8)'
                }}
              ></div>
              
              {/* Slider Labels */}
              <div className="absolute bottom-4 left-4 text-white z-20">
                <h3 className="text-lg font-serif">Documentary</h3>
              </div>
              
              <div className="absolute bottom-4 right-4 text-white z-20 text-right">
                <h3 className="text-lg font-serif">Directed</h3>
              </div>
            </div>
          </div>
          
          {/* Previously Uploaded Images */}
          {previousImages.length > 0 && (
            <div className="mt-12">
              <h3 className="text-lg font-medium mb-4">Previously Uploaded Images</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {previousImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={image.url} 
                      alt={`Previous upload ${index + 1}`}
                      className="w-full aspect-[16/9] object-cover rounded-md"
                    />
                    
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => selectLeftImage(image.url)}
                          className="p-2 bg-blue-500 rounded-full text-white"
                          title="Use as Left Image"
                        >
                          L
                        </button>
                        <button
                          onClick={() => selectRightImage(image.url)}
                          className="p-2 bg-green-500 rounded-full text-white"
                          title="Use as Right Image"
                        >
                          R
                        </button>
                        <button
                          onClick={() => deleteImage(image.name)}
                          className="p-2 bg-red-500 rounded-full text-white"
                          title="Delete Image"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 bg-gray-50 flex justify-end">
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeddingSliderSettings;
