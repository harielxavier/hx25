import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Save, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  getPortfolioFilters, 
  getFiltersByType,
  createPortfolioFilter,
  updatePortfolioFilter,
  deletePortfolioFilter
} from '../../services/portfolioService';
import { PortfolioFilter, FilterType } from '../../types/portfolio';

const FilterManagement: React.FC = () => {
  // State for filters
  const [filters, setFilters] = useState<PortfolioFilter[]>([]);
  const [newFilter, setNewFilter] = useState<Omit<PortfolioFilter, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    type: FilterType.STYLE,
    order: 0
  });
  const [editingFilter, setEditingFilter] = useState<PortfolioFilter | null>(null);
  const [selectedFilterType, setSelectedFilterType] = useState<FilterType>(FilterType.STYLE);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load filters
  useEffect(() => {
    const loadFilters = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load all filters
        const loadedFilters = await getPortfolioFilters();
        setFilters(loadedFilters);
        
        // Set default order for new filter
        const filtersOfType = loadedFilters.filter(f => f.type === selectedFilterType);
        if (filtersOfType.length > 0) {
          const maxOrder = Math.max(...filtersOfType.map(f => f.order));
          setNewFilter(prev => ({ ...prev, order: maxOrder + 1 }));
        } else {
          setNewFilter(prev => ({ ...prev, order: 1 }));
        }
      } catch (error) {
        console.error('Error loading filters:', error);
        setError('Failed to load filters. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadFilters();
  }, []);
  
  // Filter filters by selected type
  const filteredFilters = filters.filter(filter => filter.type === selectedFilterType);
  
  // Handle filter form submission
  const handleFilterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingFilter) {
        // Update existing filter
        await updatePortfolioFilter(editingFilter.id, {
          name: editingFilter.name,
          type: editingFilter.type,
          order: editingFilter.order
        });
        
        // Update local state
        setFilters(prev => 
          prev.map(filter => 
            filter.id === editingFilter.id ? editingFilter : filter
          )
        );
        
        // Reset editing state
        setEditingFilter(null);
      } else {
        // Create new filter
        const filterId = await createPortfolioFilter(newFilter);
        
        // Update local state
        const createdFilter: PortfolioFilter = {
          id: filterId,
          ...newFilter,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        setFilters(prev => [...prev, createdFilter]);
        
        // Reset form
        setNewFilter({
          name: '',
          type: selectedFilterType,
          order: newFilter.order + 1
        });
      }
    } catch (error) {
      console.error('Error saving filter:', error);
      setError('Failed to save filter. Please try again.');
    }
  };
  
  // Handle filter deletion
  const handleDeleteFilter = async (filterId: string) => {
    if (!window.confirm('Are you sure you want to delete this filter?')) {
      return;
    }
    
    try {
      await deletePortfolioFilter(filterId);
      
      // Update local state
      setFilters(prev => prev.filter(filter => filter.id !== filterId));
    } catch (error) {
      console.error('Error deleting filter:', error);
      setError('Failed to delete filter. Please try again.');
    }
  };
  
  // Handle filter type change
  const handleFilterTypeChange = (type: FilterType) => {
    setSelectedFilterType(type);
    
    // Update new filter form with the selected type
    setNewFilter(prev => ({ 
      ...prev, 
      type,
      // Reset order based on existing filters of this type
      order: Math.max(1, ...filters.filter(f => f.type === type).map(f => f.order + 1))
    }));
  };
  
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Portfolio Filter Management</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <button 
              className="float-right" 
              onClick={() => setError(null)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {/* Filter Type Tabs */}
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            {Object.values(FilterType).map(type => (
              <button
                key={type}
                onClick={() => handleFilterTypeChange(type)}
                className={`py-2 px-4 font-medium ${
                  selectedFilterType === type
                    ? 'border-b-2 border-black text-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)} Filters
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Filter Form */}
          <div>
            <form onSubmit={handleFilterSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-medium mb-4">
                {editingFilter ? 'Edit Filter' : 'Add New Filter'}
              </h3>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="filterName">
                  Filter Name
                </label>
                <input
                  id="filterName"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editingFilter ? editingFilter.name : newFilter.name}
                  onChange={(e) => 
                    editingFilter 
                      ? setEditingFilter({ ...editingFilter, name: e.target.value })
                      : setNewFilter({ ...newFilter, name: e.target.value })
                  }
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="filterType">
                  Filter Type
                </label>
                <select
                  id="filterType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editingFilter ? editingFilter.type : newFilter.type}
                  onChange={(e) => {
                    const type = e.target.value as FilterType;
                    if (editingFilter) {
                      setEditingFilter({ ...editingFilter, type });
                    } else {
                      setNewFilter({ ...newFilter, type });
                      // Also update the selected tab
                      setSelectedFilterType(type);
                    }
                  }}
                  required
                >
                  {Object.values(FilterType).map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="filterOrder">
                  Display Order
                </label>
                <input
                  id="filterOrder"
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editingFilter ? editingFilter.order : newFilter.order}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    editingFilter 
                      ? setEditingFilter({ ...editingFilter, order: value })
                      : setNewFilter({ ...newFilter, order: value });
                  }}
                  required
                />
              </div>
              
              <div className="flex justify-end gap-2">
                {editingFilter && (
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    onClick={() => setEditingFilter(null)}
                  >
                    Cancel
                  </button>
                )}
                
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingFilter ? 'Update Filter' : 'Add Filter'}
                </button>
              </div>
            </form>
          </div>
          
          {/* Filters List */}
          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-medium">
                  {selectedFilterType.charAt(0).toUpperCase() + selectedFilterType.slice(1)} Filters
                </h3>
              </div>
              
              <ul className="divide-y divide-gray-200">
                {loading ? (
                  <li className="p-4 text-center">Loading filters...</li>
                ) : filteredFilters.length === 0 ? (
                  <li className="p-4 text-center text-gray-500">
                    No filters found for this type. Add one using the form.
                  </li>
                ) : (
                  filteredFilters
                    .sort((a, b) => a.order - b.order)
                    .map((filter) => (
                      <li key={filter.id} className="p-4 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-200 text-gray-800 text-xs rounded-full">
                              {filter.order}
                            </span>
                            <h4 className="font-medium">{filter.name}</h4>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingFilter(filter)}
                            className="p-1 text-gray-600 hover:text-black"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteFilter(filter.id)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </li>
                    ))
                )}
              </ul>
            </div>
            
            {/* Filter Usage Information */}
            <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">How to Use Filters</h3>
              <p className="text-sm text-blue-700 mb-2">
                Filters allow you to categorize your galleries for easier navigation:
              </p>
              <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
                <li><strong>Style</strong>: Classic, Modern, Artistic, etc.</li>
                <li><strong>Event Type</strong>: Wedding, Engagement, Family, etc.</li>
                <li><strong>Environment</strong>: Indoor, Outdoor, Urban, Beach, etc.</li>
                <li><strong>Season</strong>: Spring, Summer, Fall, Winter</li>
              </ul>
              <p className="text-sm text-blue-700 mt-2">
                After creating filters, you can assign them to galleries in the Gallery Management section.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FilterManagement;
