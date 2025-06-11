import React, { useState } from 'react';
import { Users, ArrowUpRight, Filter, Search, Download, Plus, Edit, Trash2, Mail, Phone, Calendar } from 'lucide-react';

const LeadGeneration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'contacted' | 'converted'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for leads
  const mockLeads = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '(555) 123-4567',
      source: 'Contact Form',
      date: new Date('2025-03-28'),
      status: 'new',
      notes: 'Interested in wedding photography for June 2026',
      tags: ['wedding', 'high-priority']
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'mchen@example.com',
      phone: '(555) 987-6543',
      source: 'Instagram',
      date: new Date('2025-03-25'),
      status: 'contacted',
      notes: 'Followed up via email on March 26th',
      tags: ['family', 'portrait']
    },
    {
      id: '3',
      name: 'Jessica Williams',
      email: 'jwilliams@example.com',
      phone: '(555) 456-7890',
      source: 'Referral',
      date: new Date('2025-03-20'),
      status: 'converted',
      notes: 'Booked family session for April 15th',
      tags: ['family', 'returning']
    },
    {
      id: '4',
      name: 'David Rodriguez',
      email: 'drodriguez@example.com',
      phone: '(555) 234-5678',
      source: 'Website',
      date: new Date('2025-03-15'),
      status: 'new',
      notes: 'Requested information about corporate headshots',
      tags: ['corporate', 'headshot']
    }
  ];
  
  // Filter leads based on active tab and search term
  const filteredLeads = mockLeads.filter(lead => {
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'new' && lead.status === 'new') ||
      (activeTab === 'contacted' && lead.status === 'contacted') ||
      (activeTab === 'converted' && lead.status === 'converted');
      
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.notes.toLowerCase().includes(searchTerm.toLowerCase());
                          
    return matchesTab && matchesSearch;
  });
  
  // Stats for the dashboard
  const stats = [
    { name: 'Total Leads', value: mockLeads.length, icon: Users, color: 'bg-blue-500' },
    { name: 'Conversion Rate', value: '33%', icon: ArrowUpRight, color: 'bg-green-500' },
    { name: 'New This Week', value: '2', icon: Plus, color: 'bg-purple-500' }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lead Management</h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color} text-white mr-4`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
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
            placeholder="Search leads..."
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
            onClick={() => setActiveTab('all')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Leads
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'new'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            New
          </button>
          <button
            onClick={() => setActiveTab('contacted')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'contacted'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Contacted
          </button>
          <button
            onClick={() => setActiveTab('converted')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'converted'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Converted
          </button>
        </nav>
      </div>
      
      {/* Lead list */}
      {filteredLeads.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No leads found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Get started by adding your first lead.'}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Add Lead
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredLeads.map((lead) => (
              <li key={lead.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{lead.name}</h4>
                      <div className="mt-1 flex items-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${lead.status === 'new' ? 'bg-yellow-100 text-yellow-800' : 
                            lead.status === 'contacted' ? 'bg-blue-100 text-blue-800' : 
                            'bg-green-100 text-green-800'}`}>
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          {lead.source}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          {lead.date.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-blue-400 hover:text-blue-500">
                        <Mail className="h-5 w-5" />
                      </button>
                      <button className="p-1 text-green-400 hover:text-green-500">
                        <Phone className="h-5 w-5" />
                      </button>
                      <button className="p-1 text-purple-400 hover:text-purple-500">
                        <Calendar className="h-5 w-5" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-500">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button className="p-1 text-red-400 hover:text-red-500">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {lead.email}
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <Phone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {lead.phone}
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{lead.notes}</p>
                  </div>
                  <div className="mt-2">
                    {lead.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                        {tag}
                      </span>
                    ))}
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

export default LeadGeneration;
