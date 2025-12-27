'use client';

import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import CommentSection from './CommentSection';
import LikeButton from './LikeButton';

interface Author {
  _id: string;
  name: string;
  email: string;
}

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  slug: string;
  tags: string[];
  featuredImage: {
    url: string;
    publicId: string;
  };
  author: Author; // 👈 important
  likes: string[]; // assuming it's an array of user IDs
  createdAt: string;
  updatedAt: string;
}

interface BlogPageProps {
  post: BlogPost;
}

const BlogPage: React.FC<BlogPageProps> = ({ post }) => {
  return (
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

      <div className="flex items-center gap-4 mb-4">
        {post.tags.map((tag: string) => (
          <span
            key={tag}
            className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

      <div className="flex items-center justify-between text-gray-600 mb-8">
        <div className="flex items-center gap-4">
          <span>By {post.author.name}</span>
          <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
        </div>
        <LikeButton postId={post._id} initialLikes={post.likes} />
      </div>

      <div className="prose prose-lg max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      <CommentSection postId={post._id} />
    </article>
  );
};

export default BlogPage;
