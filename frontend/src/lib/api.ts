// API service for interacting with the backend

const API_URL = 'http://localhost:8000';

// Types
type LoginCredentials = {
  username: string;
  password: string;
};

type RegisterData = {
  username: string;
  email: string;
  password: string;
};

type PostData = {
  title: string;
  content: string;
  image_url?: string;
};

type UpdatePostData = {
  title?: string;
  content?: string;
  image_url?: string;
};

// Authentication API calls
export const login = async (credentials: LoginCredentials) => {
  const formData = new URLSearchParams();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);

  const response = await fetch(`${API_URL}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Login failed');
  }

  return response.json();
};

export const register = async (data: RegisterData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Registration failed');
  }

  return response.json();
};

// Post API calls
export const getPosts = async (page = 1, limit = 10, search?: string) => {
  const params = new URLSearchParams({
    skip: ((page - 1) * limit).toString(),
    limit: limit.toString(),
  });

  if (search) {
    params.append('search', search);
  }

  const response = await fetch(`${API_URL}/posts?${params}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  return response.json();
};

export const getPost = async (id: number) => {
  const response = await fetch(`${API_URL}/posts/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch post');
  }

  return response.json();
};

export const createPost = async (data: PostData, token: string) => {
  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create post');
  }

  return response.json();
};

export const updatePost = async (id: number, data: UpdatePostData, token: string) => {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update post');
  }

  return response.json();
};

export const deletePost = async (id: number, token: string) => {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to delete post');
  }

  return true;
};