import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import AdminLayout from '../../components/admin/AdminLayout';
import importAllData from '../../scripts/importAllData';
import importWeddingDates from '../../scripts/importWeddingDates';
import importClientData from '../../scripts/importClientData';

const DataImportPage: React.FC = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch clients on component mount
  useEffect(() => {
    fetchClients();
  }, []);

  // Function to handle full import
  const handleFullImport = async () => {
    try {
      setIsImporting(true);
      setError(null);
      
      const result = await importAllData();
      setImportResult(result);
      
      // Fetch updated clients
      await fetchClients();
    } catch (error: any) {
      console.error('Error during import:', error);
      setError(error.message || 'An unknown error occurred during import');
    } finally {
      setIsImporting(false);
    }
  };

  // Function to handle wedding dates import only
  const handleWeddingDatesImport = async () => {
    try {
      setIsImporting(true);
      setError(null);
      
      const result = await importWeddingDates();
      setImportResult({ weddingDates: result, message: result.message });
    } catch (error: any) {
      console.error('Error during wedding dates import:', error);
      setError(error.message || 'An unknown error occurred during wedding dates import');
    } finally {
      setIsImporting(false);
    }
  };

  // Function to handle client data import only
  const handleClientDataImport = async () => {
    try {
      setIsImporting(true);
      setError(null);
      
      const result = await importClientData();
      setImportResult({ clientData: result, message: result.message });
      
      // Fetch updated clients
      await fetchClients();
    } catch (error: any) {
      console.error('Error during client data import:', error);
      setError(error.message || 'An unknown error occurred during client data import');
    } finally {
      setIsImporting(false);
    }
  };

  // Function to fetch clients from Firestore
  const fetchClients = async () => {
    try {
      const clientsQuery = query(collection(db, 'clients'), orderBy('weddingDate', 'desc'));
      const snapshot = await getDocs(clientsQuery);
      
      const clientList: any[] = [];
      snapshot.forEach(doc => {
        clientList.push({
          id: doc.id,
          ...doc.data(),
          weddingDate: doc.data().weddingDate?.toDate() // Convert Firestore timestamp to Date
        });
      });
      
      setClients(clientList);
    } catch (error: any) {
      console.error('Error fetching clients:', error);
      setError(error.message || 'An unknown error occurred while fetching clients');
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Data Import</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Import Options</h2>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={handleFullImport}
              disabled={isImporting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
            >
              {isImporting ? 'Importing...' : 'Import All Data'}
            </button>
            
            <button
              onClick={handleWeddingDatesImport}
              disabled={isImporting}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
            >
              {isImporting ? 'Importing...' : 'Import Wedding Dates Only'}
            </button>
            
            <button
              onClick={handleClientDataImport}
              disabled={isImporting}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
            >
              {isImporting ? 'Importing...' : 'Import Client Data Only'}
            </button>
            
            <button
              onClick={fetchClients}
              disabled={isImporting}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
            >
              Refresh Client List
            </button>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}
          
          {importResult && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              <p className="font-medium">Import Result</p>
              <p>{importResult.message}</p>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Imported Clients</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Wedding Date</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Package</th>
                  <th className="py-2 px-4 text-left">Documents</th>
                </tr>
              </thead>
              <tbody>
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 px-4 text-center text-gray-500">
                      No clients found. Import client data to see results here.
                    </td>
                  </tr>
                ) : (
                  clients.map(client => (
                    <tr key={client.id} className="border-t hover:bg-gray-50">
                      <td className="py-2 px-4">{client.name}</td>
                      <td className="py-2 px-4">{formatDate(client.weddingDate)}</td>
                      <td className="py-2 px-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          client.status === 'Booked' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {client.status}
                        </span>
                      </td>
                      <td className="py-2 px-4">{client.packageName || 'N/A'}</td>
                      <td className="py-2 px-4">
                        {client.hasContract && (
                          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-1">
                            Contract
                          </span>
                        )}
                        {client.hasQuote && (
                          <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs mr-1">
                            Quote
                          </span>
                        )}
                        {client.hasQuestionnaire && (
                          <span className="inline-block bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs">
                            Questionnaire
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DataImportPage;
