"use client";
import { useEffect, useState } from "react";
import CountdownTimer from "../molecules/CountdownTimer";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { cancelPendingRequests } from "@/services/api";

export default function LimitedDeals() {
  const [limitedDeals, setLimitedDeals] = useState([]);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await fetch("/api/getProducts");
        const data = await res.json();

        const now = new Date();
        // Filter products
        const filtered = data.products.filter((product) => {
          const hasDiscount =
            product.discountPercent > 0 ||
            (product.flashPrice && product.flashPrice < product.price);
          if (product.flashEnd) {
            const flashEndDate = new Date(product.flashEnd);
            if (isNaN(flashEndDate) || flashEndDate <= now) {
              return false;
            }
          }
          return hasDiscount;
        });

        setLimitedDeals(filtered.slice(0, 6));
      } catch (error) {
        console.error("❌ Failed to fetch limited deals:", error);
      }
    };
    fetchDeals();
    return () => {
      cancelPendingRequests();
    };
  }, []);

  // Find the closest flash end date for countdown
  const closestEnd = limitedDeals
    .map(p => new Date(p.flashEnd))
    .filter(d => !isNaN(d) && d > new Date())
    .sort((a, b) => a - b)[0];

  return (
    <section className="bg-white p-4 my-2">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold">Limited Time Deals</h2>
          {/* {closestEnd && <CountdownTimer targetDate={closestEnd} />} */}
        </div>
        <Link href="/all-products/limited" className="text-red-600 text-sm">See All →</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 xl:grid-6 gap-3">
        {limitedDeals.length > 0 ? (
          limitedDeals.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              showDiscountBadge
              showCountdown
            />
          ))
        ) : (
          <p className="text-sm text-gray-500">This deal will be available soon.</p>
        )}
      </div>
    </section>
  );
}
