import React, { useState } from 'react';
import { Bot, Send, Loader2, Sparkles } from 'lucide-react';
import { grokAI, GrokServicePricingPackage } from '../../services/ai/GrokAIService';

interface SarahAIWidgetProps {
  allPackages: GrokServicePricingPackage[];
}

const questions = [
  { id: 'celebrationType', prompt: "Let's start with your vision - are you planning an intimate elopement (just the two of you or under 50 guests) or a traditional wedding celebration?" },
  { id: 'guestCount', prompt: "Perfect! How many loved ones will be celebrating with you? This helps me understand the scale of coverage you'll need." },
  { id: 'weddingStyle', prompt: "What's the aesthetic that speaks to your heart? (e.g., timeless elegance, rustic romance, modern luxury, bohemian chic, adventurous outdoor)" },
  { id: 'venueType', prompt: "Tell me about your venue - is it indoor elegance, natural outdoor beauty, or a mix of both?" },
  { id: 'priorities', prompt: "What matters most to you in your wedding photography? (e.g., capturing candid moments, artistic portraits, family traditions, social media content)" },
  { id: 'timeline', prompt: "How many hours of coverage are you envisioning for your special day?" },
  { id: 'budget', prompt: "To ensure I recommend the perfect collection for you, what investment range feels comfortable? (This helps me tailor my suggestions to your vision)" },
  { id: 'specialElements', prompt: "Any special elements I should know about? (e.g., multiple locations, cultural traditions, specific must-have shots, pets)" }
];

const SarahAIWidget: React.FC<SarahAIWidgetProps> = ({ allPackages }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showChatFlow, setShowChatFlow] = useState(false);
  const [chatComplete, setChatComplete] = useState(false);

  const handleStartChat = () => {
    setShowChatFlow(true);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setCurrentAnswer('');
    setAiSuggestion('');
    setError('');
    setChatComplete(false);
  };

  const handleNextQuestion = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentAnswer.trim() && questions[currentQuestionIndex]?.id !== 'budget') { // Budget can be skipped
      setError(`Please provide an answer for Sarah to consider, or type 'skip' if you're unsure.`);
      return;
    }
    setError('');
    
    const newAnswers = { ...answers, [questions[currentQuestionIndex].id]: currentAnswer };
    setAnswers(newAnswers);
    setCurrentAnswer('');

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered, now get suggestion
      setChatComplete(true);
      setIsLoading(true);
      const compiledInput = `Celebration Type: ${newAnswers.celebrationType || 'Not specified'}. Guest Count: ${newAnswers.guestCount || 'Not specified'}. Wedding Style: ${newAnswers.weddingStyle || 'Not specified'}. Venue Type: ${newAnswers.venueType || 'Not specified'}. Priorities: ${newAnswers.priorities || 'Not specified'}. Timeline: ${newAnswers.timeline || 'Not specified'}. Budget: ${newAnswers.budget || 'Not specified'}. Special Elements: ${newAnswers.specialElements || 'None'}.`;
      try {
        const suggestion = await grokAI.getAISuggestion(compiledInput, allPackages);
        setAiSuggestion(suggestion);
      } catch (err: any) {
        setError('Oh dear! Sarah seems to be having a moment. Please try again, or explore the collections manually.');
        console.error("Sarah AI Error:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl border border-gray-200 w-full max-w-2xl mx-auto transition-all duration-500">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
        <Bot className="w-20 h-20 md:w-24 md:h-24 text-champagneRose shrink-0 bg-rose-50 p-4 rounded-full" />
        <div className="text-center sm:text-left">
          <h3 className="text-2xl md:text-3xl font-serif text-gray-800 mb-2">Meet Sarah, Your Personal Wedding Guide!</h3>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            Overwhelmed by choices? I'm Sarah, your friendly AI concierge! Tell me about your dream day – your style, guest count, must-haves – and I'll help find the Hariel Xavier collection that's a perfect match for your vision and budget. It's quick, easy, and all about you!
          </p>
        </div>
      </div>

      {!showChatFlow && (
        <div className="text-center mt-6">
          <button
            onClick={handleStartChat}
            className="bg-champagneRose text-black px-8 py-3.5 rounded-lg hover:bg-rose-400 transition-colors font-semibold text-base hover:shadow-lg transform hover:scale-105 flex items-center justify-center mx-auto"
          >
            <Sparkles className="inline-block w-5 h-5 mr-2 -mt-0.5" />
            Chat with Sarah for a Recommendation
          </button>
        </div>
      )}

      {showChatFlow && !chatComplete && (
        <form onSubmit={handleNextQuestion} className="mt-6 space-y-4">
          <div className="p-4 bg-rose-50 rounded-lg">
            <p className="text-gray-700 text-md mb-2 font-medium">{questions[currentQuestionIndex].prompt}</p>
            <input
              type="text"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-champagneRose focus:border-transparent transition-shadow text-sm"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold text-base flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : "Get Sarah's Advice"}
            <Send className="w-4 h-4 ml-1" />
          </button>
        </form>
      )}

      {isLoading && chatComplete && (
        <div className="mt-6 flex flex-col items-center justify-center p-6 bg-rose-50 rounded-lg">
          <Loader2 className="animate-spin w-8 h-8 text-champagneRose mb-3" />
          <p className="text-gray-700 font-medium">Sarah is crafting your personalized recommendation...</p>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      {!isLoading && chatComplete && aiSuggestion && !error && (
        <div className="mt-6 p-8 bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-200 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-rose-600" />
            <h4 className="font-serif text-2xl text-gray-800">Sarah's Recommendation</h4>
          </div>
          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-6 text-base">{aiSuggestion}</div>
          
          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <a
                href="https://calendly.com/harielxavierphotography/hariel-xavier-photography-meeting"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold rounded-lg hover:from-rose-600 hover:to-amber-600 transition-all duration-300 text-sm"
              >
                📅 Schedule Call
              </a>
              <button
                onClick={() => {
                  const packagesSection = document.getElementById('collections-title');
                  if (packagesSection) {
                    packagesSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex items-center justify-center px-4 py-3 bg-white border-2 border-rose-300 text-rose-700 font-semibold rounded-lg hover:bg-rose-50 transition-all duration-300 text-sm"
              >
                📋 View All Packages
              </button>
              <button
                onClick={() => {
                  const contactForm = document.getElementById('contact-form') || document.querySelector('iframe[id*="sn-form"]');
                  if (contactForm) {
                    contactForm.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex items-center justify-center px-4 py-3 bg-white border-2 border-rose-300 text-rose-700 font-semibold rounded-lg hover:bg-rose-50 transition-all duration-300 text-sm"
              >
                ✉️ Contact Form
              </button>
            </div>
            
            <div className="text-center">
              <button
                onClick={handleStartChat}
                className="text-sm text-rose-600 hover:text-rose-800 hover:underline font-medium"
              >
                Ask Sarah a different question?
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SarahAIWidget;
