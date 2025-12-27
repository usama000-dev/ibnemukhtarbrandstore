'use client'
import { useEffect, useState, useRef, useCallback } from "react";
import ProductCard from "@/components/atom/ProductCard";
import LoadingComponent from "@/components/atom/LoadingComponent";
import { cancelPendingRequests } from "@/services/api";

export default function TrendingAllProducts() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const LIMIT = 20;

  // Fetch products
  const fetchTrending = useCallback(async (pageNum) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/getProducts?popular=true&page=${pageNum}&limit=${LIMIT}`);
      const data = await res.json();
      if (Array.isArray(data.products)) {
        setProducts(prev => pageNum === 1 ? data.products : [...prev, ...data.products]);
        setHasMore(data.products.length === LIMIT);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      setHasMore(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTrending(page);
    // eslint-disable-next-line
    return () => {
      cancelPendingRequests();
    };
  }, [page]);

  // Infinite scroll observer
  const lastProductRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  return (
    <div className="min-h-screen py-6 px-2 md:px-8 mt-20 md:mt-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center">Trending Products</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.length > 0 ? (
          products.map((product, idx) => {
            if (idx === products.length - 1) {
              return (
                <div ref={lastProductRef} key={product._id || product.slug || product.uniformNumberFormat || idx}>
                  <ProductCard product={product} showDiscountBadge />
                </div>
              );
            } else {
              return (
                <ProductCard key={product._id || product.slug || product.uniformNumberFormat || idx} product={product} showDiscountBadge />
              );
            }
          })
        ) : (
          !loading && <div className="text-center py-10 text-gray-500">No trending products found.</div>
        )}
      </div>
      {loading && <div className="w-full flex justify-center py-6"><LoadingComponent /></div>}
    </div>
  );
}

// Add a simple loader style (you can replace with your own spinner)
// Add this to your global CSS if not present:
// .loader { border: 4px solid #f3f3f3; border-top: 4px solid #e11d48; border-radius: 50%; width: 32px; height: 32px; animation: spin 1s linear infinite; }
// @keyframes spin { 100% { transform: rotate(360deg); } } 