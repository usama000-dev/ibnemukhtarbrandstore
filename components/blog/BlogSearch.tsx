'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function BlogSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search) {
        router.push(`/blog?search=${encodeURIComponent(search)}`);
      } else {
        router.push('/blog');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search, router]);

  return (
    <div className="mb-8">
      <div className="relative">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search blog posts..."
          className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:ring-b-2 focus:ring-blue-500"
        />
        <svg
          className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
} 