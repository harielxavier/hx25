import React, { useState } from 'react';

import { CreditCard, DollarSign } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  description: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: Error) => void;
}

export default function PaymentForm({ amount, description, onSuccess, onError }: PaymentFormProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, description })
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Payment failed: ${msg}`);
      }

      const data = await res.json();
      onSuccess(data.paymentIntentId || data.id);
    } catch (error) {
      onError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-3 mb-6">
        <CreditCard className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Process Payment</h2>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-600">Amount</p>
            <p className="text-2xl font-semibold text-gray-900">
              ${(amount / 100).toFixed(2)}
            </p>
          </div>
          <DollarSign className="w-8 h-8 text-green-500" />
        </div>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {loading ? (
          <>Processing...</>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Process Payment
          </>
        )}
      </button>
    </div>
  );
}