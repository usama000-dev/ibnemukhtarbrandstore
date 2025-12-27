"use client";
import { useEffect, useState } from "react";
import CountdownTimer from "../molecules/CountdownTimer";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { cancelPendingRequests } from "@/services/api";

export default function FlashSale() {
  const [flashProducts, setFlashProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/getProducts");
        const data = await res.json();
        const now = new Date();

        const flashFiltered = data.products.filter((product) => {
          const start = product.flashStart ? new Date(product.flashStart) : null;
          const end = product.flashEnd ? new Date(product.flashEnd) : null;
          return (
            start && end &&
            now >= start && now <= end &&
            product.flashPrice && product.flashPrice < product.price
          );
        });

        setFlashProducts(flashFiltered.slice(0, 6));
      } catch (error) {
        console.error("Failed to load flash sale products:", error);
      }
    };
    fetchProducts();
    return () => {
      cancelPendingRequests();
    };
  }, []);

  const closestEnd = flashProducts
    .map(p => new Date(p.flashEnd))
    .filter(d => !isNaN(d) && d > new Date())
    .sort((a, b) => a - b)[0];

  return (
    <section className="bg-white p-4 my-2">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold">Flash Sale</h2>
          {closestEnd && (
            <CountdownTimer targetDate={closestEnd} />
          )}
        </div>
        <Link href="/all-products/flash-sale" className="text-red-600 text-sm">See All →</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-5 xl:grid-6 gap-1">
        {flashProducts.length > 0 ? (
          flashProducts.map((product) => (
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
