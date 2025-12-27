import { NextResponse } from "next/server";
import Comment from "@/models/Comment";
import BlogPost from "@/models/BlogPost";
import { User } from "@/models/User";
import { connectDb } from '@/middleware/mongodb';

// GET /api/blog/[slug]/comments
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDb();
    const { slug } = await params;

    const comments = await Comment.find({ blogPostId: slug }).sort({
      createdAt: -1,
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST /api/blog/[slug]/comments
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDb();
    const { slug } = await params;
    const body = await request.json();
    const { name, email, comment, userId } = body;

    if (!name || !email || !comment) {
      return NextResponse.json(
        { error: "Name, email, and comment are required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const blogPost = await BlogPost.findOneAndUpdate(
      { _id: slug },
      { $push: { comments: { user: user._id, content: comment } } }
    );

    if (!blogPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    const newComment = await Comment.create({
      name,
      email,
      comment,
      blogPostId: blogPost._id,
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
