import React, { useState, useEffect } from 'react';
import { Search, Plus, Tag, ChevronDown, X } from 'lucide-react';
import { serviceCategories, getServiceCategory, getServiceSubcategory, searchServices, ServiceCategory, ServiceSubcategory } from '../data/serviceCategories';

interface ServiceSelectorProps {
  value: string;
  onChange: (value: string, rate?: number) => void;
  onCustomService?: (name: string, description: string, rate: number) => void;
  className?: string;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  value,
  onChange,
  onCustomService,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customService, setCustomService] = useState({
    name: '',
    description: '',
    rate: 0
  });

  const searchResults = searchQuery ? searchServices(searchQuery) : [];
  const currentCategory = selectedCategory ? getServiceCategory(selectedCategory) : null;

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
  };

  const handleSubcategorySelect = (category: ServiceCategory, subcategory: ServiceSubcategory) => {
    onChange(subcategory.name, subcategory.suggestedRate);
    setIsOpen(false);
    setSelectedCategory('');
    setSearchQuery('');
  };

  const handleCustomServiceSubmit = () => {
    if (customService.name.trim()) {
      onChange(customService.name, customService.rate);
      if (onCustomService) {
        onCustomService(customService.name, customService.description, customService.rate);
      }
      setShowCustomForm(false);
      setIsOpen(false);
      setCustomService({ name: '', description: '', rate: 0 });
    }
  };

  const handleSearchSelect = (result: { category: ServiceCategory; subcategory: ServiceSubcategory }) => {
    handleSubcategorySelect(result.category, result.subcategory);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Select or type service description..."
        />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-hidden">
          {/* Search Bar */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Search services..."
              />
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {searchQuery ? (
              /* Search Results */
              <div className="p-2">
                {searchResults.length > 0 ? (
                  <div className="space-y-1">
                    {searchResults.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchSelect(result)}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 transition-colors"
                      >
                        <div className="font-medium text-gray-900">{result.subcategory.name}</div>
                        <div className="text-xs text-gray-500">{result.category.name}</div>
                        {result.subcategory.description && (
                          <div className="text-xs text-gray-400 mt-1">{result.subcategory.description}</div>
                        )}
                        {result.subcategory.suggestedRate && (
                          <div className="text-xs text-blue-600 mt-1">
                            Suggested rate: ${result.subcategory.suggestedRate}/hr
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-3 py-4 text-center text-gray-500">
                    No services found matching "{searchQuery}"
                  </div>
                )}
              </div>
            ) : selectedCategory ? (
              /* Subcategories */
              <div className="p-2">
                <div className="flex items-center justify-between mb-3 px-2">
                  <h3 className="font-medium text-gray-900">{currentCategory?.name}</h3>
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-1">
                  {currentCategory?.subcategories.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      onClick={() => handleSubcategorySelect(currentCategory, subcategory)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{subcategory.name}</div>
                      {subcategory.description && (
                        <div className="text-xs text-gray-500 mt-1">{subcategory.description}</div>
                      )}
                      {subcategory.suggestedRate && (
                        <div className="text-xs text-blue-600 mt-1">
                          Suggested rate: ${subcategory.suggestedRate}/hr
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Main Categories */
              <div className="p-2">
                <div className="space-y-1">
                  {serviceCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className="w-full text-left px-3 py-3 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <Tag className="w-4 h-4 text-blue-600 mr-3" />
                        <span className="font-medium text-gray-900">{category.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-2">
                          {category.subcategories.length} services
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90" />
                      </div>
                    </button>
                  ))}
                </div>

                {/* Custom Service Option */}
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <button
                    onClick={() => setShowCustomForm(true)}
                    className="w-full text-left px-3 py-3 rounded-md hover:bg-green-50 transition-colors flex items-center text-green-700"
                  >
                    <Plus className="w-4 h-4 mr-3" />
                    <span className="font-medium">Add Custom Service</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Custom Service Form Modal */}
      {showCustomForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add Custom Service</h3>
                <button
                  onClick={() => setShowCustomForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    value={customService.name}
                    onChange={(e) => setCustomService(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter service name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Description
                  </label>
                  <textarea
                    value={customService.description}
                    onChange={(e) => setCustomService(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the service (optional)"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Suggested Rate (per hour)
                  </label>
                  <input
                    type="number"
                    value={customService.rate}
                    onChange={(e) => setCustomService(prev => ({ ...prev, rate: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCustomForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCustomServiceSubmit}
                  disabled={!customService.name.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};