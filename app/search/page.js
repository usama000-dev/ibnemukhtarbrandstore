import SearchPageCompoent from "@/components/organism/SearchPageComponet";
import { connectDb } from "@/middleware/mongodb";
import mongoose from "mongoose";
import { Suspense } from "react";
import SearchSEO from "@/components/atom/SearchSEO";
import { Product } from "@/models/Product";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Search Products - Ibnemukhtar | Find Winter Jackets & Shoes",
  description: "Search for winter jackets, shoes, and accessories at Ibnemukhtar Brand Store. Find exactly what you're looking for with our advanced search.",
  keywords: [
    "search winter jackets",
    "search shoes",
    "product search",
    "Ibnemukhtar search",
    "find jackets",
    "find shoes",
  ],
};

const Page = async ({ searchParams }) => {
  // First await the database connection
  if (mongoose.connections[0].readyState !== 1) {
    await connectDb();
  }

  // Extract search parameters
  const q = searchParams?.q || "";
  const category = searchParams?.category || "";
  const tag = searchParams?.tag || "";

  // Build filter query
  const filter = {};
  if (q) filter.title = { $regex: q, $options: "i" };
  if (category) filter.category = category;
  if (tag) filter.tags = { $in: [tag] };

  const Products = await Product.find(filter);

  // Prepare search results data for SEO
  const searchResults = Products.slice(0, 10).map(product => ({
    name: product.title,
    description: product.disc || "Martial arts product from Champion Choice",
    price: product.price || 0,
    currency: "PKR",
    image: product.images?.[0] || "/images/championchoice-logo.png",
    url: `https://www.champzones.com/product/${product.slug}`,
    type: "product"
  }));

  return (
    <>
      <SearchSEO
        query={q || "all products"}
        results={searchResults}
        totalResults={Products.length}
        url="https://www.champzones.com/"
      />
      <Suspense fallback={<div>Loading Search...</div>}>
        <SearchPageCompoent allData={JSON.parse(JSON.stringify(Products))} />
      </Suspense>
    </>
  );
};

export default Page;
