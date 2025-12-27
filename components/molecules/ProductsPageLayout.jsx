"use client";
import { IconFilter } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import ProductCard from "../atom/ProductCard";
import FilterSidebar from "../atom/FilterSidebar";

const ProductsPageLayout = ({ product, category, tag }) => {
  const [allTags, setAllTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(tag || "");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    tags: [],
    sizes: [],
    colors: [],
    rating: 0,
    availability: "",
    minPrice: 0,
    maxPrice: 10000,
    sortBy: "newest",
    search: "",
  });
  const router = useRouter();

  // Extract all unique tags, categories, sizes, and colors from products
  useEffect(() => {
    const tags = new Set();
    const categories = new Set();
    const sizes = new Set();
    const colors = new Set();

    Object.values(product).forEach((prod) => {
      if (prod.tags && Array.isArray(prod.tags)) {
        prod.tags.forEach((tag) => tags.add(tag));
      }
      if (prod.category) {
        categories.add(prod.category);
      }
      if (prod.size) {
        sizes.add(prod.size);
      }
      if (prod.color) {
        colors.add(prod.color);
      }
    });

    setAllTags(Array.from(tags).sort());
  }, [product]);

  // Get filter options from products
  const filterOptions = useMemo(() => {
    const categories = new Set();
    const tags = new Set();
    const sizes = new Set();
    const colors = new Set();

    Object.values(product).forEach((prod) => {
      if (prod.category) categories.add(prod.category);
      if (prod.tags && Array.isArray(prod.tags)) {
        prod.tags.forEach((tag) => tags.add(tag));
      }
      if (prod.size) sizes.add(prod.size);
      if (prod.color) colors.add(prod.color);
    });

    return {
      categories: Array.from(categories).sort(),
      tags: Array.from(tags).sort(),
      sizes: Array.from(sizes).sort(),
      colors: Array.from(colors).sort(),
    };
  }, [product]);

  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    let filtered = Object.values(product);

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (prod) =>
          prod.title?.toLowerCase().includes(searchLower) ||
          prod.disc?.toLowerCase().includes(searchLower) ||
          (prod.tags &&
            prod.tags.some((tag) => tag.toLowerCase().includes(searchLower)))
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter((prod) => prod.category === filters.category);
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(
        (prod) =>
          prod.tags && prod.tags.some((tag) => filters.tags.includes(tag))
      );
    }

    // Sizes filter
    if (filters.sizes.length > 0) {
      filtered = filtered.filter((prod) => filters.sizes.includes(prod.size));
    }

    // Colors filter
    if (filters.colors.length > 0) {
      filtered = filtered.filter((prod) => filters.colors.includes(prod.color));
    }

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter((prod) => prod.rating >= filters.rating);
    }

    // Price filter
    if (filters.minPrice > 0 || filters.maxPrice < 10000) {
      filtered = filtered.filter((prod) => {
        const price = prod.flashPrice || prod.price;
        return price >= filters.minPrice && price <= filters.maxPrice;
      });
    }

    // Availability filter
    if (filters.availability) {
      switch (filters.availability) {
        case "in-stock":
          filtered = filtered.filter((prod) => prod.availability > 0);
          break;
        case "flash-sale":
          filtered = filtered.filter(
            (prod) => prod.flashPrice && prod.flashEnd > new Date()
          );
          break;
        case "featured":
          filtered = filtered.filter((prod) => prod.featured);
          break;
      }
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "price-low":
          return (a.flashPrice || a.price) - (b.flashPrice || b.price);
        case "price-high":
          return (b.flashPrice || b.price) - (a.flashPrice || a.price);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "popular":
          return (b.views || 0) - (a.views || 0);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  }, [product, filters]);

  const handleTagClick = (clickedTag) => {
    const newTag = selectedTag === clickedTag ? "" : clickedTag;
    setSelectedTag(newTag);

    // Update URL with tag filter
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (newTag) params.set("tag", newTag);

    const queryString = params.toString();
    router.push(`/products${queryString ? `?${queryString}` : ""}`);
  };

  const clearFilters = () => {
    setSelectedTag("");
    setFilters({
      category: "",
      tags: [],
      sizes: [],
      colors: [],
      rating: 0,
      availability: "",
      minPrice: 0,
      maxPrice: 10000,
      sortBy: "newest",
      search: "",
    });
    router.push("/products");
  };

  const handleApplyFilters = () => {
    // Filters are applied automatically through useMemo
    setShowFilters(false); // Close sidebar on mobile
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Convert array to object format for consistent rendering
  const getProductObject = (products) => {
    if (Array.isArray(products)) {
      const productObj = {};
      products.forEach((prod, index) => {
        productObj[index] = prod;
      });
      return productObj;
    }
    return products;
  };

  const finalProducts = getProductObject(filteredProducts);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Filter Sidebar - Desktop */}
      <div className="hidden lg:block">
        <FilterSidebar
          filters={filters}
          setFilters={updateFilters}
          categories={filterOptions.categories}
          tags={filterOptions.tags}
          sizes={filterOptions.sizes}
          colors={filterOptions.colors}
          onApplyFilters={handleApplyFilters}
          isOpen={true}
        />
      </div>

      {/* Mobile Filter Overlay */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="block md:hidden absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute left-0 top-0 h-full">
            <FilterSidebar
              filters={filters}
              setFilters={updateFilters}
              categories={filterOptions.categories}
              tags={filterOptions.tags}
              sizes={filterOptions.sizes}
              colors={filterOptions.colors}
              onApplyFilters={handleApplyFilters}
              isOpen={showFilters}
              onToggle={() => setShowFilters(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1">
        <section className="bg-white-900 body-font pb-8">
          <div className="container px-5 py-24 mx-auto">
            {/* Filter Header */}
            <div className="filter flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <span className="text-gray-600">
                  {Object.keys(finalProducts).length} RESULTS
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center justify-center gap-1 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <IconFilter className="w-4 h-4" />
                  <span className="text-sm">Filters</span>
                </button>
              </div>
            </div>

            {/* Active Filters */}
            {(category ||
              selectedTag ||
              filters.category ||
              filters.tags.length > 0 ||
              filters.sizes.length > 0 ||
              filters.colors.length > 0 ||
              filters.rating > 0 ||
              filters.availability) && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Active Filters:
                  </span>
                  <button
                    onClick={clearFilters}
                    className="text-xs text-red-600 hover:text-red-800 underline"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Category: {category}
                    </span>
                  )}
                  {selectedTag && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Tag: {selectedTag}
                    </span>
                  )}
                  {filters.category && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      Filter: {filters.category}
                    </span>
                  )}
                  {filters.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                    >
                      Tag: {tag}
                    </span>
                  ))}
                  {filters.sizes.map((size, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                    >
                      Size: {size}
                    </span>
                  ))}
                  {filters.colors.map((color, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm"
                    >
                      Color: {color}
                    </span>
                  ))}
                  {filters.rating > 0 && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      Rating: {filters.rating}+ stars
                    </span>
                  )}
                  {filters.availability && (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                      {filters.availability}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Tags Filter */}
            {allTags.length > 0 && (
              <div
                className="mb-6 gap-2 xs:hidden">
                {" "}
                <h3 className="text-sm font-medium text-gray-700 mb-2 w-full">
                  Filter by Tags:
                </h3>
                <div
                  className="flex flex-nowrap gap-2 overflow-x-auto max-w-[310px] sm:max-w-[370px] md:max-w-full rounded-lg scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50 px-1 py-2 border bg-white shadow-sm"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      type="button"
                      className={`whitespace-nowrap mt-2 px-3 py-1 text-sm rounded-full border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95 select-none
                        ${
                          selectedTag === tag
                            ? "bg-blue-600 text-white border-blue-600 shadow-md"
                            : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-100 hover:text-blue-700"
                        }
                      `}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
              {Object.keys(finalProducts).map((key) => (
                <ProductCard
                  key={finalProducts[key]._id}
                  product={finalProducts[key]}
                />
              ))}
            </div>

            {/* No Products Found */}
            {Object.keys(finalProducts).length === 0 && (
              <div className="text-center py-20">
                <div className="text-gray-500 text-lg mb-4">
                  No products found
                </div>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductsPageLayout;
