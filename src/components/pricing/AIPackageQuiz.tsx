/**
 * Sarah AI-Powered Package Quiz Component
 * 
 * Interactive quiz featuring Sarah, our AI wedding expert, that uses Grok AI 
 * to recommend the perfect photography package based on couple's preferences and needs.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Users, 
  MapPin, 
  Camera, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Star,
  Zap
} from 'lucide-react';
import { grokAI, QuizResponse, PackageRecommendation } from '../../services/ai/GrokAIService';
import SarahAvatar from '../icons/SarahAvatar';

// Slider with nudging component
const SliderWithNudge: React.FC<{
  step: QuizStep;
  currentValue: any;
  onAnswer: (value: any) => void;
}> = ({ step, currentValue, onAnswer }) => {
  const [showNudge, setShowNudge] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (!hasInteracted && !currentValue) {
      const timer = setTimeout(() => {
        setShowNudge(true);
      }, 5000); // Show nudge after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [hasInteracted, currentValue]);

  const handleSliderChange = (value: number) => {
    setHasInteracted(true);
    setShowNudge(false);
    onAnswer(value);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className="text-4xl font-bold text-gray-800">
          {currentValue || step.min || 50}
        </span>
        <span className="text-lg text-gray-600 ml-2">guests</span>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={step.min}
          max={step.max}
          value={currentValue || step.min || 50}
          onChange={(e) => handleSliderChange(parseInt(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #9333ea 0%, #ec4899 ${((currentValue || step.min || 50) - (step.min || 0)) / ((step.max || 300) - (step.min || 0)) * 100}%, #e5e7eb ${((currentValue || step.min || 50) - (step.min || 0)) / ((step.max || 300) - (step.min || 0)) * 100}%, #e5e7eb 100%)`
          }}
        />
        
        {/* Nudge Animation */}
        <AnimatePresence>
          {showNudge && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg"
            >
              <div className="flex items-center space-x-2">
                <span>👆 Drag the slider to set your guest count</span>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-purple-600"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex justify-between text-sm text-gray-500">
        <span>{step.min} guests</span>
        <span>{step.max}+ guests</span>
      </div>
      
      {/* Quick selection buttons */}
      <div className="flex justify-center space-x-2 mt-4">
        {[50, 100, 150, 200].map((value) => (
          <button
            key={value}
            onClick={() => handleSliderChange(value)}
            className={`px-3 py-1 rounded-full text-xs transition-all duration-200 ${
              currentValue === value
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
};

interface QuizStep {
  id: string;
  question: string;
  description?: string;
  type: 'single' | 'multiple' | 'range' | 'text';
  options?: { value: string; label: string; icon?: React.ReactNode }[];
  min?: number;
  max?: number;
  required: boolean;
}

const quizSteps: QuizStep[] = [
  {
    id: 'guestCount',
    question: 'How many guests will celebrate with you?',
    description: 'This helps us understand the scale and coverage needed for your special day.',
    type: 'range',
    min: 10,
    max: 300,
    required: true
  },
  {
    id: 'venueType',
    question: 'What type of venue speaks to your heart?',
    description: 'Different venues require different photography approaches and equipment.',
    type: 'single',
    options: [
      { value: 'indoor', label: 'Indoor Elegance', icon: <Heart className="w-5 h-5" /> },
      { value: 'outdoor', label: 'Natural Beauty', icon: <MapPin className="w-5 h-5" /> },
      { value: 'mixed', label: 'Best of Both', icon: <Sparkles className="w-5 h-5" /> },
      { value: 'destination', label: 'Destination Dream', icon: <Star className="w-5 h-5" /> }
    ],
    required: true
  },
  {
    id: 'budgetRange',
    question: 'What investment range feels comfortable?',
    description: 'We want to recommend packages that align with your vision and budget.',
    type: 'single',
    options: [
      { value: 'under-3k', label: 'Under $3,000', icon: <Heart className="w-5 h-5" /> },
      { value: '3k-5k', label: '$3,000 - $5,000', icon: <Camera className="w-5 h-5" /> },
      { value: '5k-8k', label: '$5,000 - $8,000', icon: <Sparkles className="w-5 h-5" /> },
      { value: 'above-8k', label: '$8,000+', icon: <Star className="w-5 h-5" /> }
    ],
    required: true
  },
  {
    id: 'weddingStyle',
    question: 'How would you describe your wedding style?',
    description: 'Your style helps us understand the mood and approach for your photos.',
    type: 'single',
    options: [
      { value: 'traditional', label: 'Classic & Traditional', icon: <Heart className="w-5 h-5" /> },
      { value: 'modern', label: 'Modern & Chic', icon: <Zap className="w-5 h-5" /> },
      { value: 'rustic', label: 'Rustic & Natural', icon: <MapPin className="w-5 h-5" /> },
      { value: 'luxury', label: 'Luxury & Glamorous', icon: <Star className="w-5 h-5" /> },
      { value: 'intimate', label: 'Intimate & Personal', icon: <Users className="w-5 h-5" /> }
    ],
    required: true
  },
  {
    id: 'socialFocus',
    question: 'How important is social media sharing?',
    description: 'This influences our recommendations for quick turnaround and social-ready content.',
    type: 'single',
    options: [
      { value: 'low', label: 'Not Important', icon: <Heart className="w-5 h-5" /> },
      { value: 'medium', label: 'Somewhat Important', icon: <Camera className="w-5 h-5" /> },
      { value: 'high', label: 'Very Important', icon: <Sparkles className="w-5 h-5" /> }
    ],
    required: true
  },
  {
    id: 'photographyPriority',
    question: 'What matters most to you about your wedding photos?',
    description: 'Understanding your priorities helps us recommend the perfect package.',
    type: 'single',
    options: [
      { value: 'memories', label: 'Capturing Precious Memories', icon: <Heart className="w-5 h-5" /> },
      { value: 'social-sharing', label: 'Beautiful Social Content', icon: <Sparkles className="w-5 h-5" /> },
      { value: 'family-heirloom', label: 'Family Heirloom Albums', icon: <Star className="w-5 h-5" /> },
      { value: 'artistic', label: 'Artistic Expression', icon: <Camera className="w-5 h-5" /> }
    ],
    required: true
  },
  {
    id: 'specialNeeds',
    question: 'Any special considerations for your day?',
    description: 'Let us know about any unique aspects we should consider.',
    type: 'multiple',
    options: [
      { value: 'large-family', label: 'Large Family Groups' },
      { value: 'multiple-locations', label: 'Multiple Locations' },
      { value: 'cultural-traditions', label: 'Cultural Traditions' },
      { value: 'accessibility', label: 'Accessibility Needs' },
      { value: 'pets', label: 'Pets in Photos' },
      { value: 'drone-shots', label: 'Aerial/Drone Shots' }
    ],
    required: false
  }
];

interface AIPackageQuizProps {
  onComplete?: (packageId: string) => void;
}

const AIPackageQuiz: React.FC<AIPackageQuizProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizResponse>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<PackageRecommendation | null>(null);
  const [showResults, setShowResults] = useState(false);

  const currentQuizStep = quizSteps[currentStep];
  const isLastStep = currentStep === quizSteps.length - 1;
  const canProceed = currentQuizStep.required ? answers[currentQuizStep.id as keyof QuizResponse] !== undefined : true;

  const handleAnswer = (value: any) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuizStep.id]: value
    }));
  };

  const handleNext = async () => {
    if (isLastStep) {
      await submitQuiz();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const submitQuiz = async () => {
    setIsLoading(true);
    
    try {
      // Prepare quiz data for AI
      const quizData: QuizResponse = {
        guestCount: answers.guestCount || 100,
        venueType: answers.venueType || 'mixed',
        budgetRange: answers.budgetRange || '3k-5k',
        socialFocus: answers.socialFocus || 'medium',
        specialNeeds: answers.specialNeeds || [],
        weddingStyle: answers.weddingStyle || 'modern',
        photographyPriority: answers.photographyPriority || 'memories',
        timelineFlexibility: 'flexible' // Default value
      };

      const result = await grokAI.getPackageRecommendation(quizData);
      setRecommendation(result);
      setShowResults(true);
    } catch (error) {
      console.error('Error getting recommendation:', error);
      // Show fallback recommendation
      setRecommendation({
        recommendedPackage: 'timeless',
        confidence: 85,
        reasoning: 'Based on your preferences, The Timeless package offers excellent value with engagement session included.',
        suggestedAddOns: [],
        personalizedMessage: 'We\'d love to discuss how we can make your wedding photography perfect!'
      });
      setShowResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setRecommendation(null);
    setShowResults(false);
  };

  const renderQuestionInput = () => {
    const step = currentQuizStep;
    const currentValue = answers[step.id as keyof QuizResponse];

    switch (step.type) {
      case 'single':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {step.options?.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(option.value)}
                className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                  currentValue === option.value
                    ? 'border-rose-400 bg-gradient-to-br from-rose-50 to-amber-50 shadow-lg'
                    : 'border-rose-200 hover:border-rose-300 hover:shadow-md hover:bg-rose-50/30'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {option.icon && (
                    <div className={`p-2 rounded-full ${
                      currentValue === option.value 
                        ? 'bg-gradient-to-r from-rose-400 to-amber-400 text-white' 
                        : 'bg-rose-100 text-rose-600'
                    }`}>
                      {option.icon}
                    </div>
                  )}
                  <span className="font-medium text-gray-800">{option.label}</span>
                </div>
              </motion.button>
            ))}
          </div>
        );

      case 'multiple':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {step.options?.map((option) => {
              const isSelected = (currentValue as string[] || []).includes(option.value);
              return (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const current = (currentValue as string[]) || [];
                    const updated = isSelected
                      ? current.filter(v => v !== option.value)
                      : [...current, option.value];
                    handleAnswer(updated);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className="font-medium">{option.label}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        );

      case 'range':
        return (
          <SliderWithNudge 
            step={step}
            currentValue={currentValue}
            onAnswer={handleAnswer}
          />
        );

      default:
        return null;
    }
  };

  if (showResults && recommendation) {
    return <QuizResults recommendation={recommendation} onReset={resetQuiz} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Sarah's Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <SarahAvatar size="lg" animated={true} className="mr-4" />
          <div className="text-left">
            <h3 className="font-serif text-xl text-rose-800 mb-1">Sarah is here to help!</h3>
            <p className="text-rose-600 text-sm">Your AI Wedding Expert</p>
          </div>
        </div>
        <p className="text-gray-600 max-w-md mx-auto">
          I'll ask you a few questions to find your perfect photography package. Let's get started!
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-rose-600">
            Question {currentStep + 1} of {quizSteps.length}
          </span>
          <span className="text-sm font-medium text-rose-600">
            {Math.round(((currentStep + 1) / quizSteps.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-rose-100 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-rose-400 to-amber-400 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / quizSteps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">
              {currentQuizStep.question}
            </h2>
            {currentQuizStep.description && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {currentQuizStep.description}
              </p>
            )}
          </div>

          <div className="space-y-6">
            {renderQuestionInput()}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-12">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
            currentStep === 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>

        <button
          onClick={handleNext}
          disabled={!canProceed || isLoading}
          className={`flex items-center space-x-2 px-8 py-3 rounded-full transition-all duration-300 ${
            canProceed && !isLoading
              ? 'bg-gradient-to-r from-rose-400 to-amber-400 text-white hover:from-rose-500 hover:to-amber-500 shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Sarah is analyzing your answers...</span>
            </>
          ) : (
            <>
              <span>{isLastStep ? 'Ask Sarah for My Perfect Package!' : 'Next'}</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Results Component
const QuizResults: React.FC<{
  recommendation: PackageRecommendation;
  onReset: () => void;
}> = ({ recommendation, onReset }) => {
  const packageDetails = {
    essential: { name: 'The Essential', price: '$2,395', color: 'blue' },
    timeless: { name: 'The Timeless', price: '$2,995', color: 'green' },
    heritage: { name: 'The Heritage', price: '$3,895', color: 'purple' },
    masterpiece: { name: 'The Masterpiece', price: '$5,395', color: 'gold' }
  };

  const recommended = packageDetails[recommendation.recommendedPackage];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6 space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full"
        >
          <Sparkles className="w-8 h-8 text-green-600" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-800">
          Perfect! We Found Your Ideal Package
        </h2>
        <p className="text-lg text-gray-600">
          Based on your preferences, here's our personalized recommendation
        </p>
      </div>

      {/* Recommendation Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-blue-200"
      >
        <div className="text-center space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{recommended.name}</h3>
            <p className="text-4xl font-bold text-blue-600 mt-2">{recommended.price}</p>
            <div className="flex items-center justify-center mt-2">
              <span className="text-sm text-gray-600 mr-2">Confidence:</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(recommendation.confidence / 20)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-medium">{recommendation.confidence}%</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 text-left">
            <h4 className="font-semibold text-gray-800 mb-3">Why This Package is Perfect for You:</h4>
            <p className="text-gray-700 leading-relaxed">{recommendation.reasoning}</p>
          </div>

          {recommendation.personalizedMessage && (
            <div className="bg-blue-50 rounded-lg p-6 text-left">
              <h4 className="font-semibold text-blue-800 mb-3">Personal Message:</h4>
              <p className="text-blue-700 leading-relaxed">{recommendation.personalizedMessage}</p>
            </div>
          )}

          {/* Suggested Add-ons */}
          {recommendation.suggestedAddOns.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Recommended Add-ons:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendation.suggestedAddOns.map((addon, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 text-left">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-gray-800">{addon.name}</h5>
                      <span className="font-bold text-gray-700">${addon.price}</span>
                    </div>
                    <p className="text-sm text-gray-600">{addon.reasoning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <a
              href="https://harielxavierphotography.studioninja.co/inquire"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-center"
            >
              Book Your Consultation
            </a>
            <button
              onClick={onReset}
              className="flex-1 bg-gray-200 text-gray-800 py-4 px-6 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AIPackageQuiz;
