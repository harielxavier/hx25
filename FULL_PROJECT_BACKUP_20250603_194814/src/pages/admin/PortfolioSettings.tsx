import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Briefcase, 
  Globe, 
  Settings,
  Tag
} from 'lucide-react';
import { 
  getAllGalleries, 
  updateGallery, 
  Gallery,
  getPublicGalleries
} from '../../services/galleryService';

export default function PortfolioSettings() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [publicGalleries, setPublicGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');

  // Load galleries
  useEffect(() => {
    loadGalleries();
  }, []);

  const loadGalleries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get all galleries
      const allGalleries = await getAllGalleries();
      setGalleries(allGalleries);
      
      // Get public galleries
      const public_galleries = await getPublicGalleries();
      setPublicGalleries(public_galleries);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(allGalleries.map(gallery => gallery.category))
      ).filter(Boolean) as string[];
      
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading galleries:', error);
      setError('Failed to load galleries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle public status
  const togglePublic = async (gallery: Gallery) => {
    try {
      await updateGallery(gallery.id, { isPublic: !gallery.isPublic });
      await loadGalleries();
    } catch (error) {
      console.error('Error updating gallery:', error);
      setError('Failed to update gallery. Please try again.');
    }
  };
  
  // Add new category
  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  // Filter non-public galleries
  const privateGalleries = galleries.filter(gallery => !gallery.isPublic);

  return (
    <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Portfolio Settings</h1>
        </div>

        {/* Guide */}
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-md">
          <h2 className="font-bold text-lg mb-2 flex items-center">
            <Briefcase className="w-5 h-5 mr-2" />
            Portfolio Page Management
          </h2>
          <p className="mb-2">Control which galleries appear in your portfolio and how they are categorized.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Galleries marked as "Public" will appear in your portfolio</li>
            <li>Categories help visitors filter and find specific types of work</li>
            <li>Your portfolio showcases all your public work to potential clients</li>
          </ul>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Tag className="w-5 h-5 mr-2 text-purple-500" />
            Portfolio Categories
          </h2>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Categories help visitors filter your work. Add the types of photography you offer.
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((category, index) => (
                <span 
                  key={index}
                  className="px-3 py-1.5 bg-gray-100 rounded-full text-sm flex items-center"
                >
                  {category}
                </span>
              ))}
              
              {categories.length === 0 && (
                <span className="text-gray-400 text-sm">No categories defined yet</span>
              )}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add new category..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md flex-grow"
              />
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Public Galleries */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-green-500" />
            Public Galleries ({publicGalleries.length})
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          ) : publicGalleries.length === 0 ? (
            <div className="bg-gray-50 border border-gray-100 rounded-md p-8 text-center">
              <p className="text-gray-500 mb-4">No galleries are currently public.</p>
              <p className="text-sm text-gray-400">Make galleries public to display them in your portfolio.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gallery
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Featured
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {publicGalleries.map((gallery) => (
                    <tr key={gallery.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{gallery.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {gallery.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {gallery.featured ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Not Featured
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => togglePublic(gallery)}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
                        >
                          Make Private
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Private Galleries */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-gray-500" />
            Private Galleries ({privateGalleries.length})
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          ) : privateGalleries.length === 0 ? (
            <div className="bg-gray-50 border border-gray-100 rounded-md p-8 text-center">
              <p className="text-gray-500">All your galleries are currently public.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gallery
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Featured
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {privateGalleries.map((gallery) => (
                    <tr key={gallery.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{gallery.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {gallery.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {gallery.featured ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Not Featured
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => togglePublic(gallery)}
                          className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-green-100 hover:text-green-800 transition-colors"
                        >
                          Make Public
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
  );
}
