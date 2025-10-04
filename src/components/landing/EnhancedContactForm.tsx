import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Camera, Calendar, MapPin, Phone, Mail, Send, Sparkles, Star } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  eventDate: string;
  eventLocation: string;
  jobType: string;
  hearAboutUs: string;
  budget: string;
  message: string;
  partnerName: string;
  weddingStyle: string;
}

const EnhancedContactForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    eventDate: '',
    eventLocation: '',
    jobType: '',
    hearAboutUs: '',
    budget: '',
    message: '',
    partnerName: '',
    weddingStyle: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const totalSteps = 4;

  const jobTypes = [
    'Wedding Photography',
    'Engagement Session',
    'Bridal Portraits',
    'Elopement',
    'Anniversary Session',
    'Other'
  ];

  const budgetRanges = [
    '$2,000 - $3,500',
    '$3,500 - $5,000',
    '$5,000 - $7,500',
    '$7,500 - $10,000',
    '$10,000+'
  ];

  const weddingStyles = [
    'Classic & Timeless',
    'Romantic & Dreamy',
    'Modern & Chic',
    'Rustic & Natural',
    'Bohemian & Free-spirited',
    'Elegant & Sophisticated'
  ];

  const hearAboutOptions = [
    'Google Search',
    'Instagram',
    'Facebook',
    'Wedding Venue Recommendation',
    'Friend/Family Referral',
    'Wedding Planner',
    'Bridal Show',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        break;
      case 2:
        if (!formData.jobType) newErrors.jobType = 'Please select a service type';
        if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
        if (!formData.eventLocation.trim()) newErrors.eventLocation = 'Event location is required';
        break;
      case 3:
        if (!formData.budget) newErrors.budget = 'Please select a budget range';
        if (!formData.hearAboutUs) newErrors.hearAboutUs = 'Please tell us how you heard about us';
        break;
      case 4:
        if (!formData.message.trim()) newErrors.message = 'Please tell us about your vision';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    try {
      // Use EmailJS service (no backend needed!)
      const { sendContactEmail } = await import('../../services/emailjsService');
      
      const success = await sendContactEmail(formData);
      
      if (success) {
        setSubmitted(true);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          eventDate: '',
          eventLocation: '',
          jobType: '',
          hearAboutUs: '',
          budget: '',
          message: '',
          partnerName: '',
          weddingStyle: ''
        });
      } else {
        alert('There was an error sending your message. Please try again or call us at (862) 290-4349.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error sending your message. Please try again or call us at (862) 290-4349.');
    } finally {
      setIsLoading(false);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center py-16 px-8"
      >
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-12 shadow-2xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-6xl mb-6"
          >
            ✨💕✨
          </motion.div>
          <h2 className="text-3xl font-light text-gray-800 mb-4">Thank You!</h2>
          <p className="text-lg text-gray-600 mb-6">
            Your love story inquiry has been sent! We're so excited to learn more about your special day.
          </p>
          <p className="text-gray-500">
            We'll get back to you within 24 hours to discuss how we can capture your beautiful moments.
          </p>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mt-8 text-4xl"
          >
            📸💖
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <div className="text-center mb-12">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-light text-gray-800 mb-4"
        >
          Let's Capture Your Love Story
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Tell us about your special day and let's create something magical together
        </motion.p>
      </div>

      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                  step <= currentStep ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-gray-300'
                }`}
                animate={{ scale: step === currentStep ? 1.1 : 1 }}
                transition={{ type: "spring" }}
              >
                {step < currentStep ? <Heart className="w-6 h-6" /> : step}
              </motion.div>
              {step < 4 && (
                <div className={`w-16 h-1 mx-2 ${step < currentStep ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-gray-300'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4" />
                <h3 className="text-2xl font-light text-gray-800 mb-2">Tell Us About Yourselves</h3>
                <p className="text-gray-600">Let's start with the basics</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Your first name"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Your last name"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Partner's Name</label>
                <input
                  type="text"
                  name="partnerName"
                  value={formData.partnerName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="Your partner's name (optional)"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <Camera className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-2xl font-light text-gray-800 mb-2">Event Details</h3>
                <p className="text-gray-600">Tell us about your special day</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type *</label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                    errors.jobType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a service</option>
                  {jobTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.jobType && <p className="text-red-500 text-sm mt-1">{errors.jobType}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Event Date *
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                      errors.eventDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.eventDate && <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Event Location *
                  </label>
                  <input
                    type="text"
                    name="eventLocation"
                    value={formData.eventLocation}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                      errors.eventLocation ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Venue name or city"
                  />
                  {errors.eventLocation && <p className="text-red-500 text-sm mt-1">{errors.eventLocation}</p>}
                </div>
              </div>

              {formData.jobType === 'Wedding Photography' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Wedding Style</label>
                  <select
                    name="weddingStyle"
                    value={formData.weddingStyle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select your style preference</option>
                    {weddingStyles.map(style => (
                      <option key={style} value={style}>{style}</option>
                    ))}
                  </select>
                </div>
              )}
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <Sparkles className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-light text-gray-800 mb-2">Investment & Discovery</h3>
                <p className="text-gray-600">Help us understand your needs</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range *</label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                    errors.budget ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select your budget range</option>
                  {budgetRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
                {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">How did you hear about us? *</label>
                <select
                  name="hearAboutUs"
                  value={formData.hearAboutUs}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                    errors.hearAboutUs ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Please select</option>
                  {hearAboutOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.hearAboutUs && <p className="text-red-500 text-sm mt-1">{errors.hearAboutUs}</p>}
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <Star className="w-12 h-12 text-pink-500 mx-auto mb-4" />
                <h3 className="text-2xl font-light text-gray-800 mb-2">Your Vision</h3>
                <p className="text-gray-600">Tell us about your dream day</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tell us about your vision and what makes your love story special *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Share your love story, wedding vision, special moments you want captured, or any specific requests..."
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                <p className="text-sm text-gray-500 mt-2">{formData.message.length}/1000 characters</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-12">
          <motion.button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            whileHover={currentStep > 1 ? { scale: 1.05 } : {}}
            whileTap={currentStep > 1 ? { scale: 0.95 } : {}}
          >
            Previous
          </motion.button>

          {currentStep < totalSteps ? (
            <motion.button
              type="button"
              onClick={nextStep}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next Step
            </motion.button>
          ) : (
            <motion.button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 flex items-center"
              whileHover={{ scale: isLoading ? 1 : 1.05 }}
              whileTap={{ scale: isLoading ? 1 : 0.95 }}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send My Inquiry
                </>
              )}
            </motion.button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EnhancedContactForm;
