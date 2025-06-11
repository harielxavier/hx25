import React, { useState } from 'react';
import { 
  Save, 
  Building, 
  DollarSign, 
  Calendar, 
  Clock, 
  Users,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const BusinessSettings: React.FC = () => {
  // State for business settings
  const [settings, setSettings] = useState({
    businessName: 'Hariel Xavier Photography',
    businessType: 'sole_proprietorship',
    taxId: '12-3456789',
    currency: 'USD',
    workingHours: {
      monday: { start: '09:00', end: '17:00', closed: false },
      tuesday: { start: '09:00', end: '17:00', closed: false },
      wednesday: { start: '09:00', end: '17:00', closed: false },
      thursday: { start: '09:00', end: '17:00', closed: false },
      friday: { start: '09:00', end: '17:00', closed: false },
      saturday: { start: '10:00', end: '15:00', closed: false },
      sunday: { start: '00:00', end: '00:00', closed: true },
    },
    bookingSettings: {
      minNotice: 48,
      maxAdvance: 90,
      sessionDuration: 60,
      bufferTime: 30,
      autoConfirm: false
    },
    paymentSettings: {
      acceptedMethods: ['credit_card', 'bank_transfer', 'paypal'],
      depositRequired: true,
      depositPercentage: 25,
      cancellationPolicy: 'Full refund if cancelled 7 days before the session. 50% refund if cancelled between 3-7 days. No refund if cancelled less than 3 days before the session.'
    },
    staffMembers: [
      { id: '1', name: 'Hariel Xavier', role: 'Lead Photographer', email: 'hariel@example.com' },
      { id: '2', name: 'Jane Smith', role: 'Assistant Photographer', email: 'jane@example.com' }
    ]
  });

  // State for saving status
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState('general');

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSettings({
        ...settings,
        [parent]: {
          ...settings[parent as keyof typeof settings],
          [child]: value
        }
      });
    } else {
      setSettings({
        ...settings,
        [name]: value
      });
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSettings({
        ...settings,
        [parent]: {
          ...settings[parent as keyof typeof settings],
          [child]: checked
        }
      });
    } else {
      setSettings({
        ...settings,
        [name]: checked
      });
    }
  };

  // Handle working hours change
  const handleWorkingHoursChange = (day: string, field: string, value: string | boolean) => {
    setSettings({
      ...settings,
      workingHours: {
        ...settings.workingHours,
        [day]: {
          ...settings.workingHours[day as keyof typeof settings.workingHours],
          [field]: value
        }
      }
    });
  };

  // Handle payment methods change
  const handlePaymentMethodChange = (method: string, checked: boolean) => {
    const currentMethods = [...settings.paymentSettings.acceptedMethods];
    
    if (checked && !currentMethods.includes(method)) {
      currentMethods.push(method);
    } else if (!checked && currentMethods.includes(method)) {
      const index = currentMethods.indexOf(method);
      currentMethods.splice(index, 1);
    }
    
    setSettings({
      ...settings,
      paymentSettings: {
        ...settings.paymentSettings,
        acceptedMethods: currentMethods
      }
    });
  };

  // Handle staff member change
  const handleStaffChange = (id: string, field: string, value: string) => {
    const updatedStaff = settings.staffMembers.map(member => {
      if (member.id === id) {
        return { ...member, [field]: value };
      }
      return member;
    });
    
    setSettings({
      ...settings,
      staffMembers: updatedStaff
    });
  };

  // Add new staff member
  const addStaffMember = () => {
    const newId = (Math.max(...settings.staffMembers.map(m => parseInt(m.id))) + 1).toString();
    
    setSettings({
      ...settings,
      staffMembers: [
        ...settings.staffMembers,
        { id: newId, name: '', role: '', email: '' }
      ]
    });
  };

  // Remove staff member
  const removeStaffMember = (id: string) => {
    setSettings({
      ...settings,
      staffMembers: settings.staffMembers.filter(member => member.id !== id)
    });
  };

  // Save settings
  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success
      setSaveMessage({
        type: 'success',
        text: 'Business settings saved successfully!'
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (error) {
      setSaveMessage({
        type: 'error',
        text: 'Failed to save settings. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Business Settings</h1>
        <p className="text-gray-600">Manage your business information and operational settings</p>
      </div>
      
      {saveMessage && (
        <div className={`mb-4 p-4 rounded-md ${saveMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {saveMessage.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{saveMessage.text}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'general' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'hours' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('hours')}
          >
            Working Hours
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'booking' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('booking')}
          >
            Booking
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'payment' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('payment')}
          >
            Payment
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'staff' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('staff')}
          >
            Staff
          </button>
        </div>
        
        <div className="p-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <div className="flex items-center">
                  <Building className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={settings.businessName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Type
                </label>
                <select
                  id="businessType"
                  name="businessType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={settings.businessType}
                  onChange={handleChange}
                >
                  <option value="sole_proprietorship">Sole Proprietorship</option>
                  <option value="llc">Limited Liability Company (LLC)</option>
                  <option value="corporation">Corporation</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="taxId" className="block text-sm font-medium text-gray-700 mb-1">
                  Tax ID / EIN
                </label>
                <input
                  type="text"
                  id="taxId"
                  name="taxId"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={settings.taxId}
                  onChange={handleChange}
                />
                <p className="mt-1 text-sm text-gray-500">
                  For tax reporting purposes
                </p>
              </div>
              
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                  <select
                    id="currency"
                    name="currency"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={settings.currency}
                    onChange={handleChange}
                  >
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                    <option value="CAD">Canadian Dollar (C$)</option>
                    <option value="AUD">Australian Dollar (A$)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {/* Working Hours Tab */}
          {activeTab === 'hours' && (
            <div className="space-y-6">
              <p className="text-sm text-gray-500 mb-4">
                Set your regular business hours. These will be displayed on your website and used for booking availability.
              </p>
              
              {Object.entries(settings.workingHours).map(([day, hours]) => (
                <div key={day} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center py-3 border-b border-gray-200">
                  <div className="font-medium capitalize">{day}</div>
                  
                  <div className="md:col-span-4 flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        checked={hours.closed}
                        onChange={(e) => handleWorkingHoursChange(day, 'closed', e.target.checked)}
                      />
                      <span className="ml-2 text-sm text-gray-700">Closed</span>
                    </label>
                    
                    {!hours.closed && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <input
                          type="time"
                          className="px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={hours.start}
                          onChange={(e) => handleWorkingHoursChange(day, 'start', e.target.value)}
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="time"
                          className="px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={hours.end}
                          onChange={(e) => handleWorkingHoursChange(day, 'end', e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Booking Tab */}
          {activeTab === 'booking' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="minNotice" className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Booking Notice (hours)
                </label>
                <input
                  type="number"
                  id="minNotice"
                  name="bookingSettings.minNotice"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={settings.bookingSettings.minNotice}
                  onChange={handleChange}
                  min="0"
                />
                <p className="mt-1 text-sm text-gray-500">
                  How many hours in advance clients must book a session
                </p>
              </div>
              
              <div>
                <label htmlFor="maxAdvance" className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Advance Booking (days)
                </label>
                <input
                  type="number"
                  id="maxAdvance"
                  name="bookingSettings.maxAdvance"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={settings.bookingSettings.maxAdvance}
                  onChange={handleChange}
                  min="1"
                />
                <p className="mt-1 text-sm text-gray-500">
                  How many days in advance clients can book a session
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="sessionDuration" className="block text-sm font-medium text-gray-700 mb-1">
                    Default Session Duration (minutes)
                  </label>
                  <input
                    type="number"
                    id="sessionDuration"
                    name="bookingSettings.sessionDuration"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={settings.bookingSettings.sessionDuration}
                    onChange={handleChange}
                    min="15"
                    step="15"
                  />
                </div>
                
                <div>
                  <label htmlFor="bufferTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Buffer Time Between Sessions (minutes)
                  </label>
                  <input
                    type="number"
                    id="bufferTime"
                    name="bookingSettings.bufferTime"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={settings.bookingSettings.bufferTime}
                    onChange={handleChange}
                    min="0"
                    step="5"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center">
                  <input
                    id="autoConfirm"
                    name="bookingSettings.autoConfirm"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={settings.bookingSettings.autoConfirm}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="autoConfirm" className="ml-2 block text-sm text-gray-700">
                    Auto-confirm bookings
                  </label>
                </div>
                <p className="mt-1 text-sm text-gray-500 pl-6">
                  If enabled, bookings will be automatically confirmed without requiring your approval
                </p>
              </div>
            </div>
          )}
          
          {/* Payment Tab */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accepted Payment Methods
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="credit_card"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={settings.paymentSettings.acceptedMethods.includes('credit_card')}
                      onChange={(e) => handlePaymentMethodChange('credit_card', e.target.checked)}
                    />
                    <label htmlFor="credit_card" className="ml-2 block text-sm text-gray-700">
                      Credit/Debit Card
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="bank_transfer"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={settings.paymentSettings.acceptedMethods.includes('bank_transfer')}
                      onChange={(e) => handlePaymentMethodChange('bank_transfer', e.target.checked)}
                    />
                    <label htmlFor="bank_transfer" className="ml-2 block text-sm text-gray-700">
                      Bank Transfer
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="paypal"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={settings.paymentSettings.acceptedMethods.includes('paypal')}
                      onChange={(e) => handlePaymentMethodChange('paypal', e.target.checked)}
                    />
                    <label htmlFor="paypal" className="ml-2 block text-sm text-gray-700">
                      PayPal
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="venmo"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={settings.paymentSettings.acceptedMethods.includes('venmo')}
                      onChange={(e) => handlePaymentMethodChange('venmo', e.target.checked)}
                    />
                    <label htmlFor="venmo" className="ml-2 block text-sm text-gray-700">
                      Venmo
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="cash"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={settings.paymentSettings.acceptedMethods.includes('cash')}
                      onChange={(e) => handlePaymentMethodChange('cash', e.target.checked)}
                    />
                    <label htmlFor="cash" className="ml-2 block text-sm text-gray-700">
                      Cash
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center">
                  <input
                    id="depositRequired"
                    name="paymentSettings.depositRequired"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={settings.paymentSettings.depositRequired}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="depositRequired" className="ml-2 block text-sm text-gray-700">
                    Require deposit for bookings
                  </label>
                </div>
                
                {settings.paymentSettings.depositRequired && (
                  <div className="mt-3 pl-6">
                    <label htmlFor="depositPercentage" className="block text-sm font-medium text-gray-700 mb-1">
                      Deposit Percentage
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        id="depositPercentage"
                        name="paymentSettings.depositPercentage"
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={settings.paymentSettings.depositPercentage}
                        onChange={handleChange}
                        min="1"
                        max="100"
                      />
                      <span className="ml-2 text-gray-500">%</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="cancellationPolicy" className="block text-sm font-medium text-gray-700 mb-1">
                  Cancellation Policy
                </label>
                <textarea
                  id="cancellationPolicy"
                  name="paymentSettings.cancellationPolicy"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={settings.paymentSettings.cancellationPolicy}
                  onChange={handleChange}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Clearly describe your cancellation and refund policy
                </p>
              </div>
            </div>
          )}
          
          {/* Staff Tab */}
          {activeTab === 'staff' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Staff Members</h3>
                <button
                  type="button"
                  onClick={addStaffMember}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Staff Member
                </button>
              </div>
              
              <div className="space-y-4">
                {settings.staffMembers.map((member) => (
                  <div key={member.id} className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between mb-3">
                      <h4 className="font-medium">Staff Member</h4>
                      <button
                        type="button"
                        onClick={() => removeStaffMember(member.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={member.name}
                          onChange={(e) => handleStaffChange(member.id, 'name', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={member.role}
                          onChange={(e) => handleStaffChange(member.id, 'role', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={member.email}
                          onChange={(e) => handleStaffChange(member.id, 'email', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 bg-gray-50 flex justify-end">
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessSettings;
