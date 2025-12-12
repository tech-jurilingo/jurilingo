'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, ArrowLeft, IndianRupee, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

const CompetitionDetail = () => {
  const [competition, setCompetition] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingUserId, setProcessingUserId] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const params = useParams();
  const competitionId = params.id;
  const router = useRouter();
  
  const colors = { teal: '#005F63', gold: '#E3B65B', bg: '#ffffff' };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Validate user token
        const userResponse = await fetch('/api/auth/validate-token');
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        } else {
          setUser(null);
        }

        // Fetch competition details
        const response = await fetch(`/api/competition/by-id/${competitionId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          setCompetition(data.competition);
        } else {
          setError(data.message || 'Failed to load competition');
        }
      } catch (err) {
        console.error('Error fetching competition:', err);
        setError(err.message || 'Failed to load competition');
      } finally {
        setLoading(false);
      }
    };

    if (competitionId) {
      fetchData();
    }
  }, [competitionId]);

  const handleApprove = async (waitlistItemId, userId) => {
    console.log('Approving user:', userId);
    console.log('Waitlist Item ID:', waitlistItemId);
    setProcessingUserId(userId);
    try {
      const response = await fetch(`/api/competition/by-id/${competitionId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ waitlistItemId }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state using returned competition (or refetch)
        setCompetition(data.competition || await refetchCompetition());
      } else {
        alert(data.message || 'Failed to approve participant');
      }
    } catch (err) {
      console.error('Error approving participant:', err);
      alert('Failed to approve participant');
    } finally {
      setProcessingUserId(null);
    }
  };

  const handleReject = async (waitlistItemId, userId) => {
    setProcessingUserId(userId);
    try {
      const response = await fetch(`/api/competition/by-id/${competitionId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ waitlistItemId }),
      });

      const data = await response.json();

      if (data.success) {
        setCompetition(data.competition || await refetchCompetition());
      } else {
        alert(data.message || 'Failed to reject participant');
      }
    } catch (err) {
      console.error('Error rejecting participant:', err);
      alert('Failed to reject participant');
    } finally {
      setProcessingUserId(null);
    }
  };

  // New: registration handler
  const handleRegister = async () => {
    if (!user) {
      alert("Please login to register for competitions");
      router.push('/auth/login');
      return;
    }

    if (!competition?.registrationOpen) {
      alert("Registration is currently closed.");
      return;
    }

    // Check existing waitlist or participants (handles both populated and id-only arrays)
    const isInWaitlist = competition.waitlist?.some(
      (item) => {
        // waitlist entries may have user as object or as ObjectId string
        const uid = item.user?._id || item.user;
        return uid === user.userId || uid === user._id;
      }
    );

    const isParticipant = competition.participants?.some(
      (p) => {
        // participants may be populated user objects or just ids
        const pid = p?._id || p;
        return pid === user.userId || pid === user._id;
      }
    );

    if (isInWaitlist) {
      alert("You have already applied for this competition. Waiting for admin approval.");
      return;
    }

    if (isParticipant) {
      alert("You are already registered for this competition.");
      return;
    }

    setIsRegistering(true);

    try {
      const response = await fetch(`/api/competition/by-id/${competitionId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.userId }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Registration submitted — your application is pending admin approval.");

        // Update local competition state using returned competition if provided,
        // otherwise refetch to get the new waitlist.
        if (data.competition) {
          setCompetition(data.competition);
        } else {
          await refetchCompetitionAndSet();
        }
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Error registering:", err);
      alert("Failed to register. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  const refetchCompetition = async () => {
    try {
      const res = await fetch(`/api/competition/by-id/${competitionId}`);
      if (!res.ok) return null;
      const d = await res.json();
      return d.competition || null;
    } catch (e) {
      console.error("refetch error", e);
      return null;
    }
  };

  const refetchCompetitionAndSet = async () => {
    const c = await refetchCompetition();
    if (c) setCompetition(c);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isAdmin = user?.role === 'admin';

  if (loading) {
    return (
      <div className="grow flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005F63] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading competition...</p>
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
            href="/competitions"
            className="inline-flex items-center text-[#005F63] hover:underline"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Competitions
          </Link>
        </div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="grow flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Competition not found.</p>
          <Link
            href="/competitions"
            className="inline-flex items-center text-[#005F63] hover:underline"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Competitions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grow w-full py-12 px-4 md:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/competitions"
          className="flex items-center text-gray-500 hover:text-[#005F63] mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Competitions
        </Link>

        {/* Competition Details */}
        <div className="bg-gray-50 rounded-xl p-8 mb-8 border border-gray-200">
          <div className="mb-4">
            <span
              className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full mb-4 ${
                competition.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {competition.status}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-[#002B36] mb-4 leading-tight">
              {competition.title}
            </h1>
          </div>

          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            {competition.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Calendar size={20} className="text-[#E3B65B] mt-1 shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 mb-1">Competition Dates</p>
                <p className="text-gray-600 text-sm">
                  {formatDate(competition.startDate)} - {formatDate(competition.endDate)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock size={20} className="text-[#E3B65B] mt-1 shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 mb-1">Registration Period</p>
                <p className="text-gray-600 text-sm">
                  {formatDate(competition.registrationStartDate)} -{' '}
                  {formatDate(competition.registrationEndDate)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <IndianRupee size={20} className="text-[#E3B65B] mt-1 shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 mb-1">Registration Fee</p>
                <p className="text-gray-600 text-sm">₹{competition.registrationFee}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users size={20} className="text-[#E3B65B] mt-1 shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 mb-1">Participants</p>
                <p className="text-gray-600 text-sm">
                  {competition.participants?.length || 0} registered
                </p>
              </div>
            </div>
          </div>

          {/* Register button (for non-admins) */}
          {!isAdmin && (
            <div className="mt-6">

              {/* Payment instruction note */}
              <p className="text-red-600 font-semibold mb-3 text-sm">
                Please scan the QR code and complete the payment before clicking the Register button.
              </p>

              <button
                onClick={handleRegister}
                disabled={!competition.registrationOpen || isRegistering}
                className={`px-6 py-3 rounded-md font-bold text-lg shadow-sm transition-all ${
                  competition.registrationOpen && !isRegistering
                    ? 'bg-[#005F63] text-white hover:bg-[#004a4d] hover:shadow-md'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isRegistering ? 'Processing...' : competition.registrationOpen ? 'Register Now' : 'Registration Closed'}
              </button>
            </div>
)}

        </div>

        {/* Payment QR Code */}
        {competition && (
          <div className="bg-white rounded-xl p-8 mb-8 border border-gray-200 text-center">
            <h2 className="text-2xl font-bold text-[#002B36] mb-4">Payment QR Code</h2>
            <p className="text-gray-600 mb-6">
              Scan this QR code to complete your registration payment
            </p>
            <div className="flex justify-center">
              <div className="relative w-64 h-64 border-2 border-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/qr.png"
                  alt="Payment QR Code"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {/* Waitlist - Admin Only */}
        {isAdmin && (
          <div className="bg-yellow-50 rounded-xl p-8 mb-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-[#002B36] mb-6 flex items-center gap-2">
              <Clock size={24} className="text-[#E3B65B]" />
              Pending Approvals ({competition.waitlist.filter(w => w.status === 'pending').length})
            </h2>
            <div className="space-y-4">
              {competition.waitlist
                .filter((item) => item.status === 'pending')
                .map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-lg p-4 flex items-center justify-between border border-gray-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#E3B65B]/20 flex items-center justify-center text-[#005F63] font-bold">
                        {item.user?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {item.user?.name || 'Unknown User'}
                        </p>
                        <p className="text-sm text-gray-500">{item.user?.email}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Applied: {formatDate(item.appliedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(item._id, item.user?._id)}
                        disabled={processingUserId === item.user?._id}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <CheckCircle size={16} />
                        {processingUserId === item.user?._id ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(item._id, item.user?._id)}
                        disabled={processingUserId === item.user?._id}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Participants List */}
        {isAdmin && (
          <div className="bg-white rounded-xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-[#002B36] mb-6 flex items-center gap-2">
              <Users size={24} className="text-[#E3B65B]" />
              Registered Participants ({competition.participants?.length || 0})
            </h2>
            {competition.participants && competition.participants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {competition.participants.map((participant, index) => (
                  <div
                    key={participant._id || index}
                    className="bg-gray-50 rounded-lg p-4 flex items-center gap-4 border border-gray-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#005F63] flex items-center justify-center text-white font-bold">
                      {participant.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {participant.name || 'Unknown User'}
                      </p>
                      <p className="text-sm text-gray-500">{participant.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No participants registered yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitionDetail;
