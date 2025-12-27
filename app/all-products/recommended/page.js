'use client'
import { useEffect, useState } from "react";
import ProductCard from "@/components/atom/ProductCard";
import useRecommendedAndTrending from "@/hooks/useRecommendedAndTrending";
import LoadingComponent from "@/components/atom/LoadingComponent";

export default function RecommendedAllProducts() {
  const [activeTab, setActiveTab] = useState("forYou");
  const { loading, allForYou, allTrending } = useRecommendedAndTrending();

  const getFiltered = () => {
    if (activeTab === "forYou") {
      return allForYou;
    } else {
      return allTrending;
    }
  };

  if (loading) return <div className="p-6"><LoadingComponent /></div>;

  return (
    <div className="min-h-screen py-6 px-2 md:px-8 mt-20 md:mt-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center">Recommended & For You</h1>
      <div className="flex gap-4 mb-4 justify-center">
        <button
          className={`pb-1 ${activeTab === "forYou" ? "text-red-600 border-b-2 border-red-600" : "text-gray-600"}`}
          onClick={() => setActiveTab("forYou")}
        >
          For You
        </button>
        <button
          className={`pb-1 ${activeTab === "trending" ? "text-red-600 border-b-2 border-red-600" : "text-gray-600"}`}
          onClick={() => setActiveTab("trending")}
        >
          Trending
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {getFiltered().length > 0 ? (
          getFiltered().map((product, idx) => (
            <ProductCard key={product._id || product.slug || product.uniformNumberFormat || idx} product={product} showDiscountBadge showCountdown />
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">No recommended products or uniforms found.</div>
        )}
      </div>
    </div>
  );
} 