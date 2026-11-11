
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Megaphone,
  BookOpen,
  Mic2,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ArrowUpRight
} from 'lucide-react';

const AnnouncementsSection = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const colors = {
    teal: '#005F63',
    gold: '#E3B65B',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, announcementRes] = await Promise.all([
          fetch('/api/auth/validate-token'),
          fetch('/api/announcement')
        ]);

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }

        if (announcementRes.ok) {
          const data = await announcementRes.json();

          const sorted = (data.announcements || []).sort(
            (a, b) => Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured))
          );

          setAnnouncements(sorted);
        }
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Automatically move to the next announcement.
  useEffect(() => {
    if (announcements.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((previous) => (previous + 1) % announcements.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [announcements.length]);

  const activeAnnouncement =
    announcements.length > 0
      ? announcements[currentIndex % announcements.length]
      : null;

  const goToPrevious = () => {
    setCurrentIndex((previous) =>
      previous === 0 ? announcements.length - 1 : previous - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((previous) =>
      (previous + 1) % announcements.length
    );
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      const res = await fetch(`/api/announcement/by-id/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setAnnouncements((previous) =>
          previous.filter((item) => item._id !== id)
        );
        setCurrentIndex(0);
      } else {
        alert('Unable to delete announcement.');
      }
    } catch (err) {
      console.error('Failed to delete announcement:', err);
      alert('Something went wrong while deleting.');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Blog':
        return <BookOpen size={15} />;
      case 'Podcast':
        return <Mic2 size={15} />;
      case 'Competition':
        return <Trophy size={15} />;
      default:
        return <Megaphone size={15} />;
    }
  };

  const isAdmin = user?.role === 'admin';

  const renderAction = (item) => {
    const href = item.linkUrl || '/announcements';
    const external = /^https?:\/\//i.test(href);
    const buttonText = item.buttonText || 'Explore Now';

    const content = (
      <span className="inline-flex items-center gap-2 bg-[#E3B65B] text-[#003F42] px-5 py-3 rounded-lg font-bold text-sm hover:bg-white transition-all duration-300">
        {buttonText}
        <ArrowUpRight size={17} />
      </span>
    );

    return external ? (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    ) : (
      <Link href={href}>
        {content}
      </Link>
    );
  };

  return (
    <section className="w-full py-12 md:py-16 px-4 bg-[#F5F5F0]">
      <div className="max-w-7xl mx-auto">

        {/* Section heading */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <div className="flex items-center gap-2 text-[#005F63] mb-2">
              <Megaphone size={21} />
              <span className="text-sm font-bold uppercase tracking-[0.18em]">
                Stay Updated
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Announcements
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              The latest updates, opportunities and happenings at JuriLingo.
            </p>
          </div>

          <Link
            href="/announcements"
            className="hidden sm:inline-flex items-center gap-1 text-[#005F63] font-semibold text-sm hover:underline"
          >
            View All <ChevronRight size={17} />
          </Link>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="w-full h-[350px] md:h-[430px] rounded-2xl bg-gray-200 animate-pulse" />
        ) : announcements.length === 0 ? (
          <div className="rounded-2xl bg-white border border-gray-200 p-12 text-center">
            <Megaphone size={35} className="mx-auto text-[#005F63] mb-3" />
            <h3 className="text-lg font-bold text-gray-800">
              No announcements yet
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Check back later for the latest updates.
            </p>
          </div>
        ) : (
          <>
            {/* Featured announcement carousel */}
            <div className="relative overflow-hidden rounded-2xl bg-[#003F42] shadow-xl min-h-[390px] md:min-h-[440px]">

              {/* Background image */}
              {activeAnnouncement?.imageUrl && (
                <div
                  key={activeAnnouncement._id}
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                  style={{
                    backgroundImage: `url("${activeAnnouncement.imageUrl}")`
                  }}
                />
              )}

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#002D30]/95 via-[#003F42]/75 to-black/20" />

              {/* Announcement content */}
              <div
                key={`content-${activeAnnouncement?._id}`}
                className="relative z-10 flex flex-col justify-end min-h-[390px] md:min-h-[440px] p-7 md:p-12 max-w-3xl"
              >
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className="inline-flex items-center gap-2 bg-[#E3B65B] text-[#003F42] rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide">
                    {getIcon(activeAnnouncement.type)}
                    {activeAnnouncement.type || 'Announcement'}
                  </span>

                  {activeAnnouncement.isFeatured && (
                    <span className="text-white text-xs font-semibold border border-white/40 rounded-full px-3 py-1.5">
                      FEATURED
                    </span>
                  )}
                </div>

                <h3 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                  {activeAnnouncement.title}
                </h3>

                {activeAnnouncement.description && (
                  <p className="text-white/85 text-sm md:text-base leading-relaxed mb-7 max-w-2xl line-clamp-3">
                    {activeAnnouncement.description}
                  </p>
                )}

                <div className="flex items-center gap-4 flex-wrap">
                  {renderAction(activeAnnouncement)}

                  {isAdmin && (
                    <button
                      onClick={(e) => handleDelete(e, activeAnnouncement._id)}
                      className="inline-flex items-center gap-2 text-white/80 hover:text-red-300 text-sm transition-colors"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  )}
                </div>
              </div>

              {/* Previous and next controls */}
              {announcements.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    aria-label="Previous announcement"
                    className="absolute z-20 left-3 md:left-5 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 md:p-3 rounded-full transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <button
                    onClick={goToNext}
                    aria-label="Next announcement"
                    className="absolute z-20 right-3 md:right-5 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 md:p-3 rounded-full transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Slide indicators */}
              {announcements.length > 1 && (
                <div className="absolute bottom-5 right-7 md:right-12 z-20 flex items-center gap-2">
                  {announcements.map((item, index) => (
                    <button
                      key={item._id}
                      onClick={() => setCurrentIndex(index)}
                      aria-label={`Go to announcement ${index + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? 'w-8 bg-[#E3B65B]'
                          : 'w-2 bg-white/60 hover:bg-white'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Announcement thumbnails */}
            {announcements.length > 1 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-700">
                    More Announcements
                  </h3>
                  <span className="text-xs text-gray-400">
                    {currentIndex + 1} / {announcements.length}
                  </span>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-3">
                  {announcements.map((item, index) => (
                    <button
                      key={item._id}
                      onClick={() => setCurrentIndex(index)}
                      className={`relative shrink-0 w-52 md:w-64 text-left rounded-xl overflow-hidden border-2 transition-all ${
                        index === currentIndex
                          ? 'border-[#005F63] shadow-md'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <div
                        className="h-24 md:h-28 bg-[#005F63] bg-cover bg-center"
                        style={
                          item.imageUrl
                            ? { backgroundImage: `url("${item.imageUrl}")` }
                            : {}
                        }
                      >
                        {!item.imageUrl && (
                          <div className="h-full flex items-center justify-center text-white/80">
                            {getIcon(item.type)}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white text-xs font-semibold line-clamp-2">
                          {item.title}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Mobile view all link */}
        <div className="mt-5 sm:hidden">
          <Link
            href="/announcements"
            className="inline-flex items-center gap-1 text-[#005F63] font-semibold text-sm"
          >
            View All Announcements <ChevronRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AnnouncementsSection;
