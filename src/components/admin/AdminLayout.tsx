import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from '../Sidebar';
import AdminHeader from './AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title = 'Admin Panel' }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile sidebar */}
      <div className={`md:hidden fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
           onClick={() => setSidebarOpen(false)}>
      </div>
      
      <div className={`fixed inset-y-0 left-0 z-50 md:relative md:z-auto transition-transform duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <Sidebar />
        <button 
          className="md:hidden absolute top-4 right-0 -mr-10 p-1 rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="md:hidden sticky top-0 z-10 flex items-center bg-white border-b border-gray-200 px-4 py-2">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-4 font-semibold">{title}</div>
        </div>
        
        <div className="hidden md:block">
          <AdminHeader title={title} />
        </div>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}