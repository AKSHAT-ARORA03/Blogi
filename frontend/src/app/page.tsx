'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getPosts } from '@/lib/api';
import PostCard from '@/components/posts/PostCard';
import SearchBar from '@/components/posts/SearchBar';

interface Post {
  id: number;
  title: string;
  content: string;
  author: { id: number; username: string };
  created_at: string;
  image_url?: string;
  readingTime?: string;
}

const calculateReadingTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

export default function Home() {
  const { user } = useAuth();
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const fetchFeaturedPosts = async (page: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getPosts(page, 6); // 6 posts per page
      setFeaturedPosts(data.items || []);
      setHasNextPage(data.hasNextPage);
      setHasPreviousPage(data.hasPreviousPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      setFeaturedPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedPosts(page);
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6 rounded-2xl bg-gradient-to-r from-teal-500 to-indigo-600 text-white mb-16 shadow-xl">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Unleash Your Voice with Blogi</h1>
          <p className="text-xl mb-8 text-teal-100">
            Join a vibrant community of writers to share your stories, ideas, and passions.
          </p>
          <div>
            {user ? (
              <Link href="/posts/create" className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-3 rounded-md text-lg font-medium inline-block transition-colors duration-200">
                Write a Post
              </Link>
            ) : (
              <Link href="/register" className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-3 rounded-md text-lg font-medium inline-block transition-colors duration-200">
                Join Now
              </Link>
            )}
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white" />
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-white" />
          <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-white" />
        </div>
      </section>

      {/* Search Section */}
      <section className="mb-12">
        <div className="max-w-2xl mx-auto">
          <Suspense fallback={<div className="flex justify-center py-4"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div></div>}>
            <SearchBar basePath="/posts" />
          </Suspense>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Posts</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 animate-spin" />
          </div>
        ) : featuredPosts.length > 0 ? (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredPosts.map((post) => (
                <div key={post.id} className="h-full hover:-translate-y-2 transition-all duration-300 hover:shadow-lg">
                  <PostCard
                    post={{
                      ...post,
                      readingTime: calculateReadingTime(post.content),
                    }}
                    onDelete={() => setFeaturedPosts(featuredPosts.filter((p) => p.id !== post.id))}
                  />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-10 gap-4">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={!hasPreviousPage}
                className={`px-4 py-2 rounded-md border text-sm font-medium ${
                  hasPreviousPage
                    ? 'bg-white text-teal-600 hover:bg-teal-50 border-teal-600'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300'
                }`}
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">Page {page}</span>
              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={!hasNextPage}
                className={`px-4 py-2 rounded-md border text-sm font-medium ${
                  hasNextPage
                    ? 'bg-white text-teal-600 hover:bg-teal-50 border-teal-600'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300'
                }`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-300">
              No posts found. Be the first to create one!
            </p>
          </div>
        )}

        <div className="text-center mt-8">
          <Link href="/posts" className="text-teal-600 hover:text-teal-800 font-medium inline-flex items-center">
            View all posts
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 mb-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Blogi</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature Cards... */}
          {/* ... */}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900 rounded-lg my-12 p-8 shadow-md border border-gray-100 dark:border-gray-700">
        <h2 className="text-3xl font-bold mb-8 text-center">Get Started Today</h2>
        <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-8">
          Join our community and start sharing your ideas with the world.
        </p>
        <div className="flex justify-center">
          {user ? (
            <Link href="/posts/create" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-all duration-300 hover:shadow-lg transform hover:scale-105">
              Create Your First Post
            </Link>
          ) : (
            <Link href="/register" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-all duration-300 hover:shadow-lg transform hover:scale-105">
              Sign Up Now
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
