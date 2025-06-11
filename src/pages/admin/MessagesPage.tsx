import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Search, Plus, Mail, Phone, Clock, Star, Archive } from 'lucide-react';

interface Client {
  name: string;
  email: string;
  phone: string;
}

interface Message {
  id: string;
  client: Client;
  subject: string;
  preview: string;
  date: string;
  isStarred: boolean;
  isRead: boolean;
}

const initialMessages: Message[] = [
    {
      id: '1',
      client: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '(123) 456-7890'
      },
      subject: 'Wedding Package Inquiry',
      preview: "Hi, I'm interested in your wedding photography packages...",
      date: '2 hours ago',
      isStarred: true,
      isRead: false
    },
    {
      id: '2',
      client: {
        name: 'Emma Davis',
        email: 'emma@example.com',
        phone: '(123) 456-7890'
      },
      subject: 'Engagement Session Details',
      preview: "Just wanted to confirm the details for our upcoming session...",
      date: '1 day ago',
      isStarred: false,
      isRead: true
    }
];

export default function MessagesPage() {
  const [messages] = useState<Message[]>(initialMessages);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light text-gray-900 mb-1">Messages</h1>
            <p className="text-gray-500">Manage client communications</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Message
          </button>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Messages List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                !message.isRead ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-medium ${!message.isRead ? 'text-black' : 'text-gray-900'}`}>
                      {message.client.name}
                    </h3>
                    {message.isStarred && (
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    )}
                  </div>
                  <p className={`${!message.isRead ? 'font-medium text-black' : 'text-gray-900'}`}>
                    {message.subject}
                  </p>
                  <p className="text-gray-500 text-sm line-clamp-1">{message.preview}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {message.client.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {message.client.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {message.date}
                    </span>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Archive className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}