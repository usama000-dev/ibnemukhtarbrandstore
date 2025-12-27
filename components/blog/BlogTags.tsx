'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cancelPendingRequests } from '@/services/api';

interface BlogTag {
  tag: string;
  count: number;
}

export default function BlogTags() {
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ Fetch tags from API
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch('/api/blog/tags');
        const data = await res.json();
        setTags(data);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      }
    };

    fetchTags();
    return () => {
      cancelPendingRequests();
    };
  }, []);

  // ✅ Sync selected tags from URL
  useEffect(() => {
    const tagsParam = searchParams.get('tags');
    if (tagsParam) {
      setSelectedTags(tagsParam.split(','));
    } else {
      setSelectedTags([]);
    }
  }, [searchParams]);

  // ✅ Handle tag click and update URL
  const handleTagClick = (tag: string) => {
    let newTags: string[];

    if (selectedTags.includes(tag)) {
      newTags = selectedTags.filter(t => t !== tag);
    } else {
      newTags = [...selectedTags, tag];
    }

    setSelectedTags(newTags);

    const params = new URLSearchParams(searchParams.toString());
    if (newTags.length > 0) {
      params.set('tags', newTags.join(','));
    } else {
      params.delete('tags');
    }

    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Filter by Tags</h3>
      <div
        className="flex flex-nowrap gap-2 overflow-x-auto rounded-lg scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50 px-1 py-2 border bg-white shadow-sm"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {tags.map(({ tag }) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleTagClick(tag)}
            className={`whitespace-nowrap px-3 py-1 text-sm rounded-full border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95 select-none
              ${selectedTags.includes(tag)
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-100 hover:text-blue-700'}
            `}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
