import React, { useState } from 'react';
import {
  generateSEOContent,
  generateClientEmail,
  analyzeBusinessMetrics,
  calculateCost,
  type ClaudeResponse
} from '../../services/claudeService';
import {
  Sparkles,
  FileText,
  Mail,
  TrendingUp,
  Loader,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';

export default function AITools() {
  const [activeTab, setActiveTab] = useState<'seo' | 'email' | 'analytics'>('seo');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [totalTokens, setTotalTokens] = useState({ input: 0, output: 0 });

  // SEO Content Generation
  const [seoTopic, setSeoTopic] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [seoLocation, setSeoLocation] = useState('');

  // Email Generation
  const [emailType, setEmailType] = useState<'inquiry_response' | 'booking_confirmation' | 'follow_up'>('inquiry_response');
  const [clientName, setClientName] = useState('');
  const [emailDetails, setEmailDetails] = useState('');

  const handleGenerateSEO = async () => {
    if (!seoTopic || !seoKeywords) {
      setError('Please fill in topic and keywords');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await generateSEOContent({
        topic: seoTopic,
        keywords: seoKeywords.split(',').map(k => k.trim()),
        type: 'blog',
        location: seoLocation
      });

      setResult(response.content);
      if (response.tokens) {
        setTotalTokens(prev => ({
          input: prev.input + response.tokens.input,
          output: prev.output + response.tokens.output
        }));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateEmail = async () => {
    if (!clientName) {
      setError('Please enter client name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const details = emailDetails ? JSON.parse(emailDetails) : {};
      const response = await generateClientEmail({
        type: emailType,
        clientName,
        details
      });

      setResult(response.content);
      if (response.tokens) {
        setTotalTokens(prev => ({
          input: prev.input + response.tokens.input,
          output: prev.output + response.tokens.output
        }));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate email');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeMetrics = async () => {
    setLoading(true);
    setError('');

    try {
      // Mock data for demonstration
      const mockData = {
        bookings: [
          { date: '2025-01-15', revenue: 4500, type: 'wedding' },
          { date: '2025-02-20', revenue: 800, type: 'engagement' },
          { date: '2025-03-10', revenue: 5500, type: 'wedding' },
          { date: '2025-03-25', revenue: 3500, type: 'wedding' },
          { date: '2025-04-05', revenue: 1200, type: 'portrait' },
        ],
        inquiries: [
          { date: '2025-01-01', source: 'instagram', converted: true },
          { date: '2025-01-05', source: 'google', converted: false },
          { date: '2025-01-10', source: 'referral', converted: true },
          { date: '2025-01-15', source: 'instagram', converted: false },
          { date: '2025-01-20', source: 'google', converted: true },
        ],
        period: 'Q1 2025'
      };

      const response = await analyzeBusinessMetrics(mockData);

      setResult(response.content);
      if (response.tokens) {
        setTotalTokens(prev => ({
          input: prev.input + response.tokens.input,
          output: prev.output + response.tokens.output
        }));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to analyze metrics');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cost = calculateCost(totalTokens);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold">AI Tools</h1>
                <p className="text-gray-600">Powered by Claude 3.5 Sonnet</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Session Cost</p>
              <p className="text-lg font-semibold text-purple-600">{cost.formattedTotal}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('seo')}
            className={`flex items-center px-6 py-3 space-x-2 border-b-2 transition ${
              activeTab === 'seo'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>SEO Content</span>
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`flex items-center px-6 py-3 space-x-2 border-b-2 transition ${
              activeTab === 'email'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Mail className="w-5 h-5" />
            <span>Email Drafts</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center px-6 py-3 space-x-2 border-b-2 transition ${
              activeTab === 'analytics'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span>Analytics</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic
                </label>
                <input
                  type="text"
                  value={seoTopic}
                  onChange={(e) => setSeoTopic(e.target.value)}
                  placeholder="e.g., Summer Wedding Photography Tips"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  placeholder="e.g., wedding photographer, NJ photography, summer wedding"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location (optional)
                </label>
                <input
                  type="text"
                  value={seoLocation}
                  onChange={(e) => setSeoLocation(e.target.value)}
                  placeholder="e.g., New Jersey"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <button
                onClick={handleGenerateSEO}
                disabled={loading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate SEO Content</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Email Tab */}
          {activeTab === 'email' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Type
                </label>
                <select
                  value={emailType}
                  onChange={(e) => setEmailType(e.target.value as any)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="inquiry_response">Inquiry Response</option>
                  <option value="booking_confirmation">Booking Confirmation</option>
                  <option value="follow_up">Follow Up</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g., Sarah & Michael"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Details (JSON format, optional)
                </label>
                <textarea
                  value={emailDetails}
                  onChange={(e) => setEmailDetails(e.target.value)}
                  placeholder='{"date": "June 15, 2025", "venue": "The Park Savoy"}'
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <button
                onClick={handleGenerateEmail}
                disabled={loading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    <span>Generate Email</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Sample Data Analysis</h3>
                <p className="text-sm text-gray-600">
                  Click the button below to analyze sample business data from Q1 2025.
                  This will provide insights on revenue trends, booking patterns, and growth recommendations.
                </p>
              </div>
              <button
                onClick={handleAnalyzeMetrics}
                disabled={loading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5" />
                    <span>Analyze Business Metrics</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">Generated Content</h3>
                <button
                  onClick={copyToClipboard}
                  className="p-2 text-gray-500 hover:text-gray-700 transition"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm font-mono">{result}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Token Usage Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="flex justify-between items-center text-sm">
            <div className="flex space-x-6">
              <span className="text-gray-600">
                Input Tokens: <strong>{totalTokens.input.toLocaleString()}</strong>
              </span>
              <span className="text-gray-600">
                Output Tokens: <strong>{totalTokens.output.toLocaleString()}</strong>
              </span>
            </div>
            <div className="text-gray-600">
              Total Cost: <strong className="text-purple-600">{cost.formattedTotal}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}