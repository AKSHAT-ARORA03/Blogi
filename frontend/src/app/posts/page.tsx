'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getPosts } from '@/lib/api';
import PostCard from '@/components/posts/PostCard';
import SearchBar from '@/components/posts/SearchBar';
import Pagination from '@/components/ui/Pagination';

type Post = {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  author: {
    id: number;
    username: string;
  };
};

export default function PostsPage() {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getPosts(currentPage, 10, search);
        setPosts(data.items || []);
        setTotalPages(Math.ceil(data.total / 10));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch posts');
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, [currentPage, search]);
  
  const handleDeletePost = (deletedPostId: number) => {
    setPosts(posts.filter(post => post.id !== deletedPostId));
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Blog Posts</h1>
      
      <SearchBar basePath="/posts" />
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : posts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2">
          {posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              onDelete={() => handleDeletePost(post.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {search ? `No posts found matching "${search}"` : 'No posts found'}
          </p>
        </div>
      )}
      
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        basePath="/posts" 
        searchParams={search ? { search } : {}}
      />
    </div>
  );
}