import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from "@/utils/mongodb";
import BlogPost from '@/models/BlogPost';

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDb();
    
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Blog slug is required' },
        { status: 400 }
      );
    }

    // Increment the views count for the blog post
    const updatedBlog = await BlogPost.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!updatedBlog) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      views: updatedBlog.views
    });

  } catch (error) {
    console.error('Error incrementing blog views:', error);
    return NextResponse.json(
      { error: 'Failed to increment views' },
      { status: 500 }
    );
  }
} 