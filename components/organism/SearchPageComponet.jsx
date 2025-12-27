"use client";
import { useCart } from "@/context/CartProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import BorderSection from "../atom/BorderSection";
import SearchSEO from '../atom/SearchSEO';
import ProductCard from "../atom/ProductCard";

const SearchPageComponent = ({ allData }) => {
  const [filteredProducts, setFilteredProducts] = useState(allData || []);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [allTags, setAllTags] = useState([]);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract all unique tags from products
  useEffect(() => {
    const tags = new Set();
    allData.forEach((product) => {
      if (product.tags && Array.isArray(product.tags)) {
        product.tags.forEach(tag => tags.add(tag));
      }
    });
    setAllTags(Array.from(tags).sort());
  }, [allData]);

  const filterProducts = useCallback((searchQuery, categoryQuery, tagQuery) => {
    const q = searchQuery || searchParams.get('q') || '';
    const cat = categoryQuery || searchParams.get('category') || '';
    const tag = tagQuery || searchParams.get('tag') || '';
    
    const filtered = allData.filter(product => {
      const matchesSearch = product.title?.toLowerCase().includes(q.toLowerCase());
      const matchesCategory = !cat || product.category?.toLowerCase() === cat.toLowerCase();
      const matchesTag = !tag || (product.tags && product.tags.includes(tag));
      return matchesSearch && matchesCategory && matchesTag;
    });
    
    setFilteredProducts(filtered);
  }, [allData, searchParams]);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const cat = searchParams.get('category') || '';
    const tag = searchParams.get('tag') || '';
    setQuery(q);
    setCategory(cat);
    setSelectedTag(tag);
    filterProducts(q, cat, tag);
  }, [searchParams, filterProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    updateUrlAndFilter();
  };

  const handleTagClick = (clickedTag) => {
    const newTag = selectedTag === clickedTag ? "" : clickedTag;
    setSelectedTag(newTag);
    
    // Update URL with tag filter
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category) params.set('category', category);
    if (newTag) params.set('tag', newTag);
    
    const queryString = params.toString();
    router.push(`/search${queryString ? `?${queryString}` : ''}`);
    
    filterProducts(query, category, newTag);
  };

  const clearFilters = () => {
    setQuery("");
    setCategory("");
    setSelectedTag("");
    router.push('/search');
  };

  const updateUrlAndFilter = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category) params.set("category", category);
    if (selectedTag) params.set("tag", selectedTag);

    // Update URL without page reload
    router.push(`/search?${params.toString()}`);

    filterProducts(query, category, selectedTag);
  };

  return (
    <div className="p-4 block md:hidden">
      <SearchSEO
        query={query || "all taekwondo & martial arts products"}
        results={filteredProducts.slice(0, 10).map(product => ({
          name: product.title,
          description: product.disc || "Martial arts & taekwondo product from Champion Choice",
          price: product.price || 0,
          currency: "PKR",
          image: product.images?.[0] || "/images/championchoice-logo.png",
          url: `https://www.champzones.com/product/${product.slug}`,
          type: "product"
        }))}
        totalResults={filteredProducts.length}
        url="https://www.champzones.com"
      />
      <h2 className="text-xl text-center mt-16 mb-1">SEARCH</h2>
      <BorderSection />

      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-4 mb-6 relative mt-2"
      >
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="pl-8 border-b p-2 bg-[#FAFBFB] outline-none focus:border-[#DD8560]"
        />
        <button type="submit">
          <CiSearch className="text-xl absolute top-2 left-0" />
        </button>
      </form>

      {/* Active Filters */}
      {(query || category || selectedTag) && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-700">Active Filters:</span>
            <button
              onClick={clearFilters}
              className="text-xs text-red-600 hover:text-red-800 underline"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {query && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Search: &ldquo;{query}&rdquo;
            </span>
            )}
            {category && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Category: {category}
              </span>
            )}
            {selectedTag && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                Tag: {selectedTag}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Tags:</h3>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedTag === tag
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

<div className="grid grid-cols-2 md:ml-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
    </div>
  );
};

export default SearchPageComponent;
