import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Lock, Instagram } from 'lucide-react';
import { useEffect } from 'react';

export default function Footer() {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://app.studioninja.co/client-assets/form-render/assets/scripts/iframeResizer.js';
    script.dataset.iframeId = 'sn-form-fj5vo';
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
    <>
      <div className="grid grid-cols-1">
        <div className="flex justify-center">
          <iframe 
            height="699" 
            style={{ minWidth: '100%', maxWidth: '600px', border: '0' }} 
            id="sn-form-fj5vo"
            src="https://app.studioninja.co/contactform/parser/0a800fc8-7fbb-1621-817f-cbe6e7e26016/0a800fc8-7fbb-1621-817f-d37610217750"
            allowFullScreen
          />
        </div>
      </div>
      <footer className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Brand */}
            <div>
              <div className="mb-4">
                <img 
                  src="/MoStuff/Asset 1.png" 
                  alt="Hariel Xavier Photography" 
                  className="h-16 w-auto" 
                />
              </div>
              <p className="text-gray-400"></p>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="text-lg font-light mb-4 text-accent">Explore</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/portfolio" 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/wedding" 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Wedding Photography
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about" 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/blog" 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Admin Login */}
            <div>
              <h3 className="text-lg font-light mb-4 text-accent">Admin</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/admin/login" 
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Lock className="w-4 h-4" />
                    Admin Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-light mb-4 text-accent">Connect</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>Hi@HarielXavier.com</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span>(862) 290-4349</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>Sparta, NJ</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Instagram className="w-4 h-4" />
                  <a href="https://instagram.com/harielxaviermedia" target="_blank" rel="noopener noreferrer">
                    @harielxaviermedia
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Hariel Xavier Photography. All rights reserved.</p>
            <p className="mt-2">
              <a 
                href="https://www.devority.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                A Devority Website
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
