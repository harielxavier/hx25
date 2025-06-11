import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Upload, X } from 'lucide-react';
import { format } from 'date-fns';
import { Payment } from '../../lib/types/payment';
import { getPayments, importPaymentsFromCSV } from '../../lib/api/payments';

export default function PaymentList() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getPayments();
        setPayments(data);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportSuccess(false);
    setImportError(null);

    try {
      await importPaymentsFromCSV(file);
      setPayments(await getPayments()); // Refresh the payment list
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (error) {
      console.error('Failed to import payments:', error);
      setImportError(error instanceof Error ? error.message : 'Failed to import payments');
    } finally {
      setImporting(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {/* Import Success/Error Messages */}
      {importSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md flex items-center justify-between">
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Payments imported successfully!
          </span>
          <button onClick={() => setImportSuccess(false)} className="text-green-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {importError && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md flex items-center justify-between">
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {importError}
          </span>
          <button onClick={() => setImportError(null)} className="text-red-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Payment Status</h3>
        <div className="flex space-x-2">
          {/* Hidden file input */}
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          
          {/* Import CSV button */}
          <button 
            onClick={handleImportClick}
            disabled={importing}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {importing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Import CSV
              </>
            )}
          </button>
          
          <button className="text-sm text-blue-600 hover:text-blue-800 px-3 py-1.5">
            View All
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No payment records found</p>
            <p className="text-sm mt-2">Import payments or create a new invoice to get started</p>
          </div>
        ) : (
          payments.map((payment, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-medium text-gray-900">{payment.client.name}</p>
                <p className="text-sm text-gray-500">{payment.job.name}</p>
                <p className="text-xs text-gray-400">Due: {format(new Date(payment.dueDate), 'dd MMM yyyy')}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">${payment.amount.total.toFixed(2)}</p>
                <span className={`inline-flex items-center gap-1 text-sm ${
                  payment.status === 'overdue' 
                    ? 'text-red-600'
                    : payment.status === 'paid'
                    ? 'text-green-600'
                    : 'text-yellow-600'
                }`}>
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}