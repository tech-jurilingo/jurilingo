'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Megaphone, BookOpen, Mic2, Trophy, ChevronRight, Trash2 } from 'lucide-react';

const AnnouncementsSection = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const colors = {
    teal: '#005F63',
    gold: '#E3B65B',
  };

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        // Fetch user token for admin check
        const userRes = await fetch('/api/auth/validate-token');
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }

        // Fetch announcements
        const res = await fetch('/api/announcement');
        if (res.ok) {
          const data = await res.json();
          setAnnouncements(data.announcements || []);
        }
      } catch (err) {
        console.error('Error fetching announcements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;

    try {
      const res = await fetch(`/api/announcement/by-id/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setAnnouncements(announcements.filter(a => a._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete", err);
    }
  }

  const getIcon = (type) => {
    switch (type) {
      case 'Blog':
        return <BookOpen size={15} className="shrink-0" />;
      case 'Podcast':
        return <Mic2 size={15} className="shrink-0" />;
      case 'Competition':
        return <Trophy size={15} className="shrink-0" />;
      default:
        return <Megaphone size={15} className="shrink-0" />;
    }
  };

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'Blog':
        return { backgroundColor: '#ffffff', color: colors.teal, border: '1px solid #ffffff' };
      case 'Podcast':
        return { backgroundColor: '#ffffff', color: colors.teal, border: '1px solid #ffffff' };
      case 'Competition':
        return { backgroundColor: '#ffffff', color: colors.teal, border: '1px solid #ffffff' };
      default:
        return { backgroundColor: '#ffffff', color: colors.teal, border: '1px solid #ffffff' };
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <section
      className="w-full py-12 px-4 shadow-inner"
      style={{ backgroundColor: colors.gold }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Label */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-base font-bold shrink-0 shadow-sm"
            style={{ backgroundColor: colors.teal }}
          >
            <Megaphone size={18} />
            <span>Announcements</span>
          </div>

          {/* Scrolling items */}
          {loading ? (
            <span className="text-sm text-[#005F63] font-medium animate-pulse">Loading latest updates...</span>
          ) : announcements.length === 0 ? (
            <span className="text-sm text-[#005F63] font-medium">No announcements at the moment.</span>
          ) : (
            <div className="flex items-center gap-3 flex-wrap">
              {announcements.map((item, idx) => (
                <div key={item._id} className="flex items-center gap-2 group">
                  {item.linkUrl ? (
                    <Link href={item.linkUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
                        style={getBadgeStyle(item.type)}
                      >
                        {getIcon(item.type)}
                        {item.type}
                      </span>
                      <span className="text-base text-[#005F63] group-hover:text-black transition-colors font-semibold line-clamp-1 max-w-md hover:underline">
                        {item.title}
                      </span>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
                        style={getBadgeStyle(item.type)}
                      >
                        {getIcon(item.type)}
                        {item.type}
                      </span>
                      <span className="text-base text-[#005F63] font-semibold line-clamp-1 max-w-md">
                        {item.title}
                      </span>
                    </div>
                  )}

                  {isAdmin && (
                    <button onClick={(e) => handleDelete(e, item._id)} className="text-red-500 hover:text-red-700 opacity-50 hover:opacity-100 ml-1">
                      <Trash2 size={14} />
                    </button>
                  )}

                  {idx < announcements.length - 1 && (
                    <span className="text-gray-300 ml-1 hidden sm:inline">•</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AnnouncementsSection;
