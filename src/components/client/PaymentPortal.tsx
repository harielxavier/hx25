import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Check, 
  AlertCircle, 
  Clock,
  Download,
  Receipt,
  Shield,
  Banknote,
  Wallet
} from 'lucide-react';
import { Job } from '../../services/jobsService';

interface PaymentPortalProps {
  clientId: string;
  job: Job;
}

interface PaymentSchedule {
  id: string;
  description: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue' | 'processing';
  paidDate?: Date;
  paymentMethod?: string;
  transactionId?: string;
  invoiceUrl?: string;
  receiptUrl?: string;
}

interface PaymentPlan {
  id: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  schedule: PaymentSchedule[];
  autoPayEnabled: boolean;
  nextPaymentDate?: Date;
}

const PaymentPortal: React.FC<PaymentPortalProps> = ({ clientId, job }) => {
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentSchedule | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'paypal'>('card');

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockPaymentPlan: PaymentPlan = {
      id: '1',
      totalAmount: 4500,
      paidAmount: 1500,
      remainingAmount: 3000,
      autoPayEnabled: false,
      nextPaymentDate: new Date('2024-03-01'),
      schedule: [
        {
          id: '1',
          description: 'Booking Deposit',
          amount: 1500,
          dueDate: new Date('2024-01-15'),
          status: 'paid',
          paidDate: new Date('2024-01-10'),
          paymentMethod: 'Credit Card',
          transactionId: 'TXN_001',
          invoiceUrl: '/invoices/001.pdf',
          receiptUrl: '/receipts/001.pdf'
        },
        {
          id: '2',
          description: 'Second Payment (50%)',
          amount: 2250,
          dueDate: new Date('2024-03-01'),
          status: 'pending',
          invoiceUrl: '/invoices/002.pdf'
        },
        {
          id: '3',
          description: 'Final Payment',
          amount: 750,
          dueDate: new Date('2024-04-15'),
          status: 'pending',
          invoiceUrl: '/invoices/003.pdf'
        }
      ]
    };

    setTimeout(() => {
      setPaymentPlan(mockPaymentPlan);
      setLoading(false);
    }, 1000);
  }, [clientId, job]);

  const getStatusColor = (status: PaymentSchedule['status']) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'overdue':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'processing':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: PaymentSchedule['status']) => {
    switch (status) {
      case 'paid':
        return <Check className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />;
      case 'processing':
        return <Clock className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const processPayment = async (paymentId: string) => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      if (paymentPlan) {
        const updatedSchedule = paymentPlan.schedule.map(payment => 
          payment.id === paymentId 
            ? { 
                ...payment, 
                status: 'paid' as const, 
                paidDate: new Date(),
                paymentMethod: paymentMethod === 'card' ? 'Credit Card' : 
                             paymentMethod === 'bank' ? 'Bank Transfer' : 'PayPal',
                transactionId: `TXN_${Date.now()}`,
                receiptUrl: `/receipts/${paymentId}.pdf`
              }
            : payment
        );
        
        const newPaidAmount = updatedSchedule
          .filter(p => p.status === 'paid')
          .reduce((sum, p) => sum + p.amount, 0);
        
        setPaymentPlan({
          ...paymentPlan,
          schedule: updatedSchedule,
          paidAmount: newPaidAmount,
          remainingAmount: paymentPlan.totalAmount - newPaidAmount
        });
      }
      
      setShowPaymentForm(false);
      setSelectedPayment(null);
      setProcessing(false);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!paymentPlan) {
    return (
      <div className="text-center py-12">
        <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-800 mb-2">No Payment Plan Found</h3>
        <p className="text-gray-600">Contact us to set up your payment schedule.</p>
      </div>
    );
  }

  const progressPercentage = (paymentPlan.paidAmount / paymentPlan.totalAmount) * 100;

  return (
    <div className="space-y-6">
      {/* Payment Overview */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Payment Overview</h2>
            <p className="text-gray-600">Track your photography service payments</p>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Secure Payment Processing</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Paid</h3>
                <p className="text-2xl font-bold text-green-600">${paymentPlan.paidAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Remaining</h3>
                <p className="text-2xl font-bold text-blue-600">${paymentPlan.remainingAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Total</h3>
                <p className="text-2xl font-bold text-gray-800">${paymentPlan.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Payment Progress</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Payment Schedule */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Payment Schedule</h3>
        
        <div className="space-y-4">
          {paymentPlan.schedule.map((payment, index) => (
            <motion.div
              key={payment.id}
              className={`border rounded-xl p-6 transition-all duration-200 hover:shadow-md ${getStatusColor(payment.status)}`}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      <span className="capitalize">{payment.status}</span>
                    </div>
                    
                    <span className="text-sm text-gray-500">Payment {index + 1} of {paymentPlan.schedule.length}</span>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{payment.description}</h4>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Amount:</span>
                      <p className="font-semibold text-lg">${payment.amount.toLocaleString()}</p>
                    </div>
                    
                    <div>
                      <span className="text-gray-500">Due Date:</span>
                      <p className="font-medium">{payment.dueDate.toLocaleDateString()}</p>
                    </div>
                    
                    {payment.paidDate && (
                      <div>
                        <span className="text-gray-500">Paid Date:</span>
                        <p className="font-medium text-green-600">{payment.paidDate.toLocaleDateString()}</p>
                      </div>
                    )}
                    
                    {payment.paymentMethod && (
                      <div>
                        <span className="text-gray-500">Method:</span>
                        <p className="font-medium">{payment.paymentMethod}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-6">
                  {payment.invoiceUrl && (
                    <a
                      href={payment.invoiceUrl}
                      download
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <Receipt className="w-4 h-4" />
                      <span>Invoice</span>
                    </a>
                  )}
                  
                  {payment.receiptUrl && (
                    <a
                      href={payment.receiptUrl}
                      download
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Receipt</span>
                    </a>
                  )}
                  
                  {payment.status === 'pending' && (
                    <button
                      onClick={() => {
                        setSelectedPayment(payment);
                        setShowPaymentForm(true);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pay Now</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Payment Form Modal */}
      {showPaymentForm && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Make Payment</h3>
                  <p className="text-gray-600">{selectedPayment.description}</p>
                </div>
                
                <button
                  onClick={() => {
                    setShowPaymentForm(false);
                    setSelectedPayment(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Amount Due:</span>
                    <span className="text-2xl font-bold text-gray-800">${selectedPayment.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`flex flex-col items-center p-3 border rounded-lg transition-colors ${
                      paymentMethod === 'card' ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 mb-2" />
                    <span className="text-sm">Card</span>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod('bank')}
                    className={`flex flex-col items-center p-3 border rounded-lg transition-colors ${
                      paymentMethod === 'bank' ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Banknote className="w-6 h-6 mb-2" />
                    <span className="text-sm">Bank</span>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod('paypal')}
                    className={`flex flex-col items-center p-3 border rounded-lg transition-colors ${
                      paymentMethod === 'paypal' ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Wallet className="w-6 h-6 mb-2" />
                    <span className="text-sm">PayPal</span>
                  </button>
                </div>
              </div>
              
              {paymentMethod === 'card' && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowPaymentForm(false);
                    setSelectedPayment(null);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  onClick={() => processPayment(selectedPayment.id)}
                  disabled={processing}
                  className="flex-1 flex items-center justify-center space-x-2 bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Pay ${selectedPayment.amount.toLocaleString()}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPortal;
