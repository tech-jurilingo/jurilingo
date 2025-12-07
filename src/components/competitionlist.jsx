"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Clock, Users, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CompetitionsList = () => {
  const [competitions, setCompetitions] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const router = useRouter();
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

        // Fetch competitions
        const res = await fetch("/api/competition", { method: "GET" });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Failed to fetch competitions");
        }

        setCompetitions(data?.competitions || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Something went wrong while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDateTime = (value) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (isNaN(date.getTime())) return "N/A";

    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();

    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");

    return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
  };

  const handleRegister = async (competition) => {
    if (!user) {
      alert("Please login to register for competitions");
      router.push('/auth/login');
      return;
    }

    if (!competition.registrationOpen) {
      alert("Registration is currently closed.");
      return;
    }

    // Check if user is already in waitlist or participants
    const isInWaitlist = competition.waitlist?.some(
      (item) => item.user === user.userId
    );
    const isParticipant = competition.participants?.some(
      (p) => p === user.userId || p._id === user.userId
    );

    if (isInWaitlist) {
      alert("You have already applied for this competition. Waiting for admin approval.");
      return;
    }

    if (isParticipant) {
      alert("You are already registered for this competition.");
      return;
    }

    setProcessingId(competition._id);

    try {
      const response = await fetch(`/api/competition/by-id/${competition._id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.userId }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Registration successful! Your application is pending admin approval.");
        // Refresh competitions list
        const res = await fetch("/api/competition/status/all/list");
        const updatedData = await res.json();
        if (updatedData.success) {
          setCompetitions(updatedData.competitions || []);
        }
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Error registering:", err);
      alert("Failed to register. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (competitionId, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setProcessingId(competitionId);

    try {
      const response = await fetch(`/api/competition/by-id/${competitionId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        alert("Competition deleted successfully!");
        // Remove from local state
        setCompetitions(competitions.filter(c => c._id !== competitionId));
      } else {
        alert(data.message || "Failed to delete competition");
      }
    } catch (err) {
      console.error("Error deleting competition:", err);
      alert("Failed to delete competition. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div
      className="grow w-full py-12 px-4 md:px-8"
      style={{ backgroundColor: colors.bg }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-serif text-[#002B36] mb-4">
            Upcoming Competitions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse and register for prestigious national & international moot
            court competitions.
          </p>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">
            Loading competitions...
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : competitions.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No competitions found.
          </div>
        ) : (
          <div className="space-y-6">
            {competitions.map((comp) => {
              const isActive = comp.status === "active";
              const isRegistrationOpen = comp.registrationOpen;
              const participantsCount = comp.participants?.length || 0;
              const isProcessing = processingId === comp._id;

              return (
                <div
                  key={comp._id}
                  className="bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-8 flex flex-col gap-6 transition-all hover:shadow-lg"
                >
                  {/* Main Content */}
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Left Side */}
                    <div className="grow">
                      {/* Status Row */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          {/* Active/Inactive */}
                          <span
                            className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                              isActive
                                ? "bg-[#E3B65B]/20 text-[#005F63]"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            {comp.status}
                          </span>

                          {/* Registration Open/Closed */}
                          <span
                            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                              isRegistrationOpen
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {isRegistrationOpen
                              ? "Registration Open"
                              : "Registration Closed"}
                          </span>
                        </div>

                        {/* Fee */}
                        <span className="text-sm text-gray-600 flex items-center">
                          Fee: ₹{comp.registrationFee}
                        </span>
                      </div>

                      {/* Title */}
                      <Link 
                        href={`/competitions/by-id/${comp._id}`}
                        className="text-2xl font-bold text-[#002B36] mb-3 hover:text-[#005F63] transition-colors block"
                      >
                        {comp.title}
                      </Link>

                      {/* Dates Section */}
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        {/* Registration Period */}
                        <div className="flex items-start gap-2">
                          <Calendar size={16} className="text-[#E3B65B] mt-0.5" />
                          <span>
                            Registration:{" "}
                            <strong>
                              {formatDateTime(comp.registrationStartDate)}
                            </strong>{" "}
                            –{" "}
                            <strong>
                              {formatDateTime(comp.registrationEndDate)}
                            </strong>
                          </span>
                        </div>

                        {/* Competition Schedule */}
                        <div className="flex items-start gap-2">
                          <Clock size={16} className="text-[#E3B65B] mt-0.5" />
                          <span>
                            Competition:{" "}
                            <strong>{formatDateTime(comp.startDate)}</strong> →{" "}
                            <strong>{formatDateTime(comp.endDate)}</strong>
                          </span>
                        </div>

                        {/* Participants */}
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Users size={14} />
                          <span>{participantsCount} registered participants</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 leading-relaxed line-clamp-3">
                        {comp.description}
                      </p>
                    </div>

                    {/* Right Side: Action Buttons */}
                    <div className="flex flex-col justify-center gap-3 min-w-[220px] border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-6">
                      <Link
                        href={`/competitions/by-id/${comp._id}`}
                        className="w-full px-8 py-3 rounded-md font-bold text-lg shadow-sm transition-all bg-gray-100 text-[#005F63] hover:bg-gray-200 text-center"
                      >
                        View Details
                      </Link>

                      {!isAdmin && (
                        <button
                          onClick={() => handleRegister(comp)}
                          disabled={!isActive || !isRegistrationOpen || isProcessing}
                          className={`w-full px-8 py-3 rounded-md font-bold text-lg shadow-sm transition-all ${
                            isActive && isRegistrationOpen && !isProcessing
                              ? "bg-[#005F63] text-white hover:bg-[#004a4d] hover:shadow-md"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          {isProcessing
                            ? "Processing..."
                            : isActive && isRegistrationOpen
                            ? "Register Now"
                            : "Registration Closed"}
                        </button>
                      )}

                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(comp._id, comp.title)}
                          disabled={isProcessing}
                          className="w-full px-8 py-3 rounded-md font-bold text-lg shadow-sm transition-all bg-red-600 text-white hover:bg-red-700 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <Trash2 size={18} />
                          {isProcessing ? "Deleting..." : "Delete"}
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

export default CompetitionsList;