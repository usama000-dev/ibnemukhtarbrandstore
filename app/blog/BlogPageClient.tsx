'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BlogList from '@/components/blog/BlogList';
import BlogSearch from '@/components/blog/BlogSearch';
import BlogTags from '@/components/blog/BlogTags';
import BorderSection from '@/components/atom/BorderSection';
import LoadingComponent from '@/components/atom/LoadingComponent';

function BlogContent() {
  const searchParams = useSearchParams();
  // You can use searchParams here if needed
  return (
    <main className="container mx-auto px-4 py-8 mt-8">
      <h1 className="text-4xl font-normal text-center pt-2 mb-2">Blog</h1>
      <BorderSection />
      <div className="mt-2">
        <div className="lg:col-span-3">
          <div className="mb-8">
            <BlogSearch />
            <div className="lg:col-span-1">
              <Suspense fallback={<div>Loading tags...</div>}>
                <BlogTags />
              </Suspense>
            </div>
          </div>
          <BlogList />
        </div>

      </div>
    </main>
  );
}

export default function BlogPageClient() {
  return (
    <Suspense fallback={<div><LoadingComponent /></div>}>
      <BlogContent />
    </Suspense>
  );
} 