import React, { useState } from 'react';
import { 
  Save, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function GeneralSettings() {
  // State for general settings
  const [settings, setSettings] = useState({
    siteTitle: 'Photography Studio',
    tagline: 'Capturing moments that last forever',
    siteUrl: 'https://example.com',
    adminEmail: 'admin@example.com',
    timezone: 'America/New_York',
    dateFormat: 'F j, Y',
    timeFormat: '12',
    weekStartsOn: 'Monday',
    language: 'en_US',
    logo: '/images/logo.png',
    favicon: '/images/favicon.ico',
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
    contactInfo: {
      email: 'contact@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Photography St, New York, NY 10001'
    },
    socialMedia: {
      facebook: 'https://facebook.com/photographystudio',
      twitter: 'https://twitter.com/photographystudio',
      instagram: 'https://instagram.com/photographystudio',
      linkedin: 'https://linkedin.com/company/photographystudio'
    }
  });

  // State for saving status
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState('general');

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      const parentKey = parent as keyof typeof settings;
      const parentValue = settings[parentKey];
      
      if (parentValue && typeof parentValue === 'object') {
        setSettings({
          ...settings,
          [parent]: {
            ...parentValue,
            [child]: value
          }
        });
      }
    } else {
      setSettings({
        ...settings,
        [name]: value
      });
    }
  };

  // Handle save
  const handleSave = () => {
    setIsSaving(true);
    
    // This would normally be an API call to save the settings
    setTimeout(() => {
      setSaveMessage({ type: 'success', text: 'Settings saved successfully' });
      setIsSaving(false);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">General Settings</h1>
            <p className="mt-1 text-sm text-gray-500">
              Configure your website's general settings
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            {saveMessage && (
              <div 
                className={`flex items-center px-3 py-2 rounded-md text-sm ${
                  saveMessage.type === 'success' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {saveMessage.type === 'success' ? (
                  <CheckCircle className="h-4 w-4 mr-2" />
                ) : (
                  <AlertCircle className="h-4 w-4 mr-2" />
                )}
                {saveMessage.text}
              </div>
            )}
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

        {/* Settings Tabs */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('general')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'general'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                General
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'contact'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Contact Information
              </button>
              <button
                onClick={() => setActiveTab('social')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'social'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Social Media
              </button>
              <button
                onClick={() => setActiveTab('branding')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'branding'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Branding
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="siteTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Site Title
                  </label>
                  <input
                    type="text"
                    id="siteTitle"
                    name="siteTitle"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={settings.siteTitle}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    id="tagline"
                    name="tagline"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={settings.tagline}
                    onChange={handleChange}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    In a few words, explain what your site is about
                  </p>
                </div>
                
                <div>
                  <label htmlFor="siteUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Site URL
                  </label>
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-gray-400 mr-2" />
                    <input
                      type="text"
                      id="siteUrl"
                      name="siteUrl"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={settings.siteUrl}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    id="adminEmail"
                    name="adminEmail"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={settings.adminEmail}
                    onChange={handleChange}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    This address is used for admin purposes
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                      Timezone
                    </label>
                    <select
                      id="timezone"
                      name="timezone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={settings.timezone}
                      onChange={handleChange}
                    >
                      <option value="America/New_York">Eastern Time (US & Canada)</option>
                      <option value="America/Chicago">Central Time (US & Canada)</option>
                      <option value="America/Denver">Mountain Time (US & Canada)</option>
                      <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                      <option value="Europe/London">London</option>
                      <option value="Europe/Paris">Paris</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select
                      id="language"
                      name="language"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={settings.language}
                      onChange={handleChange}
                    >
                      <option value="en_US">English (United States)</option>
                      <option value="en_GB">English (UK)</option>
                      <option value="es_ES">Spanish (Spain)</option>
                      <option value="fr_FR">French (France)</option>
                      <option value="de_DE">German</option>
                      <option value="ja">Japanese</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 mb-1">
                      Date Format
                    </label>
                    <select
                      id="dateFormat"
                      name="dateFormat"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={settings.dateFormat}
                      onChange={handleChange}
                    >
                      <option value="F j, Y">March 10, 2025</option>
                      <option value="Y-m-d">2025-03-10</option>
                      <option value="m/d/Y">03/10/2025</option>
                      <option value="d/m/Y">10/03/2025</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="timeFormat" className="block text-sm font-medium text-gray-700 mb-1">
                      Time Format
                    </label>
                    <select
                      id="timeFormat"
                      name="timeFormat"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={settings.timeFormat}
                      onChange={handleChange}
                    >
                      <option value="12">12-hour (e.g., 1:30 PM)</option>
                      <option value="24">24-hour (e.g., 13:30)</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="weekStartsOn" className="block text-sm font-medium text-gray-700 mb-1">
                    Week Starts On
                  </label>
                  <select
                    id="weekStartsOn"
                    name="weekStartsOn"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={settings.weekStartsOn}
                    onChange={handleChange}
                  >
                    <option value="Sunday">Sunday</option>
                    <option value="Monday">Monday</option>
                  </select>
                </div>
              </div>
            )}

            {/* Contact Information Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactInfo.email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={settings.contactInfo.email}
                      onChange={handleChange}
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    This email will be displayed on your contact page
                  </p>
                </div>
                
                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                    <input
                      type="text"
                      id="contactPhone"
                      name="contactInfo.phone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={settings.contactInfo.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="contactAddress" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <div className="flex">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-2" />
                    <textarea
                      id="contactAddress"
                      name="contactInfo.address"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={settings.contactInfo.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Social Media Tab */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">
                    Facebook
                  </label>
                  <div className="flex items-center">
                    <Facebook className="h-5 w-5 text-gray-400 mr-2" />
                    <input
                      type="text"
                      id="facebook"
                      name="socialMedia.facebook"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={settings.socialMedia.facebook}
                      onChange={handleChange}
                      placeholder="https://facebook.com/yourbusiness"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter
                  </label>
                  <div className="flex items-center">
                    <Twitter className="h-5 w-5 text-gray-400 mr-2" />
                    <input
                      type="text"
                      id="twitter"
                      name="socialMedia.twitter"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={settings.socialMedia.twitter}
                      onChange={handleChange}
                      placeholder="https://twitter.com/yourbusiness"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram
                  </label>
                  <div className="flex items-center">
                    <Instagram className="h-5 w-5 text-gray-400 mr-2" />
                    <input
                      type="text"
                      id="instagram"
                      name="socialMedia.instagram"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={settings.socialMedia.instagram}
                      onChange={handleChange}
                      placeholder="https://instagram.com/yourbusiness"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn
                  </label>
                  <div className="flex items-center">
                    <Linkedin className="h-5 w-5 text-gray-400 mr-2" />
                    <input
                      type="text"
                      id="linkedin"
                      name="socialMedia.linkedin"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={settings.socialMedia.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/company/yourbusiness"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Branding Tab */}
            {activeTab === 'branding' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo
                  </label>
                  <div className="mt-1 flex items-center">
                    {settings.logo ? (
                      <div className="relative">
                        <img
                          src={settings.logo}
                          alt="Logo"
                          className="h-16 w-auto object-contain"
                          onError={() => setSettings({ ...settings, logo: '' })}
                        />
                        <button
                          onClick={() => setSettings({ ...settings, logo: '' })}
                          className="absolute top-0 right-0 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Upload Logo
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Recommended size: 200px × 50px
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Favicon
                  </label>
                  <div className="mt-1 flex items-center">
                    {settings.favicon ? (
                      <div className="relative">
                        <img
                          src={settings.favicon}
                          alt="Favicon"
                          className="h-10 w-10 object-contain"
                          onError={() => setSettings({ ...settings, favicon: '' })}
                        />
                        <button
                          onClick={() => setSettings({ ...settings, favicon: '' })}
                          className="absolute top-0 right-0 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Upload Favicon
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Recommended size: 32px × 32px
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      className="h-8 w-8 border border-gray-300 rounded-md"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    />
                    <input
                      type="text"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Secondary Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      className="h-8 w-8 border border-gray-300 rounded-md"
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    />
                    <input
                      type="text"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
