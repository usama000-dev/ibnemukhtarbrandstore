import { NextResponse } from 'next/server';
import BlogPost from '@/models/BlogPost';
import { connectDb } from '@/utils/mongodb';

export async function GET() {
  try {
    await connectDb();
    
    const posts = await BlogPost.find({}, 'tags');
    const tagCounts = new Map<string, number>();

    posts.forEach(post => {
      post.tags.forEach((tag: string) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    const tags = Array.from(tagCounts.entries()).map(([tag, count]) => ({
      tag,
      count,
    }));

    // Sort tags by count in descending order
    tags.sort((a, b) => b.count - a.count);

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
} 