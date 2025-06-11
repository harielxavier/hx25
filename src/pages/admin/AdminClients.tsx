import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Search, Plus, Mail, Phone, MoreVertical, Filter, Download, Upload } from 'lucide-react';

export default function AdminClients() {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const clients = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '(123) 456-7890',
      status: 'Active',
      type: 'Wedding',
      date: 'Mar 15, 2024',
      lastContact: '2 days ago'
    },
    {
      id: '2',
      name: 'Emma Davis',
      email: 'emma@example.com',
      phone: '(123) 456-7890',
      status: 'Lead',
      type: 'Engagement',
      date: 'Apr 20, 2024',
      lastContact: '5 days ago'
    }
  ];

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light mb-1">Clients</h1>
            <p className="text-gray-500">Manage your client relationships</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Client
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>All Status</option>
            <option>Active</option>
            <option>Lead</option>
            <option>Past</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Client Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 font-medium text-gray-500">Client</th>
                <th className="text-left p-4 font-medium text-gray-500">Status</th>
                <th className="text-left p-4 font-medium text-gray-500">Type</th>
                <th className="text-left p-4 font-medium text-gray-500">Date</th>
                <th className="text-left p-4 font-medium text-gray-500">Last Contact</th>
                <th className="text-right p-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clients.map((client) => (
                <tr 
                  key={client.id}
                  className="group hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {client.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {client.phone}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      client.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">{client.type}</td>
                  <td className="p-4 text-gray-500">{client.date}</td>
                  <td className="p-4 text-gray-500">{client.lastContact}</td>
                  <td className="p-4 text-right">
                    <div className="relative">
                      <button
                        onClick={() => setSelectedClient(selectedClient === client.id ? null : client.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                      </button>
                      {selectedClient === client.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                            View Profile
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                            Edit Details
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                            Send Message
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50">
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}