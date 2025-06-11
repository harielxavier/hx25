import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown,
  Globe,
  Calendar
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

// Sample data for pages
const samplePages = [
  {
    id: '1',
    title: 'Home',
    slug: '/',
    status: 'published',
    lastUpdated: '2025-03-20T10:30:00Z',
    author: 'Admin',
    views: 12450
  },
  {
    id: '2',
    title: 'About',
    slug: '/about',
    status: 'published',
    lastUpdated: '2025-03-15T14:20:00Z',
    author: 'Admin',
    views: 5230
  },
  {
    id: '3',
    title: 'Services',
    slug: '/services',
    status: 'published',
    lastUpdated: '2025-03-10T09:15:00Z',
    author: 'Admin',
    views: 4120
  },
  {
    id: '4',
    title: 'Portfolio',
    slug: '/portfolio',
    status: 'published',
    lastUpdated: '2025-03-05T16:45:00Z',
    author: 'Admin',
    views: 7890
  },
  {
    id: '5',
    title: 'Contact',
    slug: '/contact',
    status: 'published',
    lastUpdated: '2025-02-28T11:20:00Z',
    author: 'Admin',
    views: 3560
  },
  {
    id: '6',
    title: 'Pricing',
    slug: '/pricing',
    status: 'draft',
    lastUpdated: '2025-03-22T08:10:00Z',
    author: 'Admin',
    views: 0
  },
  {
    id: '7',
    title: 'FAQ',
    slug: '/faq',
    status: 'published',
    lastUpdated: '2025-03-18T13:40:00Z',
    author: 'Admin',
    views: 2340
  },
  {
    id: '8',
    title: 'Terms & Conditions',
    slug: '/terms',
    status: 'published',
    lastUpdated: '2025-01-15T10:00:00Z',
    author: 'Admin',
    views: 980
  }
];

export default function PagesManager() {
  const [pages, setPages] = React.useState(samplePages);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [sortField, setSortField] = React.useState('lastUpdated');
  const [sortDirection, setSortDirection] = React.useState('desc');
  const [selectedPages, setSelectedPages] = React.useState<string[]>([]);
  const [showActions, setShowActions] = React.useState<string | null>(null);

  // Filter and sort pages
  const filteredPages = pages
    .filter(page => {
      // Filter by search query
      const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           page.slug.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by status
      const matchesStatus = selectedStatus === 'all' || page.status === selectedStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortField === 'title') {
        return sortDirection === 'asc' 
          ? a.title.localeCompare(b.title) 
          : b.title.localeCompare(a.title);
      } else if (sortField === 'views') {
        return sortDirection === 'asc' 
          ? a.views - b.views 
          : b.views - a.views;
      } else {
        // Default sort by lastUpdated
        return sortDirection === 'asc' 
          ? new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime() 
          : new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      }
    });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Toggle sort direction
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Toggle page selection
  const togglePageSelection = (id: string) => {
    if (selectedPages.includes(id)) {
      setSelectedPages(selectedPages.filter(pageId => pageId !== id));
    } else {
      setSelectedPages([...selectedPages, id]);
    }
  };

  // Toggle select all pages
  const toggleSelectAll = () => {
    if (selectedPages.length === filteredPages.length) {
      setSelectedPages([]);
    } else {
      setSelectedPages(filteredPages.map(page => page.id));
    }
  };

  // Handle page deletion
  const handleDeletePage = (id: string) => {
    setPages(pages.filter(page => page.id !== id));
    setSelectedPages(selectedPages.filter(pageId => pageId !== id));
    setShowActions(null);
  };

  // Handle bulk actions
  const handleBulkDelete = () => {
    setPages(pages.filter(page => !selectedPages.includes(page.id)));
    setSelectedPages([]);
  };

  const handleBulkPublish = () => {
    setPages(pages.map(page => 
      selectedPages.includes(page.id) 
        ? { ...page, status: 'published' } 
        : page
    ));
  };

  const handleBulkDraft = () => {
    setPages(pages.map(page => 
      selectedPages.includes(page.id) 
        ? { ...page, status: 'draft' } 
        : page
    ));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your website pages
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/admin/page-editor"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Page
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {selectedPages.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{selectedPages.length} selected</span>
                <button
                  onClick={handleBulkPublish}
                  className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
                >
                  Publish
                </button>
                <button
                  onClick={handleBulkDraft}
                  className="px-3 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200"
                >
                  Draft
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Pages Table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={selectedPages.length === filteredPages.length && filteredPages.length > 0}
                          onChange={toggleSelectAll}
                        />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort('title')}
                    >
                      <div className="flex items-center">
                        <span>Title</span>
                        {sortField === 'title' && (
                          sortDirection === 'asc' ? 
                            <ArrowUp className="ml-1 h-4 w-4" /> : 
                            <ArrowDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort('lastUpdated')}
                    >
                      <div className="flex items-center">
                        <span>Last Updated</span>
                        {sortField === 'lastUpdated' && (
                          sortDirection === 'asc' ? 
                            <ArrowUp className="ml-1 h-4 w-4" /> : 
                            <ArrowDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort('views')}
                    >
                      <div className="flex items-center">
                        <span>Views</span>
                        {sortField === 'views' && (
                          sortDirection === 'asc' ? 
                            <ArrowUp className="ml-1 h-4 w-4" /> : 
                            <ArrowDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPages.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={selectedPages.includes(page.id)}
                          onChange={() => togglePageSelection(page.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{page.title}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Globe className="h-3 w-3 mr-1" />
                              {page.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          page.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {page.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {formatDate(page.lastUpdated)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1 text-gray-400" />
                          {page.views.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <a 
                            href={`https://example.com${page.slug}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <Eye className="h-5 w-5" />
                          </a>
                          <Link 
                            to={`/admin/page-editor?id=${page.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <div className="relative">
                            <button
                              onClick={() => setShowActions(showActions === page.id ? null : page.id)}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <MoreVertical className="h-5 w-5" />
                            </button>
                            {showActions === page.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                <div className="py-1">
                                  <button
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                    onClick={() => {
                                      // Duplicate page logic
                                      const newPage = {
                                        ...page,
                                        id: Date.now().toString(),
                                        title: `${page.title} (Copy)`,
                                        slug: `${page.slug}-copy`,
                                        views: 0
                                      };
                                      setPages([...pages, newPage]);
                                      setShowActions(null);
                                    }}
                                  >
                                    <Copy className="h-4 w-4 mr-2" />
                                    Duplicate
                                  </button>
                                  <button
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                                    onClick={() => handleDeletePage(page.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredPages.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500">No pages found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{filteredPages.length}</span> of <span className="font-medium">{pages.length}</span> pages
            </div>
            <div className="flex-1 flex justify-end">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  1
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
  );
}
