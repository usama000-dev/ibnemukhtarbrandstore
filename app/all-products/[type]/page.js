"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/atom/ProductCard";
import { useParams } from "next/navigation";
import BorderSection from "@/components/atom/BorderSection";
import LoadingComponent from "@/components/atom/LoadingComponent";
import ProductCardSkeleton from "@/components/atom/ProductCardSkeleton";
import { cancelPendingRequests } from "@/services/api";

const typeTitles = {
  featured: "Featured Products",
  limited: "Limited Time Deals",
  "flash-sale": "Flash Sale",
  recommended: "Recommended Products",
  popular: "Popular Products",
};

function filterProducts(products, type) {
  const now = new Date();
  switch (type) {
    case "featured":
      return products.filter((p) => p.featured === true);
    case "limited":
      return products.filter((p) => {
        const hasDiscount =
          p.discountPercent > 0 ||
          (p.flashPrice && p.flashPrice < p.price);
        if (p.flashEnd) {
          const flashEndDate = new Date(p.flashEnd);
          if (isNaN(flashEndDate) || flashEndDate <= now) return false;
        }
        return hasDiscount;
      });
    case "flash-sale":
      return products.filter((p) => {
        if (!p.flashStart || !p.flashEnd) return false;
        const start = new Date(p.flashStart);
        const end = new Date(p.flashEnd);
        return start <= now && end > now;
      });
    case "recommended":
      return products.filter((p) => p.recommended === true);
    case "popular":
      return products.filter((p) => p.popular === true);
    default:
      return [];
  }
}

export default function AllProductsPage() {
  const params = useParams();
  const type = params?.type;
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const observer = useRef();

  const categoriesParam = searchParams.get("categories");
  const categories = categoriesParam ? categoriesParam.split(",") : [];

  const fetchFeatured = useCallback(async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/featuredProducts?page=${pageNum}&limit=24`);
      const data = await res.json();
      setProducts((prev) => pageNum === 1 ? (data.featuredProducts || []) : [...prev, ...(data.featuredProducts || [])]);
      setTotalPages(data.totalPages || 1);
      setHasMore(pageNum < (data.totalPages || 1));
    } catch (e) {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLimited = useCallback(async () => {
    setLoading(true);
    try {
      const resP = await fetch(`/api/getProducts`);
      const dataP = await resP.json();
      const filteredProducts = (dataP.products || []).filter((p) => {
        const hasDiscount = p.discountPercent > 0 || (p.flashPrice && p.flashPrice < p.price);
        const now = new Date();
        if (p.flashEnd) {
          const flashEndDate = new Date(p.flashEnd);
          if (isNaN(flashEndDate) || flashEndDate <= now) return false;
        }
        return hasDiscount;
      });
      setProducts(filteredProducts);
      setHasMore(false);
    } catch (e) {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    if (type === "featured") {
      fetchFeatured(1);
    } else if (type === "limited") {
      fetchLimited();
    } else {
      setLoading(true);
      fetch("/api/getProducts")
        .then((res) => res.json())
        .then((data) => {
          setProducts(data.products || []);
          setHasMore(false);
        })
        .finally(() => setLoading(false));
    }
    return () => {
      cancelPendingRequests();
    };
  }, [type, fetchFeatured, fetchLimited]);

  const lastProductRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    if (type === "featured" && page > 1 && hasMore) {
      fetchFeatured(page);
    }
    return () => {
      cancelPendingRequests();
    };
  }, [page, type, hasMore, fetchFeatured]);

  let filtered = [];
  if (type === "featured" || type === "limited") {
    filtered = products;
  } else if (type === "recommended" && categories.length > 0) {
    filtered = products.filter((p) => categories.includes(p.category));
  } else {
    filtered = filterProducts(products, type);
  }
  const title = typeTitles[type] || "Products";

  return (
    <div className="min-h-screen py-6 px-2 md:px-8 mt-20 md:mt-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center">{title} <BorderSection className="my-2" /></h1>
      {loading && page === 1 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No products found for this section.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filtered.map((product, idx) => {
            if (type === "featured" && idx === filtered.length - 1) {
              return <ProductCard ref={lastProductRef} key={product._id} product={product} />;
            }
            return <ProductCard key={product._id} product={product} />;
          })}
        </div>
      )}
      {loading && page > 1 && (<div className="mb-2"><LoadingComponent /></div>)}
      {!hasMore && filtered.length > 0 && (
        <div className="text-center text-gray-400 py-4">All products loaded.</div>
      )}
    </div>
  );
}