import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ArrowRight, Check, X } from 'lucide-react';
// REMOVED FIREBASE: import { addDoc, collection, serverTimestamp // REMOVED FIREBASE
// REMOVED FIREBASE: import { db } from '../firebase/config';
import { format } from 'date-fns';
// Email service imports removed as they're no longer needed
// import { sendEmailToClient, sendEmailToAdmin } from '../services/emailService';

// Type for form data
interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  eventType: 'wedding' | 'portrait' | 'family' | 'commercial' | 'other';
  eventDate: string;
  eventLocation: string;
  customEventType?: string;
  message: string;
}

// Default values for form
const defaultValues: LeadFormData = {
  name: '',
  email: '',
  phone: '',
  eventType: 'wedding',
  eventDate: '',
  eventLocation: '',
  customEventType: '',
  message: ''
};

export default function LeadCaptureSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  // Initialize form with react-hook-form
  const { 
    register, 
    handleSubmit, 
    watch,
    reset, 
    formState: { errors, isValid } 
  } = useForm<LeadFormData>({
    defaultValues,
    mode: 'onChange'
  });
  
  // Get the current form values being watched
  const watchEventType = watch('eventType');
  
  // Submit form data to Firebase
  const onSubmit: SubmitHandler<LeadFormData> = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Format the date for better readability
      const formattedDate = data.eventDate ? format(new Date(data.eventDate), 'yyyy-MM-dd') : '';
      
      // Prepare lead data for Firebase
      const leadData = {
        ...data,
        eventDate: formattedDate,
        status: 'new',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        convertedToClient: false,
        convertedToJob: false,
        leadSource: 'website_footer_form'
      };
      
      // Add document to leads collection
      const docRef = await addDoc(collection(db, 'leads'), leadData);
      const leadId = docRef.id;
      
      // Email sending is now handled by the Firebase Function trigger (onLeadCreatedWithAdmin)
      // No need to send emails from the frontend anymore
      // 
      // await sendEmailToClient({
      //   to: data.email,
      //   name: data.name,
      //   eventType: data.eventType,
      //   eventDate: formattedDate
      // });
      // 
      // await sendEmailToAdmin({
      //   leadId: leadId,
      //   leadData: {
      //     ...data,
      //     eventDate: formattedDate
      //   }
      // });
      
      console.log(`Lead created successfully with ID: ${leadId}. Emails will be sent by the backend trigger.`);
      
      // Show success message and reset form
      setIsSuccess(true);
      reset(defaultValues);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
      
    } catch (err) {
      console.error('Error submitting lead form:', err);
      setError('There was an error submitting your inquiry. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-gradient-to-r from-blue-900 to-purple-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {isSuccess ? (
          <div className="max-w-3xl mx-auto bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
            <p className="text-gray-200 mb-6">
              Your inquiry has been received. We'll review your details and get back to you within 24-48 hours.
            </p>
            <button
              onClick={() => setShowForm(false)}
              className="px-6 py-2 bg-white text-blue-900 rounded-lg font-medium"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Ready to Capture Your Story?</h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Tell us about your photography needs and we'll get back to you with a personalized quote.
              </p>
            </div>
            
            {showForm ? (
              <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 lg:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">
                      Your Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      className={`w-full px-4 py-2 bg-white bg-opacity-20 border rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                        errors.name ? 'border-red-400' : 'border-gray-600'
                      }`}
                      placeholder="Jane Smith"
                      {...register('name', { required: 'Please enter your name' })}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                    )}
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={`w-full px-4 py-2 bg-white bg-opacity-20 border rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                        errors.email ? 'border-red-400' : 'border-gray-600'
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
                      <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                    )}
                  </div>
                  
                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-1">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className={`w-full px-4 py-2 bg-white bg-opacity-20 border rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                        errors.phone ? 'border-red-400' : 'border-gray-600'
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
                      <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
                    )}
                  </div>
                  
                  {/* Event Type */}
                  <div>
                    <label htmlFor="eventType" className="block text-sm font-medium text-gray-200 mb-1">
                      What type of photography do you need? *
                    </label>
                    <select
                      id="eventType"
                      className={`w-full px-4 py-2 bg-white bg-opacity-20 border rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                        errors.eventType ? 'border-red-400' : 'border-gray-600'
                      }`}
                      {...register('eventType', { required: 'Please select an event type' })}
                    >
                      <option value="wedding" className="bg-gray-800 text-white">Wedding Photography</option>
                      <option value="portrait" className="bg-gray-800 text-white">Portrait Session</option>
                      <option value="family" className="bg-gray-800 text-white">Family Photography</option>
                      <option value="commercial" className="bg-gray-800 text-white">Commercial/Brand</option>
                      <option value="other" className="bg-gray-800 text-white">Other (Please specify)</option>
                    </select>
                    {errors.eventType && (
                      <p className="mt-1 text-sm text-red-400">{errors.eventType.message}</p>
                    )}
                  </div>
                  
                  {/* Custom Event Type (conditional) */}
                  {watchEventType === 'other' && (
                    <div>
                      <label htmlFor="customEventType" className="block text-sm font-medium text-gray-200 mb-1">
                        Please specify the type of photography you need *
                      </label>
                      <input
                        id="customEventType"
                        type="text"
                        className={`w-full px-4 py-2 bg-white bg-opacity-20 border rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                          errors.customEventType ? 'border-red-400' : 'border-gray-600'
                        }`}
                        placeholder="e.g., Event, Sports, Real Estate"
                        {...register('customEventType', { 
                          required: watchEventType === 'other' ? 'Please specify the type of photography' : false
                        })}
                      />
                      {errors.customEventType && (
                        <p className="mt-1 text-sm text-red-400">{errors.customEventType.message}</p>
                      )}
                    </div>
                  )}
                  
                  {/* Event Date */}
                  <div>
                    <label htmlFor="eventDate" className="block text-sm font-medium text-gray-200 mb-1">
                      When do you need photography? *
                    </label>
                    <input
                      id="eventDate"
                      type="date"
                      className={`w-full px-4 py-2 bg-white bg-opacity-20 border rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                        errors.eventDate ? 'border-red-400' : 'border-gray-600'
                      }`}
                      {...register('eventDate', { required: 'Please select a date' })}
                    />
                    {errors.eventDate && (
                      <p className="mt-1 text-sm text-red-400">{errors.eventDate.message}</p>
                    )}
                  </div>
                  
                  {/* Event Location */}
                  <div>
                    <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-200 mb-1">
                      Where will this take place? *
                    </label>
                    <input
                      id="eventLocation"
                      type="text"
                      className={`w-full px-4 py-2 bg-white bg-opacity-20 border rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                        errors.eventLocation ? 'border-red-400' : 'border-gray-600'
                      }`}
                      placeholder="e.g., New York City, NY"
                      {...register('eventLocation', { required: 'Please enter a location' })}
                    />
                    {errors.eventLocation && (
                      <p className="mt-1 text-sm text-red-400">{errors.eventLocation.message}</p>
                    )}
                  </div>
                  
                  {/* Message - Full Width */}
                  <div className="md:col-span-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-1">
                      Tell us about your vision
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      className="w-full px-4 py-2 bg-white bg-opacity-20 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="Share any details that will help us understand your photography needs..."
                      {...register('message')}
                    ></textarea>
                  </div>
                </div>
                
                {/* Error Message */}
                {error && (
                  <div className="mt-4 p-3 bg-red-500 bg-opacity-20 text-red-200 rounded-lg">
                    <div className="flex items-center">
                      <X className="w-5 h-5 mr-2" />
                      <p>{error}</p>
                    </div>
                  </div>
                )}
                
                {/* Submit Button */}
                <div className="mt-6 flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className={`px-8 py-3 rounded-lg flex items-center text-base font-medium ${
                      isSubmitting || !isValid
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                    {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <button
                  onClick={() => setShowForm(true)}
                  className="px-8 py-3 bg-white text-blue-900 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  Tell Us About Your Project
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
