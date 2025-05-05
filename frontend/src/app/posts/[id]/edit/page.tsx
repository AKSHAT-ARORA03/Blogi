'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPost } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import PostForm from '@/components/posts/PostForm';
import Link from 'next/link';

type Post = {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  author: {
    id: number;
    username: string;
  };
};

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token } = useAuth();
  
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (typeof params.id !== 'string') {
          throw new Error('Invalid post ID');
        }
        const postId = parseInt(params.id, 10);
        if (isNaN(postId)) {
          throw new Error('Invalid post ID');
        }
        const data = await getPost(postId);
        setPost(data);
        
        // Check if user is the author
        if (!user?.id || String(user.id) !== String(data.author.id)) {
          router.push(`/posts/${postId}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch post');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user && token) {
      fetchPost();
    }
  }, [params.id, user, token, router]);
  
  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="mb-6">You need to be logged in to edit a post.</p>
        <Link 
          href="/login" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Login
        </Link>
      </div>
    );
  }
  
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
          ← Go back
        </button>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="max-w-3xl mx-auto py-8 text-center">
        <p className="text-xl mb-4">Post not found</p>
        <Link href="/posts" className="text-blue-6
00 hover:text-blue-800">
          ← Back to posts
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Edit Post</h1>
      <PostForm 
        postId={post.id} 
        initialData={{
          title: post.title,
          content: post.content,
          image_url: post.image_url
        }} 
        isEditing={true} 
      />
    </div>
  );
}
