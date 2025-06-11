import React, { useState } from 'react';
import { DollarSign, Plus, Search, Filter, Download, CreditCard, Check, Clock, AlertTriangle, FileText, Edit, Trash2, Eye, MoreHorizontal, ArrowUpRight } from 'lucide-react';

const InvoicingPayments: React.FC = () => {
  // Mock data for invoices
  const initialInvoices = [
    {
      id: 'INV-2025-001',
      client: 'Johnson Family',
      service: 'Family Portrait Session',
      amount: 450,
      date: '2025-03-15',
      dueDate: '2025-03-30',
      status: 'Paid',
      paymentDate: '2025-03-20',
      paymentMethod: 'Credit Card'
    },
    {
      id: 'INV-2025-002',
      client: 'Emily & Michael',
      service: 'Engagement Session',
      amount: 350,
      date: '2025-03-18',
      dueDate: '2025-04-01',
      status: 'Pending',
      paymentDate: null,
      paymentMethod: null
    },
    {
      id: 'INV-2025-003',
      client: 'Smith Wedding',
      service: 'Wedding Photography Package',
      amount: 3500,
      date: '2025-03-20',
      dueDate: '2025-04-03',
      status: 'Partial',
      paymentDate: '2025-03-22',
      paymentMethod: 'Bank Transfer',
      amountPaid: 1750
    },
    {
      id: 'INV-2025-004',
      client: 'ABC Corporation',
      service: 'Corporate Event Photography',
      amount: 1200,
      date: '2025-03-10',
      dueDate: '2025-03-25',
      status: 'Overdue',
      paymentDate: null,
      paymentMethod: null
    },
    {
      id: 'INV-2025-005',
      client: 'Davis Family',
      service: 'Newborn Session',
      amount: 550,
      date: '2025-03-05',
      dueDate: '2025-03-20',
      status: 'Paid',
      paymentDate: '2025-03-12',
      paymentMethod: 'Venmo'
    },
    {
      id: 'INV-2025-006',
      client: 'Wilson Family',
      service: 'Family Portrait Session',
      amount: 450,
      date: '2025-02-28',
      dueDate: '2025-03-14',
      status: 'Paid',
      paymentDate: '2025-03-10',
      paymentMethod: 'Credit Card'
    },
    {
      id: 'INV-2025-007',
      client: 'Martinez Quinceañera',
      service: 'Event Photography',
      amount: 1500,
      date: '2025-03-25',
      dueDate: '2025-04-08',
      status: 'Draft',
      paymentDate: null,
      paymentMethod: null
    }
  ];

  // State
  const [invoices] = useState(initialInvoices);
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments'>('invoices');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');

  // Calculate totals
  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const totalPaid = invoices
    .filter(invoice => invoice.status === 'Paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0) +
    invoices
    .filter(invoice => invoice.status === 'Partial')
    .reduce((sum, invoice) => sum + (invoice.amountPaid || 0), 0);
  const totalPending = invoices
    .filter(invoice => invoice.status === 'Pending' || invoice.status === 'Overdue')
    .reduce((sum, invoice) => sum + invoice.amount, 0) +
    invoices
    .filter(invoice => invoice.status === 'Partial')
    .reduce((sum, invoice) => sum + (invoice.amount - (invoice.amountPaid || 0)), 0);
  const totalOverdue = invoices
    .filter(invoice => invoice.status === 'Overdue')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const searchMatch = 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = statusFilter === 'All' || invoice.status === statusFilter;
    
    let dateMatch = true;
    const today = new Date();
    const invoiceDate = new Date(invoice.date);
    
    if (dateFilter === 'ThisMonth') {
      dateMatch = 
        invoiceDate.getMonth() === today.getMonth() && 
        invoiceDate.getFullYear() === today.getFullYear();
    } else if (dateFilter === 'LastMonth') {
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      dateMatch = 
        invoiceDate.getMonth() === lastMonth.getMonth() && 
        invoiceDate.getFullYear() === lastMonth.getFullYear();
    } else if (dateFilter === 'ThisYear') {
      dateMatch = invoiceDate.getFullYear() === today.getFullYear();
    }
    
    return searchMatch && statusMatch && dateMatch;
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center"><Check className="w-3 h-3 mr-1" /> Paid</span>;
      case 'Pending':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center"><Clock className="w-3 h-3 mr-1" /> Pending</span>;
      case 'Partial':
        return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs flex items-center"><CreditCard className="w-3 h-3 mr-1" /> Partial</span>;
      case 'Overdue':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs flex items-center"><AlertTriangle className="w-3 h-3 mr-1" /> Overdue</span>;
      case 'Draft':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs flex items-center"><FileText className="w-3 h-3 mr-1" /> Draft</span>;
      default:
        return null;
    }
  };

  // Render invoices tab
  const renderInvoicesTab = () => {
    return (
      <div className="overflow-hidden rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice #
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map(invoice => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{invoice.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{invoice.client}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{invoice.service}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(invoice.amount)}</div>
                    {invoice.status === 'Partial' && (
                      <div className="text-xs text-gray-500">
                        Paid: {formatCurrency(invoice.amountPaid || 0)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(invoice.date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(invoice.dueDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(invoice.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-gray-500 hover:text-blue-600" title="View">
                        <Eye className="h-5 w-5" />
                      </button>
                      <button className="text-gray-500 hover:text-blue-600" title="Edit">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button className="text-gray-500 hover:text-blue-600" title="Send">
                        <ArrowUpRight className="h-5 w-5" />
                      </button>
                      <button className="text-gray-500 hover:text-red-600" title="Delete">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                  No invoices found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // Render payments tab
  const renderPaymentsTab = () => {
    // Filter only paid or partially paid invoices
    const payments = invoices
      .filter(invoice => invoice.status === 'Paid' || invoice.status === 'Partial')
      .map(invoice => ({
        id: `PAY-${invoice.id.split('-')[2]}`,
        invoiceId: invoice.id,
        client: invoice.client,
        amount: invoice.status === 'Partial' ? (invoice.amountPaid || 0) : invoice.amount,
        date: invoice.paymentDate || '',
        method: invoice.paymentMethod || '',
        status: 'Completed'
      }));
    
    return (
      <div className="overflow-hidden rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice #
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.length > 0 ? (
              payments.map(payment => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{payment.invoiceId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.client}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(payment.date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{payment.method}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center">
                      <Check className="w-3 h-3 mr-1" /> Completed
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-gray-500 hover:text-blue-600" title="View">
                        <Eye className="h-5 w-5" />
                      </button>
                      <button className="text-gray-500 hover:text-blue-600" title="More">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Invoicing & Payments</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Create Invoice
        </button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalAmount)}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Paid</p>
              <h3 className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(totalPaid)}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Check className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <h3 className="text-2xl font-bold text-blue-600 mt-1">{formatCurrency(totalPending)}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Overdue</p>
              <h3 className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(totalOverdue)}</h3>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search invoices..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
              <option value="Overdue">Overdue</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
          
          <div className="w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="All">All Time</option>
              <option value="ThisMonth">This Month</option>
              <option value="LastMonth">Last Month</option>
              <option value="ThisYear">This Year</option>
            </select>
          </div>
          
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'invoices'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('invoices')}
            >
              Invoices
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'payments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('payments')}
            >
              Payments
            </button>
          </nav>
        </div>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'invoices' ? renderInvoicesTab() : renderPaymentsTab()}
      
      {/* Export Options */}
      <div className="mt-6 flex justify-end">
        <button className="flex items-center text-gray-600 hover:text-gray-900 text-sm">
          <Download className="h-4 w-4 mr-1" />
          Export {activeTab === 'invoices' ? 'Invoices' : 'Payments'}
        </button>
      </div>
    </div>
  );
};

export default InvoicingPayments;
