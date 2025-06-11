import { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Image, ExternalLink, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Gallery, getAllGalleries, deleteGallery } from '../../services/galleryService';
import cloudinaryService from '../../services/cloudinaryService';

export default function GalleriesPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [galleryToDelete, setGalleryToDelete] = useState<Gallery | null>(null);

  // Load galleries
  useEffect(() => {
    const loadGalleries = async () => {
      try {
        const data = await getAllGalleries();
        setGalleries(data);
      } catch (error) {
        console.error('Error loading galleries:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGalleries();
  }, []);

  // Handle delete
  const handleDeleteClick = (gallery: Gallery) => {
    setGalleryToDelete(gallery);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!galleryToDelete) return;
    
    try {
      await deleteGallery(galleryToDelete.id);
      setGalleries(galleries.filter(g => g.id !== galleryToDelete.id));
      setShowDeleteModal(false);
      setGalleryToDelete(null);
    } catch (error) {
      console.error('Error deleting gallery:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Client Galleries</h1>
        <Link 
          to="/admin/galleries/new" 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          <span>New Gallery</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {galleries.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-2">No client galleries yet</h3>
              <p className="text-gray-500 mb-4">Create your first client gallery to share with your clients</p>
              <p className="text-gray-600 italic">Use the "New Gallery" button in the header to get started</p>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gallery</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Images</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clients</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {galleries.map((gallery) => (
                    <tr key={gallery.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden">
                            {gallery.coverImage ? (
                              <img 
                                src={cloudinaryService.getCloudinaryUrl(
                                  gallery.coverImage,
                                  cloudinaryService.CloudinaryPreset.THUMBNAIL
                                )} 
                                alt={gallery.title} 
                                className="h-10 w-10 object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 bg-gray-200 flex items-center justify-center">
                                <Image className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{gallery.title}</div>
                            <div className="text-sm text-gray-500">{gallery.description?.substring(0, 30)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Image className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">{gallery.imageCount || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          gallery.isPublic ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {gallery.isPublic ? 'Public' : 'Private'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-gray-400 mr-2" />
                          <span>3</span> {/* This would come from your client gallery service */}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {gallery.createdAt ? new Date(gallery.createdAt.toMillis()).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Link 
                            to={gallery.slug ? `/gallery/${gallery.slug}` : `/admin/galleries/${gallery.id}`} 
                            target="_blank"
                            className="text-indigo-600 hover:text-indigo-900"
                            title="View gallery"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </Link>
                          <Link 
                            to={`/admin/galleries/${gallery.id}/images`} 
                            className="text-blue-600 hover:text-blue-900"
                            title="Manage images"
                          >
                            <Image className="w-5 h-5" />
                          </Link>
                          <Link 
                            to={`/admin/galleries/${gallery.id}/clients`} 
                            className="text-purple-600 hover:text-purple-900"
                            title="Manage clients"
                          >
                            <Users className="w-5 h-5" />
                          </Link>
                          <Link 
                            to={`/admin/galleries/edit/${gallery.id}`} 
                            className="text-amber-600 hover:text-amber-900"
                            title="Edit gallery"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(gallery)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete gallery"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              Are you sure you want to delete the gallery "{galleryToDelete?.title}"? 
              This will also delete all images and client access to this gallery. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
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
