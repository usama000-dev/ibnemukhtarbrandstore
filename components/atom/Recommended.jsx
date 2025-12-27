"use client";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Link from "next/link";
import ProductCardSkeleton from "@/components/atom/ProductCardSkeleton";
import useRecommendedAndTrending from "@/hooks/useRecommendedAndTrending";

export default function Recommended() {
  const [activeTab, setActiveTab] = useState("forYou");
  const { loading, forYou, trending } = useRecommendedAndTrending();

  // Decide which list to show
  const list = activeTab === "forYou" ? forYou : trending;

  return (
    <section className="bg-white p-4 my-2">
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded font-semibold ${activeTab === "forYou" ? "bg-gradient-to-r from-[#DD8560] to-[#fbbf24] text-white" : "text-[#DD8560]"}`}
            onClick={() => setActiveTab("forYou")}
          >
            For You
          </button>
          <button
            className={`px-3 py-1 rounded font-semibold ${activeTab === "trending" ? "bg-gradient-to-r from-[#DD8560] to-[#fbbf24] text-white" : "text-[#DD8560]"}`}
            onClick={() => setActiveTab("trending")}
          >
            Trending
          </button>
        </div>
        <Link href={activeTab === "forYou" ? "/all-products/recommended" : "/all-products/trending"} className="text-red-600 text-sm hover:underline font-medium">
          See All →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-1 md:gap-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : list.map((item, idx) => <ProductCard key={item._id || item.slug || item.uniformNumberFormat || idx} product={item} />)
        }
      </div>
    </section>
  );
}
