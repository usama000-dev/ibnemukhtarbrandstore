import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from "@/utils/mongodb";
import BlogPost from '@/models/BlogPost';
import { User } from '@/models/User';
import cloudinary from '@/utils/cloudinory';


export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');

    // Build the query dynamically
    const query: any = {};

    if (tag) {
      // support multiple tags with comma-separated values
      const tagsArray = tag.split(',');
      query.tags = { $in: tagsArray };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } } // Optional: match search term in tags
      ];
    }

    const total = await BlogPost.countDocuments(query);

    const posts = await BlogPost.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'name email')
      .lean();

    return NextResponse.json({
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });

  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    const { title, content, tags, featuredImage, email } = await req.json();
console.log("tags: ", tags);

    if (!title || !content || !featuredImage || !email) {
      return NextResponse.json(
        { error: 'Title, content, featured image, and user ID are required' },
        { status: 400 }
      );
    }

    await connectDb();
    let uploadedImage;
    try {
      const imageFile = featuredImage;
      console.log("image from frontend: ", imageFile);

      // Convert the image file to arrayBuffer → buffer
      const base64Data = imageFile.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      uploadedImage = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "championchoice- blogs" }, (err, result) => {
            if (err) return reject(err);
            resolve(result);
          })
          .end(buffer);
      });
      // console.log("uploaded url: ", uploadedImage.secure_url);

    } catch (error) {
      console.error('Error creating blog post:', error);
      return NextResponse.json(
        { error: 'Failed to create blog post' },
        { status: 500 })
    }

    // Verify user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const blogPost = await BlogPost.create({
      title,
      content,
      tags: tags || [],
      featuredImage: { url: (uploadedImage as { secure_url: string }).secure_url, publicId: (uploadedImage as { public_id: string }).public_id },
      author: user._id,
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(blogPost);
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
} 