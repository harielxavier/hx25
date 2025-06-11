import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Camera, Calendar, MapPin, Phone, Mail, Send, Sparkles, Star, 
  Users, DollarSign, Clock, Instagram, Facebook, Globe, MessageCircle,
  CheckCircle, AlertCircle, Info, Gift, Music, Utensils, Car, Home,
  Palette, Eye, Zap, Target, TrendingUp, Award, Shield, Briefcase
} from 'lucide-react';

interface FormData {
  // Personal Information
  firstName: string;
  lastName: string;
  partnerFirstName: string;
  partnerLastName: string;
  email: string;
  phone: string;
  alternatePhone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Event Details
  eventType: string;
  eventDate: string;
  eventTime: string;
  ceremonyLocation: string;
  ceremonyAddress: string;
  receptionLocation: string;
  receptionAddress: string;
  guestCount: string;
  weddingStyle: string;
  colorScheme: string;
  
  // Photography Preferences
  serviceType: string;
  coverageHours: string;
  photographyStyle: string;
  mustHaveShots: string[];
  specialRequests: string;
  previousPhotographer: string;
  inspirationPhotos: string;
  
  // Budget & Investment
  totalBudget: string;
  photographyBudget: string;
  paymentPreference: string;
  urgency: string;
  
  // Discovery & Marketing
  hearAboutUs: string;
  referralName: string;
  socialMediaHandles: {
    instagram: string;
    facebook: string;
    tiktok: string;
  };
  
  // Additional Services
  additionalServices: string[];
  albumInterest: string;
  printInterest: string;
  
  // Timeline & Planning
  engagementDate: string;
  planningStage: string;
  weddingPlanner: string;
  plannerContact: string;
  otherVendors: string;
  
  // Personal Story
  relationshipStory: string;
  proposalStory: string;
  personalityTypes: string[];
  hobbies: string;
  specialTraditions: string;
  
  // Communication Preferences
  preferredContact: string;
  bestTimeToCall: string;
  timezone: string;
  communicationStyle: string;
  
  // Final Details
  questionsForUs: string;
  additionalInfo: string;
  newsletterOptIn: boolean;
  marketingOptIn: boolean;
}

const StateOfTheArtContactForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '', lastName: '', partnerFirstName: '', partnerLastName: '',
    email: '', phone: '', alternatePhone: '', address: '', city: '', state: '', zipCode: '',
    eventType: '', eventDate: '', eventTime: '', ceremonyLocation: '', ceremonyAddress: '',
    receptionLocation: '', receptionAddress: '', guestCount: '', weddingStyle: '', colorScheme: '',
    serviceType: '', coverageHours: '', photographyStyle: '', mustHaveShots: [], specialRequests: '',
    previousPhotographer: '', inspirationPhotos: '', totalBudget: '', photographyBudget: '',
    paymentPreference: '', urgency: '', hearAboutUs: '', referralName: '',
    socialMediaHandles: { instagram: '', facebook: '', tiktok: '' },
    additionalServices: [], albumInterest: '', printInterest: '', engagementDate: '',
    planningStage: '', weddingPlanner: '', plannerContact: '', otherVendors: '',
    relationshipStory: '', proposalStory: '', personalityTypes: [], hobbies: '',
    specialTraditions: '', preferredContact: '', bestTimeToCall: '', timezone: '',
    communicationStyle: '', questionsForUs: '', additionalInfo: '',
    newsletterOptIn: false, marketingOptIn: false
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [completionPercentage, setCompletionPercentage] = useState(0);

  const totalSteps = 8;

  // Options arrays
  const eventTypes = ['Wedding', 'Engagement Session', 'Bridal Portraits', 'Elopement', 'Anniversary Session', 'Maternity', 'Family Portraits', 'Corporate Event', 'Other'];
  const serviceTypes = ['Full Wedding Day', 'Ceremony Only', 'Reception Only', 'Engagement + Wedding', 'Destination Wedding', 'Micro Wedding', 'Courthouse Wedding'];
  const coverageOptions = ['4 hours', '6 hours', '8 hours', '10 hours', '12 hours', '14+ hours', 'Multiple days'];
  const photographyStyles = ['Documentary/Photojournalistic', 'Traditional/Classic', 'Fine Art', 'Editorial', 'Lifestyle', 'Vintage/Film', 'Modern/Contemporary', 'Dark & Moody', 'Light & Airy'];
  const weddingStyles = ['Classic & Timeless', 'Romantic & Dreamy', 'Modern & Chic', 'Rustic & Natural', 'Bohemian & Free-spirited', 'Elegant & Sophisticated', 'Vintage & Retro', 'Industrial & Urban', 'Beach & Coastal', 'Garden & Outdoor'];
  const guestCounts = ['Under 50', '50-100', '100-150', '150-200', '200-300', '300+'];
  const budgetRanges = ['Under $2,000', '$2,000-$3,500', '$3,500-$5,000', '$5,000-$7,500', '$7,500-$10,000', '$10,000-$15,000', '$15,000+'];
  const urgencyLevels = ['Very urgent (within 2 weeks)', 'Urgent (within 1 month)', 'Soon (within 3 months)', 'Planning ahead (3-6 months)', 'Far in advance (6+ months)'];
  const planningStages = ['Just engaged', 'Early planning', 'Venue booked', 'Most vendors booked', 'Final details', 'Almost ready'];
  const personalityTypes = ['Outgoing & Social', 'Quiet & Intimate', 'Adventurous', 'Traditional', 'Creative & Artistic', 'Fun & Playful', 'Romantic', 'Professional'];
  const mustHaveShots = ['First Look', 'Walking down the aisle', 'Ring exchange', 'First kiss', 'Family portraits', 'Bridal party photos', 'Couple portraits', 'Reception entrance', 'First dance', 'Cake cutting', 'Bouquet toss', 'Sunset photos', 'Detail shots', 'Getting ready photos'];
  const additionalServices = ['Engagement Session', 'Bridal Session', 'Rehearsal Dinner', 'Day After Session', 'Wedding Album', 'Parent Albums', 'Canvas Prints', 'Digital Gallery', 'Social Media Package', 'Same Day Edit Video'];
  const hearAboutOptions = ['Google Search', 'Instagram', 'Facebook', 'TikTok', 'Wedding Website/Blog', 'Venue Recommendation', 'Wedding Planner', 'Friend/Family Referral', 'Bridal Show', 'Wedding Fair', 'Previous Client', 'Other Vendor', 'Print Advertisement', 'Other'];
  const contactMethods = ['Email', 'Phone Call', 'Text Message', 'Video Call', 'In-Person Meeting'];
  const timezones = ['Eastern', 'Central', 'Mountain', 'Pacific', 'Alaska', 'Hawaii', 'Other'];
  const communicationStyles = ['Frequent updates', 'Weekly check-ins', 'Milestone updates only', 'As needed basis'];

  const calculateCompletionPercentage = () => {
    const totalFields = Object.keys(formData).length;
    let filledFields = 0;
    
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'socialMediaHandles') {
        const socialFilled = Object.values(value as any).filter((v: string) => v.trim() !== '').length;
        filledFields += socialFilled > 0 ? 1 : 0;
      } else if (Array.isArray(value)) {
        filledFields += value.length > 0 ? 1 : 0;
      } else if (typeof value === 'boolean') {
        filledFields += 1; // Always count boolean fields
      } else if (typeof value === 'string') {
        filledFields += value.trim() !== '' ? 1 : 0;
      }
    });
    
    return Math.round((filledFields / totalFields) * 100);
  };

  useEffect(() => {
    setCompletionPercentage(calculateCompletionPercentage());
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof FormData] as any,
          [child]: value
        }
      }));
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleMultiSelect = (name: keyof FormData, value: string) => {
    setFormData(prev => {
      const currentArray = prev[name] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [name]: newArray };
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};

    switch (step) {
      case 1: // Personal Information
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        break;
      case 2: // Event Details
        if (!formData.eventType) newErrors.eventType = 'Event type is required';
        if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
        if (!formData.ceremonyLocation.trim()) newErrors.ceremonyLocation = 'Ceremony location is required';
        break;
      case 3: // Photography Preferences
        if (!formData.serviceType) newErrors.serviceType = 'Service type is required';
        if (!formData.photographyStyle) newErrors.photographyStyle = 'Photography style is required';
        break;
      case 4: // Budget & Investment
        if (!formData.photographyBudget) newErrors.photographyBudget = 'Photography budget is required';
        break;
      case 5: // Discovery & Marketing
        if (!formData.hearAboutUs) newErrors.hearAboutUs = 'Please tell us how you heard about us';
        break;
      case 6: // Timeline & Planning
        if (!formData.planningStage) newErrors.planningStage = 'Planning stage is required';
        break;
      case 7: // Personal Story
        if (!formData.relationshipStory.trim()) newErrors.relationshipStory = 'Please share your story';
        break;
      case 8: // Final Details
        if (!formData.preferredContact) newErrors.preferredContact = 'Preferred contact method is required';
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
      const emailService = await import('../../lib/api/email');
      const emailData = {
        to: 'info@harielxavier.com',
        subject: `🌟 COMPREHENSIVE ${formData.eventType} Inquiry - ${formData.firstName} ${formData.lastName}`,
        html: `
          <div style="font-family: 'Georgia', serif; max-width: 800px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
            <div style="background: white; border-radius: 25px; padding: 50px; box-shadow: 0 30px 60px rgba(0,0,0,0.2);">
              
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #f0f0f0; padding-bottom: 30px;">
                <h1 style="color: #2c3e50; font-size: 32px; margin: 0; font-weight: 300;">✨ COMPREHENSIVE INQUIRY ✨</h1>
                <div style="width: 80px; height: 4px; background: linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3); margin: 25px auto; border-radius: 2px;"></div>
                <p style="color: #666; font-size: 18px; margin: 0;">${formData.eventType} • ${formData.eventDate}</p>
                <div style="background: linear-gradient(45deg, #667eea, #764ba2); color: white; padding: 10px 20px; border-radius: 25px; display: inline-block; margin-top: 15px; font-weight: bold;">
                  📊 Form Completion: ${completionPercentage}%
                </div>
              </div>

              <!-- Personal Information -->
              <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 20px; padding: 30px; margin-bottom: 30px; border-left: 5px solid #ff6b6b;">
                <h2 style="color: #2c3e50; font-size: 24px; margin: 0 0 20px 0;">💕 Couple Information</h2>
                <p style="margin: 8px 0; color: #555;"><strong>Primary Contact:</strong> ${formData.firstName} ${formData.lastName}</p>
                <p style="margin: 8px 0; color: #555;"><strong>Partner:</strong> ${formData.partnerFirstName} ${formData.partnerLastName}</p>
                <p style="margin: 8px 0; color: #555;"><strong>Email:</strong> ${formData.email}</p>
                <p style="margin: 8px 0; color: #555;"><strong>Phone:</strong> ${formData.phone}</p>
                ${formData.alternatePhone ? `<p style="margin: 8px 0; color: #555;"><strong>Alt Phone:</strong> ${formData.alternatePhone}</p>` : ''}
                ${formData.address ? `<p style="margin: 8px 0; color: #555;"><strong>Address:</strong> ${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}</p>` : ''}
              </div>

              <!-- Event Details -->
              <div style="background: linear-gradient(135deg, #fff5f5 0%, #ffe0e0 100%); border-radius: 20px; padding: 30px; margin-bottom: 30px; border-left: 5px solid #feca57;">
                <h2 style="color: #2c3e50; font-size: 24px; margin: 0 0 20px 0;">🎉 Event Details</h2>
                <p style="margin: 8px 0; color: #555;"><strong>Event Type:</strong> ${formData.eventType}</p>
                <p style="margin: 8px 0; color: #555;"><strong>Date:</strong> ${formData.eventDate}</p>
                <p style="margin: 8px 0; color: #555;"><strong>Time:</strong> ${formData.eventTime || 'TBD'}</p>
                <p style="margin: 8px 0; color: #555;"><strong>Guest Count:</strong> ${formData.guestCount || 'TBD'}</p>
                <p style="margin: 8px 0; color: #555;"><strong>Ceremony:</strong> ${formData.ceremonyLocation}</p>
                ${formData.ceremonyAddress ? `<p style="margin: 8px 0; color: #555;"><strong>Ceremony Address:</strong> ${formData.ceremonyAddress}</p>` : ''}
                ${formData.receptionLocation ? `<p style="margin: 8px 0; color: #555;"><strong>Reception:</strong> ${formData.receptionLocation}</p>` : ''}
                ${formData.weddingStyle ? `<p style="margin: 8px 0; color: #555;"><strong>Wedding Style:</strong> ${formData.weddingStyle}</p>` : ''}
                ${formData.colorScheme ? `<p style="margin: 8px 0; color: #555;"><strong>Color Scheme:</strong> ${formData.colorScheme}</p>` : ''}
              </div>

              <!-- Photography Preferences -->
              <div style="background: linear-gradient(135deg, #f0f8ff 0%, #e0f0ff 100%); border-radius: 20px; padding: 30px; margin-bottom: 30px; border-left: 5px solid #48dbfb;">
                <h2 style="color: #2c3e50; font-size: 24px; margin: 0 0 20px 0;">📸 Photography Preferences</h2>
                <p style="margin: 8px 0; color: #555;"><strong>Service Type:</strong> ${formData.serviceType}</p>
                <p style="margin: 8px 0; color: #555;"><strong>Coverage Hours:</strong> ${formData.coverageHours || 'TBD'}</p>
                <p style="margin: 8px 0; color: #555;"><strong>Photography Style:</strong> ${formData.photographyStyle}</p>
                ${formData.mustHaveShots.length > 0 ? `<p style="margin: 8px 0; color: #555;"><strong>Must-Have Shots:</strong> ${formData.mustHaveShots.join(', ')}</p>` : ''}
                ${formData.specialRequests ? `<p style="margin: 8px 0; color: #555;"><strong>Special Requests:</strong> ${formData.specialRequests}</p>` : ''}
              </div>

              <!-- Budget & Investment -->
              <div style="background: linear-gradient(135deg, #f0fff0 0%, #e0ffe0 100%); border-radius: 20px; padding: 30px; margin-bottom: 30px; border-left: 5px solid #00d4aa;">
                <h2 style="color: #2c3e50; font-size: 24px; margin: 0 0 20px 0;">💰 Investment Details</h2>
                <p style="margin: 8px 0; color: #555;"><strong>Photography Budget:</strong> ${formData.photographyBudget}</p>
                ${formData.totalBudget ? `<p style="margin: 8px 0; color: #555;"><strong>Total Wedding Budget:</strong> ${formData.totalBudget}</p>` : ''}
                ${formData.paymentPreference ? `<p style="margin: 8px 0; color: #555;"><strong>Payment Preference:</strong> ${formData.paymentPreference}</p>` : ''}
                ${formData.urgency ? `<p style="margin: 8px 0; color: #555;"><strong>Timeline:</strong> ${formData.urgency}</p>` : ''}
              </div>

              <!-- Discovery & Social -->
              <div style="background: linear-gradient(135deg, #fff0f5 0%, #ffe0f0 100%); border-radius: 20px; padding: 30px; margin-bottom: 30px; border-left: 5px solid #ff9ff3;">
                <h2 style="color: #2c3e50; font-size: 24px; margin: 0 0 20px 0;">🔍 How They Found Us</h2>
                <p style="margin: 8px 0; color: #555;"><strong>Source:</strong> ${formData.hearAboutUs}</p>
                ${formData.referralName ? `<p style="margin: 8px 0; color: #555;"><strong>Referral:</strong> ${formData.referralName}</p>` : ''}
                ${Object.values(formData.socialMediaHandles).some(handle => handle) ? `
                  <div style="margin-top: 15px;">
                    <strong style="color: #555;">Social Media:</strong>
                    ${formData.socialMediaHandles.instagram ? `<p style="margin: 4px 0; color: #555;">📸 Instagram: @${formData.socialMediaHandles.instagram}</p>` : ''}
                    ${formData.socialMediaHandles.facebook ? `<p style="margin: 4px 0; color: #555;">👥 Facebook: ${formData.socialMediaHandles.facebook}</p>` : ''}
                    ${formData.socialMediaHandles.tiktok ? `<p style="margin: 4px 0; color: #555;">🎵 TikTok: @${formData.socialMediaHandles.tiktok}</p>` : ''}
                  </div>
                ` : ''}
              </div>

              <!-- Personal Story -->
              ${formData.relationshipStory || formData.proposalStory || formData.personalityTypes.length > 0 ? `
                <div style="background: linear-gradient(135deg, #fff5f8 0%, #ffe0eb 100%); border-radius: 20px; padding: 30px; margin-bottom: 30px; border-left: 5px solid #ff69b4;">
                  <h2 style="color: #2c3e50; font-size: 24px; margin: 0 0 20px 0;">💖 Their Love Story</h2>
                  ${formData.relationshipStory ? `<p style="margin: 15px 0; color: #555; line-height: 1.6; font-style: italic;"><strong>Relationship Story:</strong><br>"${formData.relationshipStory}"</p>` : ''}
                  ${formData.proposalStory ? `<p style="margin: 15px 0; color: #555; line-height: 1.6; font-style: italic;"><strong>Proposal Story:</strong><br>"${formData.proposalStory}"</p>` : ''}
                  ${formData.personalityTypes.length > 0 ? `<p style="margin: 8px 0; color: #555;"><strong>Personality Types:</strong> ${formData.personalityTypes.join(', ')}</p>` : ''}
                  ${formData.hobbies ? `<p style="margin: 8px 0; color: #555;"><strong>Hobbies:</strong> ${formData.hobbies}</p>` : ''}
                  ${formData.specialTraditions ? `<p style="margin: 8px 0; color: #555;"><strong>Special Traditions:</strong> ${formData.specialTraditions}</p>` : ''}
                </div>
              ` : ''}

              <!-- Communication Preferences -->
              <div style="background: linear-gradient(135deg, #f0f8f0 0%, #e0f0e0 100%); border-radius: 20px; padding: 30px; margin-bottom: 30px; border-left: 5px solid #32cd32;">
                <h2 style="color: #2c3e50; font-size: 24px; margin: 0 0 20px 0;">📞 Communication Preferences</h2>
                <p style="margin: 8px 0; color: #555;"><strong>Preferred Contact:</strong> ${formData.preferredContact}</p>
                ${formData.bestTimeToCall ? `<p style="margin: 8px 0; color: #555;"><strong>Best Time to Call:</strong> ${formData.bestTimeToCall}</p>` : ''}
                ${formData.timezone ? `<p style="margin: 8px 0; color: #555;"><strong>Timezone:</strong> ${formData.timezone}</p>` : ''}
                ${formData.communicationStyle ? `<p style="margin: 8px 0; color: #555;"><strong>Communication Style:</strong> ${formData.communicationStyle}</p>` : ''}
              </div>

              <!-- Questions & Additional Info -->
              ${formData.questionsForUs || formData.additionalInfo ? `
                <div style="background: linear-gradient(135deg, #f8f8ff 0%, #e8e8ff 100%); border-radius: 20px; padding: 30px; margin-bottom: 30px; border-left: 5px solid #6a5acd;">
                  <h2 style="color: #2c3e50; font-size: 24px; margin: 0 0 20px 0;">❓ Questions & Additional Information</h2>
                  ${formData.questionsForUs ? `<p style="margin: 15px 0; color: #555; line-height: 1.6;"><strong>Questions for Us:</strong><br>"${formData.questionsForUs}"</p>` : ''}
                  ${formData.additionalInfo ? `<p style="margin: 15px 0; color: #555; line-height: 1.6;"><strong>Additional Information:</strong><br>"${formData.additionalInfo}"</p>` : ''}
                </div>
              ` : ''}

              <!-- Footer -->
              <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 3px solid #f0f0f0;">
                <p style="color: #888; font-size: 16px; margin: 0;">Sent with love from HarielXavier.com ✨</p>
                <p style="color: #aaa; font-size: 14px; margin: 10px 0 0 0;">This comprehensive inquiry contains ${completionPercentage}% completion rate</p>
              </div>
            </div>
          </div>
        `,
      };
      
      const success = await emailService.sendEmail(emailData);
      if (success) {
        setSubmitted(true);
        setFormData({
          firstName: '', lastName: '', partnerFirstName: '', partnerLastName: '',
          email: '', phone: '', alternatePhone: '', address: '', city: '', state: '', zipCode: '',
          eventType: '', eventDate: '', eventTime: '', ceremonyLocation: '', ceremonyAddress: '',
          receptionLocation: '', receptionAddress: '', guestCount: '', weddingStyle: '', colorScheme: '',
          serviceType: '', coverageHours: '', photographyStyle: '', mustHaveShots: [], specialRequests: '',
          previousPhotographer: '', inspirationPhotos: '', totalBudget: '', photographyBudget: '',
          paymentPreference: '', urgency: '', hearAboutUs: '', referralName: '',
          socialMediaHandles: { instagram: '', facebook: '', tiktok: '' },
          additionalServices: [], albumInterest: '', printInterest: '', engagementDate: '',
          planningStage: '', weddingPlanner: '', plannerContact: '', otherVendors: '',
          relationshipStory: '', proposalStory: '', personalityTypes: [], hobbies: '',
          specialTraditions: '', preferredContact: '', bestTimeToCall: '', timezone: '',
          communicationStyle: '', questionsForUs: '', additionalInfo: '',
          newsletterOptIn: false, marketingOptIn: false
        });
      } else {
        alert('There was an error sending your message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error sending your message. Please try again.');
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
            🌟✨💕
          </motion.div>
          <h2 className="text-3xl font-light text-gray-800 mb-4">Thank You!</h2>
          <p className="text-lg text-gray-600 mb-6">
            Your comprehensive inquiry has been sent! We're amazed by the detail you've provided about your special day.
          </p>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl mb-6">
            <p className="font-semibold">Form Completion: {completionPercentage}%</p>
            <p className="text-sm opacity-90">This level of detail helps us serve you better!</p>
          </div>
          <p className="text-gray-500">
            We'll get back to you within 24 hours with a personalized response based on all the wonderful information you've shared.
          </p>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
