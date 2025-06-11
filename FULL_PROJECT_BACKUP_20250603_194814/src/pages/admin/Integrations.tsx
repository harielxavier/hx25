import React, { useState, useEffect } from 'react';
import { Save, Link, MessageSquare, CreditCard, Mail, BarChart, CheckCircle, AlertCircle } from 'lucide-react';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

interface IntegrationConfig {
  enabled: boolean;
  apiKey: string;
  accountId?: string;
  organizationId?: string;
  endpoint?: string;
  additionalSettings?: Record<string, string>;
}

interface IntegrationsState {
  payment: {
    stripe: IntegrationConfig;
    paypal: IntegrationConfig;
    square: IntegrationConfig;
    authorizenet: IntegrationConfig;
    venmo: IntegrationConfig;
    zelle: IntegrationConfig;
    wise: IntegrationConfig;
  };
  banking: {
    quickbooks: IntegrationConfig;
    xero: IntegrationConfig;
    wave: IntegrationConfig;
    freshbooks: IntegrationConfig;
  };
  email: {
    mailchimp: IntegrationConfig;
    sendgrid: IntegrationConfig;
    convertkit: IntegrationConfig;
    activecampaign: IntegrationConfig;
    constantcontact: IntegrationConfig;
    klaviyo: IntegrationConfig;
    hubspot: IntegrationConfig;
  };
  analytics: {
    googleAnalytics: IntegrationConfig;
    facebookPixel: IntegrationConfig;
    hotjar: IntegrationConfig;
    mixpanel: IntegrationConfig;
    adobeAnalytics: IntegrationConfig;
  };
  llm: {
    openai: IntegrationConfig;
    anthropic: IntegrationConfig;
    gemini: IntegrationConfig;
    mistral: IntegrationConfig;
    llama: IntegrationConfig;
  };
  social: {
    instagram: IntegrationConfig;
    facebook: IntegrationConfig;
    pinterest: IntegrationConfig;
  };
}

const defaultIntegrationConfig: IntegrationConfig = {
  enabled: false,
  apiKey: '',
  accountId: '',
  organizationId: '',
  endpoint: '',
  additionalSettings: {},
};

const Integrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationsState>({
    payment: {
      stripe: { ...defaultIntegrationConfig },
      paypal: { ...defaultIntegrationConfig },
      square: { ...defaultIntegrationConfig },
      authorizenet: { ...defaultIntegrationConfig },
      venmo: { ...defaultIntegrationConfig },
      zelle: { ...defaultIntegrationConfig },
      wise: { ...defaultIntegrationConfig },
    },
    banking: {
      quickbooks: { ...defaultIntegrationConfig },
      xero: { ...defaultIntegrationConfig },
      wave: { ...defaultIntegrationConfig },
      freshbooks: { ...defaultIntegrationConfig },
    },
    email: {
      mailchimp: { ...defaultIntegrationConfig },
      sendgrid: { ...defaultIntegrationConfig },
      convertkit: { ...defaultIntegrationConfig },
      activecampaign: { ...defaultIntegrationConfig },
      constantcontact: { ...defaultIntegrationConfig },
      klaviyo: { ...defaultIntegrationConfig },
      hubspot: { ...defaultIntegrationConfig },
    },
    analytics: {
      googleAnalytics: { ...defaultIntegrationConfig },
      facebookPixel: { ...defaultIntegrationConfig },
      hotjar: { ...defaultIntegrationConfig },
      mixpanel: { ...defaultIntegrationConfig },
      adobeAnalytics: { ...defaultIntegrationConfig },
    },
    llm: {
      openai: { ...defaultIntegrationConfig },
      anthropic: { ...defaultIntegrationConfig },
      gemini: { ...defaultIntegrationConfig },
      mistral: { ...defaultIntegrationConfig },
      llama: { ...defaultIntegrationConfig },
    },
    social: {
      instagram: { ...defaultIntegrationConfig },
      facebook: { ...defaultIntegrationConfig },
      pinterest: { ...defaultIntegrationConfig },
    },
  });

  const [activeTab, setActiveTab] = useState('payment');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});

  const db = getFirestore();

  // Load current integration settings from Firestore
  useEffect(() => {
    const fetchIntegrationSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'integrations');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setIntegrations(docSnap.data() as IntegrationsState);
        }
      } catch (error) {
        console.error('Error fetching integration settings:', error);
      }
    };

    fetchIntegrationSettings();
  }, [db]);

  // Toggle API key visibility
  const toggleApiKeyVisibility = (key: string) => {
    setShowApiKeys({
      ...showApiKeys,
      [key]: !showApiKeys[key],
    });
  };

  // Handle toggle change
  const handleToggleChange = (
    category: keyof IntegrationsState,
    service: string,
    subcategory?: string
  ) => {
    const newIntegrations = { ...integrations };
    
    if (subcategory) {
      // Handle nested structure (category -> subcategory -> service)
      const categoryObj = newIntegrations[category];
      
      if (typeof categoryObj === 'object' && 'stripe' in categoryObj || 
          'mailchimp' in categoryObj || 'googleAnalytics' in categoryObj || 
          'openai' in categoryObj || 'instagram' in categoryObj ||
          'quickbooks' in categoryObj) {
        
        // It's a nested category object
        const subCategoryObj = categoryObj[subcategory as keyof typeof categoryObj];
        
        if (typeof subCategoryObj === 'object' && service in subCategoryObj) {
          const serviceObj = subCategoryObj[service as keyof typeof subCategoryObj] as IntegrationConfig;
          serviceObj.enabled = !serviceObj.enabled;
        }
      }
    } else {
      // This case should never happen with our current structure
      console.warn('Direct category toggle not supported in current structure');
    }
    
    setIntegrations(newIntegrations);
  };

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    category: keyof IntegrationsState,
    service: string,
    field: keyof IntegrationConfig,
    subcategory?: string
  ) => {
    const { value } = e.target;
    const newIntegrations = { ...integrations };
    
    if (subcategory) {
      // Handle nested structure (category -> subcategory -> service)
      const categoryObj = newIntegrations[category];
      
      // Type guard to check if we're dealing with a nested category
      if (typeof categoryObj === 'object' && ('stripe' in categoryObj || 
          'mailchimp' in categoryObj || 'googleAnalytics' in categoryObj || 
          'openai' in categoryObj || 'instagram' in categoryObj ||
          'quickbooks' in categoryObj)) {
        
        // It's a nested category object
        const subCategoryObj = categoryObj[subcategory as keyof typeof categoryObj];
        
        if (typeof subCategoryObj === 'object' && service in subCategoryObj) {
          const serviceObj = subCategoryObj[service as keyof typeof subCategoryObj] as IntegrationConfig;
          
          // Type-safe assignment based on field type
          if (field === 'apiKey' || field === 'accountId' || field === 'organizationId' || field === 'endpoint') {
            serviceObj[field] = value;
          }
        }
      }
    } else {
      // This case should never happen with our current structure
      console.warn('Direct category input change not supported in current structure');
    }
    
    setIntegrations(newIntegrations);
  };

  // Save settings
  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      // Save settings to Firestore
      await setDoc(doc(db, 'settings', 'integrations'), {
        ...integrations,
        updatedAt: new Date().toISOString(),
      });
      
      // Show success message
      setSaveMessage({
        type: 'success',
        text: 'Integration settings saved successfully!',
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error saving integration settings:', error);
      setSaveMessage({
        type: 'error',
        text: 'Failed to save settings. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Render integration form for a service
  const renderIntegrationForm = (
    category: keyof IntegrationsState,
    service: string,
    title: string,
    description: string,
    fields: Array<{
      name: keyof IntegrationConfig;
      label: string;
      type: 'text' | 'password' | 'url';
      placeholder: string;
      required: boolean;
    }>,
    subcategory?: string
  ) => {
    let config: IntegrationConfig;
    
    if (subcategory) {
      const categoryObj = integrations[category];
      
      // Type guard to check if we're dealing with a nested category
      if (typeof categoryObj === 'object' && ('stripe' in categoryObj || 
          'mailchimp' in categoryObj || 'googleAnalytics' in categoryObj || 
          'openai' in categoryObj || 'instagram' in categoryObj ||
          'quickbooks' in categoryObj)) {
        
        // It's a nested category object
        const subCategoryObj = categoryObj[subcategory as keyof typeof categoryObj];
        
        if (typeof subCategoryObj === 'object' && service in subCategoryObj) {
          config = subCategoryObj[service as keyof typeof subCategoryObj] as IntegrationConfig;
        } else {
          config = defaultIntegrationConfig;
        }
      } else {
        config = defaultIntegrationConfig;
      }
    } else {
      // This case should never happen with our current structure
      console.warn('Direct category rendering not supported in current structure');
      config = defaultIntegrationConfig;
    }

    return (
      <div className="border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <div className="flex items-center">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={config.enabled}
                onChange={() => handleToggleChange(category, service, subcategory)}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-700">
                {config.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>
        </div>
        
        {config.enabled && (
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={String(field.name)}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="relative">
                  <input
                    type={field.type === 'password' && !showApiKeys[`${service}-${field.name}`] ? 'password' : 'text'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={field.placeholder}
                    value={config[field.name] as string || ''}
                    onChange={(e) => handleInputChange(e, category, service, field.name, subcategory)}
                  />
                  {field.type === 'password' && (
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => toggleApiKeyVisibility(`${service}-${field.name}`)}
                    >
                      {showApiKeys[`${service}-${field.name}`] ? 'Hide' : 'Show'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Integrations</h1>
        <p className="text-gray-600">Connect your photography business with third-party services and APIs</p>
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
        <div className="flex border-b overflow-x-auto">
          <button
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'payment' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('payment')}
          >
            Payment
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'banking' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('banking')}
          >
            Banking
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'email' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('email')}
          >
            Email
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'analytics' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'llm' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('llm')}
          >
            AI & LLMs
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'social' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('social')}
          >
            Social
          </button>
        </div>
        
        <div className="p-6">
          {/* Payment Integrations */}
          {activeTab === 'payment' && (
            <div>
              <div className="flex items-center mb-6">
                <CreditCard className="h-5 w-5 text-blue-500 mr-2" />
                <h2 className="text-lg font-medium">Payment Integrations</h2>
              </div>
              
              {renderIntegrationForm(
                'payment',
                'stripe',
                'Stripe',
                'Process credit card payments with Stripe',
                [
                  {
                    name: 'apiKey',
                    label: 'Secret Key',
                    type: 'password',
                    placeholder: 'sk_test_...',
                    required: true,
                  },
                  {
                    name: 'accountId',
                    label: 'Publishable Key',
                    type: 'text',
                    placeholder: 'pk_test_...',
                    required: true,
                  },
                  {
                    name: 'endpoint',
                    label: 'Webhook Secret',
                    type: 'password',
                    placeholder: 'whsec_...',
                    required: false,
                  },
                ],
                'payment'
              )}
              
              {renderIntegrationForm(
                'payment',
                'paypal',
                'PayPal',
                'Accept payments through PayPal',
                [
                  {
                    name: 'apiKey',
                    label: 'Client ID',
                    type: 'text',
                    placeholder: 'Enter your PayPal client ID',
                    required: true,
                  },
                  {
                    name: 'accountId',
                    label: 'Secret',
                    type: 'password',
                    placeholder: 'Enter your PayPal secret',
                    required: true,
                  },
                  {
                    name: 'endpoint',
                    label: 'Environment',
                    type: 'text',
                    placeholder: 'sandbox or production',
                    required: false,
                  },
                ],
                'payment'
              )}
              
              {renderIntegrationForm(
                'payment',
                'square',
                'Square',
                'Accept payments with Square',
                [
                  {
                    name: 'apiKey',
                    label: 'Access Token',
                    type: 'password',
                    placeholder: 'Enter your Square access token',
                    required: true,
                  },
                  {
                    name: 'accountId',
                    label: 'Application ID',
                    type: 'text',
                    placeholder: 'Enter your Square application ID',
                    required: true,
                  },
                  {
                    name: 'endpoint',
                    label: 'Location ID',
                    type: 'text',
                    placeholder: 'Enter your Square location ID',
                    required: false,
                  },
                ],
                'payment'
              )}

              {renderIntegrationForm(
                'payment',
                'authorizenet',
                'Authorize.net',
                'Process payments with Authorize.net',
                [
                  {
                    name: 'apiKey',
                    label: 'API Login ID',
                    type: 'text',
                    placeholder: 'Enter your Authorize.net API Login ID',
                    required: true,
                  },
                  {
                    name: 'accountId',
                    label: 'Transaction Key',
                    type: 'password',
                    placeholder: 'Enter your Authorize.net Transaction Key',
                    required: true,
                  },
                  {
                    name: 'endpoint',
                    label: 'Environment',
                    type: 'text',
                    placeholder: 'sandbox or production',
                    required: false,
                  },
                ],
                'payment'
              )}

              {renderIntegrationForm(
                'payment',
                'venmo',
                'Venmo',
                'Accept payments through Venmo',
                [
                  {
                    name: 'accountId',
                    label: 'Venmo Username',
                    type: 'text',
                    placeholder: '@your-venmo-username',
                    required: true,
                  },
                  {
                    name: 'apiKey',
                    label: 'Business ID (if applicable)',
                    type: 'text',
                    placeholder: 'Enter your Venmo Business ID',
                    required: false,
                  },
                ],
                'payment'
              )}

              {renderIntegrationForm(
                'payment',
                'zelle',
                'Zelle',
                'Accept payments through Zelle',
                [
                  {
                    name: 'accountId',
                    label: 'Zelle Email/Phone',
                    type: 'text',
                    placeholder: 'Email or phone number registered with Zelle',
                    required: true,
                  },
                  {
                    name: 'apiKey',
                    label: 'Business Account ID (if applicable)',
                    type: 'text',
                    placeholder: 'Enter your Zelle Business Account ID',
                    required: false,
                  },
                ],
                'payment'
              )}

              {renderIntegrationForm(
                'payment',
                'wise',
                'Wise (TransferWise)',
                'Accept international payments with Wise',
                [
                  {
                    name: 'apiKey',
                    label: 'API Token',
                    type: 'password',
                    placeholder: 'Enter your Wise API token',
                    required: true,
                  },
                  {
                    name: 'accountId',
                    label: 'Profile ID',
                    type: 'text',
                    placeholder: 'Enter your Wise Profile ID',
                    required: true,
                  },
                ],
                'payment'
              )}
            </div>
          )}

          {/* Banking Integrations */}
          {activeTab === 'banking' && (
            <div>
              <div className="flex items-center mb-6">
                <CreditCard className="h-5 w-5 text-blue-500 mr-2" />
                <h2 className="text-lg font-medium">Banking & Accounting Integrations</h2>
              </div>
              
              {renderIntegrationForm(
                'banking',
                'quickbooks',
                'QuickBooks',
                'Connect with QuickBooks for accounting and invoicing',
                [
                  {
                    name: 'apiKey',
                    label: 'Client ID',
                    type: 'text',
                    placeholder: 'Enter your QuickBooks Client ID',
                    required: true,
                  },
                  {
                    name: 'accountId',
                    label: 'Client Secret',
                    type: 'password',
                    placeholder: 'Enter your QuickBooks Client Secret',
                    required: true,
                  },
                  {
                    name: 'endpoint',
                    label: 'Realm ID (Company ID)',
                    type: 'text',
                    placeholder: 'Enter your QuickBooks Realm ID',
                    required: true,
                  },
                ],
                'banking'
              )}

              {renderIntegrationForm(
                'banking',
                'xero',
                'Xero',
                'Connect with Xero for accounting and invoicing',
                [
                  {
                    name: 'apiKey',
                    label: 'Client ID',
                    type: 'text',
                    placeholder: 'Enter your Xero Client ID',
                    required: true,
                  },
                  {
                    name: 'accountId',
                    label: 'Client Secret',
                    type: 'password',
                    placeholder: 'Enter your Xero Client Secret',
                    required: true,
                  },
                  {
                    name: 'endpoint',
                    label: 'Tenant ID',
                    type: 'text',
                    placeholder: 'Enter your Xero Tenant ID',
                    required: true,
                  },
                ],
                'banking'
              )}

              {renderIntegrationForm(
                'banking',
                'wave',
                'Wave',
                'Connect with Wave for accounting and invoicing',
                [
                  {
                    name: 'apiKey',
                    label: 'API Token',
                    type: 'password',
                    placeholder: 'Enter your Wave API Token',
                    required: true,
                  },
                  {
                    name: 'accountId',
                    label: 'Business ID',
                    type: 'text',
                    placeholder: 'Enter your Wave Business ID',
                    required: true,
                  },
                ],
                'banking'
              )}

              {renderIntegrationForm(
                'banking',
                'freshbooks',
                'FreshBooks',
                'Connect with FreshBooks for accounting and invoicing',
                [
                  {
                    name: 'apiKey',
                    label: 'Client ID',
                    type: 'text',
                    placeholder: 'Enter your FreshBooks Client ID',
                    required: true,
                  },
                  {
                    name: 'accountId',
                    label: 'Client Secret',
                    type: 'password',
                    placeholder: 'Enter your FreshBooks Client Secret',
                    required: true,
                  },
                  {
                    name: 'endpoint',
                    label: 'Account ID',
                    type: 'text',
                    placeholder: 'Enter your FreshBooks Account ID',
                    required: true,
                  },
                ],
                'banking'
              )}
            </div>
          )}
          
          {/* Email Integrations */}
          {activeTab === 'email' && (
            <div>
              <div className="flex items-center mb-6">
                <Mail className="h-5 w-5 text-blue-500 mr-2" />
                <h2 className="text-lg font-medium">Email Marketing Integrations</h2>
              </div>
              
              {renderIntegrationForm(
                'email',
                'mailchimp',
                'Mailchimp',
                'Connect with Mailchimp for email marketing campaigns',
                [
                  {
                    name: 'apiKey',
                    label: 'API Key',
                    type: 'password',
                    placeholder: 'Enter your Mailchimp API key',
                    required: true,
                  },
                  {
                    name: 'accountId',
                    label: 'Server Prefix',
                    type: 'text',
                    placeholder: 'us1, us2, etc.',
                    required: true,
                  },
                  {
                    name: 'organizationId',
                    label: 'List/Audience ID',
                    type: 'text',
                    placeholder: 'Enter your default list ID',
                    required: false,
                  },
                ],
                'email'
              )}
              
              {renderIntegrationForm(
                'email',
                'sendgrid',
                'SendGrid',
                'Send transactional and marketing emails with SendGrid',
                [
                  {
                    name: 'apiKey',
                    label: 'API Key',
                    type: 'password',
                    placeholder: 'Enter your SendGrid API key',
                    required: true,
                  },
                  {
                    name: 'accountId',
                    label: 'From Email',
                    type: 'text',
                    placeholder: 'Enter your verified sender email',
                    required: true,
                  },
                ],
                'email'
              )}
              
              {renderIntegrationForm(
                'email',
                'convertkit',
                'ConvertKit',
                'Connect with ConvertKit for email marketing',
                [
                  {
                    name: 'apiKey',
                    label: 'API Key',
                    type: 'password',
                    placeholder: 'Enter your ConvertKit API key',
                    required: true,
                  },
                  {
                    name: 'accountId',
                    label: 'API Secret',
                    type: 'password',
                    placeholder: 'Enter your ConvertKit API secret',
                    required: false,
                  },
                ],
                'email'
              )}

              {renderIntegrationForm(
                'email',
                'activecampaign',
                'ActiveCampaign',
                'Connect with ActiveCampaign for email marketing automation',
                [
                  {
                    name: 'apiKey',
                    label: 'API Key',
                    type: 'password',
                    placeholder: 'Enter your ActiveCampaign API key',
                    required: true,
                  },
                  {
                    name: 'endpoint',
                    label: 'API URL',
                    type: 'url',
                    placeholder: 'https://your-account.api-us1.com',
                    required: true,
                  },
                ],
                'email'
              )}

              {renderIntegrationForm(
                'email',
                'constantcontact',
                'Constant Contact',
                'Connect with Constant Contact for email marketing',
                [
                  {
                    name: 'apiKey',
                    label: 'API Key',
                    type: 'password',
                    placeholder: 'Enter your Constant Contact API key',
                    required: true,
                  },
                  {
                    name: 'accountId',
                    label: 'Access Token',
                    type: 'password',
                    placeholder: 'Enter your Constant Contact Access Token',
                    required: true,
                  },
                ],
                'email'
              )}

              {renderIntegrationForm(
                'email',
                'klaviyo',
                'Klaviyo',
                'Connect with Klaviyo for email marketing and SMS',
                [
                  {
                    name: 'apiKey',
                    label: 'Private API Key',
                    type: 'password',
                    placeholder: 'Enter your Klaviyo Private API key',
                    required: true,
                  },
                  {
                    name: 'accountId',
                    label: 'Public API Key',
                    type: 'text',
                    placeholder: 'Enter your Klaviyo Public API key',
                    required: true,
                  },
                ],
                'email'
              )}

              {renderIntegrationForm(
                'email',
                'hubspot',
                'HubSpot',
                'Connect with HubSpot for marketing, sales, and CRM',
                [
                  {
                    name: 'apiKey',
                    label: 'API Key',
                    type: 'password',
                    placeholder: 'Enter your HubSpot API key',
                    required: true,
                  },
                  {
                    name: 'accountId',
                    label: 'Hub ID',
                    type: 'text',
                    placeholder: 'Enter your HubSpot Hub ID',
                    required: false,
                  },
                ],
                'email'
              )}
            </div>
          )}
          
          {/* Analytics Integrations */}
          {activeTab === 'analytics' && (
            <div>
              <div className="flex items-center mb-6">
                <BarChart className="h-5 w-5 text-blue-500 mr-2" />
                <h2 className="text-lg font-medium">Analytics Integrations</h2>
              </div>
              
              {renderIntegrationForm(
                'analytics',
                'googleAnalytics',
                'Google Analytics',
                'Track website traffic and user behavior',
                [
                  {
                    name: 'apiKey',
                    label: 'Measurement ID (GA4)',
                    type: 'text',
                    placeholder: 'G-XXXXXXXXXX',
                    required: true,
                  },
                  {
                    name: 'accountId',
                    label: 'Stream ID',
                    type: 'text',
                    placeholder: 'Enter your GA4 stream ID',
                    required: false,
                  },
                ],
                'analytics'
              )}
              
              {renderIntegrationForm(
                'analytics',
                'facebookPixel',
                'Facebook Pixel',
                'Track conversions from Facebook ads',
                [
                  {
                    name: 'apiKey',
                    label: 'Pixel ID',
                    type: 'text',
                    placeholder: 'Enter your Facebook Pixel ID',
                    required: true,
                  },
                  {
                    name: 'accountId',
                    label: 'Access Token',
                    type: 'password',
                    placeholder: 'Enter your Facebook access token',
                    required: false,
                  },
                ],
                'analytics'
              )}

              {renderIntegrationForm(
                'analytics',
                'hotjar',
                'Hotjar',
                'Visualize user behavior with heatmaps and recordings',
                [
                  {
                    name: 'apiKey',
                    label: 'Site ID',
                    type: 'text',
                    placeholder: 'Enter your Hotjar Site ID',
                    required: true,
                  },
                ],
                'analytics'
              )}

              {renderIntegrationForm(
                'analytics',
                'mixpanel',
                'Mixpanel',
                'Advanced analytics for user behavior and engagement',
                [
                  {
                    name: 'apiKey',
                    label: 'Project Token',
                    type: 'text',
                    placeholder: 'Enter your Mixpanel Project Token',
                    required: true,
                  },
                  {
                    name: 'accountId',
                    label: 'API Secret',
                    type: 'password',
                    placeholder: 'Enter your Mixpanel API Secret',
                    required: false,
                  },
                ],
                'analytics'
              )}

              {renderIntegrationForm(
                'analytics',
                'adobeAnalytics',
                'Adobe Analytics',
                'Enterprise-level analytics and reporting',
                [
                  {
                    name: 'apiKey',
                    label: 'Tracking Server',
                    type: 'text',
                    placeholder: 'Enter your Adobe Analytics Tracking Server',
                    required: true,
                  },
                  {
                    name: 'accountId',
                    label: 'Report Suite ID',
                    type: 'text',
                    placeholder: 'Enter your Report Suite ID',
                    required: true,
                  },
                  {
                    name: 'organizationId',
                    label: 'Organization ID',
                    type: 'text',
                    placeholder: 'Enter your Adobe Organization ID',
                    required: true,
                  },
                ],
                'analytics'
              )}
            </div>
          )}
          
          {/* LLM Integrations */}
          {activeTab === 'llm' && (
            <div>
              <div className="flex items-center mb-6">
                <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
                <h2 className="text-lg font-medium">AI & LLM Integrations</h2>
              </div>
              
              {renderIntegrationForm(
                'llm',
                'openai',
                'OpenAI',
                'Integrate with OpenAI\'s GPT models for AI-powered features',
                [
                  {
                    name: 'apiKey',
                    label: 'API Key',
                    type: 'password',
                    placeholder: 'sk-...',
                    required: true,
                  },
                  {
                    name: 'additionalSettings',
                    label: 'Default Model',
                    type: 'text',
                    placeholder: 'gpt-4-turbo, gpt-4o, gpt-3.5-turbo',
                    required: false,
                  },
                  {
                    name: 'endpoint',
                    label: 'API Endpoint (for custom deployments)',
                    type: 'url',
                    placeholder: 'https://api.openai.com/v1',
                    required: false,
                  },
                ],
                'llm'
              )}
              
              {renderIntegrationForm(
                'llm',
                'anthropic',
                'Anthropic Claude',
                'Integrate with Anthropic\'s Claude models for AI-powered features',
                [
                  {
                    name: 'apiKey',
                    label: 'API Key',
                    type: 'password',
                    placeholder: 'sk-ant-...',
                    required: true,
                  },
                  {
                    name: 'additionalSettings',
                    label: 'Default Model',
                    type: 'text',
                    placeholder: 'claude-3-opus, claude-3-sonnet, claude-3-haiku',
                    required: false,
                  },
                ],
                'llm'
              )}
              
              {renderIntegrationForm(
                'llm',
                'gemini',
                'Google Gemini',
                'Integrate with Google\'s Gemini models for AI-powered features',
                [
                  {
                    name: 'apiKey',
                    label: 'API Key',
                    type: 'password',
                    placeholder: 'Enter your Gemini API key',
                    required: true,
                  },
                  {
                    name: 'additionalSettings',
                    label: 'Default Model',
                    type: 'text',
                    placeholder: 'gemini-pro, gemini-ultra',
                    required: false,
                  },
                ],
                'llm'
              )}
              
              {renderIntegrationForm(
                'llm',
                'mistral',
                'Mistral AI',
                'Integrate with Mistral AI models for AI-powered features',
                [
                  {
                    name: 'apiKey',
                    label: 'API Key',
                    type: 'password',
                    placeholder: 'Enter your Mistral AI API key',
                    required: true,
                  },
                  {
                    name: 'additionalSettings',
                    label: 'Default Model',
                    type: 'text',
                    placeholder: 'mistral-large, mistral-medium, mistral-small',
                    required: false,
                  },
                ],
                'llm'
              )}
              
              {renderIntegrationForm(
                'llm',
                'llama',
                'Meta Llama',
                'Integrate with Meta\'s Llama models for AI-powered features',
                [
                  {
                    name: 'apiKey',
                    label: 'API Key',
                    type: 'password',
                    placeholder: 'Enter your Llama API key',
                    required: true,
                  },
                  {
                    name: 'endpoint',
                    label: 'API Endpoint',
                    type: 'url',
                    placeholder: 'Enter your Llama API endpoint',
                    required: true,
                  },
                  {
                    name: 'additionalSettings',
                    label: 'Default Model',
                    type: 'text',
                    placeholder: 'llama-3-70b, llama-3-8b',
                    required: false,
                  },
                ],
                'llm'
              )}
            </div>
          )}
          
          {/* Social Media Integrations */}
          {activeTab === 'social' && (
            <div>
              <div className="flex items-center mb-6">
                <Link className="h-5 w-5 text-blue-500 mr-2" />
                <h2 className="text-lg font-medium">Social Media Integrations</h2>
              </div>
              
              {renderIntegrationForm(
                'social',
                'instagram',
                'Instagram',
                'Connect with Instagram for social media integration',
                [
                  {
                    name: 'apiKey',
                    label: 'Access Token',
                    type: 'password',
                    placeholder: 'Enter your Instagram access token',
                    required: true,
                  },
                  {
                    name: 'accountId',
                    label: 'Instagram Business ID',
                    type: 'text',
                    placeholder: 'Enter your Instagram business ID',
                    required: true,
                  },
                ],
                'social'
              )}
              
              {renderIntegrationForm(
                'social',
                'facebook',
                'Facebook',
                'Connect with Facebook for social media integration',
                [
                  {
                    name: 'apiKey',
                    label: 'Access Token',
                    type: 'password',
                    placeholder: 'Enter your Facebook access token',
                    required: true,
                  },
                  {
                    name: 'accountId',
                    label: 'Page ID',
                    type: 'text',
                    placeholder: 'Enter your Facebook page ID',
                    required: true,
                  },
                ],
                'social'
              )}
              
              {renderIntegrationForm(
                'social',
                'pinterest',
                'Pinterest',
                'Connect with Pinterest for social media integration',
                [
                  {
                    name: 'apiKey',
                    label: 'Access Token',
                    type: 'password',
                    placeholder: 'Enter your Pinterest access token',
                    required: true,
                  },
                ],
                'social'
              )}
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
                Save Integration Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
