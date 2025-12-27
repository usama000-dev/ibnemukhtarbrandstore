"use client";

import { useState } from "react";

export default function ProductDetailError() {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = () => {
    setRetrying(true);

    // full page refresh (best for server component retry)
    window.location.reload();
  };

  return (
    <div className="w-full flex flex-col items-center py-10 text-gray-700">

      <span style={{ fontSize: "3rem" }}>⚠️</span>

      <h2 className="text-2xl mt-3 font-semibold">Failed to Load Product</h2>

      <p className="mt-1 text-base bg-gradient-to-r from-[#DD8560] to-[#fbbf24] bg-clip-text text-transparent">
        Something went wrong while loading product details.
      </p>

      <button
        onClick={handleRetry}
        disabled={retrying}
        className="mt-5 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 duration-200 flex items-center gap-2 disabled:opacity-50"
      >
        <span style={{ fontSize: "1.4rem" }}>🔄</span>
        {retrying ? "Retrying..." : "Try Again"}
      </button>
    </div>
  );
}
