import { useState } from 'react';
import { ArrowRight, Calendar, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import OptimizedImage from '../common/OptimizedImage';

export default function Hero() {
  const [showBookingModal, setShowBookingModal] = useState(false);

  return (
    <div className="relative h-screen">
      {/* Hero Video Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Optimized poster image for better performance */}
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src="https://res.cloudinary.com/dos0qac90/image/upload/v1649789940/hero-wedding.jpg"
            alt="Wedding couple in romantic setting"
            type="hero"
            priority={true}
            className="w-full h-full"
            objectFit="cover"
          />
        </div>
        
        {/* Video only loads after page is ready to avoid performance hit */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute min-w-full min-h-full object-cover z-10"
          poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" // Transparent placeholder
        >
          <source 
            src="https://res.cloudinary.com/dos0qac90/video/upload/q_auto/v1649789940/wedding-hero-video.mp4" 
            type="video/mp4" 
          />
        </video>
        
        <div className="absolute inset-0 bg-black bg-opacity-40 z-20" />
      </div>

      {/* Booking Banner */}
      <div className="absolute top-0 w-full bg-gold/90 text-black py-3 cursor-pointer hover:bg-gold transition-colors"
           onClick={() => setShowBookingModal(true)}>
        <div className="container mx-auto text-center">
          <p className="text-sm font-serif tracking-wide flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Limited dates available for 2024/2025 Weddings</span>
            <ArrowRight className="w-4 h-4" />
          </p>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative h-full flex items-center justify-center text-center text-white px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="animate-fade-in-down">
            <p className="text-gold uppercase tracking-[0.2em] font-light">Award-Winning Wedding Photography</p>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight mt-4">
              Your <span className="text-rose-dark">Love</span> Story,
              <br className="hidden sm:block" />
              <span className="italic">Beautifully <span className="text-rose-dark">Told</span></span>
            </h1>
            <p className="text-lg md:text-xl font-light max-w-2xl mx-auto tracking-wide mt-6">
              Capturing timeless moments and authentic emotions across New York, New Jersey, and beyond.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8 animate-fade-in-up">
            <button 
              onClick={() => setShowBookingModal(true)}
              className="w-full md:w-auto bg-primary text-white px-12 py-4 hover:bg-primary-dark transition-all duration-300 group"
            >
              Check Availability
              <ArrowRight className="inline-block ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
            <Link 
              to="/contact"
              className="w-full md:w-auto border-2 border-white text-white px-12 py-4 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
            >
              Contact Me
            </Link>
          </div>

          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-6 md:gap-12 text-center animate-fade-in-up">
            <div>
              <p className="font-serif text-4xl text-gold">300+</p>
              <p className="text-sm uppercase tracking-wider mt-1">Weddings</p>
            </div>
            <div>
              <p className="font-serif text-4xl text-gold">11+</p>
              <p className="text-sm uppercase tracking-wider mt-1">Years</p>
            </div>
            <div>
              <p className="font-serif text-4xl text-gold">50+</p>
              <p className="text-sm uppercase tracking-wider mt-1">Destinations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center">
        <div className="animate-bounce">
          <div className="w-[1px] h-16 bg-white mx-auto mb-4" />
          <p className="uppercase tracking-[0.2em] text-xs font-light">Explore</p>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-8 relative animate-scale-up">
            <button 
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-8">
              <h3 className="font-serif text-3xl mb-2">Check Availability</h3>
              <p className="text-gray-600">Let's create something beautiful together</p>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name*"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name*"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                  required
                />
              </div>
              
              <input
                type="email"
                placeholder="Email Address*"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                required
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder="Phone Number*"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                  required
                />
                <input
                  type="date"
                  placeholder="Wedding Date"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                />
              </div>
              
              <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-gold focus:ring-1 focus:ring-gold transition-colors">
                <option value="">Select Package</option>
                <option value="wedding">Wedding Collection</option>
                <option value="engagement">Engagement Session</option>
                <option value="destination">Destination Wedding</option>
              </select>
              
              <textarea
                placeholder="Tell me about your vision..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              />
              
              <button
                type="submit"
                className="w-full bg-gold text-black px-8 py-4 rounded-lg hover:bg-gold/90 transition-all duration-300 tracking-widest uppercase text-sm"
              >
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
