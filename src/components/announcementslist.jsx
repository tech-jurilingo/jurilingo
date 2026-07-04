'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Trash2, Megaphone, BookOpen, Mic2, Trophy, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const AnnouncementsList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const colors = { teal: '#005F63', gold: '#E3B65B', bg: '#F5F5F0' };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Validate user token
        const userResponse = await fetch('/api/auth/validate-token').catch(() => null);
        if (userResponse && userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        }

        // Fetch all announcements
        const response = await fetch('/api/announcement?limit=all');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          setAnnouncements(data.announcements);
        } else {
          setError(data.message || 'Failed to load announcements');
        }
      } catch (err) {
        setError(err.message || 'Failed to load announcements');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this announcement: "${title}"?`
    );

    if (!confirmed) return;

    setDeletingId(id);

    try {
      const response = await fetch(`/api/announcement/by-id/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Announcement deleted successfully!');
        setAnnouncements(announcements.filter(a => a._id !== id));
      } else {
        alert(data.message || 'Failed to delete announcement');
      }
    } catch (err) {
      console.error('Error deleting announcement:', err);
      alert('Failed to delete announcement. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Blog':
        return <BookOpen size={20} />;
      case 'Podcast':
        return <Mic2 size={20} />;
      case 'Competition':
        return <Trophy size={20} />;
      default:
        return <Megaphone size={20} />;
    }
  };

  const getCategoryStyles = (type) => {
    switch (type) {
      case 'Blog':
        return { bg: '#e0f2fe', text: '#0369a1', label: 'Blog Update' };
      case 'Podcast':
        return { bg: '#f3e8ff', text: '#6b21a8', label: 'Podcast' };
      case 'Competition':
        return { bg: '#fef3c7', text: '#b45309', label: 'Competition' };
      default:
        return { bg: '#ccfbf1', text: '#0f766e', label: 'General' };
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="grow w-full py-12 px-4 md:px-8" style={{ backgroundColor: colors.bg }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex p-3 rounded-full bg-white shadow-sm mb-4" style={{ color: colors.teal }}>
            <Megaphone size={32} />
          </div>
          <h2 className="text-4xl font-bold font-serif text-[#002B36] mb-4">
            Announcements & Updates
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay informed with the latest news, notices, and developments from the JuriLingo portal.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
                <div className="flex gap-4 items-center">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border p-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#005F63] text-white rounded-md hover:brightness-110 transition-all font-semibold"
            >
              Retry
            </button>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border p-8 text-gray-500 font-medium">
            No announcements available at the moment.
          </div>
        ) : (
          <div className="space-y-6">
            {announcements.map((item) => {
              const cat = getCategoryStyles(item.type);
              return (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    {/* Category Icon */}
                    <div
                      className="p-3 rounded-xl shrink-0"
                      style={{ backgroundColor: cat.bg, color: cat.text }}
                    >
                      {getIcon(item.type)}
                    </div>

                    <div className="space-y-1">
                      {/* Category & Date */}
                      <div className="flex items-center gap-2 flex-wrap text-xs font-bold uppercase tracking-wider">
                        <span style={{ color: cat.text }}>{cat.label}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-400 flex items-center gap-1 font-semibold">
                          <Calendar size={12} />
                          {new Date(item.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      {/* Title / Announcement content */}
                      <h3 className="text-lg font-bold text-[#002B36] leading-snug">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    {item.linkUrl && (
                      <Link
                        href={item.linkUrl}
                        target={item.linkUrl.startsWith('http') ? '_blank' : '_self'}
                        rel={item.linkUrl.startsWith('http') ? 'noopener noreferrer' : ''}
                        className="px-4 py-2 rounded-lg text-white font-bold text-sm transition-all hover:brightness-110 flex items-center gap-1.5 shadow-sm"
                        style={{ backgroundColor: colors.teal }}
                      >
                        Visit Link
                        <ExternalLink size={14} />
                      </Link>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(item._id, item.title)}
                        disabled={deletingId === item._id}
                        className="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-all border border-transparent hover:border-red-100 disabled:opacity-50"
                        title="Delete Announcement"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsList;
