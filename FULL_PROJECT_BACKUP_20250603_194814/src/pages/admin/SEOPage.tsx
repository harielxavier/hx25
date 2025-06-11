import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function SEOPage() {
  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light mb-1">SEO Management</h1>
            <p className="text-gray-500">Monitor and optimize your search engine performance</p>
          </div>
        </div>
        
        {/* SEO content will go here */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-500">SEO management coming soon...</p>
        </div>
      </div>
  );
}