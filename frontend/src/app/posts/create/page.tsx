'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import PostForm from '@/components/posts/PostForm';
import Link from 'next/link';

export default function CreatePostPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="mb-6">You need to be logged in to create a post.</p>
        <Link 
          href="/login" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Login
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Create New Post</h1>
      <PostForm />
    </div>
  );
}