import React, { useState } from 'react';
import { Mail, Phone, Instagram, CheckCircle, AlertCircle, ArrowRight, ArrowLeft, Briefcase, Palette, Target } from 'lucide-react';

// Import types and functions from leads module
type LeadSource = 
  | 'website_contact_form'
  | 'instagram'
  | 'facebook'
  | 'google'
  | 'referral'
  | 'wedding_fair'
  | 'other';

interface LeadData {
  name: string;
  email: string;
  phone?: string;
  businessName?: string;
  industry?: string;
  brandChallenges?: string[];
  brandValues?: string[];
  targetAudience?: string;
  brandConsistencyNeeds?: string[];
  message?: string;
  source: LeadSource;
  status: string;
}

// Mock function for development - replace with actual API call in production
const recordLead = async (leadData: LeadData): Promise<any> => {
  console.log('Recording lead:', leadData);
  // In development, we'll just return a success promise
  return Promise.resolve({ success: true, id: 'mock-id-' + Date.now() });
};

export default function Contact() {
  // Function to simulate a lead submission without actually submitting the form
  const simulateLeadSubmission = () => {
    setIsSubmitting(true);
    
    // Simulate processing delay
    setTimeout(() => {
      // Log what would happen in a real submission
      console.log('\n===== SIMULATED LEAD NOTIFICATION EMAIL TO ADMIN =====');
      console.log('To: info@harielxavierphotography.com');
      console.log(`Subject: New Lead: ${formData.name || 'John Smith'} - website_contact_form`);
      console.log('\nBody:');
      console.log(`
<h2>New Brand Inquiry from Website</h2>
<p><strong>Name:</strong> ${formData.name || 'John Smith'}</p>
<p><strong>Email:</strong> ${formData.email || 'john.smith@example.com'}</p>
<p><strong>Business:</strong> ${formData.businessName || 'Acme Inc.'}</p>
<p><strong>Industry:</strong> ${formData.industry || 'Technology'}</p>
<p><strong>Brand Challenges:</strong> ${formData.brandChallenges?.join(', ') || 'Not specified'}</p>
<p><strong>Brand Values:</strong> ${formData.brandValues?.join(', ') || 'Not specified'}</p>
<p><strong>Target Audience:</strong> ${formData.targetAudience || 'Not specified'}</p>
<p><strong>Brand Consistency Needs:</strong> ${formData.brandConsistencyNeeds?.join(', ') || 'Not specified'}</p>
<p><strong>Source:</strong> website_contact_form</p>
<p><strong>Message:</strong><br>${formData.message || 'Hello, I am interested in your branding services.'}</p>
<p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
`);

      console.log('\n\n===== SIMULATED AUTORESPONSE EMAIL TO LEAD =====');
      console.log(`To: ${formData.email || 'john.smith@example.com'}`);
      console.log('Subject: Thank you for contacting Hariel Xavier Photography');
      console.log('\nBody:');
      console.log(`
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2>Thank You for Reaching Out!</h2>
  
  <p>Hi ${(formData.name || 'John').split(' ')[0]},</p>
  
  <p>Thank you for contacting Hariel Xavier Photography. We've received your inquiry about our branding services and are excited to help elevate your brand.</p>
  
  <p>Here's what to expect next:</p>
  
  <ol>
    <li>We'll review your inquiry within 24-48 hours</li>
    <li>You'll receive a personalized response from our team</li>
    <li>We'll schedule a consultation to discuss your brand vision in detail</li>
  </ol>
  
  <p>Looking forward to connecting with you soon!</p>
  
  <p>Warm regards,<br>
  Hariel Xavier<br>
  Hariel Xavier Photography</p>
</div>
`);
      
      // Set success state to show confirmation message
      setSubmitStatus('success');
      setIsSubmitting(false);
    }, 1500);
  };
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    industry: '',
    brandChallenges: [] as string[],
    brandValues: [] as string[],
    targetAudience: '',
    brandConsistencyNeeds: [] as string[],
    hearAboutUs: '' as LeadSource,
    message: ''
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

  const toggleSelection = (field: 'brandChallenges' | 'brandValues' | 'brandConsistencyNeeds', item: string) => {
    setFormData(prev => {
      const currentItems = prev[field] || [];
      if (currentItems.includes(item)) {
        return {
          ...prev,
          [field]: currentItems.filter(i => i !== item)
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
      if (!formData.name || !formData.email) {
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
    if (!formData.name || !formData.email) {
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
      // Record the lead in the system
      await recordLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        businessName: formData.businessName,
        industry: formData.industry,
        brandChallenges: formData.brandChallenges,
        brandValues: formData.brandValues,
        targetAudience: formData.targetAudience,
        brandConsistencyNeeds: formData.brandConsistencyNeeds,
        message: formData.message,
        source: formData.hearAboutUs || 'website_contact_form',
        status: 'new'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        businessName: '',
        industry: '',
        brandChallenges: [],
        brandValues: [],
        targetAudience: '',
        brandConsistencyNeeds: [],
        hearAboutUs: '' as LeadSource,
        message: ''
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
    <section className="py-32 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-gold uppercase tracking-[0.2em] mb-4">Get In Touch</p>
            <h2 className="font-serif text-5xl mb-6">Let's Build Your Brand</h2>
            <p className="text-gray-400 font-light leading-relaxed max-w-2xl mx-auto">
              Ready to elevate your brand? Let's connect and discuss how we can
              create a consistent and powerful brand identity that resonates with your audience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <a href="mailto:info@harielxavier.com" className="group">
              <div className="p-8 border border-primary/20 hover:border-primary transition-all duration-300">
                <Mail className="w-8 h-8 text-primary mb-6" />
                <h3 className="font-serif text-2xl mb-2">Email</h3>
                <p className="text-gray-400 font-light group-hover:text-primary transition-colors">
                  info@harielxavier.com
                </p>
              </div>
            </a>

            <a href="tel:+1234567890" className="group">
              <div className="p-8 border border-primary/20 hover:border-primary transition-all duration-300">
                <Phone className="w-8 h-8 text-primary mb-6" />
                <h3 className="font-serif text-2xl mb-2">Phone</h3>
                <p className="text-gray-400 font-light group-hover:text-primary transition-colors">
                  (862) 290-4349
                </p>
              </div>
            </a>

            <a href="https://instagram.com/harielxaviermedia" target="_blank" rel="noopener noreferrer" className="group">
              <div className="p-8 border border-primary/20 hover:border-primary transition-all duration-300">
                <Instagram className="w-8 h-8 text-primary mb-6" />
                <h3 className="font-serif text-2xl mb-2">Instagram</h3>
                <p className="text-gray-400 font-light group-hover:text-primary transition-colors">
                  @harielxaviermedia
                </p>
              </div>
            </a>
          </div>

          {submitStatus === 'success' ? (
            <div className="max-w-2xl mx-auto p-8 border border-green-500 bg-green-500/10 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-serif text-2xl mb-2">Thank You!</h3>
              <p className="text-gray-300 mb-4">
                Your message has been received. We'll get back to you within 24-48 hours.
              </p>
              <button 
                onClick={() => {
                  setSubmitStatus(null);
                  setCurrentStep(1);
                }}
                className="text-primary hover:text-white transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={currentStep === 4 ? handleSubmit : (e) => e.preventDefault()} className="max-w-2xl mx-auto">
              {/* Progress indicator */}
              <div className="flex justify-between mb-8">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex flex-col items-center">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${currentStep >= step ? 'bg-blue-400 text-white' : 'bg-gray-700 text-gray-400'}`}
                    >
                      {step}
                    </div>
                    <div className={`text-xs ${currentStep >= step ? 'text-blue-400' : 'text-gray-500'}`}>
                      {step === 1 && 'Contact Info'}
                      {step === 2 && 'Brand Awareness'}
                      {step === 3 && 'Brand Identity'}
                      {step === 4 && 'Brand Consistency'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Step 1: Contact Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="font-serif text-xl mb-4">Your Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      className="bg-transparent border border-primary/20 px-6 py-4 text-white placeholder-gray-400 focus:border-primary transition-colors"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your Email"
                      className="bg-transparent border border-primary/20 px-6 py-4 text-white placeholder-gray-400 focus:border-primary transition-colors"
                      required
                    />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your Phone Number"
                    className="w-full bg-transparent border border-primary/20 px-6 py-4 text-white placeholder-gray-400 focus:border-primary transition-colors"
                  />
                </div>
              )}

              {/* Step 2: Brand Awareness */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Target className="w-5 h-5 text-blue-400 mr-2" />
                    <h3 className="font-serif text-xl">Brand Awareness</h3>
                  </div>
                  
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Business Name"
                    className="w-full bg-transparent border border-primary/20 px-6 py-4 text-white placeholder-gray-400 focus:border-primary transition-colors"
                  />
                  
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full bg-transparent border border-primary/20 px-6 py-4 text-white placeholder-gray-400 focus:border-primary transition-colors"
                  >
                    <option value="" className="bg-gray-900">Select Your Industry</option>
                    <option value="Technology" className="bg-gray-900">Technology</option>
                    <option value="Healthcare" className="bg-gray-900">Healthcare</option>
                    <option value="Finance" className="bg-gray-900">Finance</option>
                    <option value="Education" className="bg-gray-900">Education</option>
                    <option value="Retail" className="bg-gray-900">Retail</option>
                    <option value="Hospitality" className="bg-gray-900">Hospitality</option>
                    <option value="Real Estate" className="bg-gray-900">Real Estate</option>
                    <option value="Professional Services" className="bg-gray-900">Professional Services</option>
                    <option value="Other" className="bg-gray-900">Other</option>
                  </select>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-3">Current Brand Challenges (Select all that apply)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'Low Brand Recognition', 
                        'Inconsistent Messaging', 
                        'Outdated Visual Identity', 
                        'Unclear Brand Positioning',
                        'Poor Online Presence',
                        'Difficulty Standing Out',
                        'Targeting Wrong Audience',
                        'Rebranding Needs'
                      ].map((challenge) => (
                        <div 
                          key={challenge}
                          onClick={() => toggleSelection('brandChallenges', challenge)}
                          className={`p-3 border cursor-pointer transition-all ${
                            formData.brandChallenges.includes(challenge) 
                              ? 'border-primary bg-primary/10' 
                              : 'border-gray-700 hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border ${
                              formData.brandChallenges.includes(challenge) 
                                ? 'border-primary bg-primary' 
                                : 'border-gray-500'
                            }`}></div>
                            <span>{challenge}</span>
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
                    <Palette className="w-5 h-5 text-blue-400 mr-2" />
                    <h3 className="font-serif text-xl">Brand Identity</h3>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-3">Core Brand Values (Select all that apply)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'Innovation', 
                        'Reliability', 
                        'Quality', 
                        'Sustainability',
                        'Luxury',
                        'Affordability',
                        'Creativity',
                        'Integrity',
                        'Inclusivity',
                        'Tradition'
                      ].map((value) => (
                        <div 
                          key={value}
                          onClick={() => toggleSelection('brandValues', value)}
                          className={`p-3 border cursor-pointer transition-all ${
                            formData.brandValues.includes(value) 
                              ? 'border-primary bg-primary/10' 
                              : 'border-gray-700 hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border ${
                              formData.brandValues.includes(value) 
                                ? 'border-primary bg-primary' 
                                : 'border-gray-500'
                            }`}></div>
                            <span>{value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-300 mb-2">
                      Target Audience Description
                    </label>
                    <textarea
                      id="targetAudience"
                      name="targetAudience"
                      value={formData.targetAudience}
                      onChange={handleChange}
                      placeholder="Describe your ideal customers or clients..."
                      rows={4}
                      className="w-full bg-transparent border border-primary/20 px-6 py-4 text-white placeholder-gray-400 focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Brand Consistency & How They Found Us */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Briefcase className="w-5 h-5 text-blue-400 mr-2" />
                    <h3 className="font-serif text-xl">Brand Consistency</h3>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-3">Brand Consistency Needs (Select all that apply)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'Logo Design/Redesign', 
                        'Brand Guidelines', 
                        'Website Design', 
                        'Social Media Templates',
                        'Marketing Materials',
                        'Content Strategy',
                        'Brand Messaging',
                        'Visual Identity System'
                      ].map((need) => (
                        <div 
                          key={need}
                          onClick={() => toggleSelection('brandConsistencyNeeds', need)}
                          className={`p-3 border cursor-pointer transition-all ${
                            formData.brandConsistencyNeeds.includes(need) 
                              ? 'border-primary bg-primary/10' 
                              : 'border-gray-700 hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border ${
                              formData.brandConsistencyNeeds.includes(need) 
                                ? 'border-primary bg-primary' 
                                : 'border-gray-500'
                            }`}></div>
                            <span>{need}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="hearAboutUs" className="block text-sm font-medium text-gray-300 mb-2">
                      How Did You Hear About Us? *
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
                          className={`p-3 border cursor-pointer transition-all ${formData.hearAboutUs === source.value ? 'border-primary bg-primary/10' : 'border-gray-700 hover:border-primary/50'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border ${formData.hearAboutUs === source.value ? 'border-primary bg-primary' : 'border-gray-500'}`}></div>
                            <span>{source.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Additional Information
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Share any additional details about your branding needs..."
                      rows={4}
                      className="w-full bg-transparent border border-primary/20 px-6 py-4 text-white placeholder-gray-400 focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 border border-red-500 bg-red-500/10 flex items-start gap-3 mt-6">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-200">{errorMessage}</p>
                </div>
              )}
              
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <button 
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 bg-transparent border border-gray-600 text-white px-6 py-3 hover:border-primary transition-all duration-300 text-sm"
                  >
                    <ArrowLeft className="w-4 h-4" /> Previous
                  </button>
                )}
                
                <div className="ml-auto flex gap-4">
                  {currentStep < 4 ? (
                    <button 
                      type="button"
                      onClick={nextStep}
                      className="flex items-center gap-2 bg-primary text-white px-8 py-3 hover:bg-primary-dark transition-all duration-300 text-sm"
                    >
                      Next <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <>
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-primary text-white px-10 py-3 hover:bg-primary-dark transition-all duration-300 tracking-widest uppercase text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </button>
                      
                      {/* Simulation button for testing */}
                      <button 
                        type="button"
                        onClick={simulateLeadSubmission}
                        disabled={isSubmitting}
                        className="bg-transparent border border-primary text-primary px-6 py-3 hover:bg-primary/10 transition-all duration-300 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        Simulate
                      </button>
                    </>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
