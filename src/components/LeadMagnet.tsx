import React, { useState, useEffect } from 'react';
import { X, Download, Mail } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

interface LeadMagnetProps {
  delay?: number; // Delay in milliseconds before showing
  exitIntent?: boolean; // Show on exit intent
}

export default function LeadMagnet({ delay = 30000, exitIntent = true }: LeadMagnetProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    weddingDate: '',
    referralSource: ''
  });

  useEffect(() => {
    // Show after delay if not shown before
    const timer = setTimeout(() => {
      const hasShown = sessionStorage.getItem('leadMagnetShown');
      if (!hasShown) {
        setShowModal(true);
        sessionStorage.setItem('leadMagnetShown', 'true');
      }
    }, delay);

    // Exit intent detection
    if (exitIntent) {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0) {
          const hasShown = sessionStorage.getItem('leadMagnetShown');
          if (!hasShown) {
            setShowModal(true);
            sessionStorage.setItem('leadMagnetShown', 'true');
          }
        }
      };

      document.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        document.removeEventListener('mouseleave', handleMouseLeave);
        clearTimeout(timer);
      };
    }

    return () => clearTimeout(timer);
  }, [delay, exitIntent]);

  useEffect(() => {
    loadLeadMagnets();
  }, []);

  async function loadLeadMagnets() {
    try {
      // For now, just set the default guide since we're migrating from Supabase
      setSelectedGuide({
        id: 'style-guide',
        title: 'What to Wear for Your Engagement Session',
        description: 'Complete style guide for your engagement photoshoot',
        file_url: '/MoStuff/What+to+wear+on+an+engagement+session+by+Hariel+Xavier+Photography.pdf',
        thumbnail_url: '/images/engagement-style-guide-cover.jpg',
        is_active: true
      });
    } catch (error) {
      console.error('Error loading lead magnets:', error);
      // Set default guide on error
      setSelectedGuide({
        id: 'style-guide',
        title: 'What to Wear for Your Engagement Session',
        description: 'Complete style guide for your engagement photoshoot',
        file_url: '/MoStuff/What+to+wear+on+an+engagement+session+by+Hariel+Xavier+Photography.pdf',
        thumbnail_url: '/images/engagement-style-guide-cover.jpg',
        is_active: true
      });
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Record lead magnet download in Firebase
      await addDoc(collection(db, 'lead_magnet_downloads'), {
        lead_magnet_id: selectedGuide.id,
        ...formData,
        created_at: Timestamp.now()
      });

      // Record conversion event in Firebase
      await addDoc(collection(db, 'conversion_events'), {
        event_type: 'lead_magnet',
        form_data: formData,
        page_path: window.location.pathname,
        created_at: Timestamp.now()
      });

      // Close modal and redirect to download
      setShowModal(false);
      window.open(selectedGuide.file_url, '_blank');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (!showModal || !selectedGuide) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full relative animate-scale-up overflow-hidden">
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Image Section - PDF Cover */}
          <div className="w-full md:w-1/2 h-64 md:h-auto relative">
            <img
              src="/MoStuff/whattowear.png" 
              alt="What to Wear for Your Engagement Session - Style Guide Cover"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                // First fallback - try the PDF directly if image doesn't exist
                target.src = "/MoStuff/whattowear.pdf";
                // Add another error handler for the PDF fallback
                target.onerror = () => {
                  // Second fallback - use a stock image if PDF display fails
                  target.src = "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
                };
              }}
            />
          </div>
          
          {/* Content Section */}
          <div className="w-full md:w-1/2 p-8">
            <div className="mb-6">
              <h4 className="text-sm font-medium tracking-widest text-gray-500 uppercase mb-2">FREE STYLE GUIDE</h4>
              <h3 className="text-2xl font-serif font-bold mb-4">What to Wear for Your Engagement Session</h3>
              <p className="text-gray-600 mb-4">Get our complete guide with:</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span>Seasonal style tips for any weather</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span>Color coordination advice for stunning photos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span>Location-specific outfit recommendations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span>Shopping suggestions for every budget</span>
                </li>
              </ul>
            </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email..."
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:border-black transition-colors"
              required
            />
            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            <Download className="w-4 h-4" />
            GET YOUR FREE GUIDE
          </button>

          <p className="text-center text-xs text-gray-500 mt-2">
            By downloading this guide, you'll also receive our best photography tips and wedding inspiration.
            You can unsubscribe at any time.
          </p>

          <input type="hidden" value="Style Guide" name="lead_magnet_type" />
        </form>
      </div>
    </div>

      </div>
    </div>
  );
}
