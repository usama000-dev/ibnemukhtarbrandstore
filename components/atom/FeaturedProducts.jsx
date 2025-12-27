"use client";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { cancelPendingRequests } from "@/services/api";

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await fetch("/api/featuredProducts");
        const data = await res.json();
        // Split products/uniforms
        const prods = (data.featuredProducts || []).filter(p => !p.isUniform).slice(0, 3);
        const unis = (data.featuredProducts || []).filter(p => p.isUniform).slice(0, 3);
        let merged = [...prods, ...unis];
        if (merged.length < 6) {
          // Fill from remaining
          const moreProds = (data.featuredProducts || []).filter(p => !p.isUniform).slice(3, 6 - unis.length);
          const moreUnis = (data.featuredProducts || []).filter(p => p.isUniform).slice(3, 6 - prods.length);
          merged = [...prods, ...unis, ...moreProds, ...moreUnis].slice(0, 6);
        }
        setFeaturedProducts(merged);
      } catch (error) {
        console.error("Failed to load featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
    return () => {
      cancelPendingRequests();
    };
  }, []);

  if (loading) {
    return (
      <section className="bg-white p-4 my-2">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">Featured Products</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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

  if (featuredProducts.length === 0) {
    return null; // Don't show section if no featured products
  }

  return (
    <section className="bg-white p-4 my-2">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">Featured Products</h2>
        <Link href="/all-products/featured" className="text-red-600 text-sm">See All →</Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-5 xl:grid-6 gap-3">
        {featuredProducts && featuredProducts.length > 0 && featuredProducts.map((product) => (
          <ProductCard 
            key={product._id} 
            product={product}
            showDiscountBadge
            showCountdown
          />
        ))}
      </div>
    </section>
  );
} 