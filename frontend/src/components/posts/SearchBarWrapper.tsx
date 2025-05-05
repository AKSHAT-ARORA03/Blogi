'use client';

import { Suspense } from 'react';
import SearchBar from '@/components/posts/SearchBar';

export default function SearchBarWrapper() {
  return (
    <Suspense fallback={<div className="flex justify-center py-4"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div></div>}>
      <SearchBar basePath="/posts" />
    </Suspense>
  );
}
