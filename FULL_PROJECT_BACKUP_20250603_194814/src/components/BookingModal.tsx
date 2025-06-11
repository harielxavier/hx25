import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Package {
  name: string;
  price: string;
  features: string[];
  popular?: boolean;
}

interface BookingModalProps {
  package: Package;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ package: pkg, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    venue: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // Here you would typically send the data to your backend
      console.log('Form submitted:', { package: pkg, ...formData });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div 
          className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="font-serif text-2xl">Book Your {pkg.name} Package</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-black">
              <X size={24} />
            </button>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full ${step >= 1 ? 'bg-black' : 'bg-gray-200'} flex items-center justify-center text-white mr-2`}>
                    1
                  </div>
                  <span>Your Details</span>
                </div>
                <div className="h-0.5 w-12 bg-gray-200"></div>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full ${step >= 2 ? 'bg-black' : 'bg-gray-200'} flex items-center justify-center text-white mr-2`}>
                    2
                  </div>
                  <span>Wedding Details</span>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              {step === 1 ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 focus:border-black transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 focus:border-black transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 focus:border-black transition-colors"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Wedding Date</label>
                    <input 
                      type="date" 
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 focus:border-black transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Venue (if known)</label>
                    <input 
                      type="text" 
                      name="venue"
                      value={formData.venue}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 focus:border-black transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Additional Details</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 focus:border-black transition-colors"
                    />
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex justify-between">
                {step === 2 && (
                  <button 
                    type="button" 
                    onClick={() => setStep(1)} 
                    className="px-8 py-3 border border-black text-black hover:bg-black hover:text-white transition-colors"
                  >
                    Back
                  </button>
                )}
                <button 
                  type="submit" 
                  className="px-8 py-3 bg-black text-white hover:bg-gray-900 transition-colors ml-auto"
                >
                  {step === 1 ? 'Continue' : 'Book Consultation'}
                </button>
              </div>
            </form>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-medium mb-4">Package Summary</h3>
              <div className="flex justify-between mb-2">
                <span>{pkg.name} Package</span>
                <span>${pkg.price}</span>
              </div>
              <div className="text-sm text-gray-500 mt-4">
                <p>A 50% retainer is required to secure your date. The remaining balance is due 30 days before your wedding.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BookingModal;
