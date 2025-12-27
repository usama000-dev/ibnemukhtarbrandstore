'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cancelPendingRequests } from '@/services/api';
interface BlogAuthor {
  _id: string;
  name: string;
  email: string;
}
interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  author: BlogAuthor; // 👈 Updated here
  createdAt: string;
  updatedAt: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
    return () => {
      cancelPendingRequests();
    };
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      const data = await response.json();
      setPosts(data.posts || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      setPosts(posts.filter(post => post.slug !== slug));
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Blog Posts</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your blog posts here.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Post
          </Link>
        </div>
      </div>

      <div className="mt-8">
        {posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No blog posts found. Create your first post!
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500">By {post.author.name || 'Unknown'}</p>
                </div>
                <div className="flex space-x-4">
                  <Link
                    href={`/admin/blog/${post.slug}/edit`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.slug)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 