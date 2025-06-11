import React from 'react';
import { FileText, Send, Download, Eye, Plus } from 'lucide-react';

export default function ContractManager() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Contracts</h3>
        <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
          <Plus className="w-4 h-4" />
          New Contract
        </button>
      </div>
      
      <div className="space-y-4">
        {[
          {
            client: 'Sarah & John',
            type: 'Wedding Contract',
            status: 'signed',
            date: '2024-03-15',
            value: '$3,500'
          },
          {
            client: 'Emma Davis',
            type: 'Engagement Contract',
            status: 'pending',
            date: '2024-03-10',
            value: '$500'
          }
        ].map((contract, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="font-medium">{contract.client}</p>
                <p className="text-sm text-gray-500">{contract.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="font-medium">{contract.value}</p>
                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                  contract.status === 'signed' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {contract.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Eye className="w-4 h-4 text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Send className="w-4 h-4 text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Download className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}