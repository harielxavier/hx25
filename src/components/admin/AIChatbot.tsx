import { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, Sparkles } from 'lucide-react';
import axios from 'axios';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatbotProps {
  analyticsData?: any;
  context?: string;
}

export default function AIChatbot({ analyticsData, context = 'dashboard' }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI analytics assistant powered by Claude. Ask me anything about your website analytics, SEO strategy, or business insights!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Build context for Claude
      let systemContext = 'You are an AI assistant helping with website analytics and business insights for Hariel Xavier Photography, a wedding photography business in Sparta, NJ.';
      
      if (analyticsData) {
        systemContext += `\n\nCurrent Analytics Data:\n${JSON.stringify(analyticsData, null, 2)}`;
      }

      // For now, we'll use a mock response since we need backend API
      // In production, you'd call your backend which then calls Claude API
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const assistantMessage: Message = {
        role: 'assistant',
        content: getMockResponse(input, analyticsData),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling AI:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Mock responses - replace with actual Claude API call from backend
  const getMockResponse = (question: string, data: any): string => {
    const lowerQ = question.toLowerCase();

    if (lowerQ.includes('traffic') || lowerQ.includes('visitors')) {
      return `Based on your current analytics, you have ${data?.totalVisitors || 0} visitors. ${data?.totalVisitors > 100 ? 'That\'s great traffic! Focus on converting these visitors into leads.' : 'Let\'s work on increasing your traffic. I recommend publishing 2 blog posts per week and optimizing your Google Business Profile.'}`;
    }

    if (lowerQ.includes('seo') || lowerQ.includes('ranking')) {
      return 'For SEO improvement:\n\n1. **Content**: Publish 8-12 blog posts/month targeting keywords like "wedding photographer sparta nj"\n2. **Reviews**: Aim for 100+ Google reviews in 90 days\n3. **Backlinks**: Partner with 5-10 NJ wedding venues\n4. **Local SEO**: Optimize your Google Business Profile with 100+ photos\n\nWant detailed steps for any of these?';
    }

    if (lowerQ.includes('booking') || lowerQ.includes('conversion')) {
      return 'To increase bookings:\n\n1. **Speed**: Respond to inquiries within 1 hour\n2. **Social Proof**: Display 5-star reviews prominently\n3. **Pricing**: Add clear pricing ranges on website\n4. **CTA**: Make "Book Now" buttons more visible\n5. **Follow-up**: Auto-email leads who don\'t book within 3 days\n\nYour current conversion rate can improve by 30-50% with these changes.';
    }

    if (lowerQ.includes('revenue') || lowerQ.includes('money') || lowerQ.includes('profit')) {
      return `With ${data?.totalVisitors || 0} monthly visitors:\n\n- **Conservative** (2% conversion): ${Math.floor((data?.totalVisitors || 0) * 0.02)} leads/month\n- **Optimized** (5% conversion): ${Math.floor((data?.totalVisitors || 0) * 0.05)} leads/month\n\nAt $3,500 average booking and 50% close rate:\n- Conservative revenue: $${Math.floor((data?.totalVisitors || 0) * 0.02 * 0.5 * 3500).toLocaleString()}/month\n- Optimized revenue: $${Math.floor((data?.totalVisitors || 0) * 0.05 * 0.5 * 3500).toLocaleString()}/month\n\nFocus on increasing traffic + conversion rate!`;
    }

    if (lowerQ.includes('social') || lowerQ.includes('instagram')) {
      return 'Social media strategy for photographers:\n\n📸 **Instagram**:\n- Post 5-7x/week (mix of weddings, BTS, tips)\n- Use location tags (Sparta NJ, Sussex County)\n- 25-30 hashtags per post\n- Reels 2x/week for reach\n\n📘 **Facebook**:\n- Join NJ wedding groups\n- Post client testimonials\n- Run targeted ads to engaged couples 25-35\n\nWant specific caption templates or hashtag lists?';
    }

    if (lowerQ.includes('help') || lowerQ.includes('what can you')) {
      return 'I can help you with:\n\n📊 **Analytics**: Interpret your website data\n🎯 **SEO**: Keyword strategy and ranking tips\n💰 **Revenue**: Calculate potential earnings\n📱 **Social Media**: Content strategy and posting schedule\n📝 **Content**: Blog post ideas and topics\n🎨 **Marketing**: Campaign ideas and ad strategies\n📈 **Growth**: Actionable steps to scale your business\n\nJust ask me anything!';
    }

    return 'That\'s a great question! Based on your business:\n\n1. Focus on local SEO (Sparta NJ, Sussex County keywords)\n2. Generate 100+ Google reviews in next 90 days\n3. Publish 2 blog posts per week\n4. Optimize your Google Business Profile\n5. Partner with local wedding venues for backlinks\n\nWant me to dive deeper into any of these strategies?';
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-transform z-50 group"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6" />
          <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
        </div>
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Ask AI Assistant
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Sparkles className="w-6 h-6" />
            <div className="absolute inset-0 animate-ping">
              <Sparkles className="w-6 h-6 opacity-75" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold">AI Analytics Assistant</h3>
            <p className="text-xs opacity-90">Powered by Claude</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-white/20 rounded-full p-1 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white text-gray-800 shadow-md'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl px-4 py-3 shadow-md">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-2 hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Powered by Claude AI · Ask about SEO, traffic, revenue, or marketing
        </p>
      </div>
    </div>
  );
}
