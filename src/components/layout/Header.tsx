import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Bell, Settings, User } from 'lucide-react';
import { useSupabaseAuth as useAuth } from '../../contexts/SupabaseAuthContext';

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Camera className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">PhotoCRM</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/calendar"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
            >
              Calendar
            </Link>
            <Link
              to="/clients"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
            >
              Clients
            </Link>
            <Link
              to="/services"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
            >
              Services
            </Link>
            <Link
              to="/gallery"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
            >
              Gallery
            </Link>
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-blue-600">
              <Bell className="w-5 h-5" />
            </button>
            <Link to="/settings" className="text-gray-500 hover:text-blue-600">
              <Settings className="w-5 h-5" />
            </Link>
            <div className="relative group">
              <button className="flex items-center gap-2 text-sm focus:outline-none">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <span className="hidden md:block font-medium text-gray-700">
                  {user?.user_metadata?.full_name || user?.email || 'Account'}
                </span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}