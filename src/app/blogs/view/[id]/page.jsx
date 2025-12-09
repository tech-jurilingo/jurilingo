'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const blogId = params.id;
  
  const colors = { teal: '#005F63', gold: '#E3B65B', bg: '#ffffff' };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blog/by-id/${blogId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          setBlog(data.blog);
        } else {
          setError(data.message || 'Failed to load blog');
        }
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError(err.message || 'Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  if (loading) {
    return (
      <div className="grow flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005F63] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grow flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            href="/blogs"
            className="inline-flex items-center text-[#005F63] hover:underline"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="grow flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Blog not found.</p>
          <Link
            href="/blogs"
            className="inline-flex items-center text-[#005F63] hover:underline"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grow w-full py-12 px-4 md:px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/blogs"
          className="flex items-center text-gray-500 hover:text-[#005F63] mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Blogs
        </Link>

        <h1 className="text-3xl md:text-5xl font-bold font-serif text-[#002B36] mb-6 leading-tight">
          {blog.title}
        </h1>

        <div className="flex items-center justify-between border-b border-gray-100 pb-8 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E3B65B]/20 flex items-center justify-center text-[#005F63] font-bold">
              {blog.author.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{blog.author}</p>
            </div>
          </div>
          <div className="text-gray-500 text-sm flex items-center">
            <Calendar size={16} className="mr-2 text-[#E3B65B]" />
            {new Date(blog.publishDate).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>

        {/* Content Render */}
        <div
          className="prose prose-lg prose-headings:text-[#005F63] prose-a:text-[#E3B65B] text-gray-700 leading-relaxed max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Simple Footer for the article */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <p className="text-gray-400 italic text-center text-sm">
            Thanks for reading on JuriLingo
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;