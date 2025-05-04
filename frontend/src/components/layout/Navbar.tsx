'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Brand Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">Blogi</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {/* ✅ Ensure Home link points to '/' */}
              <Link
                href="/"
                className={`${pathname === '/' ? 'border-blue-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Home
              </Link>
              <Link
                href="/posts"
                className={`${pathname === '/posts' || pathname.startsWith('/posts/') ? 'border-blue-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Posts
              </Link>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/posts/create"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Create Post
                </Link>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user.username}
                </span>
                <button
                  onClick={logout}
                  className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className={`${pathname === '/login' ? 'bg-blue-600 text-white' : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200'} px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={`${pathname === '/register' ? 'bg-blue-600 text-white' : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200'} px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
