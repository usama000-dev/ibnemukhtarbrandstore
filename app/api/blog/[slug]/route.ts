import { NextResponse } from 'next/server';
import { connectDb } from "@/utils/mongodb";
import BlogPost from '@/models/BlogPost';
import { deleteImage } from '@/utils/cloudinary';
import cloudinary from '@/utils/cloudinory';
interface LeanUser {
  _id: string;
  name: string;
  email: string;
}

interface LeanComment {
  _id: string;
  user: string;
  content: string;
  createdAt: Date;
}

interface LeanPost {
  _id: string;
  title: string;
  content: string;
  slug: string;
  tags: string[];
  featuredImage: {
    url: string;
    publicId: string;
  };
  author: LeanUser;
  likes: string[];
  comments: LeanComment[];
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDb();
    const { slug } = await params;
    const rawPost = await BlogPost.findOne({ slug })
      .populate('author', 'name email')
      .lean() as any; // as LeanPost works only if you fully clean data


    if (!rawPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // Deep manual transformation
    const post: LeanPost = {
      ...rawPost,
      _id: rawPost._id.toString(),
      author: {
        ...rawPost.author,
        _id: rawPost.author._id.toString(),
      },
      likes: Array.isArray(rawPost.likes)
        ? rawPost.likes.map((id: any) => id.toString())
        : [],
      comments: Array.isArray(rawPost.comments)
        ? rawPost.comments.map((c: any) => ({
          _id: c._id?.toString?.() ?? '',
          user: c.user?.toString?.() ?? '',
          content: c.content,
          createdAt: c.createdAt,
        }))
        : [],
    };

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDb();
    const { slug } = await params;

    // 1. Get form data
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const tagsInput = formData.get('tags') as string;
    const featuredImage = formData.get('featuredImage') as File | null;

    // console.log('Received data:', {
    //   title,
    //   content,
    //   tagsInput,
    //   featuredImage: featuredImage ? `File (${featuredImage.size} bytes)` : null
    // });

    // 2. Process tags
    const tags = tagsInput 
      ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag)
      : [];

    // 3. Find existing post
    const existingPost = await BlogPost.findOne({ slug });
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // 4. Prepare update data
    const updateData: any = {
      title,
      content,
      tags,
      updatedAt: new Date()
    };

    // 5. Handle image upload if new image provided
    if (featuredImage && featuredImage.size > 0) {
      try {
        // console.log('Processing new featured image...');
        
        // Delete old image if exists
        if (existingPost.featuredImage?.publicId) {
          // console.log('Deleting old image:', existingPost.featuredImage.publicId);
          await deleteImage(existingPost.featuredImage.publicId);
        }

        // Upload new image
        const arrayBuffer = await featuredImage.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'championchoice-blogs',
              resource_type: 'auto'
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(buffer);
        });

        if (uploadResult) {
          updateData.featuredImage = {
            url: (uploadResult as any).secure_url,
            publicId: (uploadResult as any).public_id
          };
          // console.log('New image uploaded:', (uploadResult as any).secure_url);
        }
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        // Keep existing image if upload fails
        updateData.featuredImage = existingPost.featuredImage;
      }
    } else {
      // Keep existing image if no new one provided
      updateData.featuredImage = existingPost.featuredImage;
    }

    // console.log('Final update data:', updateData);

    // 6. Update post
    const updatedPost = await BlogPost.findOneAndUpdate(
      { slug },
      updateData,
      { new: true }
    );

    if (!updatedPost) {
      return NextResponse.json(
        { error: 'Failed to update post' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update blog post',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDb();
    const { slug } = await params;

    const post = await BlogPost.findOneAndDelete({ slug });

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Delete the featured image from Cloudinary
    if (post.featuredImage?.publicId) {
      await deleteImage(post.featuredImage.publicId);
    }

    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
} 