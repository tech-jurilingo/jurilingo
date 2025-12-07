'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * JuriLingo Navbar Component
 */
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const colors = {
    teal: '#005F63',
    gold: '#E3B65B',
  };

  const navLinks = [
    { name: 'Blogs', href: '/blogs' },
    { name: 'Podcasts', href: '/podcasts' },
    { name: 'Competitions', href: '/competitions' },
  ];

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch('/api/auth/validate-token');
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error('Token validation error:', error);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <nav
      className="w-full px-4 md:px-8 py-3 shadow-md relative z-50"
      style={{ backgroundColor: colors.teal }}
    >
      {/* FIXED NAVBAR HEIGHT */}
      <div className="max-w-7xl mx-auto flex justify-between items-center h-20">

        {/* LOGO SECTION — DO NOT CHANGE HEIGHT BASED ON LOGO SIZE */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-20 w-20 md:h-18 md:w-18">
            <Image
              src="/logonav.png"
              alt="JuriLingo Logo"
              fill
              className="object-contain transform group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-white font-bold text-2xl leading-tight tracking-tight font-sans">
              JuriLingo
            </h1>
            <span
              className="text font-medium tracking-wide"
              style={{ color: colors.gold }}
            >
              Unlocking the Language of Justice
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-lg font-medium text-white transition-colors duration-200 hover:text-[#E3B65B]"
            >
              {link.name}
            </Link>
          ))}

          {/* ABOUT DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setIsAboutOpen((v) => !v)}
              onMouseEnter={() => setIsAboutOpen(true)}
              className="flex items-center gap-1 text-lg font-medium text-white hover:text-[#E3B65B]"
            >
              About
              <ChevronDown
                size={18}
                className={`transition-transform duration-200 ${
                  isAboutOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isAboutOpen && (
              <div
                className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2"
                onMouseLeave={() => setIsAboutOpen(false)}
              >
                <Link
                  href="/about/jurilingo"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  JuriLingo
                </Link>
                <Link
                  href="/about/founder"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Founder
                </Link>
              </div>
            )}
          </div>

          {/* ADMIN DROPDOWN */}
          {isAdmin && (
            <div className="relative">
              <button
                onClick={() => setIsAdminOpen((v) => !v)}
                onMouseEnter={() => setIsAdminOpen(true)}
                className="flex items-center gap-1 text-lg font-medium text-white hover:text-[#E3B65B]"
              >
                Admin
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${
                    isAdminOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isAdminOpen && (
                <div
                  className="absolute top-full right-0 mt-2 w-52 bg-white rounded-md shadow-lg py-2"
                  onMouseLeave={() => setIsAdminOpen(false)}
                >
                  <Link href="/blogs/new" className="block px-4 py-2 hover:bg-gray-100">Add Blogs</Link>
                  <Link href="/competitions/new" className="block px-4 py-2 hover:bg-gray-100">Add Competitions</Link>
                  <Link href="/podcasts/new" className="block px-4 py-2 hover:bg-gray-100">Add Podcasts</Link>
                </div>
              )}
            </div>
          )}

          {/* AUTH BUTTONS */}
          {!loading && (
            <div className="flex items-center gap-6 ml-4">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="text-white text-lg font-medium hover:underline decoration-[#E3B65B] decoration-2 underline-offset-4"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link href="/auth/login" className="text-white text-lg font-medium hover:underline decoration-[#E3B65B]">
                    Login
                  </Link>

                  <Link
                    href="/auth/register"
                    className="px-6 py-2 rounded-md font-bold text-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                    style={{ backgroundColor: colors.gold, color: colors.teal }}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            className="text-white"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="md:hidden pt-4 pb-6 border-t border-white/20 mt-2 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block px-2 text-white text-lg hover:text-[#E3B65B]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {/* About */}
          <div className="px-2">
            <span className="text-sm uppercase tracking-wider text-white/70">About</span>
            <div className="pl-4 border-l-2 border-[#E3B65B] mt-2 space-y-2">
              <Link href="/about/jurilingo" className="block py-1 text-white hover:text-[#E3B65B]" onClick={() => setIsMobileMenuOpen(false)}>JuriLingo</Link>
              <Link href="/about/founder" className="block py-1 text-white hover:text-[#E3B65B]" onClick={() => setIsMobileMenuOpen(false)}>Founder</Link>
            </div>
          </div>

          {/* Admin */}
          {isAdmin && (
            <div className="px-2">
              <span className="text-sm uppercase tracking-wider text-white/70">Admin</span>
              <div className="pl-4 border-l-2 border-[#E3B65B] mt-2 space-y-2">
                <Link href="/blogs/new" className="block py-1 text-white hover:text-[#E3B65B]" onClick={() => setIsMobileMenuOpen(false)}>Add Blogs</Link>
                <Link href="/competitions/new" className="block py-1 text-white hover:text-[#E3B65B]" onClick={() => setIsMobileMenuOpen(false)}>Add Competitions</Link>
                <Link href="/podcasts/new" className="block py-1 text-white hover:text-[#E3B65B]" onClick={() => setIsMobileMenuOpen(false)}>Add Podcasts</Link>
              </div>
            </div>
          )}

          {/* Auth */}
          {!loading && (
            <div className="pt-4 flex flex-col gap-3 px-2">
              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="py-2 text-white border border-white rounded"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link href="/auth/login" className="py-2 text-white border border-white rounded text-center hover:bg-white/10" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                  <Link href="/auth/register" className="py-2 font-bold text-center rounded" style={{ backgroundColor: colors.gold, color: colors.teal }} onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
