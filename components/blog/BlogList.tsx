// ✅ Step 1: Update BlogList.tsx to support search + tag filters
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ArticleCard from './ArticleCard';
import { cancelPendingRequests } from '@/services/api';
import LoadingComponent from '../atom/LoadingComponent';

interface BlogAuthor {
  _id: string;
  name: string;
  email: string;
}

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  author: BlogAuthor;
  featuredImage: {
    url: string;
    publicId: string;
  };
  content: string;
  tags: string[];
  likes: string[];
  createdAt: string;
}

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const searchParams = useSearchParams();

  const search = useMemo(() => {
    return searchParams.get('search')?.toLowerCase() || '';
  }, [searchParams]);

  const tags = useMemo(() => {
    const t = searchParams.get('tags');
    return t ? t.split(',') : [];
  }, [searchParams]);

  const fetchPosts = async (pageNum: number) => {
    try {
      const response = await fetch(`/api/blog?page=${pageNum}&limit=100`); // fetching all for filtering
      const data = await response.json();

      setPosts(data.posts);
      setError(null);
    } catch (err) {
      setError('Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
    return () => {
      cancelPendingRequests();
    };
  }, [page]);

  useEffect(() => {
    const result = posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(search) ||
        post.content.toLowerCase().includes(search);

      const matchesTags =
        tags.length === 0 || tags.every(tag => post.tags.includes(tag));

      return matchesSearch && matchesTags;
    });

    setFilteredPosts(result);
    return () => {
      cancelPendingRequests();
    };
  }, [posts, search, tags]);

  if (loading) return <LoadingComponent />;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (filteredPosts.length === 0) return <div className="text-center py-8">No results found.</div>;


  return (
    <div className="cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {filteredPosts.map(post => (
        <ArticleCard key={post._id} post={post} />
      ))}
    </div>
  );
}
