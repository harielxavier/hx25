import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Share2,
  Bell,
  MessageSquare,
  Camera,
  Music,
  Flower,
  Utensils,
  Car,
  Palette,
  Heart,
  Plus,
  X,
  Send,
  Download
} from 'lucide-react';

interface VendorMeshProps {
  jobId: string;
  timeline: TimelineEvent[];
  onTimelineUpdate: (timeline: TimelineEvent[]) => void;
}

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  type: 'preparation' | 'ceremony' | 'reception' | 'photos' | 'travel' | 'buffer';
  location: string;
  participants: string[];
  equipment?: string[];
  notes?: string;
  weatherDependent: boolean;
  travelBuffer: number;
  priority: 'critical' | 'important' | 'optional';
  aiGenerated: boolean;
  culturalContext?: string;
  vendorInvolvement?: VendorInvolvement[];
}

interface VendorInvolvement {
  vendorId: string;
  role: 'primary' | 'secondary' | 'observer';
  arrivalTime?: Date;
  departureTime?: Date;
  setupTime?: number; // minutes
  notes?: string;
  confirmed: boolean;
}

interface Vendor {
  id: string;
  name: string;
  type: 'photographer' | 'videographer' | 'florist' | 'dj' | 'caterer' | 'planner' | 'transport' | 'makeup' | 'other';
  email: string;
  phone: string;
  company: string;
  role: string;
  permissions: VendorPermissions;
  status: 'invited' | 'accepted' | 'declined' | 'pending';
  lastSeen?: Date;
  avatar?: string;
}

interface VendorPermissions {
  canView: boolean;
  canComment: boolean;
  canSuggestChanges: boolean;
  canSeeContactInfo: boolean;
  canDownloadTimeline: boolean;
  eventsVisible: string[]; // Event IDs they can see
}

interface VendorMessage {
  id: string;
  vendorId: string;
  eventId?: string;
  message: string;
  timestamp: Date;
  type: 'comment' | 'suggestion' | 'alert' | 'confirmation';
  resolved?: boolean;
}

interface TimelineChange {
  id: string;
  vendorId: string;
  eventId: string;
  changeType: 'time' | 'location' | 'notes' | 'participants';
  originalValue: any;
  suggestedValue: any;
  reason: string;
  timestamp: Date;
  status: 'pending' | 'approved' | 'rejected';
}

const VendorMesh: React.FC<VendorMeshProps> = ({ jobId, timeline, onTimelineUpdate }) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [messages, setMessages] = useState<VendorMessage[]>([]);
  const [changes, setChanges] = useState<TimelineChange[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMessaging, setShowMessaging] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockVendors: Vendor[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        type: 'florist',
        email: 'sarah@bloomdesigns.com',
        phone: '(555) 123-4567',
        company: 'Bloom Designs',
        role: 'Lead Florist',
        permissions: {
          canView: true,
          canComment: true,
          canSuggestChanges: true,
          canSeeContactInfo: true,
          canDownloadTimeline: true,
          eventsVisible: ['ceremony', 'reception', 'photos']
        },
        status: 'accepted',
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        id: '2',
        name: 'Mike Rodriguez',
        type: 'dj',
        email: 'mike@soundwaveentertainment.com',
        phone: '(555) 987-6543',
        company: 'SoundWave Entertainment',
        role: 'DJ & MC',
        permissions: {
          canView: true,
          canComment: true,
          canSuggestChanges: false,
          canSeeContactInfo: false,
          canDownloadTimeline: true,
          eventsVisible: ['reception', 'ceremony']
        },
        status: 'accepted',
        lastSeen: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
      },
      {
        id: '3',
        name: 'Emma Chen',
        type: 'planner',
        email: 'emma@perfectdayplanning.com',
        phone: '(555) 456-7890',
        company: 'Perfect Day Planning',
        role: 'Wedding Coordinator',
        permissions: {
          canView: true,
          canComment: true,
          canSuggestChanges: true,
          canSeeContactInfo: true,
          canDownloadTimeline: true,
          eventsVisible: ['*'] // Can see all events
        },
        status: 'accepted',
        lastSeen: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
      },
      {
        id: '4',
        name: 'David Park',
        type: 'videographer',
        email: 'david@cinematicweddings.com',
        phone: '(555) 321-0987',
        company: 'Cinematic Weddings',
        role: 'Lead Videographer',
        permissions: {
          canView: true,
          canComment: true,
          canSuggestChanges: true,
          canSeeContactInfo: true,
          canDownloadTimeline: false,
          eventsVisible: ['ceremony', 'reception', 'photos', 'preparation']
        },
        status: 'pending'
      }
    ];

    const mockMessages: VendorMessage[] = [
      {
        id: '1',
        vendorId: '1',
        eventId: 'ceremony',
        message: 'I need 30 minutes before the ceremony to set up the altar arrangements. Can we adjust the timeline?',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        type: 'suggestion'
      },
      {
        id: '2',
        vendorId: '2',
        eventId: 'reception',
        message: 'Sound check confirmed for 4:30 PM. All equipment will be ready.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        type: 'confirmation'
      },
      {
        id: '3',
        vendorId: '3',
        message: 'Weather forecast shows possible rain. Should we discuss backup plans for outdoor photos?',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        type: 'alert'
      }
    ];

    const mockChanges: TimelineChange[] = [
      {
        id: '1',
        vendorId: '1',
        eventId: 'ceremony',
        changeType: 'time',
        originalValue: '3:00 PM',
        suggestedValue: '3:30 PM',
        reason: 'Need additional setup time for floral arrangements',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'pending'
      }
    ];

    setVendors(mockVendors);
    setMessages(mockMessages);
    setChanges(mockChanges);
  }, []);

  const getVendorIcon = (type: Vendor['type']) => {
    const iconMap = {
      photographer: Camera,
      videographer: Camera,
      florist: Flower,
      dj: Music,
      caterer: Utensils,
      planner: Calendar,
      transport: Car,
      makeup: Palette,
      other: Users
    };
    return iconMap[type] || Users;
  };

  const getVendorColor = (type: Vendor['type']) => {
    const colorMap = {
      photographer: 'bg-blue-500',
      videographer: 'bg-purple-500',
      florist: 'bg-green-500',
      dj: 'bg-orange-500',
      caterer: 'bg-red-500',
      planner: 'bg-pink-500',
      transport: 'bg-gray-500',
      makeup: 'bg-yellow-500',
      other: 'bg-indigo-500'
    };
    return colorMap[type] || 'bg-gray-500';
  };

  const getStatusColor = (status: Vendor['status']) => {
    const colorMap = {
      accepted: 'text-green-600 bg-green-50',
      pending: 'text-yellow-600 bg-yellow-50',
      declined: 'text-red-600 bg-red-50',
      invited: 'text-blue-600 bg-blue-50'
    };
    return colorMap[status];
  };

  const handleInviteVendor = (vendorData: Partial<Vendor>) => {
    const newVendor: Vendor = {
      id: Date.now().toString(),
      name: vendorData.name || '',
      type: vendorData.type || 'other',
      email: vendorData.email || '',
      phone: vendorData.phone || '',
      company: vendorData.company || '',
      role: vendorData.role || '',
      permissions: {
        canView: true,
        canComment: true,
        canSuggestChanges: false,
        canSeeContactInfo: false,
        canDownloadTimeline: false,
        eventsVisible: []
      },
      status: 'invited'
    };

    setVendors([...vendors, newVendor]);
    setShowInviteModal(false);

    // In real implementation, send invitation email
    console.log('Sending invitation to:', newVendor.email);
  };

  const handleApproveChange = (changeId: string) => {
    setChanges(changes.map(change => 
      change.id === changeId 
        ? { ...change, status: 'approved' as const }
        : change
    ));

    // Apply the change to the timeline
    const change = changes.find(c => c.id === changeId);
    if (change) {
      // In real implementation, update the actual timeline
      console.log('Applying change:', change);
    }
  };

  const handleRejectChange = (changeId: string) => {
    setChanges(changes.map(change => 
      change.id === changeId 
        ? { ...change, status: 'rejected' as const }
        : change
    ));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: VendorMessage = {
      id: Date.now().toString(),
      vendorId: 'photographer', // Current user
      eventId: selectedEvent || undefined,
      message: newMessage,
      timestamp: new Date(),
      type: 'comment'
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const getEventVendors = (eventId: string) => {
    return vendors.filter(vendor => 
      vendor.permissions.eventsVisible.includes(eventId) || 
      vendor.permissions.eventsVisible.includes('*')
    );
  };

  const pendingChanges = changes.filter(change => change.status === 'pending');
  const unreadMessages = messages.filter(message => 
    message.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Vendor Mesh</h2>
              <p className="text-gray-600">Collaborative timeline with your vendor team</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowMessaging(!showMessaging)}
              className="relative px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Messages</span>
              {unreadMessages.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadMessages.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setShowInviteModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Invite Vendor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pending Changes Alert */}
      {pendingChanges.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-800">
              {pendingChanges.length} Pending Timeline Changes
            </h3>
          </div>
          
          <div className="space-y-3">
            {pendingChanges.map(change => {
              const vendor = vendors.find(v => v.id === change.vendorId);
              return (
                <div key={change.id} className="bg-white rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">
                        {vendor?.name} suggests changing {change.changeType}
                      </p>
                      <p className="text-sm text-gray-600">
                        From: {change.originalValue} → To: {change.suggestedValue}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{change.reason}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleApproveChange(change.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectChange(change.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Vendor Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map(vendor => {
          const IconComponent = getVendorIcon(vendor.type);
          const isOnline = vendor.lastSeen && 
            (Date.now() - vendor.lastSeen.getTime()) < 15 * 60 * 1000; // Online if seen within 15 minutes
          
          return (
            <motion.div
              key={vendor.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 ${getVendorColor(vendor.type)} rounded-full flex items-center justify-center relative`}>
                  <IconComponent className="w-6 h-6 text-white" />
                  {isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{vendor.name}</h3>
                  <p className="text-sm text-gray-600">{vendor.role}</p>
                  <p className="text-xs text-gray-500">{vendor.company}</p>
                </div>
                
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vendor.status)}`}>
                  {vendor.status}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{vendor.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{vendor.phone}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Permissions:</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {vendor.permissions.canView && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </span>
                  )}
                  {vendor.permissions.canComment && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center space-x-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>Comment</span>
                    </span>
                  )}
                  {vendor.permissions.canSuggestChanges && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full flex items-center space-x-1">
                      <Share2 className="w-3 h-3" />
                      <span>Suggest</span>
                    </span>
                  )}
                  {vendor.permissions.canDownloadTimeline && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full flex items-center space-x-1">
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </span>
                  )}
                </div>
              </div>
              
              {vendor.lastSeen && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Last seen: {vendor.lastSeen.toLocaleString()}
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Timeline with Vendor Visibility */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Timeline Visibility</h3>
        
        <div className="space-y-4">
          {timeline.map(event => {
            const eventVendors = getEventVendors(event.id);
            
            return (
              <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">{event.title}</h4>
                    <p className="text-sm text-gray-600">
                      {event.startTime.toLocaleTimeString()} - {event.endTime.toLocaleTimeString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{event.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Visible to:</span>
                    <div className="flex -space-x-2">
                      {eventVendors.slice(0, 3).map(vendor => {
                        const IconComponent = getVendorIcon(vendor.type);
                        return (
                          <div
                            key={vendor.id}
                            className={`w-8 h-8 ${getVendorColor(vendor.type)} rounded-full flex items-center justify-center border-2 border-white`}
                            title={vendor.name}
                          >
                            <IconComponent className="w-4 h-4 text-white" />
                          </div>
                        );
                      })}
                      {eventVendors.length > 3 && (
                        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center border-2 border-white text-white text-xs">
                          +{eventVendors.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                  >
                    {selectedEvent === event.id ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>
                
                <AnimatePresence>
                  {selectedEvent === event.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-100"
                    >
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-gray-800 mb-2">Event Details</h5>
                          <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                          {event.notes && (
                            <p className="text-sm text-gray-500">Notes: {event.notes}</p>
                          )}
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-gray-800 mb-2">Vendor Involvement</h5>
                          <div className="space-y-2">
                            {eventVendors.map(vendor => (
                              <div key={vendor.id} className="flex items-center justify-between text-sm">
                                <span className="text-gray-700">{vendor.name}</span>
                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(vendor.status)}`}>
                                  {vendor.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Messaging Panel */}
      <AnimatePresence>
        {showMessaging && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Vendor Messages</h3>
              <button
                onClick={() => setShowMessaging(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {messages.map(message => {
                const vendor = vendors.find(v => v.id === message.vendorId);
                const IconComponent = vendor ? getVendorIcon(vendor.type) : Users;
                
                return (
                  <div key={message.id} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 ${vendor ? getVendorColor(vendor.type) : 'bg-gray-500'} rounded-full flex items-center justify-center`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-800">
                          {vendor?.name || 'Unknown Vendor'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleString()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          message.type === 'alert' ? 'bg-red-100 text-red-700' :
                          message.type === 'suggestion' ? 'bg-yellow-100 text-yellow-700' :
                          message.type === 'confirmation' ? 'bg-green-100 text-green-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {message.type}
                        </span>
                      </div>
                      <p className="text-gray-700">{message.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message to all vendors..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invite Vendor Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Invite Vendor</h3>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleInviteVendor({
                  name: formData.get('name') as string,
                  email: formData.get('email') as string,
                  phone: formData.get('phone') as string,
                  company: formData.get('company') as string,
                  role: formData.get('role') as string,
                  type: formData.get('type') as Vendor['type']
                });
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendor Type
                  </label>
                  <select
                    name="type"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select vendor type...</option>
                    <option value="photographer">Photographer</option>
                    <option value="videographer">Videographer</option>
                    <option value="florist">Florist</option>
                    <option value="dj">DJ/Music</option>
                    <option value="caterer">Caterer</option>
                    <option value="planner">Wedding Planner</option>
                    <option value="transport">Transportation</option>
                    <option value="makeup">Makeup Artist</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Vendor's full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="vendor@company.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Company name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Lead Photographer, Wedding Coordinator"
                  />
                </div>
                
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorMesh;
