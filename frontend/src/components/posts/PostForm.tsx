'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { createPost, updatePost } from '@/lib/api';
import Image from 'next/image';
// Temporarily remove framer-motion import to fix build error
// import { motion } from 'framer-motion';

// Import API URL from api.ts
const API_URL = 'http://localhost:8000';

type PostFormProps = {
  postId?: number;
  initialData?: {
    title: string;
    content: string;
    image_url?: string;
  };
  isEditing?: boolean;
};

export default function PostForm({ postId, initialData, isEditing = false }: PostFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);
  
  const { token } = useAuth();
  const router = useRouter();
  
  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('You must be logged in to create or edit posts');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Upload image if selected
      let finalImageUrl = imageUrl;
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        
        const uploadResponse = await fetch(`${API_URL}/images/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
        
        if (!uploadResponse.ok) {
          const uploadError = await uploadResponse.json();
          throw new Error(uploadError.detail || 'Failed to upload image');
        }
        
        const uploadResult = await uploadResponse.json();
        finalImageUrl = `http://localhost:8000${uploadResult.url}`;
      }
      
      const postData = {
        title,
        content,
        image_url: finalImageUrl,
      };
      
      if (isEditing && postId) {
        await updatePost(postId, postData, token);
      } else {
        await createPost(postData, token);
      }
      
      // Redirect to posts page after successful submission
      router.push('/posts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Post' : 'Create New Post'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2 text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="content" className="block mb-2 text-sm font-medium">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="image" className="block mb-2 text-sm font-medium">
            Featured Image
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {imagePreview && (
            <div className="mt-2 relative h-48 w-full">
              <Image 
                src={imagePreview} 
                alt="Preview" 
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover rounded-md"
              />
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}