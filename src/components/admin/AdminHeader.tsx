import { Bell, Search, Calendar, ChevronDown, Activity, HardDrive, Zap, Info, Home } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSupabaseAuth as useAuth } from '../../contexts/SupabaseAuthContext';
import { useLocation, Link } from 'react-router-dom';
import { getAllGalleries, getPublicGalleries } from '../../services/galleryService';

interface AdminHeaderProps {
  title?: string;
}

export default function AdminHeader({ title }: AdminHeaderProps) {
  const [dateRange, setDateRange] = useState('Last 7 days');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSystemInfo, setShowSystemInfo] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  
  // System info
  const systemInfo = {
    storageUsed: '2.4 GB',
    storageLimit: '5 GB',
    storagePercentage: 48,
    lastBackup: '2 days ago',
    serverStatus: 'Operational'
  };
  
  // Recent activity (mock data - would be fetched from a real service)
  const recentActivity = [
    { id: 1, type: 'upload', message: 'New images uploaded to "Smith Wedding"', time: '10 minutes ago' },
    { id: 2, type: 'edit', message: 'Gallery "Johnson Engagement" edited', time: '2 hours ago' },
    { id: 3, type: 'view', message: 'Client viewed "Davis Family Session"', time: '5 hours ago' },
    { id: 4, type: 'download', message: 'Client downloaded images from "Taylor Wedding"', time: 'Yesterday' }
  ];
  
  // Get current section from URL
  const getCurrentSection = () => {
    if (title) return title;
    
    const path = location.pathname;
    
    if (path.includes('/admin/client')) return 'Client Management';
    if (path.includes('/admin/leads')) return 'Lead Management';
    if (path.includes('/admin/bookings')) return 'Bookings & Calendar';
    
    if (path.includes('/admin/galleries')) return 'Client Galleries';
    if (path.includes('/admin/active-galleries')) return 'Active Galleries';
    if (path.includes('/admin/archive-galleries')) return 'Archive Galleries';
    if (path.includes('/admin/portfolio')) return 'Portfolio';
    
    if (path.includes('/admin/website-editor')) return 'Website Editor';
    if (path.includes('/admin/pages')) return 'Pages';
    if (path.includes('/admin/blog')) return 'Blog';
    if (path.includes('/admin/image-manager')) return 'Media Library';
    
    if (path.includes('/admin/landing-editor')) return 'Landing Pages';
    if (path.includes('/admin/email-campaigns')) return 'Email Campaigns';
    if (path.includes('/admin/lead-generation')) return 'Lead Generation';
    
    if (path.includes('/admin/settings')) return 'Settings';
    if (path.includes('/admin/branding')) return 'Branding';
    if (path.includes('/admin/integrations')) return 'Integrations';
    
    return 'Dashboard';
  };
  
  // Load gallery statistics
  useEffect(() => {
    const loadGalleryStats = async () => {
      try {
        await Promise.all([
          getAllGalleries(),
          getPublicGalleries()
        ]);
      } catch (error) {
        console.error('Error loading gallery stats:', error);
      }
    };
    
    loadGalleryStats();
  }, []);

  return (
    <>
      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        {/* Section Title */}
        <div className="flex items-center">
          <h1 className="text-xl font-medium text-gray-800">{getCurrentSection()}</h1>
        </div>
        
        <div className="flex items-center gap-6">
          {/* View Site Link */}
          <Link 
            to="/"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Home size={16} />
            <span className="text-sm font-medium">View Site</span>
          </Link>
          
          {/* Search */}
          <div className="relative max-w-md hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search galleries, images, clients..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent text-sm"
            />
          </div>
          
          {/* Date Range */}
          <div className="relative">
            <button 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-medium">{dateRange}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showDatePicker && (
              <div className="absolute right-0 top-full w-48 bg-white shadow-md rounded-lg z-20 border border-gray-200 p-4">
                <button 
                  className="block w-full py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    setDateRange('Today');
                    setShowDatePicker(false);
                  }}
                >
                  Today
                </button>
                <button 
                  className="block w-full py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    setDateRange('Yesterday');
                    setShowDatePicker(false);
                  }}
                >
                  Yesterday
                </button>
                <button 
                  className="block w-full py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    setDateRange('Last 7 days');
                    setShowDatePicker(false);
                  }}
                >
                  Last 7 days
                </button>
                <button 
                  className="block w-full py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    setDateRange('Last 30 days');
                    setShowDatePicker(false);
                  }}
                >
                  Last 30 days
                </button>
              </div>
            )}
          </div>
          
          {/* System Info Button */}
          <button 
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setShowSystemInfo(!showSystemInfo)}
          >
            <Info className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* Notifications */}
          <button 
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          
          {/* Admin Profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
              <img 
                src={user?.user_metadata?.avatar_url || "https://res.cloudinary.com/dos0qac90/image/upload/v1761593379/hariel-xavier-photography/MoStuff/black.png"} 
                alt={user?.email || "Admin"} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-800">{user?.user_metadata?.full_name || user?.email || "Admin"}</p>
              <p className="text-xs text-gray-500">{user?.email || "admin@example.com"}</p>
            </div>
          </div>
        </div>
      </header>
      
      {/* System Info Dropdown */}
      {showSystemInfo && (
        <div className="absolute right-32 top-16 w-80 bg-white shadow-lg rounded-lg z-20 border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-800">System Information</h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">Storage Used</span>
                <span className="text-xs font-medium">{systemInfo.storageUsed} / {systemInfo.storageLimit}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${systemInfo.storagePercentage}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-600">Last Backup</span>
              </div>
              <span className="text-xs font-medium">{systemInfo.lastBackup}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-600">Server Status</span>
              </div>
              <span className="text-xs font-medium text-green-500">{systemInfo.serverStatus}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-16 top-16 w-80 bg-white shadow-lg rounded-lg z-20 border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-800">Recent Activity</h3>
            <button className="text-xs text-blue-600 hover:text-blue-800">Mark all as read</button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {recentActivity.map(activity => (
              <div key={activity.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Activity className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-200">
            <button className="w-full py-2 text-xs text-center text-blue-600 hover:text-blue-800">
              View All Activity
            </button>
          </div>
        </div>
      )}
    </>
  );
}