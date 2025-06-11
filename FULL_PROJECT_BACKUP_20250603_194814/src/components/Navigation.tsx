import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="text-2xl font-light">
            XAVIER STUDIO
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/work" className="text-sm hover:text-gray-600 transition-colors">
              Work
            </Link>
            <Link to="/about" className="text-sm hover:text-gray-600 transition-colors">
              About
            </Link>
            <Link to="/pricing" className="text-sm hover:text-gray-600 transition-colors">
              Pricing
            </Link>
            <Link to="/wedding" className="text-sm hover:text-gray-600 transition-colors">
              Wedding
            </Link>
            <Link to="/blog" className="text-sm hover:text-gray-600 transition-colors">
              Blog
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/work" 
                className="text-sm hover:text-gray-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Work
              </Link>
              <Link 
                to="/about" 
                className="text-sm hover:text-gray-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/pricing" 
                className="text-sm hover:text-gray-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                to="/wedding" 
                className="text-sm hover:text-gray-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Wedding
              </Link>
              <Link 
                to="/blog" 
                className="text-sm hover:text-gray-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Blog
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
