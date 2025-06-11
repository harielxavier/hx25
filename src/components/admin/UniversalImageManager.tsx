import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Layout, 
  Settings, 
  FileText, 
  Home
} from 'lucide-react';
import ImageLibrary from './ImageLibrary';
import VisualPageEditor from './VisualPageEditor';
import { getPageZones, PageZone } from '../../services/imageManagerService';

// Define page templates for quick setup
const PAGE_TEMPLATES = [
  {
    id: 'home',
    name: 'Home Page',
    path: '/',
    zones: [
      { name: 'Hero Image', selector: '#hero-section .image-container' },
      { name: 'About Section', selector: '#about-section .image-container' },
      { name: 'Featured Gallery', selector: '#featured-gallery .gallery-container' },
      { name: 'Testimonials Background', selector: '#testimonials-section' },
      { name: 'Contact Section', selector: '#contact-section .image-container' }
    ]
  },
  {
    id: 'about',
    name: 'About Page',
    path: '/about',
    zones: [
      { name: 'Team Photo', selector: '#team-section .image-container' },
      { name: 'Studio Image', selector: '#studio-section .image-container' },
      { name: 'Philosophy Background', selector: '#philosophy-section' },
      { name: 'Timeline Images', selector: '#timeline-section .timeline-images' }
    ]
  },
  {
    id: 'services',
    name: 'Services Page',
    path: '/services',
    zones: [
      { name: 'Services Header', selector: '#services-header .image-container' },
      { name: 'Wedding Photography', selector: '#wedding-service .image-container' },
      { name: 'Portrait Photography', selector: '#portrait-service .image-container' },
      { name: 'Commercial Photography', selector: '#commercial-service .image-container' },
      { name: 'Event Photography', selector: '#event-service .image-container' }
    ]
  },
  {
    id: 'contact',
    name: 'Contact Page',
    path: '/contact',
    zones: [
      { name: 'Contact Header', selector: '#contact-header .image-container' },
      { name: 'Map Background', selector: '#map-section' },
      { name: 'Studio Image', selector: '#studio-info .image-container' }
    ]
  },
  {
    id: 'blog',
    name: 'Blog Page',
    path: '/blog',
    zones: [
      { name: 'Blog Header', selector: '#blog-header .image-container' },
      { name: 'Featured Post Image', selector: '#featured-post .image-container' },
      { name: 'Category Images', selector: '.category-section .image-container' }
    ]
  }
];

// Main Universal Image Manager component
const UniversalImageManager: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState('library');
  const [pages, setPages] = useState<{ path: string; title: string; zonesCount: number }[]>([]);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof PAGE_TEMPLATES[0] | null>(null);
  const [customPagePath, setCustomPagePath] = useState('');
  const [customPageTitle, setCustomPageTitle] = useState('');
  
  // Load pages with image zones
  useEffect(() => {
    const loadPages = async () => {
      try {
        setLoading(true);
        
        // This is a simplified approach - in a real implementation,
        // you would fetch all pages from your CMS or site structure
        const pagesData = [
          { path: '/', title: 'Home Page' },
          { path: '/about', title: 'About Us' },
          { path: '/services', title: 'Services' },
          { path: '/gallery', title: 'Gallery' },
          { path: '/blog', title: 'Blog' },
          { path: '/contact', title: 'Contact' }
        ];
        
        // For each page, get the zones count
        const pagesWithZones = await Promise.all(
          pagesData.map(async (page) => {
            const zones = await getPageZones(page.path);
            return {
              ...page,
              zonesCount: zones.length
            };
          })
        );
        
        setPages(pagesWithZones);
      } catch (error) {
        console.error('Error loading pages:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPages();
  }, []);
  
  // Handle selecting a page for editing
  const handleSelectPage = (path: string) => {
    setSelectedPage(path);
    setActiveTab('editor');
  };
  
  // Handle applying a template
  const handleApplyTemplate = async () => {
    if (!selectedTemplate) return;
    
    try {
      setLoading(true);
      
      // Use the template path or custom path
      const pagePath = customPagePath || selectedTemplate.path;
      const pageTitle = customPageTitle || selectedTemplate.name;
      
      // Create zones for the page based on the template
      for (const zone of selectedTemplate.zones) {
        await createPageZone(pagePath, zone.name, zone.selector);
      }
      
      // Update the pages list
      setPages(prev => {
        const existingPageIndex = prev.findIndex(p => p.path === pagePath);
        
        if (existingPageIndex >= 0) {
          // Update existing page
          const updatedPages = [...prev];
          updatedPages[existingPageIndex] = {
            ...updatedPages[existingPageIndex],
            zonesCount: selectedTemplate.zones.length
          };
          return updatedPages;
        } else {
          // Add new page
          return [...prev, {
            path: pagePath,
            title: pageTitle,
            zonesCount: selectedTemplate.zones.length
          }];
        }
      });
      
      // Select the page for editing
      setSelectedPage(pagePath);
      setActiveTab('editor');
      setShowTemplateModal(false);
      setSelectedTemplate(null);
      setCustomPagePath('');
      setCustomPageTitle('');
    } catch (error) {
      console.error('Error applying template:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to create a page zone
  const createPageZone = async (pagePath: string, name: string, selector: string) => {
    try {
      const zone: PageZone = {
        id: `${pagePath}_${name}`.replace(/[^a-zA-Z0-9]/g, '_'),
        pagePath,
        name,
        selector
      };
      
      // Use the definePageZone function from imageManagerService
      // This is imported from the actual service in a real implementation
      // For this example, we'll mock it
      console.log('Creating zone:', zone);
      // await definePageZone(zone);
      
      return zone;
    } catch (error) {
      console.error('Error creating zone:', error);
      throw error;
    }
  };
  
  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Universal Image Manager</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowTemplateModal(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center"
            >
              <Layout size={18} className="mr-2" />
              Apply Template
            </button>
            <button
              onClick={() => {}}
              className="px-4 py-2 border rounded-lg flex items-center"
            >
              <Settings size={18} className="mr-2" />
              Settings
            </button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto p-4">
        <div className="flex flex-col">
          {/* Tabs header */}
          <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 mb-6">
            <button 
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 ${activeTab === 'library' ? 'bg-white text-gray-950 shadow-sm' : ''}`}
              onClick={() => setActiveTab('library')}
            >
              <ImageIcon size={18} className="mr-2" />
              Image Library
            </button>
            <button 
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 ${activeTab === 'pages' ? 'bg-white text-gray-950 shadow-sm' : ''}`}
              onClick={() => setActiveTab('pages')}
            >
              <FileText size={18} className="mr-2" />
              Pages
            </button>
            <button 
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 ${activeTab === 'editor' ? 'bg-white text-gray-950 shadow-sm' : ''}`}
              onClick={() => setActiveTab('editor')}
              disabled={!selectedPage}
              style={{ opacity: !selectedPage ? 0.5 : 1, cursor: !selectedPage ? 'not-allowed' : 'pointer' }}
            >
              <Layout size={18} className="mr-2" />
              Visual Editor
            </button>
          </div>
          
          {/* Tab content */}
          <div className="mt-0">
            {activeTab === 'library' && <ImageLibrary />}
            
            {activeTab === 'pages' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-medium mb-6">Website Pages</h2>
                
                {loading ? (
                  <div className="text-center py-8">
                    <p>Loading pages...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pages.map(page => (
                      <div 
                        key={page.path}
                        className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors"
                        onClick={() => handleSelectPage(page.path)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{page.title}</h3>
                            <p className="text-sm text-gray-500">{page.path}</p>
                          </div>
                          <div className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {page.zonesCount} zones
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectPage(page.path);
                            }}
                            className="px-3 py-1 bg-blue-500 text-white text-sm rounded"
                          >
                            Edit Images
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Add custom page button */}
                    <div 
                      className="border border-dashed rounded-lg p-4 flex items-center justify-center cursor-pointer hover:bg-gray-50"
                      onClick={() => setShowTemplateModal(true)}
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width={24} 
                            height={24} 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className="text-gray-500"
                          >
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </div>
                        <p className="font-medium">Add Custom Page</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'editor' && selectedPage && (
              <VisualPageEditor 
                pagePath={selectedPage}
                pageTitle={pages.find(p => p.path === selectedPage)?.title || selectedPage}
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Template modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl p-6">
            <h2 className="text-xl font-semibold mb-4">Apply Page Template</h2>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Select Template</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {PAGE_TEMPLATES.map(template => (
                  <div
                    key={template.id}
                    className={`border rounded-lg p-3 cursor-pointer ${
                      selectedTemplate?.id === template.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="flex items-center mb-2">
                      {template.id === 'home' ? (
                        <Home size={18} className="mr-2" />
                      ) : (
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width={18} 
                          height={18} 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="mr-2"
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                      )}
                      <h4 className="font-medium">{template.name}</h4>
                    </div>
                    <p className="text-sm text-gray-500">{template.zones.length} image zones</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Customize (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Page Path</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder={selectedTemplate?.path || '/page-path'}
                    value={customPagePath}
                    onChange={(e) => setCustomPagePath(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Page Title</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder={selectedTemplate?.name || 'Page Title'}
                    value={customPageTitle}
                    onChange={(e) => setCustomPageTitle(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 border rounded"
                onClick={() => {
                  setShowTemplateModal(false);
                  setSelectedTemplate(null);
                  setCustomPagePath('');
                  setCustomPageTitle('');
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleApplyTemplate}
                disabled={!selectedTemplate}
              >
                Apply Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversalImageManager;
