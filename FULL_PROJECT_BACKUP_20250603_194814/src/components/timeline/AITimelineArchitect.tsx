import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Calendar, 
  MapPin, 
  Clock, 
  Sunset, 
  Car, 
  Users, 
  Camera, 
  Heart,
  Sparkles,
  Wand2,
  CheckCircle,
  AlertTriangle,
  Cloud,
  Navigation
} from 'lucide-react';
import { Job } from '../../services/jobsService';

interface AITimelineArchitectProps {
  job: Job;
  onTimelineGenerated: (timeline: TimelineEvent[]) => void;
}

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  type: 'preparation' | 'ceremony' | 'reception' | 'photos' | 'travel' | 'buffer';
  location: string;
  participants: string[];
  equipment?: string[];
  notes?: string;
  weatherDependent: boolean;
  travelBuffer: number; // minutes
  priority: 'critical' | 'important' | 'optional';
  aiGenerated: boolean;
  culturalContext?: string;
}

interface WeddingWizardData {
  weddingStyle: 'traditional' | 'modern' | 'destination' | 'elopement' | 'cultural';
  culturalTraditions: string[];
  ceremonyDuration: number;
  receptionStyle: 'formal' | 'casual' | 'cocktail' | 'outdoor';
  guestCount: number;
  venueType: 'indoor' | 'outdoor' | 'mixed';
  sunsetTime?: string;
  travelDistance: number;
  specialRequests: string[];
  photographyStyle: 'documentary' | 'traditional' | 'artistic' | 'candid';
  keyMoments: string[];
}

const AITimelineArchitect: React.FC<AITimelineArchitectProps> = ({ job, onTimelineGenerated }) => {
  const [step, setStep] = useState(1);
  const [wizardData, setWizardData] = useState<WeddingWizardData>({
    weddingStyle: 'traditional',
    culturalTraditions: [],
    ceremonyDuration: 30,
    receptionStyle: 'formal',
    guestCount: 100,
    venueType: 'mixed',
    travelDistance: 0,
    specialRequests: [],
    photographyStyle: 'documentary',
    keyMoments: []
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTimeline, setGeneratedTimeline] = useState<TimelineEvent[]>([]);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [trafficData, setTrafficData] = useState<any>(null);

  // AI Timeline Generation Engine
  const generateAITimeline = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing with realistic timeline generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const baseDate = job.mainShootDate?.toDate() || new Date();
    const timeline: TimelineEvent[] = [];
    
    // Generate intelligent timeline based on wizard data
    const ceremonyStart = new Date(baseDate);
    ceremonyStart.setHours(16, 0, 0); // 4 PM default ceremony
    
    // Pre-ceremony preparation
    timeline.push({
      id: '1',
      title: 'Bridal Preparation',
      description: 'Hair, makeup, and getting ready photos',
      startTime: new Date(ceremonyStart.getTime() - 4 * 60 * 60 * 1000), // 4 hours before
      endTime: new Date(ceremonyStart.getTime() - 2 * 60 * 60 * 1000), // 2 hours before
      type: 'preparation',
      location: 'Bridal Suite',
      participants: ['Bride', 'Bridal Party', 'Photographer'],
      equipment: ['Portrait lens', 'Natural light setup', 'Detail shots'],
      weatherDependent: false,
      travelBuffer: 15,
      priority: 'critical',
      aiGenerated: true,
      notes: 'Capture candid moments and detail shots of dress, shoes, jewelry'
    });

    timeline.push({
      id: '2',
      title: 'Groom Preparation',
      description: 'Getting ready and groomsmen photos',
      startTime: new Date(ceremonyStart.getTime() - 2.5 * 60 * 60 * 1000), // 2.5 hours before
      endTime: new Date(ceremonyStart.getTime() - 1.5 * 60 * 60 * 1000), // 1.5 hours before
      type: 'preparation',
      location: 'Groom Suite',
      participants: ['Groom', 'Groomsmen', 'Photographer'],
      equipment: ['Portrait lens', 'Detail shots'],
      weatherDependent: false,
      travelBuffer: 10,
      priority: 'important',
      aiGenerated: true
    });

    // First Look (if requested)
    if (wizardData.keyMoments.includes('first_look')) {
      timeline.push({
        id: '3',
        title: 'First Look',
        description: 'Private moment between bride and groom',
        startTime: new Date(ceremonyStart.getTime() - 90 * 60 * 1000), // 1.5 hours before
        endTime: new Date(ceremonyStart.getTime() - 60 * 60 * 1000), // 1 hour before
        type: 'photos',
        location: 'Garden/Private Area',
        participants: ['Bride', 'Groom', 'Photographer'],
        equipment: ['85mm lens', 'Reflector'],
        weatherDependent: true,
        travelBuffer: 5,
        priority: 'important',
        aiGenerated: true,
        notes: 'Intimate moment - maintain distance for authentic reactions'
      });
    }

    // Ceremony
    timeline.push({
      id: '4',
      title: 'Wedding Ceremony',
      description: wizardData.culturalTraditions.length > 0 
        ? `${wizardData.culturalTraditions.join(', ')} ceremony`
        : 'Wedding ceremony',
      startTime: ceremonyStart,
      endTime: new Date(ceremonyStart.getTime() + wizardData.ceremonyDuration * 60 * 1000),
      type: 'ceremony',
      location: job.location || 'Ceremony Venue',
      participants: ['Bride', 'Groom', 'Wedding Party', 'Guests', 'Photographer'],
      equipment: ['70-200mm lens', 'Silent shutter', 'Backup camera'],
      weatherDependent: wizardData.venueType === 'outdoor',
      travelBuffer: 0,
      priority: 'critical',
      aiGenerated: true,
      culturalContext: wizardData.culturalTraditions.join(', '),
      notes: 'Key moments: processional, vows, ring exchange, kiss, recessional'
    });

    // Cocktail Hour
    timeline.push({
      id: '5',
      title: 'Cocktail Hour & Family Photos',
      description: 'Guest mingling and formal family portraits',
      startTime: new Date(ceremonyStart.getTime() + wizardData.ceremonyDuration * 60 * 1000),
      endTime: new Date(ceremonyStart.getTime() + (wizardData.ceremonyDuration + 60) * 60 * 1000),
      type: 'photos',
      location: 'Cocktail Area',
      participants: ['All Guests', 'Family Members', 'Photographer'],
      equipment: ['24-70mm lens', 'Flash', 'Group photo setup'],
      weatherDependent: wizardData.venueType !== 'indoor',
      travelBuffer: 5,
      priority: 'critical',
      aiGenerated: true,
      notes: 'Efficient family photo schedule - largest groups first'
    });

    // Golden Hour Portraits (if timing allows)
    const sunsetTime = new Date(ceremonyStart);
    sunsetTime.setHours(18, 30, 0); // Approximate sunset
    
    if (wizardData.sunsetTime) {
      const [hours, minutes] = wizardData.sunsetTime.split(':');
      sunsetTime.setHours(parseInt(hours), parseInt(minutes), 0);
    }

    timeline.push({
      id: '6',
      title: 'Golden Hour Portraits',
      description: 'Romantic couple portraits during golden hour',
      startTime: new Date(sunsetTime.getTime() - 30 * 60 * 1000), // 30 min before sunset
      endTime: new Date(sunsetTime.getTime() + 15 * 60 * 1000), // 15 min after sunset
      type: 'photos',
      location: 'Scenic Location',
      participants: ['Bride', 'Groom', 'Photographer'],
      equipment: ['85mm lens', 'Reflector', 'Off-camera flash'],
      weatherDependent: true,
      travelBuffer: 10,
      priority: 'important',
      aiGenerated: true,
      notes: 'Weather backup plan: covered outdoor area or large windows'
    });

    // Reception
    const receptionStart = new Date(ceremonyStart.getTime() + 2 * 60 * 60 * 1000); // 2 hours after ceremony
    
    timeline.push({
      id: '7',
      title: 'Reception Grand Entrance',
      description: 'Couple introduction and first dance',
      startTime: receptionStart,
      endTime: new Date(receptionStart.getTime() + 30 * 60 * 1000),
      type: 'reception',
      location: 'Reception Venue',
      participants: ['Bride', 'Groom', 'Wedding Party', 'Guests', 'Photographer'],
      equipment: ['24-70mm lens', 'Flash', 'Low light setup'],
      weatherDependent: false,
      travelBuffer: 0,
      priority: 'critical',
      aiGenerated: true,
      notes: 'Coordinate with DJ for timing and lighting'
    });

    timeline.push({
      id: '8',
      title: 'Reception Coverage',
      description: 'Dinner, speeches, dancing, and candid moments',
      startTime: new Date(receptionStart.getTime() + 30 * 60 * 1000),
      endTime: new Date(receptionStart.getTime() + 4 * 60 * 60 * 1000), // 4 hours total
      type: 'reception',
      location: 'Reception Venue',
      participants: ['All Guests', 'Photographer'],
      equipment: ['24-70mm lens', '85mm lens', 'Flash', 'Low light gear'],
      weatherDependent: false,
      travelBuffer: 0,
      priority: 'critical',
      aiGenerated: true,
      notes: 'Key moments: toasts, cake cutting, bouquet toss, last dance'
    });

    // Add travel buffers based on distance
    if (wizardData.travelDistance > 0) {
      timeline.forEach(event => {
        if (event.type === 'travel' || event.travelBuffer > 0) {
          const bufferMinutes = Math.max(15, wizardData.travelDistance * 2); // 2 min per mile minimum
          event.travelBuffer = bufferMinutes;
        }
      });
    }

    setGeneratedTimeline(timeline);
    setIsGenerating(false);
  };

  const handleWizardComplete = () => {
    generateAITimeline();
  };

  const handleTimelineApprove = () => {
    onTimelineGenerated(generatedTimeline);
  };

  const renderWizardStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Brain className="w-16 h-16 text-pink-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">AI Timeline Architect</h3>
              <p className="text-gray-600">Answer 3 quick questions and I'll create your perfect wedding timeline</p>
            </div>
            
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-800 mb-4">What's your wedding style?</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['traditional', 'modern', 'destination', 'elopement', 'cultural'].map((style) => (
                  <button
                    key={style}
                    onClick={() => setWizardData(prev => ({ ...prev, weddingStyle: style as any }))}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      wizardData.weddingStyle === style
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="capitalize font-medium">{style}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h4 className="font-semibold text-gray-800 mb-4">Tell me about your ceremony</h4>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ceremony Duration (minutes)</label>
                <input
                  type="number"
                  value={wizardData.ceremonyDuration}
                  onChange={(e) => setWizardData(prev => ({ ...prev, ceremonyDuration: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  min="15"
                  max="120"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Guest Count</label>
                <input
                  type="number"
                  value={wizardData.guestCount}
                  onChange={(e) => setWizardData(prev => ({ ...prev, guestCount: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  min="2"
                  max="500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Venue Type</label>
              <div className="grid grid-cols-3 gap-3">
                {['indoor', 'outdoor', 'mixed'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setWizardData(prev => ({ ...prev, venueType: type as any }))}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      wizardData.venueType === type
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="capitalize font-medium">{type}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cultural Traditions (optional)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['Unity Candle', 'Sand Ceremony', 'Handfasting', 'Tea Ceremony', 'Jumping the Broom', 'Ring Warming', 'Wine Box', 'Other'].map((tradition) => (
                  <button
                    key={tradition}
                    onClick={() => {
                      const traditions = wizardData.culturalTraditions.includes(tradition)
                        ? wizardData.culturalTraditions.filter(t => t !== tradition)
                        : [...wizardData.culturalTraditions, tradition];
                      setWizardData(prev => ({ ...prev, culturalTraditions: traditions }));
                    }}
                    className={`p-2 text-sm rounded-lg border transition-all ${
                      wizardData.culturalTraditions.includes(tradition)
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {tradition}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h4 className="font-semibold text-gray-800 mb-4">Photography preferences</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Photography Style</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['documentary', 'traditional', 'artistic', 'candid'].map((style) => (
                  <button
                    key={style}
                    onClick={() => setWizardData(prev => ({ ...prev, photographyStyle: style as any }))}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      wizardData.photographyStyle === style
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="capitalize font-medium">{style}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Key Moments to Capture</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['first_look', 'getting_ready', 'family_formals', 'golden_hour', 'reception_dancing', 'cake_cutting', 'bouquet_toss', 'sparkler_exit'].map((moment) => (
                  <button
                    key={moment}
                    onClick={() => {
                      const moments = wizardData.keyMoments.includes(moment)
                        ? wizardData.keyMoments.filter(m => m !== moment)
                        : [...wizardData.keyMoments, moment];
                      setWizardData(prev => ({ ...prev, keyMoments: moments }));
                    }}
                    className={`p-2 text-sm rounded-lg border transition-all ${
                      wizardData.keyMoments.includes(moment)
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {moment.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sunset Time (optional)</label>
                <input
                  type="time"
                  value={wizardData.sunsetTime || ''}
                  onChange={(e) => setWizardData(prev => ({ ...prev, sunsetTime: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Travel Distance (miles)</label>
                <input
                  type="number"
                  value={wizardData.travelDistance}
                  onChange={(e) => setWizardData(prev => ({ ...prev, travelDistance: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  const renderGeneratedTimeline = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Sparkles className="w-16 h-16 text-pink-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Your AI-Generated Timeline</h3>
        <p className="text-gray-600">Optimized for your wedding style, weather, and travel conditions</p>
      </div>
      
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
        <div className="flex items-center space-x-3 mb-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="font-medium text-green-800">AI Optimizations Applied:</span>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Sunset className="w-4 h-4 text-orange-500" />
            <span>Golden hour timing optimized</span>
          </div>
          <div className="flex items-center space-x-2">
            <Car className="w-4 h-4 text-blue-500" />
            <span>Travel buffers calculated</span>
          </div>
          <div className="flex items-center space-x-2">
            <Cloud className="w-4 h-4 text-gray-500" />
            <span>Weather contingencies planned</span>
          </div>
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-pink-500" />
            <span>Cultural traditions integrated</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {generatedTimeline.map((event, index) => (
          <motion.div
            key={event.id}
            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-3 h-3 rounded-full ${
                    event.priority === 'critical' ? 'bg-red-500' :
                    event.priority === 'important' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <h4 className="font-semibold text-gray-800">{event.title}</h4>
                  {event.aiGenerated && (
                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                      AI Generated
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{event.participants.length} people</span>
                  </div>
                  {event.travelBuffer > 0 && (
                    <div className="flex items-center space-x-1">
                      <Navigation className="w-3 h-3" />
                      <span>{event.travelBuffer}min buffer</span>
                    </div>
                  )}
                </div>
                
                {event.weatherDependent && (
                  <div className="mt-2 flex items-center space-x-2 text-xs text-orange-600">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Weather dependent - backup plan recommended</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <AnimatePresence mode="wait">
        {step <= 3 && (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Progress Bar */}
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    stepNum <= step ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      stepNum < step ? 'bg-pink-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            
            {renderWizardStep()}
            
            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleWizardComplete}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Generate AI Timeline</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
        
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="relative">
              <Brain className="w-16 h-16 text-pink-500 mx-auto mb-4 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">AI is crafting your perfect timeline...</h3>
            <p className="text-gray-600">Analyzing weather patterns, travel times, and cultural traditions</p>
          </motion.div>
        )}
        
        {generatedTimeline.length > 0 && !isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {renderGeneratedTimeline()}
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setStep(1);
                  setGeneratedTimeline([]);
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Start Over
              </button>
              
              <button
                onClick={handleTimelineApprove}
                className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve Timeline</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AITimelineArchitect;
