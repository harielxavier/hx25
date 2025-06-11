import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Phone,
  CheckCircle,
  Bot,
  User,
  Sparkles,
  Zap,
  Coffee,
  Camera
} from 'lucide-react';

interface ConversationalSchedulerProps {
  clientId: string;
  onMeetingScheduled: (meeting: ScheduledMeeting) => void;
}

interface ScheduledMeeting {
  id: string;
  title: string;
  type: 'consultation' | 'planning' | 'review' | 'delivery';
  dateTime: Date;
  duration: number;
  location: 'in_person' | 'zoom' | 'phone';
  meetingUrl?: string;
  notes?: string;
  agenda: string[];
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  content: string;
  timestamp: Date;
  type: 'text' | 'options' | 'calendar' | 'confirmation';
  options?: string[];
  suggestedTimes?: Date[];
  meetingData?: Partial<ScheduledMeeting>;
}

const ConversationalScheduler: React.FC<ConversationalSchedulerProps> = ({ 
  clientId, 
  onMeetingScheduled 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState<'greeting' | 'type' | 'timing' | 'location' | 'confirmation'>('greeting');
  const [meetingData, setMeetingData] = useState<Partial<ScheduledMeeting>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Available time slots (in real app, this would come from calendar API)
  const availableSlots = [
    new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
  ];

  useEffect(() => {
    // Initialize conversation
    addBotMessage(
      "Hi! I'm your AI scheduling assistant. I can help you book a meeting with Hariel. What would you like to discuss?",
      'options',
      ['Initial Consultation', 'Wedding Planning Session', 'Photo Review Meeting', 'Album Delivery']
    );
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addBotMessage = (
    content: string, 
    type: ChatMessage['type'] = 'text', 
    options?: string[], 
    suggestedTimes?: Date[],
    meetingData?: Partial<ScheduledMeeting>
  ) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const message: ChatMessage = {
        id: Date.now().toString(),
        sender: 'bot',
        content,
        timestamp: new Date(),
        type,
        options,
        suggestedTimes,
        meetingData
      };
      
      setMessages(prev => [...prev, message]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Realistic typing delay
  };

  const addUserMessage = (content: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content,
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, message]);
  };

  const handleOptionSelect = (option: string) => {
    addUserMessage(option);
    
    switch (currentStep) {
      case 'greeting':
        handleMeetingTypeSelection(option);
        break;
      case 'location':
        handleLocationSelection(option);
        break;
      default:
        break;
    }
  };

  const handleMeetingTypeSelection = (type: string) => {
    let meetingType: ScheduledMeeting['type'];
    let duration = 60;
    let agenda: string[] = [];

    switch (type) {
      case 'Initial Consultation':
        meetingType = 'consultation';
        duration = 60;
        agenda = ['Discuss your vision', 'Review packages', 'Answer questions', 'Next steps'];
        break;
      case 'Wedding Planning Session':
        meetingType = 'planning';
        duration = 90;
        agenda = ['Timeline planning', 'Shot list review', 'Vendor coordination', 'Final details'];
        break;
      case 'Photo Review Meeting':
        meetingType = 'review';
        duration = 45;
        agenda = ['Review edited photos', 'Select favorites', 'Discuss any adjustments'];
        break;
      case 'Album Delivery':
        meetingType = 'delivery';
        duration = 30;
        agenda = ['Album presentation', 'Care instructions', 'Additional prints discussion'];
        break;
      default:
        meetingType = 'consultation';
    }

    setMeetingData(prev => ({
      ...prev,
      type: meetingType,
      title: type,
      duration,
      agenda
    }));

    setCurrentStep('timing');
    
    addBotMessage(
      `Perfect! I'll help you schedule a ${duration}-minute ${type.toLowerCase()}. When would work best for you?`,
      'calendar',
      undefined,
      availableSlots
    );
  };

  const handleTimeSelection = (selectedTime: Date) => {
    addUserMessage(selectedTime.toLocaleDateString() + ' at ' + selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    
    setMeetingData(prev => ({
      ...prev,
      dateTime: selectedTime
    }));

    setCurrentStep('location');
    
    addBotMessage(
      "Great choice! How would you prefer to meet?",
      'options',
      ['In Person (Studio)', 'Video Call (Zoom)', 'Phone Call']
    );
  };

  const handleLocationSelection = (location: string) => {
    let locationType: ScheduledMeeting['location'];
    let meetingUrl: string | undefined;

    switch (location) {
      case 'In Person (Studio)':
        locationType = 'in_person';
        break;
      case 'Video Call (Zoom)':
        locationType = 'zoom';
        meetingUrl = 'https://zoom.us/j/meeting-room-id'; // Would be generated
        break;
      case 'Phone Call':
        locationType = 'phone';
        break;
      default:
        locationType = 'zoom';
    }

    const finalMeetingData: ScheduledMeeting = {
      id: Date.now().toString(),
      title: meetingData.title || 'Meeting',
      type: meetingData.type || 'consultation',
      dateTime: meetingData.dateTime || new Date(),
      duration: meetingData.duration || 60,
      location: locationType,
      meetingUrl,
      agenda: meetingData.agenda || []
    };

    setMeetingData(finalMeetingData);
    setCurrentStep('confirmation');

    addBotMessage(
      "Perfect! Let me confirm your meeting details:",
      'confirmation',
      undefined,
      undefined,
      finalMeetingData
    );
  };

  const handleConfirmMeeting = () => {
    if (meetingData as ScheduledMeeting) {
      onMeetingScheduled(meetingData as ScheduledMeeting);
      addBotMessage(
        "🎉 Your meeting has been scheduled! You'll receive a calendar invitation shortly. Looking forward to speaking with you!"
      );
    }
  };

  const handleUserInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    addUserMessage(userInput);
    
    // Simple NLP for natural language processing
    const input = userInput.toLowerCase();
    
    if (input.includes('tuesday') || input.includes('wednesday') || input.includes('thursday')) {
      // Handle natural language date requests
      addBotMessage("I understand you'd prefer a weekday. Let me show you available times:");
      // Would integrate with actual calendar API
    } else if (input.includes('morning') || input.includes('afternoon') || input.includes('evening')) {
      addBotMessage("Got it! I'll prioritize those time slots for you.");
    } else {
      addBotMessage("I understand. Let me help you with that!");
    }
    
    setUserInput('');
  };

  const renderMessage = (message: ChatMessage) => {
    const isBot = message.sender === 'bot';
    
    return (
      <motion.div
        key={message.id}
        className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isBot ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-gray-300'
          }`}>
            {isBot ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-gray-600" />}
          </div>
          
          <div className={`rounded-2xl px-4 py-3 ${
            isBot ? 'bg-gray-100 text-gray-800' : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
          }`}>
            <p className="text-sm">{message.content}</p>
            
            {message.type === 'options' && message.options && (
              <div className="mt-3 space-y-2">
                {message.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    className="block w-full text-left px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-800 text-sm"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
            
            {message.type === 'calendar' && message.suggestedTimes && (
              <div className="mt-3 space-y-2">
                {message.suggestedTimes.map((time, index) => (
                  <button
                    key={index}
                    onClick={() => handleTimeSelection(time)}
                    className="block w-full text-left px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-800 text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{time.toLocaleDateString()}</span>
                      <Clock className="w-4 h-4" />
                      <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {message.type === 'confirmation' && message.meetingData && (
              <div className="mt-3 bg-white rounded-lg p-4 text-gray-800">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Camera className="w-4 h-4 text-pink-500" />
                    <span className="font-medium">{message.meetingData.title}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>{message.meetingData.dateTime?.toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span>{message.meetingData.dateTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({message.meetingData.duration} minutes)</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {message.meetingData.location === 'zoom' && <Video className="w-4 h-4 text-purple-500" />}
                    {message.meetingData.location === 'phone' && <Phone className="w-4 h-4 text-orange-500" />}
                    {message.meetingData.location === 'in_person' && <MapPin className="w-4 h-4 text-red-500" />}
                    <span className="capitalize">{message.meetingData.location?.replace('_', ' ')}</span>
                  </div>
                  
                  {message.meetingData.agenda && message.meetingData.agenda.length > 0 && (
                    <div>
                      <p className="font-medium text-sm mb-2">Agenda:</p>
                      <ul className="text-sm space-y-1">
                        {message.meetingData.agenda.map((item, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => {
                      setCurrentStep('greeting');
                      setMeetingData({});
                      setMessages([]);
                      addBotMessage("Let's start over. What type of meeting would you like to schedule?", 'options', ['Initial Consultation', 'Wedding Planning Session', 'Photo Review Meeting', 'Album Delivery']);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Start Over
                  </button>
                  
                  <button
                    onClick={handleConfirmMeeting}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors text-sm"
                  >
                    Confirm Meeting
                  </button>
                </div>
              </div>
            )}
            
            <div className="text-xs opacity-75 mt-2">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">AI Scheduling Assistant</h3>
            <p className="text-pink-100">Book your meeting in seconds with natural conversation</p>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="h-96 overflow-y-auto p-6 bg-gray-50">
        {messages.map(renderMessage)}
        
        {isTyping && (
          <motion.div
            className="flex justify-start mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleUserInput} className="flex items-center space-x-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message or use the buttons above..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!userInput.trim()}
            className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:from-pink-600 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        
        <div className="flex items-center justify-center mt-3 space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Zap className="w-3 h-3" />
            <span>Instant booking</span>
          </div>
          <div className="flex items-center space-x-1">
            <Coffee className="w-3 h-3" />
            <span>Natural conversation</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-3 h-3" />
            <span>Auto calendar sync</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationalScheduler;
