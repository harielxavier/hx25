import React, { useState } from 'react';
import { Mail, Plus, Search, Filter, Send, Edit, Trash2, Eye, Clock, CheckCircle } from 'lucide-react';

const EmailCampaigns: React.FC = () => {
  // State for campaigns
  const [activeTab, setActiveTab] = useState<'drafts' | 'scheduled' | 'sent'>('drafts');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for campaigns
  const mockCampaigns = [
    {
      id: '1',
      name: 'Spring Mini Sessions Announcement',
      subject: 'Book Your Spring Mini Session Now!',
      status: 'draft',
      created: new Date('2025-03-15'),
      recipients: 124,
      openRate: null,
      clickRate: null
    },
    {
      id: '2',
      name: 'Wedding Season Promotion',
      subject: 'Special Offer for 2025 Wedding Bookings',
      status: 'scheduled',
      scheduled: new Date('2025-04-05'),
      created: new Date('2025-03-20'),
      recipients: 250,
      openRate: null,
      clickRate: null
    },
    {
      id: '3',
      name: 'Client Gallery Announcement',
      subject: 'Your Wedding Photos Are Ready!',
      status: 'sent',
      sent: new Date('2025-03-10'),
      created: new Date('2025-03-08'),
      recipients: 2,
      openRate: 100,
      clickRate: 50
    },
    {
      id: '4',
      name: 'Holiday Card Mini Sessions',
      subject: 'Book Your Holiday Card Photos Now',
      status: 'sent',
      sent: new Date('2025-02-15'),
      created: new Date('2025-02-10'),
      recipients: 180,
      openRate: 68,
      clickRate: 32
    }
  ];
  
  // Filter campaigns based on active tab and search term
  const filteredCampaigns = mockCampaigns.filter(campaign => {
    const matchesTab = 
      (activeTab === 'drafts' && campaign.status === 'draft') ||
      (activeTab === 'scheduled' && campaign.status === 'scheduled') ||
      (activeTab === 'sent' && campaign.status === 'sent');
      
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          campaign.subject.toLowerCase().includes(searchTerm.toLowerCase());
                          
    return matchesTab && matchesSearch;
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Email Campaigns</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Create Campaign</span>
        </button>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50">
            <Filter className="h-5 w-5 text-gray-400" />
            <span>Filter</span>
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('drafts')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'drafts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Drafts
          </button>
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'scheduled'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Scheduled
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sent'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Sent
          </button>
        </nav>
      </div>
      
      {/* Campaign list */}
      {filteredCampaigns.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Mail className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns</h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab === 'drafts' 
              ? 'Get started by creating a new email campaign.' 
              : activeTab === 'scheduled' 
                ? 'You don\'t have any scheduled campaigns.' 
                : 'You haven\'t sent any campaigns yet.'}
          </p>
          {activeTab === 'drafts' && (
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Create Campaign
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredCampaigns.map((campaign) => (
              <li key={campaign.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {campaign.status === 'draft' ? (
                          <Edit className="h-6 w-6 text-gray-400" />
                        ) : campaign.status === 'scheduled' ? (
                          <Clock className="h-6 w-6 text-amber-500" />
                        ) : (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        )}
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">{campaign.name}</h4>
                        <p className="text-sm text-gray-500">{campaign.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-500">
                        <Eye className="h-5 w-5" />
                      </button>
                      <button className="p-1 text-blue-400 hover:text-blue-500">
                        <Edit className="h-5 w-5" />
                      </button>
                      {campaign.status === 'draft' && (
                        <button className="p-1 text-green-400 hover:text-green-500">
                          <Send className="h-5 w-5" />
                        </button>
                      )}
                      <button className="p-1 text-red-400 hover:text-red-500">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {campaign.recipients} recipients
                      </p>
                      {campaign.status === 'sent' && (
                        <>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            <Eye className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {campaign.openRate}% open rate
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            <CheckCircle className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {campaign.clickRate}% click rate
                          </p>
                        </>
                      )}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      {campaign.status === 'draft' ? (
                        <p>Created on {campaign.created.toLocaleDateString()}</p>
                      ) : campaign.status === 'scheduled' ? (
                        <p>Scheduled for {campaign.scheduled?.toLocaleDateString()}</p>
                      ) : (
                        <p>Sent on {campaign.sent?.toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmailCampaigns;
