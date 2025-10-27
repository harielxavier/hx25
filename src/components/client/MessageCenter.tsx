import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Paperclip, 
  Image, 
  Smile,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck
} from 'lucide-react';
import { Job } from '../../services/jobsService';

interface MessageCenterProps {
  clientId: string;
  job: Job;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'photographer' | 'admin';
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  attachments?: Attachment[];
  status: 'sent' | 'delivered' | 'read';
  replyTo?: string;
}

interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'other';
  size: number;
}

const MessageCenter: React.FC<MessageCenterProps> = ({ clientId, job }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        senderId: 'photographer_1',
        senderName: 'Hariel Xavier',
        senderRole: 'photographer',
        content: 'Hi! Thank you for booking with us. I\'m excited to capture your special day! 📸',
        timestamp: new Date('2024-01-15T10:00:00'),
        type: 'text',
        status: 'read'
      },
      {
        id: '2',
        senderId: clientId,
        senderName: job.clientName,
        senderRole: 'client',
        content: 'Thank you! We\'re so excited to work with you. When can we schedule our engagement session?',
        timestamp: new Date('2024-01-15T10:30:00'),
        type: 'text',
        status: 'read'
      },
      {
        id: '3',
        senderId: 'photographer_1',
        senderName: 'Hariel Xavier',
        senderRole: 'photographer',
        content: 'I have availability next weekend. Here are some location ideas for your engagement session:',
        timestamp: new Date('2024-01-15T11:00:00'),
        type: 'text',
        status: 'read'
      },
      {
        id: '4',
        senderId: 'photographer_1',
        senderName: 'Hariel Xavier',
        senderRole: 'photographer',
        content: '',
        timestamp: new Date('2024-01-15T11:01:00'),
        type: 'image',
        attachments: [
          {
            id: 'att_1',
            name: 'location_ideas.jpg',
            url: 'https://res.cloudinary.com/dos0qac90/image/upload/v1761593380/hariel-xavier-photography/MoStuff/amanda/hero.jpg',
            type: 'image',
            size: 2048000
          }
        ],
        status: 'read'
      },
      {
        id: '5',
        senderId: clientId,
        senderName: job.clientName,
        senderRole: 'client',
        content: 'These locations look amazing! We love the garden setting. Can we do Saturday at 4 PM?',
        timestamp: new Date('2024-01-15T14:00:00'),
        type: 'text',
        status: 'delivered'
      },
      {
        id: '6',
        senderId: 'photographer_1',
        senderName: 'Hariel Xavier',
        senderRole: 'photographer',
        content: 'Perfect! Saturday at 4 PM works great. The lighting will be beautiful at that time. I\'ll send you the exact address and what to expect.',
        timestamp: new Date('2024-01-15T14:15:00'),
        type: 'text',
        status: 'sent'
      }
    ];

    setTimeout(() => {
      setMessages(mockMessages);
      setLoading(false);
      scrollToBottom();
    }, 1000);
  }, [clientId, job]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    
    const message: Message = {
      id: Date.now().toString(),
      senderId: clientId,
      senderName: job.clientName,
      senderRole: 'client',
      content: newMessage,
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: 'delivered' } : msg
      ));
      setSending(false);
    }, 1000);

    // Simulate photographer response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: 'photographer_1',
        senderName: 'Hariel Xavier',
        senderRole: 'photographer',
        content: 'Thanks for your message! I\'ll get back to you shortly.',
        timestamp: new Date(),
        type: 'text',
        status: 'sent'
      };
      setMessages(prev => [...prev, response]);
    }, 3000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Handle file upload logic here
    console.log('Files selected:', files);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getMessageStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Message Center</h2>
              <p className="text-gray-600">Chat with your photographer</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => {
          const isOwnMessage = message.senderRole === 'client';
          const showDate = index === 0 || 
            formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);

          return (
            <div key={message.id}>
              {showDate && (
                <div className="text-center my-4">
                  <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {formatDate(message.timestamp)}
                  </span>
                </div>
              )}
              
              <motion.div
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                  {!isOwnMessage && (
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
                          {message.senderName.charAt(0)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{message.senderName}</span>
                    </div>
                  )}
                  
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      isOwnMessage
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.type === 'text' && (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}
                    
                    {message.type === 'image' && message.attachments && (
                      <div className="space-y-2">
                        {message.attachments.map((attachment) => (
                          <div key={attachment.id}>
                            <img
                              src={attachment.url}
                              alt={attachment.name}
                              className="rounded-lg max-w-full h-auto"
                            />
                            <p className="text-xs mt-1 opacity-75">{attachment.name}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className={`flex items-center space-x-1 mt-1 ${
                    isOwnMessage ? 'justify-end' : 'justify-start'
                  }`}>
                    <span className="text-xs text-gray-500">
                      {formatTime(message.timestamp)}
                    </span>
                    {isOwnMessage && getMessageStatusIcon(message.status)}
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <div className="relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              
              <div className="absolute right-3 bottom-3 flex items-center space-x-1">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  <Smile className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default MessageCenter;
