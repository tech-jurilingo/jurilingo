'use client';

import React, { useState, useEffect } from 'react';
import { PlayCircle } from 'lucide-react';

const RecentPodcasts = () => {
  const colors = {
    teal: '#005F63',
    bgSection: '#F5F5F0',
  };

  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await fetch('/api/podcast');
        const data = await response.json();

        if (data.success) {
          // Get the 2 most recent podcasts
          setPodcasts(data.podcasts.slice(0, 2));
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to load podcasts');
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-16" style={{ backgroundColor: colors.bgSection }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2
            className="text-3xl font-bold mb-10 text-center"
            style={{ color: colors.teal }}
          >
            Spotlight: Legal Voices
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse"
              >
                <div className="aspect-video w-full bg-gray-300"></div>
                <div className="p-5">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-16" style={{ backgroundColor: colors.bgSection }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2
            className="text-3xl font-bold mb-10 text-center"
            style={{ color: colors.teal }}
          >
            Spotlight: Legal Voices
          </h2>
          <p className="text-center text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  if (podcasts.length === 0) {
    return (
      <section className="w-full py-16" style={{ backgroundColor: colors.bgSection }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2
            className="text-3xl font-bold mb-10 text-center"
            style={{ color: colors.teal }}
          >
            Spotlight: Legal Voices
          </h2>
          <p className="text-center text-gray-600">
            No podcasts available at the moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16" style={{ backgroundColor: colors.bgSection }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h2
          className="text-3xl font-bold mb-10 text-center"
          style={{ color: colors.teal }}
        >
          Spotlight: Legal Voices
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {podcasts.map((pod) => (
            <div
              key={pod._id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
            >
              {/* Video Container */}
              <div className="aspect-video w-full bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${pod.youtubeId}`}
                  title={pod.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                  {pod.title}
                </h3>
                <a
                  href={pod.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-[#005F63] font-medium hover:underline"
                >
                  <PlayCircle size={16} className="mr-1" />
                  Watch on YouTube
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentPodcasts;