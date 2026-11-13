
'use client';

import React, { useEffect, useState } from 'react';

const colors = {
  teal: '#005F63',
  gold: '#E3B65B',
};

const TheTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        setLoading(true);
        setError('');

        const response = await fetch('/api/team', {
          cache: 'no-store',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || 'Unable to load team members.'
          );
        }

        setTeamMembers(
          Array.isArray(data.members) ? data.members : []
        );
      } catch (err) {
        console.error('Team members fetch error:', err);
        setError(err.message || 'Unable to load the team.');
      } finally {
        setLoading(false);
      }
    }

    fetchTeamMembers();
  }, []);

  return (
    <section
      className="w-full py-20 px-4"
      style={{ backgroundColor: '#F8FAF8' }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
            style={{ color: colors.teal }}
          >
            Meet the Team
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The passionate people behind JuriLingo — dedicated to making legal
            education accessible, engaging, and empowering for everyone.
          </p>

          <div
            className="mt-6 mx-auto h-1 w-20 rounded-full"
            style={{ backgroundColor: colors.gold }}
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16 text-gray-500">
            Loading team members...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-5 py-2 rounded-lg bg-[#005F63] text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && teamMembers.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            No team members are currently available.
          </div>
        )}

        {/* Team Members */}
        {!loading && !error && teamMembers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {teamMembers.map((member) => (
              <div
                key={member._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >

                {/* Image Section */}
                <div className="w-full h-[450px] bg-gray-200 relative">
                  <img
                    src={member.imagePath}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        'https://placehold.co/400x400/e2e8f0/64748b?text=' +
                        encodeURIComponent(
                          member.name?.split(' ')[0] || 'Team'
                        );
                    }}
                  />
                </div>

                {/* Text Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-1 text-gray-900">
                    {member.name}
                  </h3>

                  <p className="text-[#E3B65B] font-bold tracking-wide uppercase text-sm mb-4">
                    {member.role}
                  </p>

                  <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                    {member.bio}
                  </p>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default TheTeam;
