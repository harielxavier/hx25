import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { 
  Users, 
  Calendar, 
  Settings, 
  RefreshCw, 
  Link as LinkIcon,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface StudioNinjaConfig {
  apiKey: string;
  connected: boolean;
  lastSync: Date | null;
  autoSync: boolean;
  syncInterval: number; // in minutes
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: 'active' | 'lead' | 'past';
  bookings: number;
  lastBooking: Date | null;
  totalSpent: number;
}

interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  date: Date;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  type: string;
  location: string;
  amount: number;
  paid: number;
  balance: number;
}

const StudioNinjaIntegration: React.FC = () => {
  const [config, setConfig] = useState<StudioNinjaConfig>({
    apiKey: '',
    connected: false,
    lastSync: null,
    autoSync: true,
    syncInterval: 60
  });
  
  const [clients, setClients] = useState<Client[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Load configuration and data
  useEffect(() => {
    // Mock data for demonstration
    const mockClients: Client[] = [
      {
        id: 'c1',
        name: 'John & Sarah Smith',
        email: 'john.smith@example.com',
        phone: '555-123-4567',
        source: 'Website Contact Form',
        status: 'active',
        bookings: 2,
        lastBooking: new Date('2025-02-15'),
        totalSpent: 3500
      },
      {
        id: 'c2',
        name: 'Emily Johnson',
        email: 'emily@example.com',
        phone: '555-987-6543',
        source: 'Instagram',
        status: 'lead',
        bookings: 0,
        lastBooking: null,
        totalSpent: 0
      },
      {
        id: 'c3',
        name: 'Michael & Jessica Brown',
        email: 'michael@example.com',
        phone: '555-456-7890',
        source: 'Referral',
        status: 'active',
        bookings: 1,
        lastBooking: new Date('2025-03-10'),
        totalSpent: 2800
      }
    ];
    
    const mockBookings: Booking[] = [
      {
        id: 'b1',
        clientId: 'c1',
        clientName: 'John & Sarah Smith',
        date: new Date('2025-04-15T14:00:00'),
        status: 'confirmed',
        type: 'Wedding Photography',
        location: 'Grand Plaza Hotel',
        amount: 2500,
        paid: 1250,
        balance: 1250
      },
      {
        id: 'b2',
        clientId: 'c3',
        clientName: 'Michael & Jessica Brown',
        date: new Date('2025-05-20T10:00:00'),
        status: 'pending',
        type: 'Engagement Session',
        location: 'Riverside Park',
        amount: 500,
        paid: 250,
        balance: 250
      },
      {
        id: 'b3',
        clientId: 'c1',
        clientName: 'John & Sarah Smith',
        date: new Date('2025-02-15T15:30:00'),
        status: 'completed',
        type: 'Engagement Session',
        location: 'Downtown',
        amount: 500,
        paid: 500,
        balance: 0
      }
    ];
    
    setClients(mockClients);
    setBookings(mockBookings);
  }, []);
  
  const handleConnect = () => {
    setConnecting(true);
    setError(null);
    
    // Simulate API connection
    setTimeout(() => {
      if (config.apiKey.trim() === '') {
        setError('API Key is required');
        setConnecting(false);
        return;
      }
      
      setConfig({
        ...config,
        connected: true,
        lastSync: new Date()
      });
      setConnecting(false);
      setSuccess('Successfully connected to Studio Ninja!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    }, 1500);
  };
  
  const handleSync = () => {
    setLoading(true);
    setError(null);
    
    // Simulate sync
    setTimeout(() => {
      setConfig({
        ...config,
        lastSync: new Date()
      });
      setLoading(false);
      setSuccess('Successfully synced with Studio Ninja!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    }, 2000);
  };
  
  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Studio Ninja Integration</h1>
          <div className="flex items-center gap-4">
            {config.connected && (
              <>
                <div className="text-sm text-gray-500">
                  Last synced: {config.lastSync ? formatDateTime(config.lastSync) : 'Never'}
                </div>
                <button 
                  onClick={handleSync}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Syncing...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5" />
                      <span>Sync Now</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${config.connected ? 'bg-green-100' : 'bg-gray-100'}`}>
                <LinkIcon className={`w-6 h-6 ${config.connected ? 'text-green-600' : 'text-gray-500'}`} />
              </div>
              <div>
                <h2 className="text-lg font-medium">Studio Ninja Connection</h2>
                <p className="text-gray-500">
                  {config.connected 
                    ? 'Your account is connected to Studio Ninja' 
                    : 'Connect your Studio Ninja account to sync clients and bookings'}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              {config.connected ? (
                <span className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  Connected
                </span>
              ) : (
                <span className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full">
                  <XCircle className="w-4 h-4" />
                  Not Connected
                </span>
              )}
            </div>
          </div>
          
          {!config.connected && (
            <div className="mt-6">
              <div className="mb-4">
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                  Studio Ninja API Key
                </label>
                <input
                  type="text"
                  id="apiKey"
                  value={config.apiKey}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                  placeholder="Enter your Studio Ninja API key"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  You can find your API key in your Studio Ninja account settings
                </p>
              </div>
              <button 
                onClick={handleConnect}
                disabled={connecting}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {connecting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-5 h-5" />
                    <span>Connect to Studio Ninja</span>
                  </>
                )}
              </button>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
              {success}
            </div>
          )}
        </div>
        
        {config.connected && (
          <Tabs defaultValue="bookings" className="mb-6">
            <TabsList className="bg-white shadow rounded-lg p-1 mb-6">
              <TabsTrigger value="bookings" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                <Calendar className="w-4 h-4 mr-2" />
                Bookings
              </TabsTrigger>
              <TabsTrigger value="clients" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                <Users className="w-4 h-4 mr-2" />
                Clients
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="bookings" className="mt-0">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium">Upcoming Bookings</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map(booking => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{booking.clientName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDateTime(booking.date)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{booking.type}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{booking.location}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatCurrency(booking.amount)}</div>
                            <div className="text-xs text-gray-500">
                              Paid: {formatCurrency(booking.paid)} / Balance: {formatCurrency(booking.balance)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="clients" className="mt-0">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium">Clients</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Source
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bookings
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Spent
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {clients.map(client => (
                        <tr key={client.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{client.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{client.email}</div>
                            <div className="text-sm text-gray-500">{client.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{client.source}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              client.status === 'active' ? 'bg-green-100 text-green-800' :
                              client.status === 'lead' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{client.bookings}</div>
                            <div className="text-xs text-gray-500">
                              Last: {formatDate(client.lastBooking)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatCurrency(client.totalSpent)}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium mb-4">Sync Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Auto Sync</h4>
                      <p className="text-xs text-gray-500">Automatically sync data with Studio Ninja</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={config.autoSync} 
                        onChange={() => setConfig({ ...config, autoSync: !config.autoSync })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  {config.autoSync && (
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Sync Interval</h4>
                        <p className="text-xs text-gray-500">How often to sync with Studio Ninja</p>
                      </div>
                      <select
                        value={config.syncInterval}
                        onChange={(e) => setConfig({ ...config, syncInterval: parseInt(e.target.value) })}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={15}>Every 15 minutes</option>
                        <option value={30}>Every 30 minutes</option>
                        <option value={60}>Every hour</option>
                        <option value={360}>Every 6 hours</option>
                        <option value={720}>Every 12 hours</option>
                        <option value={1440}>Once a day</option>
                      </select>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-gray-200">
                    <button 
                      onClick={() => {
                        setConfig({
                          ...config,
                          connected: false,
                          apiKey: '',
                          lastSync: null
                        });
                      }}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                    >
                      Disconnect from Studio Ninja
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AdminLayout>
  );
};

export default StudioNinjaIntegration;
