import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Mail, Phone, Calendar, MessageSquare, Edit, Trash2, Star, Download, MoreHorizontal } from 'lucide-react';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Lead } from '../../services/leadService';

interface LeadWithId extends Lead {
  id: string;
  date: string;
  starred: boolean;
}

const LeadManagement: React.FC = () => {
  // State for leads from Firestore
  const [leads, setLeads] = useState<LeadWithId[]>([]);

  // Fetch leads from Firestore
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Status options for filter and display
  const statusOptions = ['All', 'new', 'contacted', 'qualified', 'converted', 'lost'];
  const typeOptions = ['All', 'wedding', 'engagement', 'family', 'newborn', 'corporate', 'event', 'other'];

  // Status badge color mapping
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-purple-100 text-purple-800';
      case 'qualified': return 'bg-indigo-100 text-indigo-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Fetch leads from Firestore
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const leadsRef = collection(db, 'leads');
        const q = query(leadsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const leadData = querySnapshot.docs.map(doc => {
          const data = doc.data() as Lead;
          return {
            id: doc.id,
            ...data,
            // Convert Firestore timestamps to strings for display
            date: data.createdAt instanceof Timestamp 
              ? new Date(data.createdAt.toMillis()).toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0],
            starred: false,
            notes: data.additionalInfo || '',
          };
        });
        
        setLeads(leadData);
        console.log('Fetched leads:', leadData);
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };
    
    fetchLeads();
  }, []);

  // Filter and sort leads
  const filteredLeads = leads
    .filter(lead => {
      // Search filter
      const searchMatch = 
        `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.phone ? lead.phone.includes(searchTerm) : false) ||
        (lead.additionalInfo ? lead.additionalInfo.toLowerCase().includes(searchTerm.toLowerCase()) : false);
      
      // Status filter
      const statusMatch = statusFilter === 'All' || lead.status === statusFilter.toLowerCase();
      
      // Type filter
      const typeMatch = typeFilter === 'All' || lead.eventType === typeFilter.toLowerCase();
      
      return searchMatch && statusMatch && typeMatch;
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'name') {
        return sortOrder === 'asc'
          ? `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
          : `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`);
      } else if (sortBy === 'status') {
        return sortOrder === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      return 0;
    });

  // Toggle lead selection
  const toggleLeadSelection = (id: string) => {
    if (selectedLeads.includes(id)) {
      setSelectedLeads(selectedLeads.filter(leadId => leadId !== id));
    } else {
      setSelectedLeads([...selectedLeads, id]);
    }
  };

  // Toggle star status
  const toggleStarred = (id: string) => {
    setLeads(leads.map(lead => 
      lead.id === id ? { ...lead, starred: !lead.starred } : lead
    ));
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Handle bulk selection
  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    }
  };

  // Toggle sort order
  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Watch for selected leads to show/hide bulk actions
  React.useEffect(() => {
    setShowBulkActions(selectedLeads.length > 0);
  }, [selectedLeads]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Lead Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add New Lead
        </button>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search leads..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div className="w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              {typeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </button>
        </div>
      </div>
      
      {/* Bulk Actions */}
      {showBulkActions && (
        <div className="bg-blue-50 p-3 rounded-lg shadow mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-blue-700 font-medium mr-4">{selectedLeads.length} leads selected</span>
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center text-sm">
                <Mail className="w-4 h-4 mr-1.5" />
                Email
              </button>
              <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-1.5" />
                Schedule
              </button>
              <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center text-sm">
                <Edit className="w-4 h-4 mr-1.5" />
                Update Status
              </button>
              <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center text-sm text-red-600">
                <Trash2 className="w-4 h-4 mr-1.5" />
                Delete
              </button>
            </div>
          </div>
          <button 
            className="text-blue-700 hover:text-blue-900"
            onClick={() => setSelectedLeads([])}
          >
            Clear Selection
          </button>
        </div>
      )}
      
      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                <span className="sr-only">Star</span>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange('name')}
              >
                Name
                {sortBy === 'name' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange('date')}
              >
                Date
                {sortBy === 'date' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange('status')}
              >
                Status
                {sortBy === 'status' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLeads.length > 0 ? (
              filteredLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={() => toggleLeadSelection(lead.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      className={`text-gray-400 hover:text-yellow-500 ${lead.starred ? 'text-yellow-500' : ''}`}
                      onClick={() => toggleStarred(lead.id)}
                    >
                      <Star className="h-5 w-5" fill={lead.starred ? 'currentColor' : 'none'} />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{`${lead.firstName} ${lead.lastName}`}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lead.email}</div>
                    <div className="text-sm text-gray-500">{lead.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{lead.source || 'Website'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(lead.date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lead.eventType ? lead.eventType.charAt(0).toUpperCase() + lead.eventType.slice(1) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-gray-500 hover:text-blue-600" title="Email">
                        <Mail className="h-5 w-5" />
                      </button>
                      <button className="text-gray-500 hover:text-blue-600" title="Call">
                        <Phone className="h-5 w-5" />
                      </button>
                      <button className="text-gray-500 hover:text-blue-600" title="Message">
                        <MessageSquare className="h-5 w-5" />
                      </button>
                      <button className="text-gray-500 hover:text-blue-600" title="More">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-6 py-10 text-center text-gray-500">
                  No leads found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{filteredLeads.length}</span> of <span className="font-medium">{leads.length}</span> leads
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors">
            Previous
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors">
            Next
          </button>
        </div>
      </div>
      
      {/* Export Options */}
      <div className="mt-4 flex justify-end">
        <button className="flex items-center text-gray-600 hover:text-gray-900 text-sm">
          <Download className="h-4 w-4 mr-1" />
          Export Leads
        </button>
      </div>
    </div>
  );
};

export default LeadManagement;
