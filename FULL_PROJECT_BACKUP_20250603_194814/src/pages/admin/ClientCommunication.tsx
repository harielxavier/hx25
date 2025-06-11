import React, { useState } from 'react';
import { Search, Filter, Plus, Mail, MessageSquare, Phone, Users, Star, Clock, Calendar, Paperclip, Send, Edit, Trash2, ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react';

const ClientCommunication: React.FC = () => {
  // Mock data for clients
  const initialClients = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '(555) 123-4567',
      type: 'Wedding',
      status: 'Active',
      lastContact: '2025-03-28',
      unread: 2,
      starred: true,
      avatar: 'SJ'
    },
    {
      id: 2,
      name: 'Michael Smith',
      email: 'michael.smith@example.com',
      phone: '(555) 987-6543',
      type: 'Family Portrait',
      status: 'Active',
      lastContact: '2025-03-25',
      unread: 0,
      starred: false,
      avatar: 'MS'
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      phone: '(555) 456-7890',
      type: 'Engagement',
      status: 'Active',
      lastContact: '2025-03-20',
      unread: 1,
      starred: true,
      avatar: 'ED'
    },
    {
      id: 4,
      name: 'James Wilson',
      email: 'james.wilson@example.com',
      phone: '(555) 234-5678',
      type: 'Corporate',
      status: 'Inactive',
      lastContact: '2025-03-18',
      unread: 0,
      starred: false,
      avatar: 'JW'
    },
    {
      id: 5,
      name: 'Jessica Brown',
      email: 'jessica.brown@example.com',
      phone: '(555) 876-5432',
      type: 'Newborn',
      status: 'Active',
      lastContact: '2025-03-15',
      unread: 3,
      starred: false,
      avatar: 'JB'
    },
    {
      id: 6,
      name: 'Robert Taylor',
      email: 'robert.taylor@example.com',
      phone: '(555) 345-6789',
      type: 'Wedding',
      status: 'Active',
      lastContact: '2025-03-12',
      unread: 0,
      starred: true,
      avatar: 'RT'
    },
    {
      id: 7,
      name: 'Amanda Martinez',
      email: 'amanda.martinez@example.com',
      phone: '(555) 654-3210',
      type: 'Wedding',
      status: 'Archived',
      lastContact: '2025-03-10',
      unread: 0,
      starred: false,
      avatar: 'AM'
    }
  ];

  // Mock data for messages
  const initialMessages = [
    {
      id: 1,
      clientId: 1,
      sender: 'client',
      content: 'Hi there! I was wondering if you have any availability for a wedding on June 15th, 2026?',
      timestamp: '2025-03-28T10:15:00',
      read: true
    },
    {
      id: 2,
      clientId: 1,
      sender: 'me',
      content: 'Hello Sarah! Thanks for reaching out. Yes, I do have availability on June 15th, 2026. Would you like to schedule a consultation to discuss your wedding photography needs?',
      timestamp: '2025-03-28T11:30:00',
      read: true
    },
    {
      id: 3,
      clientId: 1,
      sender: 'client',
      content: 'That would be great! When are you available for a consultation?',
      timestamp: '2025-03-28T14:45:00',
      read: false
    },
    {
      id: 4,
      clientId: 1,
      sender: 'client',
      content: 'Also, do you have a pricing guide you could send over?',
      timestamp: '2025-03-28T14:46:00',
      read: false
    },
    {
      id: 5,
      clientId: 3,
      sender: 'client',
      content: 'Just wanted to confirm our engagement session for next Friday at 4pm at Brooklyn Bridge Park.',
      timestamp: '2025-03-20T09:20:00',
      read: false
    },
    {
      id: 6,
      clientId: 5,
      sender: 'client',
      content: 'Our baby arrived early! She was born yesterday. When can we schedule the newborn session?',
      timestamp: '2025-03-15T08:10:00',
      read: false
    },
    {
      id: 7,
      clientId: 5,
      sender: 'client',
      content: 'Here\'s a photo of her. Can\'t wait for the professional photos!',
      timestamp: '2025-03-15T08:12:00',
      read: false
    },
    {
      id: 8,
      clientId: 5,
      sender: 'client',
      content: 'Would sometime next week work for you?',
      timestamp: '2025-03-15T08:15:00',
      read: false
    }
  ];

  // State
  const [clients, setClients] = useState(initialClients);
  const [messages, setMessages] = useState(initialMessages);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [showTemplates, setShowTemplates] = useState(false);
  const [activeTab, setActiveTab] = useState<'messages' | 'emails' | 'calls'>('messages');

  // Template messages
  const templates = [
    { id: 1, name: 'Booking Confirmation', content: 'Thank you for booking your session! I\'m excited to work with you. Here are the details of our upcoming session:' },
    { id: 2, name: 'Session Reminder', content: 'This is a friendly reminder about our upcoming session on [DATE] at [TIME] at [LOCATION]. Please let me know if you have any questions!' },
    { id: 3, name: 'Gallery Delivery', content: 'I\'m thrilled to share your gallery with you! You can view and download your images at the following link:' },
    { id: 4, name: 'Follow-up', content: 'I hope you\'re doing well! I wanted to follow up on our previous conversation about your photography needs.' }
  ];

  // Filter clients
  const filteredClients = clients
    .filter(client => {
      // Search filter
      const searchMatch = 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm);
      
      // Status filter
      const statusMatch = statusFilter === 'All' || client.status === statusFilter;
      
      // Type filter
      const typeMatch = typeFilter === 'All' || client.type === typeFilter;
      
      return searchMatch && statusMatch && typeMatch;
    })
    .sort((a, b) => {
      // Sort by unread first, then by starred, then by last contact date
      if (a.unread !== b.unread) return b.unread - a.unread;
      if (a.starred !== b.starred) return a.starred ? -1 : 1;
      return new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime();
    });

  // Get selected client
  const selectedClient = clients.find(client => client.id === selectedClientId);

  // Get messages for selected client
  const clientMessages = messages
    .filter(message => message.clientId === selectedClientId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Send message
  const sendMessage = () => {
    if (!messageText.trim() || !selectedClientId) return;
    
    const newMessage = {
      id: messages.length + 1,
      clientId: selectedClientId,
      sender: 'me' as const,
      content: messageText,
      timestamp: new Date().toISOString(),
      read: true
    };
    
    setMessages([...messages, newMessage]);
    setMessageText('');
    
    // Update last contact date for client
    setClients(clients.map(client => 
      client.id === selectedClientId 
        ? { ...client, lastContact: new Date().toISOString().split('T')[0] }
        : client
    ));
  };

  // Mark messages as read
  const markMessagesAsRead = (clientId: number) => {
    setMessages(messages.map(message => 
      message.clientId === clientId && message.sender === 'client' && !message.read
        ? { ...message, read: true }
        : message
    ));
    
    setClients(clients.map(client => 
      client.id === clientId
        ? { ...client, unread: 0 }
        : client
    ));
  };

  // Toggle star status
  const toggleStarred = (clientId: number) => {
    setClients(clients.map(client => 
      client.id === clientId
        ? { ...client, starred: !client.starred }
        : client
    ));
  };

  // Use template
  const useTemplate = (content: string) => {
    setMessageText(content);
    setShowTemplates(false);
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: Record<string, typeof clientMessages> = {};
    
    clientMessages.forEach(message => {
      const date = message.timestamp.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return Object.entries(groups)
      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
      .map(([date, messages]) => ({
        date,
        messages
      }));
  };

  // Select a client
  const handleSelectClient = (clientId: number) => {
    setSelectedClientId(clientId);
    markMessagesAsRead(clientId);
  };

  // Render avatar
  const renderAvatar = (client: typeof clients[0]) => {
    return (
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white ${client.unread > 0 ? 'bg-blue-600' : 'bg-gray-500'}`}>
        {client.avatar}
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Clients Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800">Clients</h2>
            <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search clients..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2 mb-2">
            <select
              className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Archived">Archived</option>
            </select>
            
            <select
              className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Wedding">Wedding</option>
              <option value="Engagement">Engagement</option>
              <option value="Family Portrait">Family</option>
              <option value="Newborn">Newborn</option>
              <option value="Corporate">Corporate</option>
            </select>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredClients.length > 0 ? (
            filteredClients.map(client => (
              <div 
                key={client.id}
                className={`p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors ${selectedClientId === client.id ? 'bg-blue-50' : ''}`}
                onClick={() => handleSelectClient(client.id)}
              >
                <div className="flex items-center">
                  {renderAvatar(client)}
                  
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <h3 className={`text-sm font-medium ${client.unread > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                          {client.name}
                        </h3>
                        {client.starred && (
                          <Star className="w-4 h-4 ml-1 text-yellow-500" fill="currentColor" />
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(client.lastContact)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-500 truncate">{client.email}</p>
                      {client.unread > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                          {client.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No clients match your search criteria.
            </div>
          )}
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedClient ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
              <div className="flex items-center">
                {renderAvatar(selectedClient)}
                <div className="ml-3">
                  <div className="flex items-center">
                    <h2 className="text-lg font-medium text-gray-800">{selectedClient.name}</h2>
                    <button 
                      className={`ml-2 text-gray-400 hover:text-yellow-500 ${selectedClient.starred ? 'text-yellow-500' : ''}`}
                      onClick={() => toggleStarred(selectedClient.id)}
                    >
                      <Star className="w-5 h-5" fill={selectedClient.starred ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">{selectedClient.type} • {selectedClient.status}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                  <Mail className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                  <Calendar className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-white">
              <button 
                className={`px-4 py-2 text-sm font-medium flex items-center ${activeTab === 'messages' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                onClick={() => setActiveTab('messages')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Messages
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium flex items-center ${activeTab === 'emails' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                onClick={() => setActiveTab('emails')}
              >
                <Mail className="w-4 h-4 mr-2" />
                Emails
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium flex items-center ${activeTab === 'calls' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                onClick={() => setActiveTab('calls')}
              >
                <Phone className="w-4 h-4 mr-2" />
                Calls
              </button>
            </div>
            
            {/* Messages */}
            {activeTab === 'messages' && (
              <>
                <div className="flex-1 p-4 overflow-y-auto">
                  {groupMessagesByDate().map(group => (
                    <div key={group.date} className="mb-6">
                      <div className="flex justify-center mb-4">
                        <span className="px-3 py-1 bg-gray-200 rounded-full text-xs text-gray-600">
                          {formatDate(group.date)}
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        {group.messages.map(message => (
                          <div 
                            key={message.id}
                            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[70%] p-3 rounded-lg ${
                                message.sender === 'me' 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-white text-gray-800 border border-gray-200'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <div className={`text-xs mt-1 text-right ${message.sender === 'me' ? 'text-blue-200' : 'text-gray-500'}`}>
                                {formatTimestamp(message.timestamp)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {clientMessages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                      <MessageSquare className="w-12 h-12 mb-4 text-gray-300" />
                      <p>No messages yet</p>
                      <p className="text-sm mt-1">Send a message to start the conversation</p>
                    </div>
                  )}
                </div>
                
                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="relative">
                    {showTemplates && (
                      <div className="absolute bottom-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mb-2 max-h-60 overflow-y-auto">
                        <div className="p-2 border-b border-gray-200 flex justify-between items-center">
                          <h3 className="text-sm font-medium text-gray-700">Message Templates</h3>
                          <button 
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => setShowTemplates(false)}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="p-2">
                          {templates.map(template => (
                            <div 
                              key={template.id}
                              className="p-2 hover:bg-gray-50 cursor-pointer rounded"
                              onClick={() => useTemplate(template.content)}
                            >
                              <h4 className="text-sm font-medium text-gray-800">{template.name}</h4>
                              <p className="text-xs text-gray-500 truncate">{template.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Type a message..."
                      rows={3}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                    />
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex space-x-2">
                        <button 
                          className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                          onClick={() => setShowTemplates(!showTemplates)}
                        >
                          {showTemplates ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                        <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                          <Paperclip className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                          <Calendar className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <button 
                        className={`px-4 py-2 rounded-md flex items-center ${
                          messageText.trim() 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        onClick={sendMessage}
                        disabled={!messageText.trim()}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* Emails Tab */}
            {activeTab === 'emails' && (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center p-6">
                  <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Email Communication</h3>
                  <p className="text-gray-500 mb-4">Track and send emails to your clients</p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Compose New Email
                  </button>
                </div>
              </div>
            )}
            
            {/* Calls Tab */}
            {activeTab === 'calls' && (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center p-6">
                  <Phone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Call History</h3>
                  <p className="text-gray-500 mb-4">Track and log calls with your clients</p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Log New Call
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-500">
            <Users className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-medium text-gray-700 mb-2">Client Communication</h2>
            <p className="mb-6">Select a client to start messaging</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add New Client
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientCommunication;
