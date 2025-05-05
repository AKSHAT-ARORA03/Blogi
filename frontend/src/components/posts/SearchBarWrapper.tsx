'use client';

import { useEffect, useState } from 'react';
import SearchBar from '@/components/posts/SearchBar';

export default function SearchBarWrapper() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="flex justify-center py-4"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div></div>;
  }

  return <SearchBar basePath="/posts" />;
}
