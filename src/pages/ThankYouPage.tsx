import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Heart, Camera, Calendar, Mail, Phone, ArrowRight, Star, Instagram, Facebook } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThankYouPageProps {
  formData?: {
    name?: string;
    email?: string;
    weddingDate?: string;
    dateAvailable?: boolean;
  };
}

export default function ThankYouPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  
  // Get form data from location state or URL params
  const formData = location.state?.formData || {};
  const { name, email, weddingDate, dateAvailable } = formData;

  useEffect(() => {
    // Hide confetti after 3 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Format wedding date for display
  const formatWeddingDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-light via-white to-cream">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-rose-dark rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: -10,
                rotate: 0,
              }}
              animate={{
                y: window.innerHeight + 10,
                rotate: 360,
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                ease: "easeOut",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Main Thank You Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-rose-light to-rose-dark mb-6 shadow-lg">
              <Check className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
              Thank You{name ? `, ${name.split(' ')[0]}` : ''}!
            </h1>
            
            <div className="flex items-center justify-center mb-6">
              <Heart className="w-6 h-6 text-rose-dark mr-2" />
              <p className="text-xl text-gray-700 font-light">
                Your wedding photography inquiry has been received
              </p>
              <Heart className="w-6 h-6 text-rose-dark ml-2" />
            </div>
          </motion.div>

          {/* Date Availability Status */}
          {weddingDate && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`mb-8 p-6 rounded-xl shadow-lg ${
                dateAvailable 
                  ? 'bg-gradient-to-r from-green-50 to-green-100 border border-green-200' 
                  : 'bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200'
              }`}
            >
              <div className="flex items-center justify-center mb-4">
                <Calendar className={`w-8 h-8 mr-3 ${dateAvailable ? 'text-green-600' : 'text-amber-600'}`} />
                <h3 className={`text-xl font-semibold ${dateAvailable ? 'text-green-800' : 'text-amber-800'}`}>
                  Your Wedding Date: {formatWeddingDate(weddingDate)}
                </h3>
              </div>
              
              {dateAvailable ? (
                <div className="text-center">
                  <p className="text-green-700 text-lg mb-2">
                    🎉 <strong>Wonderful news!</strong> We're available on your special day!
                  </p>
                  <p className="text-green-600">
                    We're excited to potentially be part of your wedding celebration.
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-amber-700 text-lg mb-2">
                    📅 <strong>We're currently booked</strong> on your selected date.
                  </p>
                  <p className="text-amber-600">
                    Don't worry! We'll discuss alternative dates and options in our response.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* What Happens Next */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-serif text-gray-900 mb-6 text-center">
              What Happens Next?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-light mb-4">
                  <Mail className="w-6 h-6 text-rose-dark" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">1. Confirmation Email</h3>
                <p className="text-gray-600 text-sm">
                  You'll receive a confirmation email within the next few minutes with your inquiry details.
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-light mb-4">
                  <Phone className="w-6 h-6 text-rose-dark" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">2. Personal Response</h3>
                <p className="text-gray-600 text-sm">
                  We'll personally review your inquiry and respond within 24 hours with next steps.
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-light mb-4">
                  <Camera className="w-6 h-6 text-rose-dark" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">3. Consultation</h3>
                <p className="text-gray-600 text-sm">
                  We'll schedule a consultation to discuss your vision and create a custom package.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Social Proof & Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gradient-to-r from-rose-light to-cream rounded-xl shadow-lg p-8 mb-8"
          >
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-lg italic text-gray-700 mb-4">
                "Hariel captured our wedding day perfectly! Every moment was beautifully documented, 
                and we couldn't be happier with our photos. Professional, creative, and so easy to work with!"
              </blockquote>
              <cite className="text-gray-600 font-medium">— Sarah & Michael, 2024</cite>
            </div>
          </motion.div>

          {/* Call to Action Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-serif text-gray-900 mb-4">
                While You Wait...
              </h2>
              
              <p className="text-gray-600 mb-6">
                Explore our recent work and get inspired for your special day!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => navigate('/portfolio')}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose-dark to-rose-DEFAULT text-white rounded-lg hover:from-rose-DEFAULT hover:to-rose-dark transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  View Our Portfolio
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                
                <button
                  onClick={() => navigate('/blog')}
                  className="inline-flex items-center px-6 py-3 border-2 border-rose-dark text-rose-dark rounded-lg hover:bg-rose-dark hover:text-white transition-all duration-300"
                >
                  Read Wedding Stories
                </button>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex justify-center space-x-6">
              <a
                href="https://instagram.com/harielxavierphotography"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:scale-110 transition-transform duration-300"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://facebook.com/harielxavierphotography"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white hover:scale-110 transition-transform duration-300"
              >
                <Facebook className="w-6 h-6" />
              </a>
            </div>
            
            <p className="text-gray-500 text-sm mt-4">
              Follow us for daily inspiration and behind-the-scenes moments
            </p>
          </motion.div>

          {/* Emergency Contact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="text-center mt-8 p-4 bg-gray-50 rounded-lg"
          >
            <p className="text-gray-600 text-sm">
              <strong>Need immediate assistance?</strong> Call us at{' '}
              <a href="tel:+1234567890" className="text-rose-dark hover:underline font-medium">
                (123) 456-7890
              </a>{' '}
              or email{' '}
              <a href="mailto:hello@harielxavierphotography.com" className="text-rose-dark hover:underline font-medium">
                hello@harielxavierphotography.com
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
