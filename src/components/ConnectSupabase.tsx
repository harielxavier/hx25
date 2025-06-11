import React from 'react';
import { Database } from 'lucide-react';

export default function ConnectSupabase() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg text-center">
        <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Database Connection Required</h1>
        <p className="text-gray-600 mb-6">
          Please click the "Connect to Supabase" button in the top right corner to set up your database connection.
        </p>
      </div>
    </div>
  );
}