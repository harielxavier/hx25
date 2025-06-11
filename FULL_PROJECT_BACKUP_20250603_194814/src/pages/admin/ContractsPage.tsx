import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function ContractsPage() {
  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light mb-1">Contracts</h1>
            <p className="text-gray-500">Manage client contracts and agreements</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Create Contract
          </button>
        </div>
        
        {/* Contract content will go here */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-500">Contract management coming soon...</p>
        </div>
      </div>
  );
}