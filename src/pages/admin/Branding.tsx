import React, { useState, useEffect } from 'react';
import { Save, Upload, Palette, Type, Image, CheckCircle, AlertCircle } from 'lucide-react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

interface BrandingSettings {
  logo: {
    primary: string;
    secondary: string;
    favicon: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    fontSize: string;
  };
}

const Branding: React.FC = () => {
  const [settings, setSettings] = useState<BrandingSettings>({
    logo: {
      primary: '',
      secondary: '',
      favicon: '',
    },
    colors: {
      primary: '#000000',
      secondary: '#ffffff',
      accent: '#e5c1c1',
      text: '#333333',
      background: '#ffffff',
    },
    typography: {
      headingFont: 'Playfair Display, serif',
      bodyFont: 'Inter, sans-serif',
      fontSize: 'medium',
    },
  });

  const [logoFiles, setLogoFiles] = useState<{
    primary: File | null;
    secondary: File | null;
    favicon: File | null;
  }>({
    primary: null,
    secondary: null,
    favicon: null,
  });

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const storage = getStorage();
  const db = getFirestore();

  // Load current branding settings from Firestore
  useEffect(() => {
    const fetchBrandingSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'branding');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setSettings(docSnap.data() as BrandingSettings);
        }
      } catch (error) {
        console.error('Error fetching branding settings:', error);
      }
    };

    fetchBrandingSettings();
  }, [db]);

  // Handle logo file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'primary' | 'secondary' | 'favicon') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFiles({
        ...logoFiles,
        [type]: file,
      });
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSettings({
            ...settings,
            logo: {
              ...settings.logo,
              [type]: event.target.result as string,
            },
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle color change
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>, type: keyof BrandingSettings['colors']) => {
    setSettings({
      ...settings,
      colors: {
        ...settings.colors,
        [type]: e.target.value,
      },
    });
  };

  // Handle typography change
  const handleTypographyChange = (e: React.ChangeEvent<HTMLSelectElement>, type: keyof BrandingSettings['typography']) => {
    setSettings({
      ...settings,
      typography: {
        ...settings.typography,
        [type]: e.target.value,
      },
    });
  };

  // Save settings
  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      const updatedSettings = { ...settings };
      
      // Upload logos if new files were selected
      if (logoFiles.primary) {
        const logoRef = ref(storage, `branding/primary-logo-${Date.now()}`);
        await uploadBytes(logoRef, logoFiles.primary);
        updatedSettings.logo.primary = await getDownloadURL(logoRef);
      }
      
      if (logoFiles.secondary) {
        const logoRef = ref(storage, `branding/secondary-logo-${Date.now()}`);
        await uploadBytes(logoRef, logoFiles.secondary);
        updatedSettings.logo.secondary = await getDownloadURL(logoRef);
      }
      
      if (logoFiles.favicon) {
        const logoRef = ref(storage, `branding/favicon-${Date.now()}`);
        await uploadBytes(logoRef, logoFiles.favicon);
        updatedSettings.logo.favicon = await getDownloadURL(logoRef);
      }
      
      // Save settings to Firestore
      await setDoc(doc(db, 'settings', 'branding'), {
        ...updatedSettings,
        updatedAt: new Date().toISOString(),
      });
      
      // Clear file selections
      setLogoFiles({
        primary: null,
        secondary: null,
        favicon: null,
      });
      
      // Show success message
      setSaveMessage({
        type: 'success',
        text: 'Branding settings saved successfully!',
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error saving branding settings:', error);
      setSaveMessage({
        type: 'error',
        text: 'Failed to save settings. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Branding Settings</h1>
        <p className="text-gray-600">Manage your brand identity including logos, colors, and typography</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Logo Section */}
            <div>
              <div className="flex items-center mb-4">
                <Image className="h-5 w-5 text-blue-500 mr-2" />
                <h2 className="text-lg font-medium">Logo & Brand Assets</h2>
              </div>
              
              {/* Primary Logo */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Primary Logo</h3>
                <div className="mb-3 h-32 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                  {settings.logo.primary ? (
                    <img 
                      src={settings.logo.primary} 
                      alt="Primary Logo" 
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <p className="text-gray-400">No logo uploaded</p>
                  )}
                </div>
                <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Primary Logo
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/jpeg,image/png,image/svg+xml"
                    onChange={(e) => handleLogoChange(e, 'primary')}
                  />
                </label>
                <p className="mt-1 text-xs text-gray-500">Recommended size: 300x100px, transparent background</p>
              </div>
              
              {/* Secondary Logo */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Secondary Logo / Watermark</h3>
                <div className="mb-3 h-32 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                  {settings.logo.secondary ? (
                    <img 
                      src={settings.logo.secondary} 
                      alt="Secondary Logo" 
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <p className="text-gray-400">No logo uploaded</p>
                  )}
                </div>
                <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Secondary Logo
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/jpeg,image/png,image/svg+xml"
                    onChange={(e) => handleLogoChange(e, 'secondary')}
                  />
                </label>
                <p className="mt-1 text-xs text-gray-500">Recommended size: 200x200px, transparent background</p>
              </div>
              
              {/* Favicon */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Favicon</h3>
                <div className="mb-3 h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                  {settings.logo.favicon ? (
                    <img 
                      src={settings.logo.favicon} 
                      alt="Favicon" 
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <p className="text-gray-400 text-xs">No favicon</p>
                  )}
                </div>
                <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Favicon
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/jpeg,image/png,image/svg+xml,image/x-icon"
                    onChange={(e) => handleLogoChange(e, 'favicon')}
                  />
                </label>
                <p className="mt-1 text-xs text-gray-500">Recommended size: 32x32px or 64x64px</p>
              </div>
            </div>
            
            {/* Colors & Typography Section */}
            <div>
              {/* Colors */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Palette className="h-5 w-5 text-blue-500 mr-2" />
                  <h2 className="text-lg font-medium">Brand Colors</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Color
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        id="primaryColor"
                        value={settings.colors.primary}
                        onChange={(e) => handleColorChange(e, 'primary')}
                        className="h-10 w-10 border-0 p-0 mr-2"
                      />
                      <input
                        type="text"
                        value={settings.colors.primary}
                        onChange={(e) => handleColorChange(e, 'primary')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700 mb-1">
                      Secondary Color
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        id="secondaryColor"
                        value={settings.colors.secondary}
                        onChange={(e) => handleColorChange(e, 'secondary')}
                        className="h-10 w-10 border-0 p-0 mr-2"
                      />
                      <input
                        type="text"
                        value={settings.colors.secondary}
                        onChange={(e) => handleColorChange(e, 'secondary')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="accentColor" className="block text-sm font-medium text-gray-700 mb-1">
                      Accent Color
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        id="accentColor"
                        value={settings.colors.accent}
                        onChange={(e) => handleColorChange(e, 'accent')}
                        className="h-10 w-10 border-0 p-0 mr-2"
                      />
                      <input
                        type="text"
                        value={settings.colors.accent}
                        onChange={(e) => handleColorChange(e, 'accent')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="textColor" className="block text-sm font-medium text-gray-700 mb-1">
                      Text Color
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        id="textColor"
                        value={settings.colors.text}
                        onChange={(e) => handleColorChange(e, 'text')}
                        className="h-10 w-10 border-0 p-0 mr-2"
                      />
                      <input
                        type="text"
                        value={settings.colors.text}
                        onChange={(e) => handleColorChange(e, 'text')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Color Preview */}
                <div className="mt-6 p-4 rounded-md" style={{ backgroundColor: settings.colors.background }}>
                  <h3 
                    className="text-xl font-serif mb-2" 
                    style={{ color: settings.colors.primary, fontFamily: settings.typography.headingFont }}
                  >
                    Brand Preview
                  </h3>
                  <p 
                    className="mb-3" 
                    style={{ color: settings.colors.text, fontFamily: settings.typography.bodyFont }}
                  >
                    This is how your brand colors and typography will look together.
                  </p>
                  <button 
                    className="px-4 py-2 rounded-md text-white"
                    style={{ backgroundColor: settings.colors.primary }}
                  >
                    Primary Button
                  </button>
                  <button 
                    className="px-4 py-2 rounded-md ml-2 text-white"
                    style={{ backgroundColor: settings.colors.accent }}
                  >
                    Accent Button
                  </button>
                </div>
              </div>
              
              {/* Typography */}
              <div>
                <div className="flex items-center mb-4">
                  <Type className="h-5 w-5 text-blue-500 mr-2" />
                  <h2 className="text-lg font-medium">Typography</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="headingFont" className="block text-sm font-medium text-gray-700 mb-1">
                      Heading Font
                    </label>
                    <select
                      id="headingFont"
                      value={settings.typography.headingFont}
                      onChange={(e) => handleTypographyChange(e, 'headingFont')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Playfair Display, serif">Playfair Display (Serif)</option>
                      <option value="Cormorant Garamond, serif">Cormorant Garamond (Serif)</option>
                      <option value="Montserrat, sans-serif">Montserrat (Sans-serif)</option>
                      <option value="Raleway, sans-serif">Raleway (Sans-serif)</option>
                      <option value="Lora, serif">Lora (Serif)</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">Used for headings and titles</p>
                  </div>
                  
                  <div>
                    <label htmlFor="bodyFont" className="block text-sm font-medium text-gray-700 mb-1">
                      Body Font
                    </label>
                    <select
                      id="bodyFont"
                      value={settings.typography.bodyFont}
                      onChange={(e) => handleTypographyChange(e, 'bodyFont')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Inter, sans-serif">Inter (Sans-serif)</option>
                      <option value="Open Sans, sans-serif">Open Sans (Sans-serif)</option>
                      <option value="Roboto, sans-serif">Roboto (Sans-serif)</option>
                      <option value="Lato, sans-serif">Lato (Sans-serif)</option>
                      <option value="Source Sans Pro, sans-serif">Source Sans Pro (Sans-serif)</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">Used for paragraphs and general text</p>
                  </div>
                  
                  <div>
                    <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700 mb-1">
                      Base Font Size
                    </label>
                    <select
                      id="fontSize"
                      value={settings.typography.fontSize}
                      onChange={(e) => handleTypographyChange(e, 'fontSize')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                Save Branding Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Branding;
