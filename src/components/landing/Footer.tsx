import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, ArrowRight, ArrowLeft, Check, AlertCircle, Briefcase, Palette, Target } from 'lucide-react';
import { useState } from 'react';
// Import Firebase dependencies
import { getApp, initializeApp } from 'firebase/app';
// We don't need to import getFirestore as it's not used in this component

// Import lead service for proper lead registration
import { LeadSubmission } from '../../services/leadService';

// Import the email service
import emailService from '../../lib/api/email';

// Firebase configuration - only used if Firebase isn't already initialized
const firebaseConfig = {
  apiKey: "AIzaSyAohXEBojJPIFKXd1KTPQSi-LE2VxLG3xg",
  authDomain: "hariel-xavier-photography.firebaseapp.com",
  projectId: "hariel-xavier-photography",
  storageBucket: "hariel-xavier-photography.appspot.com",
  messagingSenderId: "397018472516",
  appId: "1:397018472516:web:49b2915c257651262a29b5",
  measurementId: "G-DNMEK173KQ"
};

// Initialize Firebase safely (avoid duplicate initialization)
try {
  // Try to get existing Firebase app
  getApp();
} catch (error) {
  // Initialize Firebase if no app exists
  initializeApp(firebaseConfig);
}

// Lead source types
type LeadSource = 
  | 'website_contact_form'
  | 'instagram'
  | 'facebook'
  | 'google'
  | 'referral'
  | 'wedding_fair'
  | 'other';

// Wedding Photography Form Component
const BrandCaptureForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    eventDate: '',
    eventLocation: '',
    packageInterest: [] as string[],
    preferredStyle: [] as string[],
    mustHaveShots: '',
    additionalServices: [] as string[],
    hearAboutUs: '' as LeadSource,
    additionalInfo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleSelection = (field: 'packageInterest' | 'preferredStyle' | 'additionalServices', item: string) => {
    setFormData(prev => {
      const currentItems = prev[field] || [];
      if (currentItems.includes(item)) {
        return {
          ...prev,
          [field]: currentItems.filter((i: string) => i !== item)
        };
      } else {
        return {
          ...prev,
          [field]: [...currentItems, item]
        };
      }
    });
  };

  const nextStep = () => {
    if (currentStep === 1) {
      // Validate first step
      if (!formData.firstName || !formData.email) {
        setSubmitStatus('error');
        setErrorMessage('Please fill in your name and email');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setSubmitStatus('error');
        setErrorMessage('Please enter a valid email address');
        return;
      }
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setSubmitStatus(null);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setSubmitStatus(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation
    if (!formData.firstName || !formData.email) {
      setSubmitStatus('error');
      setErrorMessage('Please fill in your name and email');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    // Ensure referral source is selected
    if (!formData.hearAboutUs) {
      setSubmitStatus('error');
      setErrorMessage('Please let us know how you heard about us');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Prepare lead data for the lead management system
      const leadData: LeadSubmission = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        eventType: 'wedding',
        eventDate: formData.eventDate,
        eventLocation: formData.eventLocation,
        preferredStyle: formData.preferredStyle,
        mustHaveShots: formData.mustHaveShots,
        additionalInfo: formData.additionalInfo,
        hearAboutUs: formData.hearAboutUs,
        source: 'website_contact_form'
      };
      
      console.log('Submitting lead to lead management system:', leadData);
      
      // Register lead in your CRM system using the email service
      const leadRegistered = await emailService.registerLead(leadData);
      console.log('Lead registered successfully:', leadRegistered);
      
      // Send notification email to admin
      const adminEmailSent = await emailService.sendEmail({
        to: 'info@harielxavier.com',
        subject: `New Wedding Photography Inquiry: ${formData.firstName} ${formData.lastName}`,
        html: `
          <h2>New Wedding Photography Inquiry from Website</h2>
          <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Phone:</strong> ${formData.phone || 'Not specified'}</p>
          <p><strong>Wedding Date:</strong> ${formData.eventDate || 'Not specified'}</p>
          <p><strong>Venue Location:</strong> ${formData.eventLocation || 'Not specified'}</p>
          <p><strong>Package Interest:</strong> ${formData.packageInterest?.join(', ') || 'Not specified'}</p>
          <p><strong>Photography Style:</strong> ${formData.preferredStyle?.join(', ') || 'Not specified'}</p>
          <p><strong>Must-Have Shots:</strong> ${formData.mustHaveShots || 'Not specified'}</p>
          <p><strong>Additional Services:</strong> ${formData.additionalServices?.join(', ') || 'Not specified'}</p>
          <p><strong>Source:</strong> ${formData.hearAboutUs || 'website_contact_form'}</p>
          <p><strong>Additional Info:</strong><br>${formData.additionalInfo || 'No additional information'}</p>
          <p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
        `
      });
      
      // Send autoresponse to client
      const clientEmailSent = await emailService.sendEmail({
        to: formData.email,
        subject: 'Thank you for your wedding photography inquiry - Hariel Xavier Photography',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Thank You for Reaching Out!</h2>
            
            <p>Hi ${formData.firstName},</p>
            
            <p>Thank you for contacting Hariel Xavier Photography. We've received your wedding photography inquiry and are excited about the possibility of capturing your special day.</p>
            
            <p>Here's what to expect next:</p>
            
            <ol>
              <li>We'll review your inquiry within 24-48 hours</li>
              <li>You'll receive a personalized response from our team</li>
              <li>We'll schedule a consultation to discuss your wedding photography vision</li>
            </ol>
            
            <p>Looking forward to connecting with you soon!</p>
            
            <p>Warm regards,<br>
            Hariel Xavier<br>
            Hariel Xavier Photography</p>
          </div>
        `
      });
      
      console.log('Emails sent:', { admin: adminEmailSent, client: clientEmailSent });
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        eventDate: '',
        eventLocation: '',
        packageInterest: [],
        preferredStyle: [],
        mustHaveShots: '',
        additionalServices: [],
        hearAboutUs: '' as LeadSource,
        additionalInfo: ''
      });
      
      setSubmitStatus('success');
      setCurrentStep(1);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setErrorMessage('Something went wrong. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-[#F7D6CF] to-[#F9E2C7]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-rose-dark uppercase tracking-[0.2em] mb-2">Capture Your Special Day</p>
            <h2 className="font-serif text-4xl mb-4">
              <span className="text-black">Wedding</span> <span className="text-rose-dark">Photography</span> <span className="text-black">Inquiry</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Complete this form to inquire about our wedding photography services
            </p>
          </div>

          {submitStatus === 'success' ? (
            <div className="max-w-2xl mx-auto p-8 border border-green-500 bg-white shadow-lg rounded-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-serif text-2xl mb-2">Thank You!</h3>
              <p className="text-gray-600 mb-4">
                Your wedding photography inquiry has been received. We'll review your details and get back to you within 24-48 hours.
              </p>
              <button 
                onClick={() => {
                  setSubmitStatus(null);
                  setCurrentStep(1);
                }}
                className="text-rose-dark hover:text-black transition-colors"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={currentStep === 4 ? handleSubmit : (e) => e.preventDefault()} className="bg-white shadow-lg rounded-lg p-8">
              {/* Progress indicator */}
              <div className="flex justify-between mb-8">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex flex-col items-center">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                        currentStep >= step 
                          ? 'bg-rose-dark text-white' 
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {step}
                    </div>
                    <div className={`text-xs ${currentStep >= step ? 'text-rose-dark' : 'text-gray-500'}`}>
                      {step === 1 && 'Contact Info'}
                      {step === 2 && 'Wedding Details'}
                      {step === 3 && 'Photography Style'}
                      {step === 4 && 'Additional Services'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Step 1: Contact Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="font-serif text-xl mb-4">Your <span className="text-rose-dark">Contact</span> Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Your First Name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-dark"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your Email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-dark"
                      required
                    />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your Phone Number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-dark"
                  />
                </div>
              )}

              {/* Step 2: Brand Awareness */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Target className="w-5 h-5 text-rose-dark mr-2" />
                    <h3 className="font-serif text-xl">Wedding <span className="text-rose-dark">Details</span></h3>
                  </div>
                  
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    placeholder="Wedding Date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-dark"
                  />
                  
                  <input
                    type="text"
                    name="eventLocation"
                    value={formData.eventLocation}
                    onChange={handleChange}
                    placeholder="Venue Location"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-dark"
                  />
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Package Interest (Select all that apply)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'Full Day Coverage', 
                        'Half Day Coverage', 
                        'Engagement Session', 
                        'Bridal Session',
                        'Premium Album',
                        'Digital Package',
                        'Second Photographer',
                        'Destination Wedding'
                      ].map((option) => (
                        <div 
                          key={option}
                          onClick={() => toggleSelection('packageInterest', option)}
                          className={`p-3 border rounded-md cursor-pointer transition-all ${
                            formData.packageInterest.includes(option) 
                              ? 'border-rose-dark bg-rose-light' 
                              : 'border-gray-300 hover:border-rose-dark/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border ${
                              formData.packageInterest.includes(option) 
                                ? 'border-rose-dark bg-rose-dark' 
                                : 'border-gray-400'
                            }`}></div>
                            <span>{option}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Brand Identity */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Palette className="w-5 h-5 text-rose-dark mr-2" />
                    <h3 className="font-serif text-xl">Photography <span className="text-rose-dark">Style</span></h3>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Photography Style (Select all that apply)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'Traditional', 
                        'Photojournalistic', 
                        'Artistic', 
                        'Candid',
                        'Dramatic',
                        'Natural Light',
                        'Black & White',
                        'Vintage',
                        'Modern',
                        'Editorial'
                      ].map((style) => (
                        <div 
                          key={style}
                          onClick={() => toggleSelection('preferredStyle', style)}
                          className={`p-3 border rounded-md cursor-pointer transition-all ${
                            formData.preferredStyle.includes(style) 
                              ? 'border-rose-dark bg-rose-light' 
                              : 'border-gray-300 hover:border-rose-dark/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border ${
                              formData.preferredStyle.includes(style) 
                                ? 'border-rose-dark bg-rose-dark' 
                                : 'border-gray-400'
                            }`}></div>
                            <span>{style}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="mustHaveShots" className="block text-sm font-medium text-gray-700 mb-2">
                      Must-Have Shots
                    </label>
                    <textarea
                      id="mustHaveShots"
                      name="mustHaveShots"
                      value={formData.mustHaveShots}
                      onChange={handleChange}
                      placeholder="Share any must-have shots you'd like..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-dark"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Brand Consistency & How They Found Us */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Briefcase className="w-5 h-5 text-rose-dark mr-2" />
                    <h3 className="font-serif text-xl">Additional <span className="text-rose-dark">Services</span></h3>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Additional Services (Select all that apply)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'Video Highlights', 
                        'Drone Coverage', 
                        'Photo Booth', 
                        'Same-Day Slideshow',
                        'Wedding Album',
                        'Engagement Session',
                        'Bridal Boudoir',
                        'Rehearsal Dinner'
                      ].map((service) => (
                        <div 
                          key={service}
                          onClick={() => toggleSelection('additionalServices', service)}
                          className={`p-3 border rounded-md cursor-pointer transition-all ${
                            formData.additionalServices.includes(service) 
                              ? 'border-rose-dark bg-rose-light' 
                              : 'border-gray-300 hover:border-rose-dark/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border ${
                              formData.additionalServices.includes(service) 
                                ? 'border-rose-dark bg-rose-dark' 
                                : 'border-gray-400'
                            }`}></div>
                            <span>{service}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="hearAboutUs" className="block text-sm font-medium text-gray-700 mb-2">
                      How Did You <span className="text-rose-dark">Hear About Us</span>? *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { value: 'instagram', label: 'Instagram' },
                        { value: 'facebook', label: 'Facebook' },
                        { value: 'google', label: 'Google Search' },
                        { value: 'referral', label: 'Friend/Family Referral' },
                        { value: 'wedding_fair', label: 'Event or Conference' },
                        { value: 'other', label: 'Other' }
                      ].map((source) => (
                        <div 
                          key={source.value}
                          onClick={() => setFormData({...formData, hearAboutUs: source.value as LeadSource})}
                          className={`p-3 border rounded-md cursor-pointer transition-all ${
                            formData.hearAboutUs === source.value 
                              ? 'border-rose-dark bg-rose-light' 
                              : 'border-gray-300 hover:border-rose-dark/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border ${
                              formData.hearAboutUs === source.value 
                                ? 'border-rose-dark bg-rose-dark' 
                                : 'border-gray-400'
                            }`}></div>
                            <span>{source.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Information
                    </label>
                    <textarea
                      id="message"
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleChange}
                      placeholder="Share any additional details about your wedding photography needs..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-dark"
                    />
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 border border-red-500 bg-red-50 rounded-md flex items-start gap-3 mt-6">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700">{errorMessage}</p>
                </div>
              )}
              
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <button 
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-all duration-300 text-sm"
                  >
                    <ArrowLeft className="w-4 h-4" /> Previous
                  </button>
                )}
                
                <div className="ml-auto">
                  {currentStep < 4 ? (
                    <button 
                      type="button"
                      onClick={nextStep}
                      className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-all duration-300 text-sm"
                    >
                      Next <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-rose-dark text-white px-10 py-3 rounded-md hover:bg-rose-dark/90 transition-all duration-300 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <>
      {/* Brand Capture Form - temporarily hidden */}
      {/* <BrandCaptureForm /> */}
      
      {/* Footer */}
      <footer className="bg-black text-white">
        {/* Elegant Contact Announcement Banner */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-accent/20 py-6">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-3 h-3 bg-accent rounded-full mr-3 animate-pulse"></div>
                <span className="text-accent text-sm font-medium tracking-[0.2em] uppercase">Important Update</span>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl text-white mb-2">
                New Dedicated Contact Line
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
                We're pleased to introduce our new primary contact number for all wedding photography consultations and inquiries.
              </p>
              <div className="mt-4">
                <a 
                  href="tel:+18623914179" 
                  className="inline-flex items-center bg-gradient-to-r from-accent to-rose-dark text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span className="mr-2">📞</span>
                  Call (862) 391-4179
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-serif mb-4">Hariel Xavier Photography</h3>
              <p className="text-gray-400 mb-6">
                Capturing life's most precious moments with an artistic eye and a passion for storytelling.
              </p>
              <div className="flex space-x-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                  <Instagram size={20} />
                  <span className="sr-only">Instagram</span>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                  <Facebook size={20} />
                  <span className="sr-only">Facebook</span>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                  <Twitter size={20} />
                  <span className="sr-only">Twitter</span>
                </a>
              </div>
            </div>
            
            
            <div>
              <h3 className="text-xl font-serif mb-4">Wedding Planning Tools</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/timeline-tool" className="text-gray-400 hover:text-white transition-colors">Wedding Timeline Tool</Link>
                </li>
                <li>
                  <Link to="/venue-lighting-tool" className="text-gray-400 hover:text-white transition-colors">Venue Lighting Tool</Link>
                </li>
                <li>
                  <Link to="/wedding-tools" className="text-gray-400 hover:text-white transition-colors bg-gray-800 px-2 py-1 rounded-sm text-white">New! Wedding Planning Suite</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-serif mb-4">Contact</h3>
              
              <address className="not-italic text-gray-400 space-y-3">
                <p className="text-white/80">Sussex County, NJ</p>
                <p>
                  <a href="mailto:Hi@HarielXavier.com" className="hover:text-white transition-colors">
                    Hi@HarielXavier.com
                  </a>
                </p>
              </address>
            </div>
            
            <div>
              <h3 className="text-xl font-serif mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link>
                </li>
                <li>
                  <Link to="/admin" className="text-gray-400 hover:text-white transition-colors">Admin Login</Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0">
              <p className="text-gray-500 mb-0 md:mr-4">
                &copy; {currentYear} Hariel Xavier Photography. All rights reserved.
              </p>
              <p className="text-gray-500">
                <a href="https://www.devority.io" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  A Devority Website
                </a>
              </p>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0"></div>
          </div>
          </div>
        </div>
      </footer>
    </>
  );
}
