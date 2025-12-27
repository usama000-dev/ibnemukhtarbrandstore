'use client';

import { Suspense } from 'react';
import BlogTags from './BlogTags';



export default function BlogTagsWrapper() {
  return (
    <Suspense fallback={<div>Loading tags...</div>}>
      <BlogTags  />
    </Suspense>
  );
} 