import React from 'react';
import { DollarSign, AlertCircle, CheckCircle } from 'lucide-react';

interface Payment {
  client: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'overdue' | 'completed';
}

export default function PaymentTracker() {
  const [payments] = React.useState<Payment[]>([
    {
      client: 'Sarah & John',
      amount: 2500,
      dueDate: '2024-03-20',
      status: 'pending'
    },
    {
      client: 'Emma Davis',
      amount: 1500,
      dueDate: '2024-03-15',
      status: 'overdue'
    }
  ]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Payment Status</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {payments.map((payment, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">{payment.client}</p>
              <p className="text-sm text-gray-500">Due: {payment.dueDate}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">${payment.amount}</p>
              <span className={`inline-flex items-center gap-1 text-sm ${
                payment.status === 'overdue' 
                  ? 'text-red-600'
                  : payment.status === 'pending'
                  ? 'text-yellow-600'
                  : 'text-green-600'
              }`}>
                {payment.status === 'overdue' && <AlertCircle className="w-4 h-4" />}
                {payment.status === 'completed' && <CheckCircle className="w-4 h-4" />}
                {payment.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center justify-between text-xl">
          <span className="font-medium">Total Outstanding</span>
          <span className="font-medium">$4,000</span>
        </div>
      </div>
    </div>
  );
}