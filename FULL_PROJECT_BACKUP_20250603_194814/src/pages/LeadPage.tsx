import { useEffect } from 'react';
import LeadCaptureForm from '../components/LeadCaptureForm';

export default function LeadPage() {
  useEffect(() => {
    // Set page title when component mounts
    document.title = 'Contact Us | Hariel Xavier Photography';
    
    // Scroll to top
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Let's Create Something Beautiful Together</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We'd love to hear about your photography needs. Fill out the form below and we'll get back to you soon.
            </p>
          </div>
          
          {/* Lead Form */}
          <LeadCaptureForm />
          
          {/* Additional Contact Info */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Email Us</h3>
              <p className="text-gray-600">contact@harielxavier.com</p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Call Us</h3>
              <p className="text-gray-600">(862) 290-4349</p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Follow Us</h3>
              <p className="text-gray-600">@harielxavierphotography</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
