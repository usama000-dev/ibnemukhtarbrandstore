"use client";
import { useState, useEffect } from 'react';
import { IconFilter, IconX, IconChevronDown, IconChevronUp, IconSearch } from '@tabler/icons-react';

export default function FilterSidebar({ 
  filters, 
  setFilters, 
  categories = [], 
  tags = [], 
  sizes = [],
  colors = [],
  onApplyFilters,
  isOpen = true,
  onToggle 
}) {
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    price: true,
    category: true,
    tags: true,
    sizes: true,
    colors: true,
    rating: true,
    availability: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePriceChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(value);
    setPriceRange(newRange);
  };

  const handleSearchChange = (e) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value
    }));
  };

  const handleCategoryChange = (category) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === category ? '' : category
    }));
  };

  const handleTagChange = (tag) => {
    console.log('Tag clicked:', tag, 'Current tags:', filters.tags);
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSizeChange = (size) => {
    console.log('Size clicked:', size, 'Current sizes:', filters.sizes);
    setFilters(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) 
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleColorChange = (color) => {
    console.log('Color clicked:', color, 'Current colors:', filters.colors);
    setFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(color) 
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handleRatingChange = (rating) => {
    setFilters(prev => ({
      ...prev,
      rating: prev.rating === rating ? 0 : rating
    }));
  };

  const handleAvailabilityChange = (availability) => {
    setFilters(prev => ({
      ...prev,
      availability: prev.availability === availability ? '' : availability
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: '',
      tags: [],
      sizes: [],
      colors: [],
      rating: 0,
      availability: '',
      minPrice: 0,
      maxPrice: 10000,
      sortBy: 'newest',
      search: ''
    });
    setPriceRange([0, 10000]);
  };

  const applyFilters = () => {
    setFilters(prev => ({
      ...prev,
      minPrice: priceRange[0],
      maxPrice: priceRange[1]
    }));
    onApplyFilters();
  };

  const hasActiveFilters = () => {
    return filters.category || 
           filters.tags.length > 0 || 
           filters.sizes.length > 0 ||
           filters.colors.length > 0 ||
           filters.rating > 0 || 
           filters.availability ||
           filters.search ||
           priceRange[0] > 0 || 
           priceRange[1] < 10000;
  };

  return (
    <div className={`bg-white border-r border-gray-200 w-80 h-full overflow-y-auto transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconFilter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
          </div>
          <button
            onClick={onToggle}
            className="md:hidden p-1 hover:bg-gray-100 rounded"
          >
            <IconX className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {hasActiveFilters() && (
          <button
            onClick={clearAllFilters}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="border-b border-gray-100 pb-4">
          <button
            onClick={() => toggleSection('search')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <h4 className="font-medium text-gray-800">Search</h4>
            {expandedSections.search ? (
              <IconChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <IconChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.search && (
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filters.search || ''}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="border-b border-gray-100 pb-4">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <h4 className="font-medium text-gray-800">Price Range</h4>
            {expandedSections.price ? (
              <IconChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <IconChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.price && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(0, e.target.value)}
                  placeholder="Min"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(1, e.target.value)}
                  placeholder="Max"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-xs text-gray-500">
                Range: Rs.{priceRange[0]}/_ - Rs.{priceRange[1]}/_
              </div>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="border-b border-gray-100 pb-4">
          <button
            onClick={() => toggleSection('category')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <h4 className="font-medium text-gray-800">Categories</h4>
            {expandedSections.category ? (
              <IconChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <IconChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.category && (
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === category}
                    onChange={() => handleCategoryChange(category)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-sm text-gray-700 capitalize">{category}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="border-b border-gray-100 pb-4">
          <button
            onClick={() => toggleSection('tags')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <h4 className="font-medium text-gray-800">Tags</h4>
            {expandedSections.tags ? (
              <IconChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <IconChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.tags && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {tags.map((tag) => (
                <label key={tag} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={filters.tags.includes(tag)}
                    onChange={() => handleTagChange(tag)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700 capitalize">{tag}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Sizes */}
        <div className="border-b border-gray-100 pb-4">
          <button
            onClick={() => toggleSection('sizes')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <h4 className="font-medium text-gray-800">Sizes</h4>
            {expandedSections.sizes ? (
              <IconChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <IconChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.sizes && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {sizes.map((size) => (
                <label key={size} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={filters.sizes.includes(size)}
                    onChange={() => handleSizeChange(size)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700 capitalize">{size}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Colors */}
        <div className="border-b border-gray-100 pb-4">
          <button
            onClick={() => toggleSection('colors')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <h4 className="font-medium text-gray-800">Colors</h4>
            {expandedSections.colors ? (
              <IconChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <IconChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.colors && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {colors.map((color) => (
                <label key={color} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={filters.colors.includes(color)}
                    onChange={() => handleColorChange(color)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700 capitalize">{color}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Ratings */}
        <div className="border-b border-gray-100 pb-4">
          <button
            onClick={() => toggleSection('rating')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <h4 className="font-medium text-gray-800">Rating</h4>
            {expandedSections.rating ? (
              <IconChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <IconChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.rating && (
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.rating === rating}
                    onChange={() => handleRatingChange(rating)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div className="flex items-center gap-1">
                    {[...Array(rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-sm">★</span>
                    ))}
                    <span className="text-sm text-gray-600 ml-1">& up</span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Availability */}
        <div className="border-b border-gray-100 pb-4">
          <button
            onClick={() => toggleSection('availability')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <h4 className="font-medium text-gray-800">Availability</h4>
            {expandedSections.availability ? (
              <IconChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <IconChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.availability && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="radio"
                  name="availability"
                  checked={filters.availability === 'in-stock'}
                  onChange={() => handleAvailabilityChange('in-stock')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm text-gray-700">In Stock</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="radio"
                  name="availability"
                  checked={filters.availability === 'flash-sale'}
                  onChange={() => handleAvailabilityChange('flash-sale')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm text-gray-700">Flash Sale</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="radio"
                  name="availability"
                  checked={filters.availability === 'featured'}
                  onChange={() => handleAvailabilityChange('featured')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm text-gray-700">Featured</span>
              </label>
            </div>
          )}
        </div>

        {/* Sort By */}
        <div className="border-b border-gray-100 pb-4">
          <h4 className="font-medium text-gray-800 mb-3">Sort By</h4>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>

        {/* Apply Filters Button */}
        <button
          onClick={applyFilters}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
} 