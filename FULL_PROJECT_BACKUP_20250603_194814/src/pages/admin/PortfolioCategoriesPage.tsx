import { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Image, ExternalLink, Folder } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PortfolioCategory, getPortfolioCategories, deletePortfolioCategory } from '../../services/portfolioCategoryService';
import cloudinaryService from '../../services/cloudinaryService';

export default function PortfolioCategoriesPage() {
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<PortfolioCategory | null>(null);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getPortfolioCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error loading portfolio categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Handle delete
  const handleDeleteClick = (category: PortfolioCategory) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      await deletePortfolioCategory(categoryToDelete.id);
      setCategories(categories.filter(c => c.id !== categoryToDelete.id));
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Portfolio Categories</h1>
        <Link 
          to="/admin/portfolio-categories/new" 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          <span>New Category</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {categories.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-2">No portfolio categories yet</h3>
              <p className="text-gray-500 mb-4">Create your first category to organize your portfolio</p>
              <p className="text-gray-600 italic">Use the "New Category" button in the header to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 overflow-hidden relative">
                    {category.coverImage ? (
                      <img 
                        src={cloudinaryService.getCloudinaryUrl(
                          category.coverImage,
                          cloudinaryService.CloudinaryPreset.MEDIUM
                        )} 
                        alt={category.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Folder className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-1">
                      <span className="flex items-center text-xs px-2 py-1 rounded">
                        <Image className="w-4 h-4 mr-1 text-gray-500" />
                        {category.imageCount || 0}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{category.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {category.description ? (
                        category.description.length > 100 ? 
                          `${category.description.substring(0, 100)}...` : 
                          category.description
                      ) : 'No description provided'}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        {category.slug && (
                          <span className="inline-block bg-gray-100 rounded px-2 py-1">
                            {category.slug}
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Link 
                          to={`/portfolio/${category.slug}`} 
                          target="_blank"
                          className="text-indigo-600 hover:text-indigo-900"
                          title="View category"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </Link>
                        <Link 
                          to={`/admin/portfolio-categories/edit/${category.id}`} 
                          className="text-amber-600 hover:text-amber-900"
                          title="Edit category"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(category)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete category"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-500 mb-4">
              Are you sure you want to delete the category "{categoryToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
