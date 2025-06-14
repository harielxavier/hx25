import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import ManagedImage from '../shared/ManagedImage';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    // Portfolio link removed as requested
    { label: 'Showcase', path: '/showcase' },
    { label: 'About', path: '/about' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Blog', path: '/blog' }
  ];

  // Tool links removed as requested

  return (
    <nav 
      role="navigation"
      aria-label="Main navigation"
      className="fixed w-full z-50 bg-white shadow-sm py-4"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            aria-label="Home"
            className="transition-colors"
          >
            <img
              src="/black.png"
              alt="Hariel Xavier Photography Logo"
              className="h-20 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-base tracking-wide transition-colors text-black hover:text-gray-600 ${location.pathname === link.path ? 'font-medium' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Tools Dropdown removed as requested */}
            
            <Link 
              to="/book-now"
              className="px-6 py-2 text-base tracking-wide transition-colors bg-black text-white hover:bg-gray-900"
            >
              Book Now
            </Link>
            <Link 
              to="/admin"
              className="text-base tracking-wide transition-colors text-gray-500 hover:text-black"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="text-black md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div 
            id="mobile-menu"
            className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden"
          >
            <div className="container mx-auto py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-black hover:text-gray-600 transition-colors py-2 text-sm tracking-wide"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Photography Tools Links removed as requested */}
              
              <Link 
                to="/book-now"
                className="block w-full bg-rose text-white text-center py-3 text-sm tracking-wide hover:bg-rose-dark"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Book Now
              </Link>
              <Link 
                to="/admin"
                className="block text-gray-500 hover:text-black transition-colors py-2 text-sm tracking-wide"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
