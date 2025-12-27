// app/api/categories/route.js

import connectDb from "@/middleware/mongoose";
import { Product } from "@/models/Product";

export const GET = async () => {
  try {
    await connectDb();

    // Get all products with category and images
    const products = await Product.find({}, 'category images');

    const categoryMap = {};

    // Group products by category
    products.forEach(prod => {
      const cat = prod.category;
      if (!categoryMap[cat]) categoryMap[cat] = [];
      categoryMap[cat].push(prod);
    });

    const featuredCategories = [];
    
    for (const [category, items] of Object.entries(categoryMap)) {
      const randomProduct = items[Math.floor(Math.random() * items.length)];
      featuredCategories.push({
        _id: category.toLowerCase().replace(/\s+/g, "-"), // slug-like ID
        name: category,
        image: randomProduct.images?.[0] || null,
        productCount: items.length,
      });
    }

    // All categories (names only)
    const allCategories = featuredCategories.map(cat => ({
        _id: cat._id,
        name: cat.name,
        image: cat.image,
        productCount: cat.productCount,
      }));
    // Popular categories (top 3 by product count)
    const popularCategories = [...featuredCategories]
      .sort((a, b) => b.productCount - a.productCount)
      .slice(0, 3);

    return new Response(JSON.stringify({
      allCategories,            // array of names
      popularCategories,        // array of objects
      featuredCategories        // array of objects
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("âŒ Error in GET /api/categories:", error.message);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", message: error.message }),
      { status: 500 }
    );
  }
};
