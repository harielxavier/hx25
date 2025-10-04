import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import LeadCaptureSection from './LeadCaptureSection';

export default function SiteFooter() {
  // Current year for copyright notice
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative bg-gray-900 text-white">
      {/* Lead Form Section */}
      <LeadCaptureSection />
      
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-1">
            <div className="mb-4">
              <Link to="/" className="text-2xl font-bold text-white">Hariel Xavier</Link>
            </div>
            <p className="text-gray-400 mb-4">
              Capturing moments, creating memories. Professional photography services for weddings, 
              portraits, events, and commercial shoots.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="https://instagram.com/harielxavierphotography" target="_blank" rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com/harielxavierphotography" target="_blank" rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="mailto:hi@harielxavier.com" 
                className="text-gray-400 hover:text-white transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/wedding" className="text-gray-400 hover:text-white transition-colors">
                  Wedding Photography
                </Link>
              </li>
              <li>
                <Link to="/wedding-video" className="text-gray-400 hover:text-white transition-colors">
                  Wedding Videography
                </Link>
              </li>
              <li>
                <Link to="/galleries" className="text-gray-400 hover:text-white transition-colors">
                  Galleries
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">
                  Pricing & Packages
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Information */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-gray-400" />
                <p className="text-gray-400">
                  New York City, New York & serving clients nationwide
                </p>
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-gray-400" />
                <a href="tel:+18623914179" className="text-gray-400 hover:text-white transition-colors">
                  (862) 391-4179
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-gray-400" />
                <a href="mailto:hi@harielxavier.com" className="text-gray-400 hover:text-white transition-colors">
                  hi@harielxavier.com
                </a>
              </div>
            </div>
          </div>
          
          {/* Newsletter Signup */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for photography tips, special offers, and updates.
            </p>
            <form className="flex items-center">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 rounded-l bg-gray-800 border border-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 transition-colors p-2 rounded-r"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {currentYear} Hariel Xavier Photography. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="text-sm text-gray-500 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-sm text-gray-500 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/client-login" className="text-sm text-gray-500 hover:text-white transition-colors">
                Client Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
