import { NextResponse } from 'next/server';
import { connectDb } from '@/utils/mongodb';
import BlogPost from '@/models/BlogPost';
import mongoose from 'mongoose';
import { User } from '@/models/User';

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    const { userId } = body;
    await connectDb();
    const { slug } = await params;

    const post = await BlogPost.findOne({ _id: slug });

    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // ✅ Ensure userId is valid ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // ✅ Check if already liked
    const alreadyLiked = post.likes.includes(userObjectId);

    if (alreadyLiked) {
      // ❌ Remove like (Unlike)
      post.likes = post.likes.filter(
        (id: mongoose.Types.ObjectId) => !id.equals(userObjectId)
      );
    } else {
      // ✅ Add like
      post.likes.push(userObjectId);
    }

    await post.save();

    return NextResponse.json({
      likes: post.likes.length,
      liked: !alreadyLiked,
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}
