import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import BlogPost from '@/models/BlogPost';
import CommentSection from '@/components/blog/CommentSection';
import LikeButton from '@/components/blog/LikeButton';
import { connectDb } from '@/utils/mongodb';
import { User } from '@/models/User';
import mongoose from 'mongoose';
import BlogSEO from '@/components/atom/BlogSEO';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectDb();
  const { slug } = await params;
  const post = await BlogPost.findOne({ slug });

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  const description = post.content.substring(0, 160);
  const url = `https://www.champzones.com/blog/${slug}`;
  const images = post.featuredImage?.url ? [post.featuredImage.url] : ['https://www.champzones.com/images/championchoice-logo.png'];

  return {
    title: `${post.title} | Champion Choice Blog`,
    description: description,
    keywords: [...(post.tags || []), 'martial arts', 'champion choice', 'blog'],
    authors: [{ name: post.author.name || 'Champion Choice' }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: description,
      url: url,
      siteName: 'Champion Choice',
      locale: 'en_US',
      type: 'article',
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt || post.createdAt,
      authors: [post.author.name || 'Champion Choice'],
      section: post.category || 'Martial Arts',
      tags: post.tags || [],
      images: [
        {
          url: images[0],
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: description,
      images: images,
      site: '@championchoice',
      creator: '@championchoice',
    },
    other: {
      'article:published_time': post.createdAt,
      'article:modified_time': post.updatedAt || post.createdAt,
      'article:section': post.category || 'Martial Arts',
      'article:tag': (post.tags || []).join(', '),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  await connectDb();
  const { slug } = await params;
  if (!mongoose.models.User) {
    mongoose.model('User', new mongoose.Schema({ name: String }));
  }

  const post = await BlogPost.findOne({ slug }).populate('author', 'name');

  if (!post) {
    notFound();
  }

  return (
    <>
      <BlogSEO
        post={{
          title: post.title,
          content: post.content,
          excerpt: post.content.substring(0, 160),
          author: post.author.name || 'Unknown',
          publishedAt: post.createdAt,
          updatedAt: post.updatedAt,
          tags: post.tags || [],
          category: post.category || 'Martial Arts',
          image: post.featuredImage?.url,
          slug: post.slug
        }}
        url="https://www.champzones.com"
      />
      <main className="container mx-auto px-4 mt-10 py-8">
        <article className="max-w-4xl mx-auto">
          <div className="relative h-[400px] w-full mb-8">
            <Image
              src={post.featuredImage.url}
              alt={post.title}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>

          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center justify-between text-gray-600 mb-8">
            <div className="flex items-center gap-4">
              <span>By {post.author.name || 'Unknown'}</span>
              <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
            </div>
            <LikeButton postId={post._id.toString()} initialLikes={post.likes.map((like: any) => like.user)} />
          </div>

          <div
            className="prose lg:prose-lg sm:prose-sm max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}></div>

          <CommentSection postId={post._id.toString()} />
        </article>
      </main>
    </>
  );
}