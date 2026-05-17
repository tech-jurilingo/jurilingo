'use client';

import React, { useEffect, useState } from 'react';
import { User, RefreshCw, Users, UserCheck, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

/**
 * UserDashboard
 * - Uses GET /api/auth/me to get user
 * - Uses GET /api/competition/user/:userId to get competitions for that user
 * - Admins also see total registrations via GET /api/auth/registrations
 */

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [comps, setComps] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingComps, setLoadingComps] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Admin-only state
  const [registrations, setRegistrations] = useState(null);
  const [loadingRegs, setLoadingRegs] = useState(false);

  const colors = { teal: '#005F63', gold: '#E3B65B', bg: '#F8FAF8' };

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setError(null);
    setLoadingUser(true);
    setLoadingComps(false);

    try {
      // 1) fetch user
      const uRes = await fetch('/api/auth/me');
      if (!uRes.ok) {
        // not logged in or server error
        setUser(null);
        setComps([]);
        setLoadingUser(false);
        return;
      }
      const uData = await uRes.json();
      setUser(uData);
      setLoadingUser(false);

      // 2) fetch competitions for this user
      setLoadingComps(true);
      const url = `/api/competition/user/${uData._id}`;
      const cRes = await fetch(url);
      if (!cRes.ok) {
        const errBody = await cRes.json().catch(() => null);
        throw new Error(errBody?.message || `Failed to fetch competitions (${cRes.status})`);
      }
      const cData = await cRes.json();
      setComps(Array.isArray(cData.competitions) ? cData.competitions : []);
      setLoadingComps(false);

      // 3) If admin, also load registrations
      if (uData.role === 'admin') {
        loadRegistrations();
      }
    } catch (err) {
      console.error('Dashboard load error', err);
      setError(err.message || 'Failed to load dashboard');
      setLoadingUser(false);
      setLoadingComps(false);
    }
  }

  async function loadRegistrations() {
    setLoadingRegs(true);
    try {
      const res = await fetch('/api/auth/registrations');
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data);
      }
    } catch (err) {
      console.error('Failed to load registrations:', err);
    } finally {
      setLoadingRegs(false);
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  };

  const formatDateShort = (iso) => {
    if (!iso) return '-';
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatDateTime = (iso) => {
    if (!iso) return '-';
    const d = new Date(iso);
    return `${d.toLocaleDateString('en-IN')} ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const renderStatusBadge = (status) => {
    if (!status) return <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">—</span>;
    const map = {
      accepted: { text: 'Registered', cls: 'bg-emerald-100 text-emerald-800' },
      pending: { text: 'Applied', cls: 'bg-yellow-100 text-yellow-800' },
      rejected: { text: 'Rejected', cls: 'bg-red-100 text-red-800' },
    };
    const info = map[status] || { text: status, cls: 'bg-gray-100 text-gray-800' };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${info.cls}`}>{info.text}</span>;
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div style={{ backgroundColor: colors.bg }} className="grow w-full py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold font-serif text-[#002B36]">Your Dashboard</h2>
            <p className="text-sm text-gray-600 mt-1">Overview of your profile and competition participation.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white shadow-sm hover:shadow-md"
              title="Refresh"
            >
              <RefreshCw size={16} /> {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 border border-red-100">
            {error}
          </div>
        )}

        {/* User card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#005F63] flex items-center justify-center text-white text-2xl font-bold">
            <User size={28} />
          </div>

          <div className="flex-1">
            {loadingUser ? (
              <div className="text-gray-500">Loading user info...</div>
            ) : user ? (
              <>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-[#002B36]">{user.name || user.email}</h3>
                  <span className="text-sm text-gray-500">({user.role || 'user'})</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">{user.email}</div>
                <div className="mt-3 text-xs text-gray-500">
                  User ID: <span className="font-mono text-xs text-gray-700">{user._id}</span>
                </div>
              </>
            ) : (
              <div className="text-gray-600">
                Not logged in. <Link href="/auth/login" className="text-[#005F63] underline">Sign in</Link> to see your competitions.
              </div>
            )}
          </div>
        </div>

        {/* ===== ADMIN ONLY: Registrations Panel ===== */}
        {isAdmin && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <UserCheck size={20} className="text-[#E3B65B]" />
                <h4 className="text-lg font-semibold text-[#002B36]">Website Registrations</h4>
              </div>
              {registrations && (
                <span
                  className="px-3 py-1 rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: colors.teal }}
                >
                  {registrations.totalRegistrations} Total
                </span>
              )}
            </div>

            {loadingRegs ? (
              <div className="py-8 text-center text-gray-500 animate-pulse">Loading registrations...</div>
            ) : !registrations ? (
              <div className="py-8 text-center text-gray-500">No registration data available.</div>
            ) : registrations.users.length === 0 ? (
              <div className="py-8 text-center text-gray-500">No users have registered yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left pb-3 font-semibold text-gray-500 pr-4">#</th>
                      <th className="text-left pb-3 font-semibold text-gray-500 pr-4">Name</th>
                      <th className="text-left pb-3 font-semibold text-gray-500 pr-4">Email</th>
                      <th className="text-left pb-3 font-semibold text-gray-500">Phone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {registrations.users.map((u, idx) => (
                      <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 pr-4 text-gray-400 font-mono text-xs">
                          {registrations.users.length - idx}
                        </td>
                        <td className="py-3 pr-4 font-medium text-[#002B36]">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#005F63]/10 flex items-center justify-center text-[#005F63] text-xs font-bold shrink-0">
                              {(u.name || u.email || '?')[0].toUpperCase()}
                            </div>
                            {u.name || '—'}
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Mail size={13} className="text-gray-400 shrink-0" />
                            {u.email}
                          </div>
                        </td>
                        <td className="py-3 text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Phone size={13} className="text-gray-400 shrink-0" />
                            {u.phonenumber || '—'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Competitions taken part in */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Users size={20} className="text-[#E3B65B]" />
              <h4 className="text-lg font-semibold text-[#002B36]">Your Competitions</h4>
            </div>
            <div className="text-sm text-gray-500">
              {loadingComps ? 'Loading…' : `${comps.length} item${comps.length === 1 ? '' : 's'}`}
            </div>
          </div>

          {loadingComps ? (
            <div className="py-8 text-center text-gray-500">Loading competitions...</div>
          ) : comps.length === 0 ? (
            <div className="py-8 text-center text-gray-500">You haven't applied to any competitions yet.</div>
          ) : (
            <div className="divide-y">
              {comps.map((c) => (
                <div key={c._id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex-1">
                    <Link href={`/competitions/by-id/${c._id}`} className="text-md font-semibold text-[#002B36] hover:text-[#005F63]">
                      {c.title}
                    </Link>
                    <div className="text-sm text-gray-600 mt-1">
                      {formatDateShort(c.startDate)} — {formatDateShort(c.endDate)} • Fee: ₹{c.registrationFee}
                    </div>
                    {c.waitlistEntry?.appliedAt && (
                      <div className="text-xs text-gray-500 mt-1">
                        Applied: {formatDateTime(c.waitlistEntry.appliedAt)} • Status: {c.waitlistEntry.status}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-3 md:mt-0">
                    {renderStatusBadge(c.userStatus)}
                    <Link href={`/competitions/by-id/${c._id}`} className="px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200">
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;
