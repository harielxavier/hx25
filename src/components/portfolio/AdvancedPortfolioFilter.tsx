import React, { useState, useEffect } from 'react';
import { Filter, X, ChevronDown, Check } from 'lucide-react';

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface FilterCategory {
  id: string;
  label: string;
  options: FilterOption[];
  multiSelect?: boolean;
}

interface AdvancedPortfolioFilterProps {
  categories: FilterCategory[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (categoryId: string, selectedOptions: string[]) => void;
  onClearFilters: () => void;
  className?: string;
  layout?: 'horizontal' | 'vertical' | 'dropdown';
  showCounts?: boolean;
}

export default function AdvancedPortfolioFilter({
  categories,
  selectedFilters,
  onFilterChange,
  onClearFilters,
  className = '',
  layout = 'horizontal',
  showCounts = true
}: AdvancedPortfolioFilterProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Initialize expanded state for all categories
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    categories.forEach(category => {
      initialExpanded[category.id] = layout === 'vertical';
    });
    setExpandedCategories(initialExpanded);
  }, [categories, layout]);
  
  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  
  // Toggle a filter option
  const toggleFilter = (categoryId: string, optionId: string) => {
    const currentSelected = selectedFilters[categoryId] || [];
    const category = categories.find(c => c.id === categoryId);
    
    let newSelected: string[];
    
    // If multiSelect is enabled or not specified, toggle the option
    if (category?.multiSelect !== false) {
      if (currentSelected.includes(optionId)) {
        newSelected = currentSelected.filter(id => id !== optionId);
      } else {
        newSelected = [...currentSelected, optionId];
      }
    } else {
      // For single select, replace the current selection
      newSelected = currentSelected.includes(optionId) ? [] : [optionId];
    }
    
    onFilterChange(categoryId, newSelected);
  };
  
  // Check if any filters are applied
  const hasActiveFilters = Object.values(selectedFilters).some(
    options => options && options.length > 0
  );
  
  // Count total active filters
  const activeFilterCount = Object.values(selectedFilters).reduce(
    (count, options) => count + (options ? options.length : 0), 
    0
  );
  
  // Render horizontal layout
  const renderHorizontalLayout = () => (
    <div className="portfolio-filters-horizontal">
      <div className="flex flex-wrap items-center gap-4">
        {categories.map(category => (
          <div key={category.id} className="relative">
            <button
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              onClick={() => toggleCategory(category.id)}
            >
              {category.label}
              {selectedFilters[category.id]?.length > 0 && (
                <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                  {selectedFilters[category.id].length}
                </span>
              )}
              <ChevronDown className={`ml-2 h-4 w-4 inline-block transition-transform ${expandedCategories[category.id] ? 'rotate-180' : ''}`} />
            </button>
            
            {expandedCategories[category.id] && (
              <div className="absolute z-10 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg">
                <div className="py-1 max-h-60 overflow-auto">
                  {category.options.map(option => (
                    <button
                      key={option.id}
                      className={`w-full text-left px-4 py-2 flex items-center justify-between hover:bg-gray-100 ${
                        selectedFilters[category.id]?.includes(option.id) ? 'bg-rose-50 text-rose-700' : 'text-gray-700'
                      }`}
                      onClick={() => toggleFilter(category.id, option.id)}
                    >
                      <span className="flex items-center">
                        {selectedFilters[category.id]?.includes(option.id) && (
                          <Check className="mr-2 h-4 w-4 text-rose-500" />
                        )}
                        {option.label}
                      </span>
                      {showCounts && option.count !== undefined && (
                        <span className="text-xs text-gray-500">{option.count}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {hasActiveFilters && (
          <button
            className="px-4 py-2 text-sm font-medium text-rose-600 hover:text-rose-800 focus:outline-none"
            onClick={onClearFilters}
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
  
  // Render vertical layout
  const renderVerticalLayout = () => (
    <div className="portfolio-filters-vertical">
      <div className="space-y-6">
        {categories.map(category => (
          <div key={category.id}>
            <button
              className="flex items-center justify-between w-full text-left font-medium text-gray-900 hover:text-rose-600"
              onClick={() => toggleCategory(category.id)}
            >
              <span>{category.label}</span>
              <ChevronDown className={`h-5 w-5 transition-transform ${expandedCategories[category.id] ? 'rotate-180' : ''}`} />
            </button>
            
            {expandedCategories[category.id] && (
              <div className="mt-2 pl-2 space-y-2">
                {category.options.map(option => (
                  <div key={option.id} className="flex items-center">
                    <input
                      type={category.multiSelect === false ? 'radio' : 'checkbox'}
                      id={`filter-${category.id}-${option.id}`}
                      name={`filter-${category.id}`}
                      className={category.multiSelect === false ? 'form-radio text-rose-600' : 'form-checkbox text-rose-600'}
                      checked={selectedFilters[category.id]?.includes(option.id) || false}
                      onChange={() => toggleFilter(category.id, option.id)}
                    />
                    <label 
                      htmlFor={`filter-${category.id}-${option.id}`}
                      className="ml-2 text-sm text-gray-700 cursor-pointer"
                    >
                      {option.label}
                      {showCounts && option.count !== undefined && (
                        <span className="ml-1 text-xs text-gray-500">({option.count})</span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {hasActiveFilters && (
          <button
            className="text-sm font-medium text-rose-600 hover:text-rose-800 focus:outline-none"
            onClick={onClearFilters}
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
  
  // Render dropdown layout (mobile-friendly)
  const renderDropdownLayout = () => (
    <div className="portfolio-filters-dropdown">
      <button
        className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
      >
        <Filter className="mr-2 h-5 w-5" />
        Filters
        {activeFilterCount > 0 && (
          <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
            {activeFilterCount}
          </span>
        )}
      </button>
      
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-40 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                 aria-hidden="true"
                 onClick={() => setMobileFiltersOpen(false)}></div>
            
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                  <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                      <button
                        type="button"
                        className="ml-3 h-7 flex items-center justify-center"
                        onClick={() => setMobileFiltersOpen(false)}
                      >
                        <X className="h-6 w-6 text-gray-400 hover:text-gray-500" aria-hidden="true" />
                      </button>
                    </div>
                    
                    <div className="mt-8">
                      {renderVerticalLayout()}
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                    <div className="flex justify-between">
                      <button
                        type="button"
                        className="text-sm font-medium text-rose-600 hover:text-rose-500"
                        onClick={onClearFilters}
                        disabled={!hasActiveFilters}
                      >
                        Clear all
                      </button>
                      <button
                        type="button"
                        className="bg-rose-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                        onClick={() => setMobileFiltersOpen(false)}
                      >
                        Apply filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
  // Render the appropriate layout
  return (
    <div className={`portfolio-filters ${className}`}>
      {layout === 'horizontal' && renderHorizontalLayout()}
      {layout === 'vertical' && renderVerticalLayout()}
      {layout === 'dropdown' && renderDropdownLayout()}
    </div>
  );
}
