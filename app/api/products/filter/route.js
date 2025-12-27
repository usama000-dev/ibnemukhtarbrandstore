import { connectDb } from '@/middleware/mongodb';
import { Product } from '@/models/Product';

export async function POST(request) {
  try {
    await connectDb();
    
    const body = await request.json();
    const {
      category = '',
      tags = [],
      rating = 0,
      availability = '',
      minPrice = 0,
      maxPrice = 10000,
      sortBy = 'newest',
      page = 1,
      limit = 50,
      search = '',
      sizes = [],
      colors = []
    } = body;

    // Build filter query
    let filterQuery = {};

    // Search filter
    if (search) {
      filterQuery.$or = [
        { title: { $regex: search, $options: 'i' } },
        { disc: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Category filter
    if (category) {
      filterQuery.category = category;
    }

    // Tags filter
    if (tags && tags.length > 0) {
      filterQuery.tags = { $in: tags };
    }

    // Sizes filter
    if (sizes && sizes.length > 0) {
      filterQuery.size = { $in: sizes };
    }

    // Colors filter
    if (colors && colors.length > 0) {
      filterQuery.color = { $in: colors };
    }

    // Rating filter
    if (rating > 0) {
      filterQuery.rating = { $gte: rating };
    }

    // Price filter
    if (minPrice > 0 || maxPrice < 10000) {
      filterQuery.price = {};
      if (minPrice > 0) filterQuery.price.$gte = minPrice;
      if (maxPrice < 10000) filterQuery.price.$lte = maxPrice;
    }

    // Availability filters
    if (availability) {
      switch (availability) {
        case 'in-stock':
          filterQuery.availability = { $gt: 0 };
          break;
        case 'flash-sale':
          filterQuery.flashPrice = { $exists: true, $ne: null };
          filterQuery.flashEnd = { $gt: new Date() };
          break;
        case 'featured':
          filterQuery.featured = true;
          break;
      }
    }

    // Build sort query
    let sortQuery = {};
    switch (sortBy) {
      case 'newest':
        sortQuery.createdAt = -1;
        break;
      case 'oldest':
        sortQuery.createdAt = 1;
        break;
      case 'price-low':
        sortQuery.price = 1;
        break;
      case 'price-high':
        sortQuery.price = -1;
        break;
      case 'rating':
        sortQuery.rating = -1;
        break;
      case 'popular':
        sortQuery.views = -1;
        break;
      default:
        sortQuery.createdAt = -1;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filterQuery);
    const totalPages = Math.ceil(totalProducts / limit);

    // Get filtered products
    const products = await Product.find(filterQuery)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .select('title price flashPrice images category tags rating availability size color featured views createdAt flashEnd')
      .lean();

    // Get unique categories, tags, sizes, and colors for filter options
    const categories = await Product.distinct('category');
    const allTags = await Product.distinct('tags');
    const allSizes = await Product.distinct('size');
    const allColors = await Product.distinct('color');

    return Response.json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      filters: {
        categories,
        tags: allTags,
        sizes: allSizes.filter(size => size), // Remove null/undefined values
        colors: allColors.filter(color => color) // Remove null/undefined values
      }
    });

  } catch (error) {
    console.error('Filter products error:', error);
    return Response.json(
      { success: false, message: 'Failed to filter products' },
      { status: 500 }
    );
  }
} 
