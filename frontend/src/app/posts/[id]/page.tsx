'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPost } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

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

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const postId = parseInt(params.id as string, 10);
        const data = await getPost(postId);
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch post');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [params.id]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
          {error}
        </div>
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800"
        >
          &larr; Go back
        </button>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="max-w-3xl mx-auto py-8 text-center">
        <p className="text-xl mb-4">Post not found</p>
        <Link href="/posts" className="text-blue-600 hover:text-blue-800">
          &larr; Back to posts
        </Link>
      </div>
    );
  }
  
  // Convert IDs to strings for reliable comparison
  const isAuthor = user?.id && post.author?.id && String(user.id) === String(post.author.id);
  const formattedDate = new Date(post.created_at).toLocaleDateString();
  
  return (
    <article className="max-w-3xl mx-auto py-8">
      <Link href="/posts" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
        &larr; Back to posts
      </Link>
      
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
      
      <div className="flex items-center text-gray-600 dark:text-gray-300 mb-6">
        <span>By {post.author.username}</span>
        <span className="mx-2">&bull;</span>
        <span>{formattedDate}</span>
      </div>
      
      {post.image_url && (
        <div className="relative h-64 md:h-96 w-full mb-8">
          <Image 
            src={post.image_url} 
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover rounded-lg"
          />
        </div>
      )}
      
      <div className="prose dark:prose-invert max-w-none">
        {post.content.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4">{paragraph}</p>
        ))}
      </div>
      
      {isAuthor && (
        <div className="mt-8 flex space-x-4">
          <Link 
            href={`/posts/${post.id}/edit`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Edit Post
          </Link>
          <button
            onClick={async () => {
              if (confirm('Are you sure you want to delete this post?')) {
                try {
                  const { token } = useAuth();
                  if (!token) throw new Error('Not authenticated');
                  const { deletePost } = await import('@/lib/api');
                  await deletePost(post.id, token);
                  router.push('/posts');
                } catch (err) {
                  alert(err instanceof Error ? err.message : 'Failed to delete post');
                }
              }
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            Delete Post
          </button>
        </div>
      )}
    </article>
  );
}