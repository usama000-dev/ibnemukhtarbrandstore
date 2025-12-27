"use client";
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { cancelPendingRequests } from '@/services/api';

export default function DealSection({ title, subtitle, timer }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDealProducts = async () => {
      try {
        const res = await fetch("/api/products/filter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            availability: 'flash-sale',
            limit: 8,
            sortBy: 'newest'
          }),
        });

        const data = await res.json();
        if (data.success) {
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("Failed to load deal products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDealProducts();
    return () => {
      cancelPendingRequests();
    };
  }, []);

  if (loading) {
    return (
      <section className="px-3 py-4 bg-white mt-2">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-lg font-bold">{title}</h2>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
          {timer && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Ends in:</span>
              {timer}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="w-full h-40 bg-gray-200 rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null; // Don't show section if no products
  }

  return (
    <section className="px-3 py-4 bg-white mt-2">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        {timer && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Ends in:</span>
            {timer}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      
      <button className="w-full border border-gray-300 rounded-md py-2 mt-3 text-sm text-gray-700 flex items-center justify-center">
        View More <span className="ml-1">&#8250;</span>
      </button>
    </section>
  );
}