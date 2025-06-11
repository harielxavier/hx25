import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, Mail, Phone, Download, Upload, MoreVertical } from 'lucide-react';

const clientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  company: z.string().optional(),
  dateCreated: z.string().optional(),
});

type ClientForm = z.infer<typeof clientSchema>;

// Mock data based on the CSV structure
const mockClients = [
  {
    id: '1',
    dateCreated: 'Dec 12 2024',
    firstName: 'Amy',
    lastName: 'Jenson',
    company: '-',
    phone: '13035021331',
    email: 'amy@businesscoachvas.com',
  },
  {
    id: '2',
    dateCreated: 'Nov 20 2024',
    firstName: 'Darlene',
    lastName: 'Schild',
    company: '-',
    phone: '732-801-0043',
    email: 'dwschild@gmail.com',
  },
  // Add more clients...
];

export default function ClientList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ClientForm>({
    resolver: zodResolver(clientSchema)
  });

  const filteredClients = mockClients.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    return (
      client.firstName.toLowerCase().includes(searchLower) ||
      client.lastName.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      client.phone.includes(searchTerm)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-white">Clients Overview</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-400">Dashboard</span>
            <span className="text-sm text-gray-400">›</span>
            <span className="text-sm text-gray-400">Clients overview</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 text-white bg-[#1a1a1a] border border-[#333] rounded-lg hover:bg-[#222] transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import Clients
          </button>
          <button className="px-4 py-2 text-white bg-[#1a1a1a] border border-[#333] rounded-lg hover:bg-[#222] transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Clients
          </button>
          <button className="px-4 py-2 bg-[#2F855A] text-white rounded-lg hover:bg-[#276749] transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Client
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500
                   focus:border-white focus:ring-1 focus:ring-white transition-all"
        />
      </div>

      {/* Client Table */}
      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#333]">
              <th className="px-6 py-3 text-left text-xs font-light text-gray-400">Date Created</th>
              <th className="px-6 py-3 text-left text-xs font-light text-gray-400">First Name</th>
              <th className="px-6 py-3 text-left text-xs font-light text-gray-400">Last Name</th>
              <th className="px-6 py-3 text-left text-xs font-light text-gray-400">Company</th>
              <th className="px-6 py-3 text-left text-xs font-light text-gray-400">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-light text-gray-400">Email</th>
              <th className="px-6 py-3 text-right text-xs font-light text-gray-400"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#333]">
            {filteredClients.map((client) => (
              <tr 
                key={client.id}
                className="hover:bg-[#222] transition-colors group"
              >
                <td className="px-6 py-4 text-sm text-gray-300">{client.dateCreated}</td>
                <td className="px-6 py-4 text-sm text-white">{client.firstName}</td>
                <td className="px-6 py-4 text-sm text-white">{client.lastName}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{client.company}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{client.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{client.email}</td>
                <td className="px-6 py-4 text-right">
                  <div className="relative">
                    <button
                      onClick={() => setSelectedClient(selectedClient === client.id ? null : client.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-400 hover:text-white" />
                    </button>
                    {selectedClient === client.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-lg py-1 z-10">
                        <button className="w-full px-4 py-2 text-sm text-left text-white hover:bg-[#222] transition-colors">
                          View Client
                        </button>
                        <button className="w-full px-4 py-2 text-sm text-left text-white hover:bg-[#222] transition-colors">
                          Send Email
                        </button>
                        <button className="w-full px-4 py-2 text-sm text-left text-white hover:bg-[#222] transition-colors">
                          Edit Client
                        </button>
                        <button className="w-full px-4 py-2 text-sm text-left text-red-400 hover:bg-[#222] transition-colors">
                          Delete Client
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