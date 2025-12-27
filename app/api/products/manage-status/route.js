import connectDb from "@/middleware/mongoose";
import { Product } from "@/models/Product";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    await connectDb();
    
    const { productId, updates } = await req.json();
    
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Validate updates object
    const allowedUpdates = [
      'featured', 
      'popular', 
      'availability', 
      'flashPrice', 
      'flashStart', 
      'flashEnd',
      'discountPercent',
      'tags'
    ];

    const validUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        validUpdates[key] = updates[key];
      }
    });

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      validUpdates,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: "Product updated successfully"
    });

  } catch (error) {
    console.error("Error updating product status:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// Get all products with their statuses for management
export async function GET(req) {
  try {
    await connectDb();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const category = searchParams.get("category");
    const status = searchParams.get("status"); // featured, flash, low-stock, etc.
    
    const skip = (page - 1) * limit;
    
    // Build query
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (status) {
      switch (status) {
        case 'featured':
          query.featured = true;
          break;
        case 'flash':
          query.flashEnd = { $gt: new Date() };
          break;
        case 'low-stock':
          query.availability = { $lt: 10 };
          break;
        case 'out-of-stock':
          query.availability = 0;
          break;
        case 'popular':
          query.popular = true;
          break;
      }
    }

    const products = await Product.find(query)
      .select('title slug category price availability featured popular flashPrice flashStart flashEnd discountPercent images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error("Error fetching products for management:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
} 
