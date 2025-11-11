import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Camera, Calendar, Users, MessageSquare, ArrowRight, ArrowLeft, Check, X, Briefcase, Palette, Target } from 'lucide-react';
// REMOVED FIREBASE: import { addDoc, collection, serverTimestamp // REMOVED FIREBASE
// REMOVED FIREBASE: import { db, functions } from '../firebase/config';
import { format } from 'date-fns';
// REMOVED FIREBASE: import { httpsCallable // REMOVED FIREBASE
import { sendEmailToClient, sendEmailToAdmin } from '../services/emailService';

// Type for form data
interface LeadFormData {
  // Step 1: Basic Information
  name: string;
  email: string;
  phone: string;
  
  // Step 2: Wedding Details
  weddingDate: string;
  venue: string;
  guestCount: string;
  
  // Step 3: Photography Style
  photographyStyle: string[];
  mustHaveShots: string[];
  
  // Step 4: Additional Services & Final Details
  additionalServices: string[];
  hearAboutUs: string;
  budget: string;
  message: string;
}

// Default values for form
const defaultValues: LeadFormData = {
  name: '',
  email: '',
  phone: '',
  weddingDate: '',
  venue: '',
  guestCount: '',
  photographyStyle: [],
  mustHaveShots: [],
  additionalServices: [],
  hearAboutUs: '',
  budget: '',
  message: ''
};

// List of booked dates (same as in admin-email.ts)
const bookedDates = [
  '2025-05-10', // May 10, 2025
  '2025-05-17', // May 17, 2025
  '2025-05-24', // May 24, 2025
  '2025-06-07', // June 7, 2025
  '2025-06-14', // June 14, 2025
  '2025-06-21', // June 21, 2025
  '2025-07-05', // July 5, 2025
  '2025-07-12', // July 12, 2025
  '2025-07-19', // July 19, 2025
  '2025-08-02', // August 2, 2025
  '2025-08-09', // August 9, 2025
  '2025-08-16', // August 16, 2025
  '2025-08-30', // August 30, 2025
  '2025-09-06', // September 6, 2025
  '2025-09-13', // September 13, 2025
  '2025-09-27', // September 27, 2025
];

// Function to check date availability
const checkDateAvailability = (date: string): boolean => {
  // Check if the date is in the booked dates list
  return !bookedDates.includes(date);
};

export default function LeadCaptureForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // isSuccess is used to display success message and control UI state
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // State for date availability
  const [dateAvailability, setDateAvailability] = useState<{
    isChecked: boolean;
    isAvailable: boolean | null;
  }>({
    isChecked: false,
    isAvailable: null,
  });
  
  // Initialize form with react-hook-form
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue,
    getValues,
    formState: { errors, isValid } 
  } = useForm<LeadFormData>({
    defaultValues,
    mode: 'onChange'
  });
  
  // Get the current form values being watched
  const watchPhotographyStyle = watch('photographyStyle');
  const watchMustHaveShots = watch('mustHaveShots');
  const watchAdditionalServices = watch('additionalServices');
  const watchWeddingDate = watch('weddingDate');
  
  // Check date availability when wedding date changes
  useEffect(() => {
    if (watchWeddingDate) {
      // Reset availability state
      setDateAvailability({
        isChecked: true,
        isAvailable: checkDateAvailability(watchWeddingDate)
      });
    } else {
      // Reset if no date is selected
      setDateAvailability({
        isChecked: false,
        isAvailable: null
      });
    }
  }, [watchWeddingDate]);
  
  // Email service functions are imported at the top of the file

  // Submit form data to Firebase
  const onSubmit: SubmitHandler<LeadFormData> = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
        // Prepare lead data for Firebase
        const leadData = {
          ...data,
          firstName: data.name.split(' ')[0],
          lastName: data.name.includes(' ') ? data.name.split(' ').slice(1).join(' ') : '',
          eventType: 'wedding',
          eventDate: data.weddingDate,
          status: 'new',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          convertedToClient: false,
          convertedToJob: false,
          leadSource: 'website_inquiry_form'
        };
      
      // Add document to leads collection
      const docRef = await addDoc(collection(db, 'leads'), leadData);
      
      // Send email notification to admin and autoresponse to client
      try {
          // Send email to client with thank you message - THIS IS NOW HANDLED BY THE BACKEND TRIGGER (onLeadCreatedWithAdmin)
          // await sendEmailToClient({
          //   to: data.email,
          //   name: data.name,
          //   eventType: 'wedding',
          //   eventDate: data.weddingDate,
          //   dateAvailable: dateAvailability.isAvailable === null ? undefined : dateAvailability.isAvailable // Handle null case
          // });
          
          // Send email to admin with lead details - THIS IS NOW HANDLED BY THE BACKEND TRIGGER (onLeadCreatedWithAdmin)
          // await sendEmailToAdmin({
          //   leadId: docRef.id,
          //   leadData: {
          //     name: data.name,
          //     email: data.email,
          //     phone: data.phone,
          //     eventType: 'wedding',
          //     eventDate: data.weddingDate,
          //     message: data.message,
          //     venue: data.venue,
          //     guestCount: data.guestCount,
          //     photographyStyle: data.photographyStyle,
          //     mustHaveShots: data.mustHaveShots,
          //     additionalServices: data.additionalServices,
          //     hearAboutUs: data.hearAboutUs,
          //     budget: data.budget,
          //     dateAvailable: dateAvailability.isAvailable === null ? undefined : dateAvailability.isAvailable // Handle null case
          //   }
          // });
        
        console.log('Emails sent successfully');
      } catch (emailErr) {
        console.error('Error sending email notifications:', emailErr);
        // Continue even if email sending fails
      }
      
      // Show success message and transition to thank you screen
      setIsSuccess(true);
      setCurrentStep(5); // Show success step
      
    } catch (err) {
      console.error('Error submitting lead form:', err);
      setError('There was an error submitting your inquiry. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle navigation between steps
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // Handle multiple selection (checkboxes)
  const toggleSelection = (field: 'photographyStyle' | 'mustHaveShots' | 'additionalServices', item: string) => {
    const currentItems = getValues(field) || [];
    
    if (currentItems.includes(item)) {
      setValue(
        field, 
        currentItems.filter(i => i !== item),
        { shouldValidate: true }
      );
    } else {
      setValue(
        field, 
        [...currentItems, item],
        { shouldValidate: true }
      );
    }
  };

  // Progress percentage calculation
  const calculateProgress = () => {
    return ((currentStep - 1) / 4) * 100;
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Form Header */}
      <div className="bg-gradient-to-r from-[#F7D6CF] to-[#F9E2C7] p-6 text-black">
        <h2 className="text-2xl font-bold">Capture Your Wedding Day</h2>
        <p className="mt-2 opacity-90">
          {isSuccess 
            ? "Thank you for your inquiry!" 
            : "Tell us about your wedding photography needs and we'll create timeless memories"}
        </p>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="w-full bg-white/20 rounded-full h-2.5 mb-2">
            <div 
              className="bg-white h-2.5 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs">
            <span>Contact Info</span>
            <span>Wedding Details</span>
            <span>Photography Style</span>
            <span>Additional Services</span>
          </div>
        </div>
      </div>
      
      {/* Form Body */}
      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <Users className="w-6 h-6 text-rose-dark mr-2" />
                <h3 className="text-xl font-semibold">Your <span className="text-rose-dark">Contact</span> Information</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Jane Smith"
                    {...register('name', { required: 'Please enter your name' })}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="jane@example.com"
                    {...register('email', { 
                      required: 'Please enter your email address',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please enter a valid email address'
                      }
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="(555) 123-4567"
                    {...register('phone', { 
                      required: 'Please enter your phone number',
                      pattern: {
                        value: /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
                        message: 'Please enter a valid phone number'
                      }
                    })}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Wedding Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <Calendar className="w-6 h-6 text-rose-dark mr-2" />
                <h3 className="text-xl font-semibold">Wedding <span className="text-rose-dark">Details</span></h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="weddingDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Wedding Date *
                  </label>
                  <input
                    id="weddingDate"
                    type="date"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.weddingDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    min={new Date().toISOString().split('T')[0]} // Set min date to today
                    {...register('weddingDate', { required: 'Please select your wedding date' })}
                  />
                  {errors.weddingDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.weddingDate.message}</p>
                  )}
                  
                  {/* Date Availability Notification */}
                  {dateAvailability.isChecked && watchWeddingDate && (
                    <div className={`mt-2 p-3 rounded-md ${dateAvailability.isAvailable ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                      {dateAvailability.isAvailable ? (
                        <div className="flex items-center">
                          <Check className="w-4 h-4 text-green-500 mr-2" />
                          <p className="text-sm text-green-700">
                            <strong>Great news!</strong> We're available on {new Date(watchWeddingDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}!
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <X className="w-4 h-4 text-red-500 mr-2" />
                          <p className="text-sm text-red-700">
                            <strong>We're sorry!</strong> We're already booked on {new Date(watchWeddingDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. Please select another date or contact us for recommendations.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!dateAvailability.isChecked && (
                    <p className="mt-1 text-xs text-gray-500">
                      Select a date to check our availability.
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-1">
                    Venue (if known)
                  </label>
                  <input
                    id="venue"
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Wedding venue name and location"
                    {...register('venue')}
                  />
                </div>
                
                <div>
                  <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Guest Count
                  </label>
                  <select
                    id="guestCount"
                    className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register('guestCount')}
                  >
                    <option value="">Select guest count</option>
                    <option value="intimate">Intimate (0-50 guests)</option>
                    <option value="medium">Medium (51-100 guests)</option>
                    <option value="large">Large (101-200 guests)</option>
                    <option value="very-large">Very Large (200+ guests)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Photography Style */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <Camera className="w-6 h-6 text-rose-dark mr-2" />
                <h3 className="text-xl font-semibold">Photography <span className="text-rose-dark">Style</span></h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photography Style Preferences (Select all that apply)
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'photojournalistic', label: 'Photojournalistic/Documentary' },
                      { id: 'traditional', label: 'Traditional/Classic' },
                      { id: 'artistic', label: 'Artistic/Creative' },
                      { id: 'candid', label: 'Candid/Natural' },
                      { id: 'dramatic', label: 'Dramatic/Bold' },
                      { id: 'vintage', label: 'Vintage/Film-inspired' },
                      { id: 'moody', label: 'Moody/Atmospheric' },
                      { id: 'bright-airy', label: 'Bright & Airy' }
                    ].map(style => (
                      <div key={style.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={style.id}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={watchPhotographyStyle?.includes(style.id)}
                          onChange={() => toggleSelection('photographyStyle', style.id)}
                        />
                        <label htmlFor={style.id} className="ml-2 block text-sm text-gray-700">
                          {style.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Must-Have Shots (Select all that apply)
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'getting-ready', label: 'Getting Ready' },
                      { id: 'first-look', label: 'First Look' },
                      { id: 'ceremony', label: 'Ceremony' },
                      { id: 'family-portraits', label: 'Family Portraits' },
                      { id: 'wedding-party', label: 'Wedding Party' },
                      { id: 'couple-portraits', label: 'Couple Portraits' },
                      { id: 'reception', label: 'Reception' },
                      { id: 'details', label: 'Details (Rings, Dress, Decor)' },
                      { id: 'first-dance', label: 'First Dance' },
                      { id: 'cake-cutting', label: 'Cake Cutting' }
                    ].map(shot => (
                      <div key={shot.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={shot.id}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={watchMustHaveShots?.includes(shot.id)}
                          onChange={() => toggleSelection('mustHaveShots', shot.id)}
                        />
                        <label htmlFor={shot.id} className="ml-2 block text-sm text-gray-700">
                          {shot.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 4: Additional Services & Final Details */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <Briefcase className="w-6 h-6 text-rose-dark mr-2" />
                <h3 className="text-xl font-semibold">Additional <span className="text-rose-dark">Details</span></h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Services (Select all that apply)
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'engagement-session', label: 'Engagement Session' },
                      { id: 'second-photographer', label: 'Second Photographer' },
                      { id: 'video', label: 'Wedding Video' },
                      { id: 'photo-booth', label: 'Photo Booth' },
                      { id: 'drone', label: 'Drone Photography' },
                      { id: 'album', label: 'Wedding Album' },
                      { id: 'prints', label: 'Fine Art Prints' },
                      { id: 'rehearsal', label: 'Rehearsal Dinner Coverage' }
                    ].map(service => (
                      <div key={service.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={service.id}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={watchAdditionalServices?.includes(service.id)}
                          onChange={() => toggleSelection('additionalServices', service.id)}
                        />
                        <label htmlFor={service.id} className="ml-2 block text-sm text-gray-700">
                          {service.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="hearAboutUs" className="block text-sm font-medium text-gray-700 mb-1">
                    How did you hear about us?
                  </label>
                  <select
                    id="hearAboutUs"
                    className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register('hearAboutUs')}
                  >
                    <option value="">Select an option</option>
                    <option value="search">Search Engine</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="pinterest">Pinterest</option>
                    <option value="referral">Friend/Family Referral</option>
                    <option value="vendor">Vendor Referral</option>
                    <option value="wedding-site">Wedding Website</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                    Photography Budget Range
                  </label>
                  <select
                    id="budget"
                    className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register('budget')}
                  >
                    <option value="">Select a budget range</option>
                    <option value="under-2000">Under $2,000</option>
                    <option value="2000-3500">$2,000 - $3,500</option>
                    <option value="3500-5000">$3,500 - $5,000</option>
                    <option value="5000-7500">$5,000 - $7,500</option>
                    <option value="over-7500">Over $7,500</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Information
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us more about your wedding vision, any specific photography needs, or questions you have"
                    {...register('message')}
                  ></textarea>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 5: Success Message */}
          {currentStep === 5 && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
              
              {dateAvailability.isChecked && watchWeddingDate && (
                <div className={`mb-4 p-4 rounded-md ${dateAvailability.isAvailable ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                  {dateAvailability.isAvailable ? (
                    <p className="text-green-700">
                      <strong>Great news!</strong> We're available on your selected date ({new Date(watchWeddingDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })})!
                    </p>
                  ) : (
                    <p className="text-amber-700">
                      <strong>Note:</strong> Your selected date ({new Date(watchWeddingDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}) appears to be already booked. We'll discuss alternative options in our response.
                    </p>
                  )}
                </div>
              )}
              
              <p className="text-gray-600 mb-6">
                Your inquiry has been submitted successfully. We'll be in touch with you shortly to discuss your wedding photography needs.
              </p>
              <p className="text-sm text-gray-500">
                A confirmation email has been sent to your inbox with more details.
              </p>
            </div>
          )}
          
          {/* Navigation Buttons */}
          {!isSuccess && (
            <div className="mt-8 flex justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={prevStep}
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>
              ) : (
                <div></div> // Empty div to maintain flex spacing
              )}
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={nextStep}
                  disabled={isSubmitting}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              )}
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
