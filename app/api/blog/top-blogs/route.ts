import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from "@/utils/mongodb";
import BlogPost from '@/models/BlogPost';

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    // Get most liked blogs (top 5)
    const mostLikedBlogs = await BlogPost.aggregate([
      {
        $addFields: {
          likesCount: { $size: "$likes" }
        }
      },
      {
        $sort: { likesCount: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'authorInfo'
        }
      },
      {
        $unwind: '$authorInfo'
      },
      {
        $project: {
          _id: 1,
          title: 1,
          slug: 1,
          featuredImage: 1,
          likesCount: 1,
          commentsCount: { $size: "$comments" },
          createdAt: 1,
          authorName: '$authorInfo.name',
          authorEmail: '$authorInfo.email'
        }
      }
    ]);

    // Get most viewed blogs (top 5) - assuming views field exists
    const mostViewedBlogs = await BlogPost.aggregate([
      {
        $addFields: {
          viewsCount: { $ifNull: ["$views", 0] }
        }
      },
      {
        $sort: { viewsCount: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'authorInfo'
        }
      },
      {
        $unwind: '$authorInfo'
      },
      {
        $project: {
          _id: 1,
          title: 1,
          slug: 1,
          featuredImage: 1,
          viewsCount: 1,
          likesCount: { $size: "$likes" },
          commentsCount: { $size: "$comments" },
          createdAt: 1,
          authorName: '$authorInfo.name',
          authorEmail: '$authorInfo.email'
        }
      }
    ]);

    return NextResponse.json({
      mostLiked: mostLikedBlogs,
      mostViewed: mostViewedBlogs
    });

  } catch (error) {
    console.error('Error fetching top blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top blogs' },
      { status: 500 }
    );
  }
} 