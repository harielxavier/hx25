import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  FileText, 
  Settings, 
  LogOut,
  BookOpen,
  Edit,
  Tag,
  Calendar,
  FileImage,
  Database,
  CreditCard,
  Activity,
  Layers,
  Award,
  Sliders,
  Home
} from 'lucide-react';
import { useSupabaseAuth as useAuth } from '../contexts/SupabaseAuthContext';
import { useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

interface MenuItem {
  icon?: any;
  label?: string;
  path?: string;
  items?: {
    icon: any;
    label: string;
    path: string;
  }[];
}

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();
  
  const menuItems: MenuItem[] = [
    { 
      label: 'DASHBOARD',
      items: [
        { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
        { icon: Activity, label: 'Mission Control', path: '/admin/mission-control' },
        { icon: Calendar, label: 'Activities', path: '/admin/activities' }
      ]
    },
    {
      label: 'CLIENTS',
      items: [
        { icon: Users, label: 'Client Database', path: '/admin/clients-page' },
        { icon: Users, label: 'Leads', path: '/admin/leads' },
        { icon: Calendar, label: 'Bookings', path: '/admin/bookings' },
        { icon: MessageSquare, label: 'Communication', path: '/admin/communication' },
        { icon: FileText, label: 'Contracts', path: '/admin/contracts' },
        { icon: CreditCard, label: 'Payments & Invoicing', path: '/admin/invoicing' },
        { icon: FileText, label: 'Jobs', path: '/admin/jobs' }
      ]
    },
    {
      label: 'CONTENT',
      items: [
        { icon: Layers, label: 'Galleries', path: '/admin/galleries' },
        { icon: BookOpen, label: 'Blog', path: '/admin/blog-manager' },
        { icon: FileImage, label: 'Media Library', path: '/admin/universal-media-manager' }
      ]
    },
    {
      label: 'SETTINGS',
      items: [
        { icon: Settings, label: 'General', path: '/admin/settings' },
        { icon: Award, label: 'Branding', path: '/admin/branding' },
        { icon: Tag, label: 'SEO', path: '/admin/seo' },
        { icon: Sliders, label: 'Integrations', path: '/admin/integrations' }
      ]
    }
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleConfettiClick = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="h-screen bg-gray-900 text-white w-64 flex flex-col relative">
      {showConfetti && (
        <Confetti 
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          tweenDuration={5000}
          gravity={0.2}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 1000 }}
        />
      )}

      <div className="p-4 border-b border-gray-800">
        <Link to="/" className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors">
          <Home className="w-4 h-4 mr-2" />
          View Main Site
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        {menuItems.map((section, index) => (
          <div key={index} className="mb-6">
            {section.label && (
              <h3 className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {section.label}
              </h3>
            )}
            <ul>
              {section.items?.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Link
                    to={item.path}
                    onClick={item.label === 'Clients' ? handleConfettiClick : undefined}
                    className={`flex items-center px-4 py-2 text-sm ${
                      isActive(item.path)
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    } transition-colors`}
                  >
                    {item.icon && <item.icon className="w-5 h-5 mr-3" />}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center text-gray-400 hover:text-white w-full px-4 py-2 text-sm rounded hover:bg-gray-800 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
