"use client";

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm relative animate-pulse">
      <div className="w-full h-40 bg-gray-200"></div>
      <div className="p-2">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded mb-1"></div>
        <div className="h-3 bg-gray-200 rounded mb-2"></div>
        <div className="h-6 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
} 