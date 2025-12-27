'use client'
import { useEffect, useState } from "react";
import ProductCard from "@/components/atom/ProductCard";
import LoadingComponent from "@/components/atom/LoadingComponent";
import { cancelPendingRequests } from "@/services/api";

export default function FlashSaleAllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const res = await fetch("/api/getProducts");
        const data = await res.json();
        const now = new Date();

        const flashProducts = (data.products || []).filter((product) => {
          const start = product.flashStart ? new Date(product.flashStart) : null;
          const end = product.flashEnd ? new Date(product.flashEnd) : null;
          return (
            start && end &&
            now >= start && now <= end &&
            product.flashPrice && product.flashPrice < product.price
          );
        });

        setProducts(flashProducts);
      } catch (err) {
        setProducts([]);
      }
      setLoading(false);
    }
    fetchAll();
    return () => {
      cancelPendingRequests();
    };
  }, []);

  if (loading) return <div className="p-6"><LoadingComponent /></div>;

  return (
    <div className="min-h-screen py-6 px-2 md:px-8 mt-20 md:mt-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center">Flash Sale</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} showDiscountBadge showCountdown />
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">No flash sale products found.</div>
        )}
      </div>
    </div>
  );
}