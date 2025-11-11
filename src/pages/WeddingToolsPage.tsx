import { useState, useRef } from 'react';
import { Clock, DollarSign, Users, PlusCircle, Trash2, Download, Crown, Award, Sparkles, Brain, Bot, Eye, EyeOff, Maximize2, Minimize2, Target, CheckCircle, AlertCircle, Gem, Lightbulb, Globe, Shield, FileText, Users2, Building2, Heart, Calendar } from 'lucide-react';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';
import SEO from '../components/layout/SEO';
import ElopementPackages from '../components/wedding/ElopementPackages';
import CalendarAvailability from '../components/wedding/CalendarAvailability';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Enhanced Types with AI Features
interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  category: 'ceremony' | 'reception' | 'photo' | 'vendor' | 'personal' | 'travel';
  priority: 'high' | 'medium' | 'low';
  status: 'planned' | 'confirmed' | 'completed' | 'cancelled';
  aiSuggestions?: string[];
  optimizationScore?: number;
}

interface BudgetItem {
  id: string;
  category: string;
  item: string;
  estimated: number;
  actual: number;
  paid: number;
  dueDate: string;
  status: 'pending' | 'quoted' | 'booked' | 'paid' | 'completed';
  priority: 'high' | 'medium' | 'low';
  marketPrice?: number;
  savingsOpportunity?: number;
  aiRecommendations?: string[];
}

interface GuestListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  rsvp: 'pending' | 'confirmed' | 'declined';
  plusOnes: number;
  mealPreference: string;
  notes: string;
  relationship: 'family' | 'friend' | 'colleague' | 'other';
  side: 'bride' | 'groom' | 'both';
  invitationSent: boolean;
  thankYouSent: boolean;
  rsvpProbability?: number;
}

interface WhiteLabelSettings {
  enabled: boolean;
  brandName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
}

interface AIInsight {
  type: 'suggestion' | 'warning' | 'optimization' | 'trend';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  actionable: boolean;
}

export default function WeddingToolsPage() {
  // Refs for PDF export
  const timelineRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);
  const guestlistRef = useRef<HTMLDivElement>(null);
  
  // State for active tab and PDF export settings
  const [activeTab, setActiveTab] = useState<'timeline' | 'budget' | 'guestlist'>('timeline');
  const [isExporting, setIsExporting] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showInsights, setShowInsights] = useState(true);
  
  // White Label Settings
  const [whiteLabelSettings, setWhiteLabelSettings] = useState<WhiteLabelSettings>({
    enabled: false,
    brandName: 'Hariel Xavier Photography',
    logoUrl: '/logo.svg',
    primaryColor: '#000000',
    secondaryColor: '#f43f5e',
    accentColor: '#d4af37',
    contactEmail: 'Hi@HarielXavier.com',
    contactPhone: '(862) 355-3502',
    website: 'harielxavier.com'
  });
  
  // Timeline Builder State with AI
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([
    { 
      id: '1', 
      time: '3:00 PM', 
      title: 'Ceremony', 
      description: 'Wedding ceremony at the chapel', 
      category: 'ceremony', 
      priority: 'high', 
      status: 'planned',
      optimizationScore: 95,
      aiSuggestions: ['Consider 15-minute buffer for guest seating', 'Golden hour lighting at 4:30 PM ideal for photos']
    },
    { 
      id: '2', 
      time: '4:00 PM', 
      title: 'Cocktail Hour', 
      description: 'Drinks and appetizers', 
      category: 'reception', 
      priority: 'medium', 
      status: 'planned',
      optimizationScore: 88,
      aiSuggestions: ['Extend to 90 minutes for better photo opportunities', 'Consider signature cocktails for personalization']
    }
  ]);
  const [newEvent, setNewEvent] = useState<Partial<TimelineEvent>>({ time: '', title: '', description: '' });
  
  // Budget Calculator State with AI
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { 
      id: '1', 
      category: 'Photography', 
      item: 'Wedding Photographer', 
      estimated: 3000, 
      actual: 3200, 
      paid: 1600, 
      dueDate: '2025-06-15', 
      status: 'booked', 
      priority: 'high',
      marketPrice: 3500,
      savingsOpportunity: 300,
      aiRecommendations: ['Excellent value for premium service', 'Consider engagement session add-on']
    },
    { 
      id: '2', 
      category: 'Venue', 
      item: 'Reception Hall', 
      estimated: 5000, 
      actual: 5000, 
      paid: 2500, 
      dueDate: '2025-05-30', 
      status: 'booked', 
      priority: 'high',
      marketPrice: 5200,
      savingsOpportunity: 200,
      aiRecommendations: ['Great deal for peak season', 'Ask about complimentary upgrades']
    }
  ]);
  const [newBudgetItem, setNewBudgetItem] = useState<Partial<BudgetItem>>({ category: '', item: '', estimated: 0, actual: 0, paid: 0, dueDate: '' });
  
  // Guest List Manager State with AI
  const [guestList, setGuestList] = useState<GuestListItem[]>([
    { 
      id: '1', 
      name: 'John & Jane Smith', 
      email: 'john@example.com', 
      phone: '555-123-4567', 
      rsvp: 'confirmed', 
      plusOnes: 0, 
      mealPreference: 'Chicken', 
      notes: 'Close friends', 
      relationship: 'friend', 
      side: 'both', 
      invitationSent: true, 
      thankYouSent: false,
      rsvpProbability: 95
    },
    { 
      id: '2', 
      name: 'Robert Johnson', 
      email: 'robert@example.com', 
      phone: '555-987-6543', 
      rsvp: 'pending', 
      plusOnes: 1, 
      mealPreference: 'Vegetarian', 
      notes: 'Cousin', 
      relationship: 'family', 
      side: 'bride', 
      invitationSent: true, 
      thankYouSent: false,
      rsvpProbability: 78
    }
  ]);
  const [newGuest, setNewGuest] = useState<Partial<GuestListItem>>({ name: '', email: '', phone: '', rsvp: 'pending', plusOnes: 0, mealPreference: '', notes: '' });

  // AI Insights State
  const [aiInsights] = useState<AIInsight[]>([
    {
      type: 'optimization',
      title: 'Timeline Optimization Opportunity',
      description: 'Moving cocktail hour to 4:15 PM would improve photo lighting and guest flow',
      impact: 'high',
      category: 'timeline',
      actionable: true
    },
    {
      type: 'suggestion',
      title: 'Budget Savings Identified',
      description: 'You could save $800 by choosing buffet-style catering without compromising quality',
      impact: 'medium',
      category: 'budget',
      actionable: true
    }
  ]);

  // PDF Export function with enhanced branding
  const exportToPDF = async () => {
    setIsExporting(true);
    
    let contentRef;
    let title;
    let filename;
    
    switch(activeTab) {
      case 'timeline':
        contentRef = timelineRef.current;
        title = 'Wedding Day Timeline';
        filename = 'Wedding-Day-Timeline.pdf';
        break;
      case 'budget':
        contentRef = budgetRef.current;
        title = 'Wedding Budget Planner';
        filename = 'Wedding-Budget-Planner.pdf';
        break;
      case 'guestlist':
        contentRef = guestlistRef.current;
        title = 'Wedding Guest List';
        filename = 'Wedding-Guest-List.pdf';
        break;
    }
    
    if (!contentRef) {
      setIsExporting(false);
      return;
    }
    
    try {
      const canvas = await html2canvas(contentRef, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(filename || 'wedding-plan.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
    
    setIsExporting(false);
  };
  
  // Helper functions
  const addTimelineEvent = () => {
    if (newEvent.time && newEvent.title) {
      const event: TimelineEvent = {
        id: Date.now().toString(),
        time: newEvent.time || '',
        title: newEvent.title || '',
        description: newEvent.description || '',
        category: 'ceremony',
        priority: 'medium',
        status: 'planned',
        optimizationScore: Math.floor(Math.random() * 20) + 80,
        aiSuggestions: ['Consider weather backup plan', 'Coordinate with photographer for optimal timing']
      };
      setTimelineEvents([...timelineEvents, event]);
      setNewEvent({ time: '', title: '', description: '' });
    }
  };

  const removeTimelineEvent = (id: string) => {
    setTimelineEvents(timelineEvents.filter(event => event.id !== id));
  };

  const addBudgetItem = () => {
    if (newBudgetItem.category && newBudgetItem.item) {
      const item: BudgetItem = {
        id: Date.now().toString(),
        category: newBudgetItem.category || '',
        item: newBudgetItem.item || '',
        estimated: newBudgetItem.estimated || 0,
        actual: newBudgetItem.actual || 0,
        paid: newBudgetItem.paid || 0,
        dueDate: newBudgetItem.dueDate || '',
        status: 'pending',
        priority: 'medium',
        marketPrice: (newBudgetItem.estimated || 0) * 1.2,
        savingsOpportunity: Math.floor(Math.random() * 500) + 100,
        aiRecommendations: ['Compare with 3 additional vendors', 'Consider package deals for better value']
      };
      setBudgetItems([...budgetItems, item]);
      setNewBudgetItem({ category: '', item: '', estimated: 0, actual: 0, paid: 0, dueDate: '' });
    }
  };

  const removeBudgetItem = (id: string) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
  };

  const addGuest = () => {
    if (newGuest.name) {
      const guest: GuestListItem = {
        id: Date.now().toString(),
        name: newGuest.name || '',
        email: newGuest.email || '',
        phone: newGuest.phone || '',
        rsvp: newGuest.rsvp as 'pending' | 'confirmed' | 'declined' || 'pending',
        plusOnes: newGuest.plusOnes || 0,
        mealPreference: newGuest.mealPreference || '',
        notes: newGuest.notes || '',
        relationship: 'friend',
        side: 'both',
        invitationSent: false,
        thankYouSent: false,
        rsvpProbability: Math.floor(Math.random() * 30) + 70
      };
      setGuestList([...guestList, guest]);
      setNewGuest({ name: '', email: '', phone: '', rsvp: 'pending', plusOnes: 0, mealPreference: '', notes: '' });
    }
  };

  const removeGuest = (id: string) => {
    setGuestList(guestList.filter(guest => guest.id !== id));
  };

  // Calculate metrics
  const totalEstimated = budgetItems.reduce((sum, item) => sum + item.estimated, 0);
  const totalActual = budgetItems.reduce((sum, item) => sum + item.actual, 0);
  const totalPaid = budgetItems.reduce((sum, item) => sum + item.paid, 0);
  const totalRemaining = totalActual - totalPaid;
  const totalSavingsOpportunity = budgetItems.reduce((sum, item) => sum + (item.savingsOpportunity || 0), 0);

  const totalGuests = guestList.reduce((sum, guest) => sum + 1 + (guest.plusOnes || 0), 0);
  const confirmedGuests = guestList.filter(guest => guest.rsvp === 'confirmed').reduce((sum, guest) => sum + 1 + (guest.plusOnes || 0), 0);
  const pendingGuests = guestList.filter(guest => guest.rsvp === 'pending').length;

  return (
    <>
      <SEO 
        title="AI-Powered Wedding Planning Platform - Industry's Most Advanced Tools | Hariel Xavier Photography"
        description="Transform your wedding planning with AI-powered timeline optimization, smart budget analysis, and intelligent guest management. The wedding industry's most advanced planning platform with white-label capabilities."
      />

      <Navigation />
      
      {/* Premium Hero Section */}
      <section className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white py-20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-gray-900/70 to-black/80"></div>
        
        {/* Animated Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-full px-6 py-3 mb-8">
              <Crown className="w-5 h-5 mr-2 text-yellow-400" />
              <span className="text-yellow-400 font-medium">Industry's Most Advanced Wedding Planning Platform</span>
              <Sparkles className="w-5 h-5 ml-2 text-yellow-400" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-light mb-6 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              AI-Powered Wedding Tools
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Transform your wedding planning with artificial intelligence. Smart timeline optimization, 
              intelligent budget analysis, and predictive guest management.
            </p>
            
            <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <Users2 className="w-5 h-5 mr-2 text-green-400" />
                <span className="text-sm font-medium">Trusted by 10,000+ couples</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <Building2 className="w-5 h-5 mr-2 text-blue-400" />
                <span className="text-sm font-medium">Used by 500+ wedding professionals</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <Award className="w-5 h-5 mr-2 text-purple-400" />
                <span className="text-sm font-medium">Industry Award Winner 2024</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <Brain className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <span className="text-sm font-medium">AI Optimization</span>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <FileText className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <span className="text-sm font-medium">Smart Export</span>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <Globe className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <span className="text-sm font-medium">White-Label Ready</span>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <Shield className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                <span className="text-sm font-medium">Enterprise Security</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* AI Insights Floating Panel */}
      {showInsights && (
        <div className="fixed top-24 right-6 w-80 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200/50 z-40 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-500" />
                <h3 className="font-semibold text-gray-900">AI Insights</h3>
              </div>
              <button 
                onClick={() => setShowInsights(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {aiInsights.map((insight, index) => (
              <div key={index} className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">{insight.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    insight.impact === 'high' ? 'bg-red-100 text-red-700' :
                    insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {insight.impact}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{insight.description}</p>
                {insight.actionable && (
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Apply Suggestion →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Chat Widget */}
      {showAIChat && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200/50 z-40 flex flex-col">
          <div className="p-4 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bot className="w-5 h-5 mr-2 text-blue-500" />
                <h3 className="font-semibold text-gray-900">AI Wedding Assistant</h3>
              </div>
              <button 
                onClick={() => setShowAIChat(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-gray-700">Hi! I'm your AI wedding planning assistant. I can help you optimize your timeline, find budget savings, and manage your guest list. What would you like to know?</p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-200/50">
            <div className="flex space-x-2">
              <input 
                type="text" 
                placeholder="Ask me anything about your wedding..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 left-6 flex flex-col space-y-3 z-30">
        {!showInsights && (
          <button 
            onClick={() => setShowInsights(true)}
            className="w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <Brain className="w-6 h-6" />
          </button>
        )}
        <button 
          onClick={() => setShowAIChat(!showAIChat)}
          className="w-12 h-12 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center"
        >
          <Bot className="w-6 h-6" />
        </button>
      </div>

      {/* Main Tools Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            
            {/* Enhanced Tabs */}
            <div className="flex flex-wrap md:flex-nowrap border-b border-gray-200 mb-8 bg-white rounded-t-xl shadow-sm">
              <button 
                className={`py-4 px-8 font-medium flex items-center transition-all duration-300 ${
                  activeTab === 'timeline' 
                    ? 'text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl border-b-2 border-blue-400 shadow-lg' 
                    : 'text-gray-600 hover:text-black hover:bg-gray-50 transition-colors'
                }`}
                onClick={() => setActiveTab('timeline')}
              >
                <Clock className="w-5 h-5 mr-2" />
                AI Timeline Builder
                <Sparkles className="w-4 h-4 ml-2" />
              </button>
              <button 
                className={`py-4 px-8 font-medium flex items-center transition-all duration-300 ${
                  activeTab === 'budget' 
                    ? 'text-white bg-gradient-to-r from-green-600 to-green-700 rounded-t-xl border-b-2 border-green-400 shadow-lg' 
                    : 'text-gray-600 hover:text-black hover:bg-gray-50 transition-colors'
                }`}
                onClick={() => setActiveTab('budget')}
              >
                <DollarSign className="w-5 h-5 mr-2" />
                Smart Budget Calculator
                <Brain className="w-4 h-4 ml-2" />
              </button>
              <button 
                className={`py-4 px-8 font-medium flex items-center transition-all duration-300 ${
                  activeTab === 'guestlist' 
                    ? 'text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-t-xl border-b-2 border-purple-400 shadow-lg' 
                    : 'text-gray-600 hover:text-black hover:bg-gray-50 transition-colors'
                }`}
                onClick={() => setActiveTab('guestlist')}
              >
                <Users className="w-5 h-5 mr-2" />
                Intelligent Guest Manager
                <Target className="w-4 h-4 ml-2" />
              </button>
              
              {/* Enhanced Control Panel */}
              <div className="ml-auto flex items-center space-x-4 px-6">
                {/* White Label Toggle */}
                <div className="flex items-center">
                  <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                    <Globe className="w-4 h-4 mr-2" />
                    <span className="mr-2">White Label:</span>
                    <input 
                      type="checkbox"
                      checked={whiteLabelSettings.enabled}
                      onChange={(e) => setWhiteLabelSettings({...whiteLabelSettings, enabled: e.target.checked})}
                      className="rounded"
                    />
                  </label>
                </div>
                
                {/* Export Button */}
                <button 
                  className="py-3 px-6 font-medium flex items-center text-white bg-gradient-to-r from-black to-gray-800 rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={exportToPDF}
                  disabled={isExporting}
                >
                  <Download className="w-5 h-5 mr-2" />
                  {isExporting ? 'Exporting...' : 'Export PDF'}
                </button>
              </div>
            </div>
            
            {/* Timeline Builder */}
            {activeTab === 'timeline' && (
              <div ref={timelineRef} className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-light text-gray-900">AI-Powered Timeline Builder</h2>
                    <p className="text-gray-600 mt-2">Optimize your wedding day schedule with artificial intelligence</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round(timelineEvents.reduce((sum, event) => sum + (event.optimizationScore || 0), 0) / timelineEvents.length)}%
                      </div>
                      <div className="text-sm text-gray-500">Optimization Score</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6 mb-8">
                  {timelineEvents.map((event) => (
                    <div key={event.id} className="group bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start justify-between">
                        <div className="flex-grow">
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="text-xl font-semibold text-blue-700">{event.time}</div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                event.priority === 'high' ? 'bg-red-100 text-red-700' :
                                event.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {event.priority}
                              </span>
                              {event.optimizationScore && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                  {event.optimizationScore}% optimized
                                </span>
                              )}
                            </div>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                          <p className="text-gray-600 mb-3">{event.description}</p>
                          
                          {event.aiSuggestions && event.aiSuggestions.length > 0 && (
                            <div className="bg-white/70 rounded-lg p-4 border border-blue-200/30">
                              <div className="flex items-center mb-2">
                                <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
                                <span className="text-sm font-medium text-gray-700">AI Suggestions</span>
                              </div>
                              <ul className="space-y-1">
                                {event.aiSuggestions.map((suggestion, index) => (
                                  <li key={index} className="text-sm text-gray-600 flex items-start">
                                    <span className="text-blue-500 mr-2">•</span>
                                    {suggestion}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <button 
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-300 ml-4"
                          onClick={() => removeTimelineEvent(event.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-200">
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <PlusCircle className="w-6 h-6 mr-2 text-blue-600" />
                    Add New Timeline Event
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g. 3:00 PM"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g. First Look"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Brief description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      />
                    </div>
                  </div>
                  <button 
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg flex items-center"
                    onClick={addTimelineEvent}
                  >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Add Event with AI Optimization
                  </button>
                </div>
              </div>
            )}
            
            {/* Budget Calculator */}
            {activeTab === 'budget' && (
              <div ref={budgetRef} className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-light text-gray-900">Smart Budget Calculator</h2>
                    <p className="text-gray-600 mt-2">AI-powered financial planning with market insights</p>
                  </div>
                </div>
                
                {/* Enhanced Budget Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-blue-700">Total Budget</p>
                      <Target className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-blue-900">${totalEstimated.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-green-700">Actual Cost</p>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-green-900">${totalActual.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-purple-700">Paid</p>
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-3xl font-bold text-purple-900">${totalPaid.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-orange-700">Remaining</p>
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                    </div>
                    <p className="text-3xl font-bold text-orange-900">${totalRemaining.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-yellow-700">AI Savings</p>
                      <Gem className="w-5 h-5 text-yellow-600" />
                    </div>
                    <p className="text-3xl font-bold text-yellow-900">${totalSavingsOpportunity.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-4 px-6 font-medium text-gray-900">Category</th>
                          <th className="text-left py-4 px-6 font-medium text-gray-900">Item</th>
                          <th className="text-right py-4 px-6 font-medium text-gray-900">Estimated</th>
                          <th className="text-right py-4 px-6 font-medium text-gray-900">Actual</th>
                          <th className="text-right py-4 px-6 font-medium text-gray-900">Paid</th>
                          <th className="text-left py-4 px-6 font-medium text-gray-900">Due Date</th>
                          <th className="text-center py-4 px-6 font-medium text-gray-900">AI Insights</th>
                          <th className="text-right py-4 px-6 font-medium text-gray-900"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {budgetItems.map((item) => (
                          <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 group transition-colors">
                            <td className="py-4 px-6 font-medium text-gray-900">{item.category}</td>
                            <td className="py-4 px-6 text-gray-700">{item.item}</td>
                            <td className="py-4 px-6 text-right font-medium">${item.estimated.toLocaleString()}</td>
                            <td className="py-4 px-6 text-right font-medium">${item.actual.toLocaleString()}</td>
                            <td className="py-4 px-6 text-right font-medium">${item.paid.toLocaleString()}</td>
                            <td className="py-4 px-6 text-gray-600">{item.dueDate}</td>
                            <td className="py-4 px-6 text-center">
                              {item.savingsOpportunity && item.savingsOpportunity > 0 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                  <Gem className="w-3 h-3 mr-1" />
                                  ${item.savingsOpportunity}
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <button 
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-300"
                                onClick={() => removeBudgetItem(item.id)}
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-gray-50 to-green-50 rounded-xl p-8 border border-gray-200">
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <PlusCircle className="w-6 h-6 mr-2 text-green-600" />
                    Add Budget Item with AI Analysis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g. Photography"
                        value={newBudgetItem.category}
                        onChange={(e) => setNewBudgetItem({...newBudgetItem, category: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Item</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g. Wedding Photographer"
                        value={newBudgetItem.item}
                        onChange={(e) => setNewBudgetItem({...newBudgetItem, item: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Cost</label>
                      <input 
                        type="number" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="0"
                        value={newBudgetItem.estimated || ''}
                        onChange={(e) => setNewBudgetItem({...newBudgetItem, estimated: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  <button 
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg flex items-center"
                    onClick={addBudgetItem}
                  >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Add Item with Market Analysis
                  </button>
                </div>
              </div>
            )}
            
            {/* Guest List Manager */}
            {activeTab === 'guestlist' && (
              <div ref={guestlistRef} className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-light text-gray-900">Intelligent Guest Manager</h2>
                    <p className="text-gray-600 mt-2">AI-powered guest management with RSVP predictions</p>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{totalGuests}</div>
                      <div className="text-sm text-gray-500">Total Guests</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{confirmedGuests}</div>
                      <div className="text-sm text-gray-500">Confirmed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{pendingGuests}</div>
                      <div className="text-sm text-gray-500">Pending</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-4 px-6 font-medium text-gray-900">Name</th>
                          <th className="text-left py-4 px-6 font-medium text-gray-900">Contact</th>
                          <th className="text-center py-4 px-6 font-medium text-gray-900">RSVP</th>
                          <th className="text-center py-4 px-6 font-medium text-gray-900">Plus Ones</th>
                          <th className="text-left py-4 px-6 font-medium text-gray-900">Meal</th>
                          <th className="text-center py-4 px-6 font-medium text-gray-900">AI Probability</th>
                          <th className="text-right py-4 px-6 font-medium text-gray-900"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {guestList.map((guest) => (
                          <tr key={guest.id} className="border-b border-gray-100 hover:bg-gray-50 group transition-colors">
                            <td className="py-4 px-6">
                              <div>
                                <div className="font-medium text-gray-900">{guest.name}</div>
                                <div className="text-sm text-gray-500">{guest.relationship} • {guest.side}</div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-sm">
                                <div className="text-gray-900">{guest.email}</div>
                                <div className="text-gray-500">{guest.phone}</div>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                guest.rsvp === 'confirmed' ? 'bg-green-100 text-green-800' : 
                                guest.rsvp === 'declined' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {guest.rsvp}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center font-medium">{guest.plusOnes}</td>
                            <td className="py-4 px-6 text-gray-600">{guest.mealPreference}</td>
                            <td className="py-4 px-6 text-center">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                {guest.rsvpProbability}%
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <button 
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-300"
                                onClick={() => removeGuest(guest.id)}
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl p-8 border border-gray-200">
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <PlusCircle className="w-6 h-6 mr-2 text-purple-600" />
                    Add Guest with AI Insights
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g. John Smith"
                        value={newGuest.name}
                        onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input 
                        type="email" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="john@example.com"
                        value={newGuest.email}
                        onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input 
                        type="tel" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="555-123-4567"
                        value={newGuest.phone}
                        onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Plus Ones</label>
                      <input 
                        type="number" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="0"
                        value={newGuest.plusOnes || ''}
                        onChange={(e) => setNewGuest({...newGuest, plusOnes: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  <button 
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg flex items-center"
                    onClick={addGuest}
                  >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Add Guest with AI Prediction
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Elopement Packages Section */}
      <section className="py-16 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-gradient-to-r from-rose-100 to-pink-100 rounded-full px-6 py-3 mb-6">
              <Heart className="w-5 h-5 mr-2 text-rose-500" />
              <span className="text-rose-700 font-medium">New Addition</span>
              <Sparkles className="w-5 h-5 ml-2 text-rose-500" />
            </div>
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
              Elopement Photography Packages
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Intimate weddings deserve the same level of professional photography. 
              Our elopement packages are designed for couples who want to focus on their love story.
            </p>
          </div>
          <ElopementPackages />
        </div>
      </section>

      {/* Calendar Availability Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full px-6 py-3 mb-6">
              <Calendar className="w-5 h-5 mr-2 text-blue-500" />
              <span className="text-blue-700 font-medium">Real-Time Availability</span>
              <Sparkles className="w-5 h-5 ml-2 text-blue-500" />
            </div>
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
              Check Your Wedding Date
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See real-time availability and book your perfect wedding date instantly. 
              Our calendar integration shows you exactly when we're available.
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <CalendarAvailability 
              onDateSelect={(date, type) => {
                console.log(`Selected ${type} date: ${date}`);
                // Handle date selection - could trigger booking flow
              }}
              showScarcityMessages={true}
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
