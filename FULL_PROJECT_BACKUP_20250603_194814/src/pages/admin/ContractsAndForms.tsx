import React, { useState } from 'react';
import { FileText, Plus, Search, Filter, Download, Upload, Edit, Trash2, Eye, Copy, CheckCircle, Clock, Users, AlertTriangle } from 'lucide-react';

const ContractsAndForms: React.FC = () => {
  // Mock data for contracts and forms
  const initialContracts = [
    {
      id: 1,
      name: 'Wedding Photography Contract',
      type: 'Contract',
      status: 'Active',
      lastUpdated: '2025-02-15',
      usageCount: 24,
      tags: ['Wedding', 'Standard']
    },
    {
      id: 2,
      name: 'Portrait Session Agreement',
      type: 'Contract',
      status: 'Active',
      lastUpdated: '2025-01-20',
      usageCount: 18,
      tags: ['Portrait', 'Family', 'Standard']
    },
    {
      id: 3,
      name: 'Model Release Form',
      type: 'Form',
      status: 'Active',
      lastUpdated: '2025-03-05',
      usageCount: 32,
      tags: ['Release', 'Legal']
    },
    {
      id: 4,
      name: 'Commercial Photography Agreement',
      type: 'Contract',
      status: 'Active',
      lastUpdated: '2025-02-28',
      usageCount: 7,
      tags: ['Commercial', 'Business']
    },
    {
      id: 5,
      name: 'Print Release Form',
      type: 'Form',
      status: 'Active',
      lastUpdated: '2025-01-10',
      usageCount: 41,
      tags: ['Release', 'Prints']
    },
    {
      id: 6,
      name: 'Wedding Questionnaire',
      type: 'Form',
      status: 'Active',
      lastUpdated: '2025-03-12',
      usageCount: 15,
      tags: ['Wedding', 'Questionnaire']
    },
    {
      id: 7,
      name: 'Engagement Session Contract',
      type: 'Contract',
      status: 'Draft',
      lastUpdated: '2025-03-18',
      usageCount: 0,
      tags: ['Engagement', 'Draft']
    }
  ];

  const initialPendingContracts = [
    {
      id: 101,
      name: 'Smith Wedding Contract',
      client: 'John & Sarah Smith',
      type: 'Wedding Photography Contract',
      sentDate: '2025-03-25',
      status: 'Awaiting Signature',
      dueDate: '2025-04-05'
    },
    {
      id: 102,
      name: 'Johnson Family Portrait Agreement',
      client: 'Johnson Family',
      type: 'Portrait Session Agreement',
      sentDate: '2025-03-22',
      status: 'Signed',
      dueDate: '2025-03-29',
      signedDate: '2025-03-24'
    },
    {
      id: 103,
      name: 'ABC Corp Commercial Agreement',
      client: 'ABC Corporation',
      type: 'Commercial Photography Agreement',
      sentDate: '2025-03-20',
      status: 'Awaiting Signature',
      dueDate: '2025-04-03'
    },
    {
      id: 104,
      name: 'Davis Newborn Session',
      client: 'Davis Family',
      type: 'Portrait Session Agreement',
      sentDate: '2025-03-15',
      status: 'Signed',
      dueDate: '2025-03-22',
      signedDate: '2025-03-16'
    }
  ];

  // State
  const [contracts, setContracts] = useState(initialContracts);
  const [pendingContracts, setPendingContracts] = useState(initialPendingContracts);
  const [activeTab, setActiveTab] = useState<'templates' | 'pending'>('templates');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedContractId, setSelectedContractId] = useState<number | null>(null);

  // Filter contracts
  const filteredContracts = contracts.filter(contract => {
    const searchMatch = contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       contract.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const typeMatch = typeFilter === 'All' || contract.type === typeFilter;
    const statusMatch = statusFilter === 'All' || contract.status === statusFilter;
    
    return searchMatch && typeMatch && statusMatch;
  });

  // Filter pending contracts
  const filteredPendingContracts = pendingContracts.filter(contract => {
    const searchMatch = contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       contract.client.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === 'All' || contract.status === statusFilter;
    
    return searchMatch && statusMatch;
  });

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Active</span>;
      case 'Draft':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs flex items-center"><Clock className="w-3 h-3 mr-1" /> Draft</span>;
      case 'Archived':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs flex items-center"><Clock className="w-3 h-3 mr-1" /> Archived</span>;
      case 'Awaiting Signature':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center"><Clock className="w-3 h-3 mr-1" /> Awaiting Signature</span>;
      case 'Signed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Signed</span>;
      case 'Expired':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs flex items-center"><AlertTriangle className="w-3 h-3 mr-1" /> Expired</span>;
      default:
        return null;
    }
  };

  // Render templates tab
  const renderTemplatesTab = () => {
    return (
      <div>
        <div className="overflow-hidden rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContracts.length > 0 ? (
                filteredContracts.map(contract => (
                  <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400 mr-3" />
                        <div className="text-sm font-medium text-gray-900">{contract.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{contract.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(contract.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(contract.lastUpdated)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{contract.usageCount} uses</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {contract.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-gray-500 hover:text-blue-600" title="View">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="text-gray-500 hover:text-blue-600" title="Edit">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button className="text-gray-500 hover:text-blue-600" title="Duplicate">
                          <Copy className="h-5 w-5" />
                        </button>
                        <button className="text-gray-500 hover:text-red-600" title="Delete">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    No contracts or forms found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render pending tab
  const renderPendingTab = () => {
    return (
      <div>
        <div className="overflow-hidden rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sent Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPendingContracts.length > 0 ? (
                filteredPendingContracts.map(contract => (
                  <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400 mr-3" />
                        <div className="text-sm font-medium text-gray-900">{contract.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contract.client}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{contract.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(contract.sentDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(contract.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(contract.dueDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-gray-500 hover:text-blue-600" title="View">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="text-gray-500 hover:text-blue-600" title="Send Reminder">
                          <Clock className="h-5 w-5" />
                        </button>
                        <button className="text-gray-500 hover:text-red-600" title="Cancel">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    No pending contracts found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Contracts & Forms</h1>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Create New
          </button>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search contracts and forms..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Contract">Contracts</option>
              <option value="Form">Forms</option>
            </select>
          </div>
          
          <div className="w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
              <option value="Awaiting Signature">Awaiting Signature</option>
              <option value="Signed">Signed</option>
            </select>
          </div>
          
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('templates')}
            >
              Templates
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('pending')}
            >
              Pending Contracts
              {pendingContracts.filter(c => c.status === 'Awaiting Signature').length > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {pendingContracts.filter(c => c.status === 'Awaiting Signature').length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'templates' ? renderTemplatesTab() : renderPendingTab()}
      
      {/* Export Options */}
      <div className="mt-6 flex justify-end">
        <button className="flex items-center text-gray-600 hover:text-gray-900 text-sm">
          <Download className="h-4 w-4 mr-1" />
          Export List
        </button>
      </div>
    </div>
  );
};

export default ContractsAndForms;
