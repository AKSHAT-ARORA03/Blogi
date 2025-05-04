'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { deletePost } from '@/lib/api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type Post = {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  readingTime?: string;
  author: {
    id: number;
    username: string;
  };
};

type PostCardProps = {
  post: Post;
  onDelete?: () => void;
};

export default function PostCard({ post, onDelete }: PostCardProps) {
  const { user, token } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Ensure user IDs are properly compared
  const userId = user?.id ? String(user.id) : null;
  const authorId = post.author?.id ? String(post.author.id) : null;
  const userUsername = user?.username || null;
  const authorUsername = post.author?.username || null;

  // Prioritize username check for isAuthor
  let isAuthor = userUsername && authorUsername ? userUsername === authorUsername : false;
  // Secondary check: compare IDs
  if (!isAuthor && userId && authorId) {
    isAuthor = userId === authorId;
  }

  // Debug logs for development
  if (process.env.NODE_ENV !== 'production') {
    console.log('PostCard Debug:');
    console.log('User:', user);
    console.log('Post:', post);
    console.log('User ID:', userId, 'Author ID:', authorId, 'Is Author (ID):', userId === authorId);
    console.log('User Username:', userUsername, 'Author Username:', authorUsername, 'Is Author (Username):', userUsername === authorUsername);
    console.log('Final Is Author:', isAuthor);
  }

  const formattedDate = new Date(post.created_at).toLocaleDateString();

  // Truncate content for preview
  const truncatedContent = post.content.length > 150
    ? post.content.substring(0, 150) + '...'
    : post.content;

  const handleDelete = async () => {
    if (!token) {
      toast.error('Please log in to delete this post.');
      return;
    }

    if (confirm('Are you sure you want to delete this post?')) {
      setIsDeleting(true);
      setError(null);

      try {
        await deletePost(post.id, token);
        toast.success('Post deleted successfully!');
        if (onDelete) onDelete();
        router.refresh();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete post';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1"
    >
      {post.image_url ? (
        <div className="relative h-48 w-full">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 384px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="relative h-48 w-full">
          <Image
            src={`https://picsum.photos/800/400?random=${post.id}`}
            alt="Blog post placeholder"
            fill
            sizes="(max-width: 768px) 100vw, 384px"
            className="object-cover"
          />
        </div>
      )}

      <div className="p-5">
        <h3 className="text-xl font-bold mb-2">
          <Link href={`/posts/${post.id}`} className="hover:text-blue-600 transition-colors">
            {post.title}
          </Link>
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          By {post.author?.username || 'Unknown'} • {formattedDate}
          {post.readingTime && (
            <span className="ml-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
              {post.readingTime}
            </span>
          )}
        </p>

        <p className="text-gray-700 dark:text-gray-300 mb-4">{truncatedContent}</p>

        <div className="flex justify-between items-center">
          <Link
            href={`/posts/${post.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Read more
          </Link>

          {user ? (
            isAuthor ? (
              <div className="flex space-x-3">
                <button
                  onClick={() => router.push(`/posts/${post.id}/edit`)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors flex items-center hover:scale-105 active:scale-95"
                  disabled={isDeleting}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors flex items-center disabled:opacity-50 hover:scale-105 active:scale-95"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            ) : (
              <span className="text-gray-500 text-sm">Not your post</span>
            )
          ) : (
            <span className="text-gray-500 text-sm">Log in to edit/delete</span>
          )}
        </div>

        {error && (
          <div className="mt-2 p-2 bg-red-100 text-red-700 text-sm rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}