import { cancelPendingRequests } from '@/services/api';
import { useState, useEffect, useCallback } from 'react';

export default function useProductFilters() {
  const [filters, setFilters] = useState({
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

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    tags: [],
    sizes: [],
    colors: []
  });

  const fetchFilteredProducts = useCallback(async (filterParams = filters, page = 1) => {
    console.log('Fetching filtered products with params:', filterParams);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/products/filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...filterParams,
          page,
          limit: 50
        }),
      });

      const data = await response.json();
      console.log('Filter API response:', data);

      if (data.success) {
        setProducts(data.products);
        setPagination(data.pagination);
        setFilterOptions(data.filters);
      } else {
        setError(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Fetch products error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    const defaultFilters = {
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
    };
    setFilters(defaultFilters);
    fetchFilteredProducts(defaultFilters, 1);
  }, [fetchFilteredProducts]);

  const applyFilters = useCallback(() => {
    console.log('Applying filters:', filters);
    fetchFilteredProducts(filters, 1);
  }, [filters, fetchFilteredProducts]);

  const loadMore = useCallback(() => {
    if (pagination.hasNextPage) {
      fetchFilteredProducts(filters, pagination.currentPage + 1);
    }
  }, [filters, pagination, fetchFilteredProducts]);

  // Initial load - don't call filter API immediately
  useEffect(() => {
    // Only load filter options, not products
    const loadFilterOptions = async () => {
      try {
        const response = await fetch('/api/products/filter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            limit: 1 // Just get filter options
          }),
        });

        const data = await response.json();
        if (data.success) {
          setFilterOptions(data.filters);
        }
      } catch (err) {
        console.error('Load filter options error:', err);
      }
    };

    loadFilterOptions();
    return () => {
      cancelPendingRequests();
    };
  }, []);

  return {
    filters,
    products,
    loading,
    error,
    pagination,
    filterOptions,
    updateFilters,
    clearFilters,
    applyFilters,
    loadMore,
    fetchFilteredProducts
  };
} 