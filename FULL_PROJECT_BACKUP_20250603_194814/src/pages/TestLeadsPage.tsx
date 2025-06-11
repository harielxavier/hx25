import { useState } from 'react';
import { createTestLeads } from '../services/leadService';
import { Loader, Check, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TestLeadsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateTestLeads = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await createTestLeads();
      if (result) {
        setSuccess(true);
      } else {
        setError('Failed to create test leads. Check console for details.');
      }
    } catch (err) {
      console.error('Error creating test leads:', err);
      setError('An error occurred while creating test leads.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-serif mb-6">Test Leads Generator</h1>
          <p className="text-gray-600 mb-8">
            This page allows you to create sample test leads in your CRM system. 
            Click the button below to add three test leads (Test A, Test B, and Test C) 
            to your database.
          </p>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6 flex items-start">
              <Check className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Success!</p>
                <p>Test leads have been created successfully. You can now check your CRM to see them.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6 flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={handleCreateTestLeads}
              disabled={loading}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors disabled:bg-gray-400 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Creating Test Leads...
                </>
              ) : (
                'Create Test Leads'
              )}
            </button>
            
            <Link
              to="/"
              className="border border-black px-6 py-3 rounded-lg hover:bg-black hover:text-white transition-colors text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
