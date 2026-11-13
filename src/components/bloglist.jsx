
'use client';

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  User,
  Trash2,
  Heart,
  Eye,
} from 'lucide-react';
import Link from 'next/link';

const BlogsList = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [likingId, setLikingId] = useState(null);

  const colors = {
    teal: '#005F63',
    gold: '#E3B65B',
    bg: '#F5F5F0',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch(
          '/api/auth/validate-token',
          { credentials: 'include' }
        );

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        }

        const response = await fetch('/api/blog');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setBlogs(data.blogs || []);
        } else {
          setError(data.message || 'Failed to load blogs');
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError(err.message || 'Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLikeToggle = async (blogId) => {
    if (!user || likingId) return;

    try {
      setLikingId(blogId);

      const response = await fetch(
        `/api/blog/by-id/${encodeURIComponent(blogId)}/likes`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        setUser(null);
        alert('Please log in to like this blog.');
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to update like');
      }

      setBlogs((previous) =>
        previous.map((blog) =>
          blog._id === blogId
            ? { ...blog, likes: data.likes }
            : blog
        )
      );
    } catch (err) {
      console.error('Like update error:', err);
      alert(err.message || 'Unable to update like');
    } finally {
      setLikingId(null);
    }
  };

  const handleDelete = async (blogId, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(blogId);

    try {
      const response = await fetch(`/api/blog/by-id/${blogId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        alert('Blog deleted successfully!');
        setBlogs((previous) =>
          previous.filter((blog) => blog._id !== blogId)
        );
      } else {
        alert(data.message || 'Failed to delete blog');
      }
    } catch (err) {
      console.error('Error deleting blog:', err);
      alert('Failed to delete blog. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const stripHtml = (html) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  const getExcerpt = (content, maxLength = 150) => {
    const text = stripHtml(content || '');
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  };

  const isAdmin = user?.role === 'admin';

  const hasLiked = (blog) =>
    user &&
    blog.likes?.some(
      (like) =>
        String(like?._id || like) === String(user.userId)
    );

  return (
    <div
      className="grow w-full py-12 px-4 md:px-8"
      style={{ backgroundColor: colors.bg }}
    >
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-serif text-[#002B36] mb-4">
            Legal Insights & Articles
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore the latest thoughts, analysis, and tips from the JuriLingo community.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 animate-pulse"
              >
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                  <div className="h-6 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                  <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#005F63] text-white rounded-md hover:brightness-110 transition-all"
            >
              Retry
            </button>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No blogs available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col border border-gray-100"
              >
                <div className="p-6 grow">

                  <div className="flex items-center text-xs text-[#E3B65B] font-bold uppercase tracking-wider mb-3">
                    <Calendar size={14} className="mr-1" />
                    {blog.publishDate
                      ? new Date(blog.publishDate).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'Date unavailable'}
                  </div>

                  <h3 className="text-xl font-bold text-[#002B36] mb-3 line-clamp-2">
                    {blog.title}
                  </h3>

                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <User size={16} className="mr-2" />
                    {blog.author}
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {getExcerpt(blog.content)}
                  </p>

                  {/* Likes and views */}
                  <div className="flex items-center gap-5 border-t border-gray-100 pt-4 mt-4">

                    <button
                      type="button"
                      onClick={() => handleLikeToggle(blog._id)}
                      disabled={!user || likingId === blog._id}
                      title={
                        !user
                          ? 'Log in to like this blog'
                          : 'Like or unlike this blog'
                      }
                      className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                      <Heart
                        size={18}
                        className={
                          hasLiked(blog)
                            ? 'fill-red-500 text-red-500'
                            : ''
                        }
                      />
                      {blog.likes?.length || 0} Likes
                      {likingId === blog._id ? '...' : ''}
                    </button>

                    <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                      <Eye size={18} />
                      {blog.viewCount || 0} Views
                    </div>

                  </div>
                </div>

                <div className="px-6 pb-6 pt-0 mt-auto space-y-2">

                  <Link
                    href={`/blogs/view/${blog._id}`}
                    className="w-full py-2 rounded-md font-bold text-white transition-colors hover:brightness-110 flex items-center justify-center gap-2"
                    style={{ backgroundColor: colors.teal }}
                  >
                    Read Article
                  </Link>

                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(blog._id, blog.title)}
                      disabled={deletingId === blog._id}
                      className="w-full py-2 rounded-md font-bold text-white transition-colors hover:brightness-110 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={16} />
                      {deletingId === blog._id ? 'Deleting...' : 'Delete'}
                    </button>
                  )}

                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsList;
