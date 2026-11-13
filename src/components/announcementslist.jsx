
'use client';

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Trash2,
  Megaphone,
  BookOpen,
  Mic2,
  Trophy,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

const categoryConfig = {
  Blog: {
    icon: BookOpen,
    color: 'bg-blue-100 text-blue-700',
  },
  Podcast: {
    icon: Mic2,
    color: 'bg-purple-100 text-purple-700',
  },
  Competition: {
    icon: Trophy,
    color: 'bg-amber-100 text-amber-700',
  },
  General: {
    icon: Megaphone,
    color: 'bg-gray-100 text-gray-700',
  },
};

const AnnouncementsList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    checkUser();
    fetchAnnouncements();
  }, []);

  const checkUser = async () => {
    try {
      const response = await fetch('/api/auth/validate-token', {
        credentials: 'include',
      });

      if (!response.ok) return;

      const data = await response.json();
      const user = data.user || data;

      setIsAdmin(user?.role === 'admin');
    } catch (err) {
      console.error('User validation error:', err);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/announcement?limit=all', {
        cache: 'no-store',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load announcements');
      }

      const items = Array.isArray(data)
        ? data
        : data.announcements || data.data || [];

      setAnnouncements(items);
    } catch (err) {
      console.error('Announcement fetch error:', err);
      setError(err.message || 'Unable to load announcements.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this announcement?'
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await fetch(`/api/announcement/by-id/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete announcement');
      }

      setAnnouncements((previous) =>
        previous.filter((announcement) => announcement._id !== id)
      );
    } catch (err) {
      console.error('Announcement deletion error:', err);
      alert(err.message || 'Unable to delete announcement.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return '';

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return '';

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <section className="min-h-[50vh] flex items-center justify-center px-4">
        <p className="text-gray-600 text-lg">Loading announcements...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchAnnouncements}
          className="px-5 py-2 rounded-lg bg-blue-900 text-white hover:bg-blue-800"
        >
          Try Again
        </button>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-5 py-12">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-blue-100">
            <Megaphone className="w-9 h-9 text-blue-900" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Announcements
        </h1>

        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Stay updated with the latest news, opportunities, events and
          announcements from JuriLingo.
        </p>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Megaphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">
            No announcements yet
          </h2>
          <p className="text-gray-500 mt-2">
            Check back later for updates.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {announcements.map((announcement) => {
            const category =
              announcement.category || 'General';

            const config =
              categoryConfig[category] || categoryConfig.General;

            const CategoryIcon = config.icon;

            const id = announcement._id;

            return (
              <article
                key={id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {announcement.imageUrl && (
                  <div className="w-full h-52 bg-gray-100 overflow-hidden">
                    <img
                      src={announcement.imageUrl}
                      alt={announcement.title || 'Announcement'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
                    >
                      <CategoryIcon size={15} />
                      {category}
                    </span>

                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(id)}
                        disabled={deletingId === id}
                        title="Delete announcement"
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    {announcement.title}
                  </h2>

                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {announcement.description ||
                      announcement.content ||
                      announcement.message ||
                      ''}
                  </p>

                  {(announcement.date || announcement.createdAt) && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-5">
                      <Calendar size={16} />
                      <span>
                        {formatDate(
                          announcement.date || announcement.createdAt
                        )}
                      </span>
                    </div>
                  )}

                  {announcement.linkUrl && (
                    <div className="mt-5">
                      <Link
                        href={announcement.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-800 font-semibold hover:text-blue-600"
                      >
                        Visit Link
                        <ExternalLink size={16} />
                      </Link>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default AnnouncementsList;
