"use client";

import React, { useEffect, useState } from "react";
import { Youtube, Trash2 } from "lucide-react";

const PodcastsList = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const colors = { teal: "#005F63", gold: "#E3B65B", bg: "#F5F5F0" };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Validate user token
        const userResponse = await fetch('/api/auth/validate-token');
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        }

        // Fetch podcasts
        const res = await fetch("/api/podcast", { method: "GET" });
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(data?.message || "Failed to fetch podcasts");
        }

        setPodcasts(data?.podcasts || []);
      } catch (err) {
        setError(err.message || "Something went wrong while fetching podcasts");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (podcastId, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(podcastId);

    try {
      const response = await fetch(`/api/podcast/by-id/${podcastId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        alert('Podcast deleted successfully!');
        // Remove from local state
        setPodcasts(podcasts.filter(p => p._id !== podcastId));
      } else {
        alert(data.message || 'Failed to delete podcast');
      }
    } catch (err) {
      console.error('Error deleting podcast:', err);
      alert('Failed to delete podcast. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (value) => {
    if (!value) return "N/A";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "N/A";

    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();

    return `${dd}-${mm}-${yyyy}`;
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div
      className="grow w-full py-12 px-4 md:px-8"
      style={{ backgroundColor: colors.bg }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-serif text-[#002B36] mb-4">
            Podcasts
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Watch and listen to expert discussions, tutorials, and competition
            highlights.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">
            Loading podcasts...
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : podcasts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No podcasts available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {podcasts.map((podcast) => {
              const videoId =
                podcast.youtubeId ||
                (typeof podcast.youtubeUrl === "string"
                  ? (podcast.youtubeUrl.match(
                      /(?:youtube\.com\/.*v=|youtu\.be\/)([^&#]+)/,
                    ) || [])[1]
                  : null);

              return (
                <div
                  key={podcast._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col border border-gray-100"
                >
                  {/* Video Player Area */}
                  <div className="aspect-video w-full bg-black relative group">
                    {videoId ? (
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={podcast.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      ></iframe>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                        <Youtube size={40} className="mb-2 opacity-40" />
                        <span className="text-xs">Invalid YouTube URL</span>
                      </div>
                    )}
                  </div>

                  {/* Content Area */}
                  <div className="p-5 grow flex flex-col">
                    <div className="flex items-center text-xs text-[#E3B65B] font-bold uppercase tracking-wider mb-2">
                      <Youtube size={14} className="mr-1" />
                      Episode
                    </div>
                    <h3 className="text-lg font-bold text-[#002B36] mb-2 line-clamp-2 leading-tight">
                      {podcast.title}
                    </h3>

                    {/* Footer of card */}
                    <div className="mt-auto pt-4 border-t border-gray-50">
                      <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
                        <span>{formatDate(podcast.createdAt)}</span>
                      </div>

                      {/* Admin Delete Button */}
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(podcast._id, podcast.title)}
                          disabled={deletingId === podcast._id}
                          className="w-full py-2 rounded-md font-bold text-white transition-colors hover:brightness-110 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          <Trash2 size={14} />
                          {deletingId === podcast._id ? 'Deleting...' : 'Delete Podcast'}
                        </button>
                      )}
                    </div>
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

export default PodcastsList;