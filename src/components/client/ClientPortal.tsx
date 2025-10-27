import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Calendar, 
  CreditCard, 
  MessageCircle, 
  Download, 
  Image, 
  FileText, 
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Heart
} from 'lucide-react';
import { Job } from '../../services/jobsService';
import ClientGalleryAccess from './ClientGalleryAccess';
import ContractSigningInterface from './ContractSigningInterface';
import PaymentPortal from './PaymentPortal';
import MessageCenter from './MessageCenter';
import ProjectTimeline from './ProjectTimeline';
import DownloadCenter from './DownloadCenter';

interface ClientPortalProps {
  clientId: string;
  job: Job;
}

type TabType = 'overview' | 'gallery' | 'contracts' | 'payments' | 'messages' | 'timeline' | 'downloads';

const ClientPortal: React.FC<ClientPortalProps> = ({ clientId, job }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'info',
      message: 'Your engagement session photos are ready for review!',
      timestamp: new Date(),
      read: false
    },
    {
      id: '2',
      type: 'payment',
      message: 'Final payment due in 7 days',
      timestamp: new Date(Date.now() - 86400000),
      read: false
    }
  ]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'contracts', label: 'Contracts', icon: FileText },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'downloads', label: 'Downloads', icon: Download }
  ];

  const getTabNotificationCount = (tabId: string) => {
    switch (tabId) {
      case 'messages':
        return notifications.filter(n => !n.read && n.type === 'message').length;
      case 'payments':
        return notifications.filter(n => !n.read && n.type === 'payment').length;
      case 'gallery':
        return notifications.filter(n => !n.read && n.type === 'gallery').length;
      default:
        return 0;
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome, {job.clientName}!</h2>
            <p className="text-gray-600">Your {job.type} with Hariel Xavier Photography</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <Calendar className="w-8 h-8 text-pink-500 mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">Event Date</h3>
            <p className="text-gray-600">
              {job.mainShootDate ? job.mainShootDate.toDate().toLocaleDateString() : 'TBD'}
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <FileText className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">Contract Status</h3>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-600 font-medium">Signed</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <CreditCard className="w-8 h-8 text-green-500 mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">Payment Status</h3>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <span className="text-yellow-600 font-medium">Partial</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tabs.slice(1).map((tab) => {
          const Icon = tab.icon;
          const notificationCount = getTabNotificationCount(tab.id);
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className="relative bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 text-left group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-8 h-8 text-gray-600 group-hover:text-pink-500 transition-colors mb-3" />
              <h3 className="font-semibold text-gray-800 mb-1">{tab.label}</h3>
              <p className="text-sm text-gray-500">
                {tab.id === 'gallery' && 'View your photos'}
                {tab.id === 'contracts' && 'Review documents'}
                {tab.id === 'payments' && 'Manage payments'}
                {tab.id === 'messages' && 'Chat with us'}
                {tab.id === 'timeline' && 'Track progress'}
                {tab.id === 'downloads' && 'Get your files'}
              </p>
              
              {notificationCount > 0 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {notificationCount}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                notification.type === 'info' ? 'bg-blue-500' :
                notification.type === 'payment' ? 'bg-yellow-500' :
                'bg-green-500'
              }`} />
              <div className="flex-1">
                <p className="text-gray-800">{notification.message}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {notification.timestamp.toLocaleDateString()}
                </p>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 bg-red-500 rounded-full" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'gallery':
        return <ClientGalleryAccess clientId={clientId} job={job} />;
      case 'contracts':
        return <ContractSigningInterface clientId={clientId} job={job} />;
      case 'payments':
        return <PaymentPortal clientId={clientId} job={job} />;
      case 'messages':
        return <MessageCenter clientId={clientId} job={job} />;
      case 'timeline':
        return <ProjectTimeline clientId={clientId} job={job} />;
      case 'downloads':
        return <DownloadCenter clientId={clientId} job={job} />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img
                src="https://res.cloudinary.com/dos0qac90/image/upload/v1761593379/hariel-xavier-photography/MoStuff/black.png"
                alt="Hariel Xavier Photography"
                className="h-8 w-auto"
              />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Client Portal</h1>
                <p className="text-sm text-gray-500">{job.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </button>
                {notifications.filter(n => !n.read).length > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{job.clientName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const notificationCount = getTabNotificationCount(tab.id);
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`relative flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  
                  {notificationCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {notificationCount}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ClientPortal;
