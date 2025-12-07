'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, IndianRupee } from 'lucide-react';
import Link from 'next/link';

/*  
───────────────────────────────────────────────────────────────
 FULL ORIGINAL COMPONENT — 100% COMMENTED OUT
───────────────────────────────────────────────────────────────

const RecentCompetitions = () => {
  const colors = {
    teal: '#005F63',
  };

  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await fetch('/api/competition/active');
        const data = await response.json();

        if (data.success) {
          // Get top 3 competitions
          setCompetitions(data.competitions.slice(0, 3));
        } else {
          setError(data.message);
        }
      } catch (err) {
        console.error('Error fetching competitions:', err);
        setError('Failed to load competitions');
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <section className="w-full py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2
            className="text-3xl font-bold mb-10 text-center"
            style={{ color: colors.teal }}
          >
            Upcoming Competitions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-xl p-6 shadow-md border border-gray-100 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2
            className="text-3xl font-bold mb-10 text-center"
            style={{ color: colors.teal }}
          >
            Upcoming Competitions
          </h2>
          <p className="text-center text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  if (competitions.length === 0) {
    return (
      <section className="w-full py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2
            className="text-3xl font-bold mb-10 text-center"
            style={{ color: colors.teal }}
          >
            Upcoming Competitions
          </h2>
          <p className="text-center text-gray-600">
            No competitions available at the moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h2
          className="text-3xl font-bold mb-10 text-center"
          style={{ color: colors.teal }}
        >
          Upcoming Competitions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {competitions.map((comp) => (
            <div
              key={comp._id}
              className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-gray-100 flex flex-col"
            >
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-[#E3B65B]/20 text-[#005F63] mb-3">
                  Open for Registration
                </span>
                <h3 className="text-xl font-bold leading-tight mb-2 text-gray-800">
                  {comp.title}
                </h3>
              </div>

              <div className="space-y-3 mb-6 grow">
                <div className="flex items-start text-gray-600 text-sm">
                  <Calendar size={16} className="mr-2 mt-0.5 text-[#E3B65B] shrink-0" />
                  <div>
                    <div className="font-medium">Competition:</div>
                    <div>
                      {formatDate(comp.startDate)} to {formatDate(comp.endDate)}
                    </div>
                  </div>
                </div>
                
                {comp.registrationStartDate && comp.registrationEndDate && (
                  <div className="flex items-start text-gray-600 text-sm">
                    <Calendar size={16} className="mr-2 mt-0.5 text-[#E3B65B] shrink-0" />
                    <div>
                      <div className="font-medium">Registration:</div>
                      <div>
                        {formatDate(comp.registrationStartDate)} to{' '}
                        {formatDate(comp.registrationEndDate)}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center text-gray-600 text-sm">
                  <IndianRupee size={16} className="mr-1 text-[#E3B65B]" />
                  <span className="font-medium">Fee: ₹{comp.registrationFee}</span>
                </div>
              </div>

              <Link
                href={`/competitions/by-id/${comp._id}`}
                className="w-full py-2 rounded font-bold text-white transition-colors hover:brightness-110 text-center block"
                style={{ backgroundColor: colors.teal }}
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

───────────────────────────────────────────────────────────────
 END OF ORIGINAL
───────────────────────────────────────────────────────────────
*/

const RecentCompetitions = () => {
  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
        <h2 className="text-3xl font-bold text-[#005F63] mb-4">
          Upcoming Competitions
        </h2>
        <p className="text-gray-600 text-lg font-medium mt-6">
          🚧 Coming Soon
        </p>
      </div>
    </section>
  );
};

export default RecentCompetitions;
