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
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* --- LOGO SECTION --- */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Image
              src="/logo.png"
              alt="JuriLingo Logo"
              width={50}
              height={50}
              className="transform group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-white font-bold text-2xl leading-tight tracking-tight font-serif">
              JuriLingo
            </h1>
            <span
              className="text-xs font-medium tracking-wide"
              style={{ color: colors.gold }}
            >
              Unlocking the Language of Justice
            </span>
          </div>
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <div className="hidden md:flex items-center gap-8">
          {/* Standard Links */}
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-lg font-medium text-white transition-colors duration-200 hover:text-opacity-80 hover:text-[#E3B65B]"
            >
              {link.name}
            </Link>
          ))}

          {/* About Dropdown */}
          <div className="relative group">
            <button
              onClick={() => setIsAboutOpen((v) => !v)}
              onMouseEnter={() => setIsAboutOpen(true)}
              className="flex items-center gap-1 text-lg font-medium text-white hover:text-opacity-80 transition-colors focus:outline-none"
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
                className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 animate-in fade-in slide-in-from-top-2 duration-200"
                onMouseLeave={() => setIsAboutOpen(false)}
              >
                <Link
                  href="/about/jurilingo"
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  JuriLingo
                </Link>
                <Link
                  href="/about/founder"
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Founder
                </Link>
              </div>
            )}
          </div>

          {/* Admin Dropdown - Only visible to admins */}
          {isAdmin && (
            <div className="relative group">
              <button
                onClick={() => setIsAdminOpen((v) => !v)}
                onMouseEnter={() => setIsAdminOpen(true)}
                className="flex items-center gap-1 text-lg font-medium text-white hover:text-opacity-80 transition-colors focus:outline-none"
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
                  className="absolute top-full right-0 mt-2 w-52 bg-white rounded-md shadow-lg py-2 animate-in fade-in slide-in-from-top-2 duration-200"
                  onMouseLeave={() => setIsAdminOpen(false)}
                >
                  <Link
                    href="/admin/blogs"
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Manage Blogs
                  </Link>
                  <Link
                    href="/admin/competitions"
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Manage Competitions
                  </Link>
                  <Link
                    href="/admin/podcasts"
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Manage Podcasts
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Auth Buttons */}
          {!loading && (
            <div className="flex items-center gap-6 ml-4">
              {user ? (
                // Logged in - Show Logout
                <button
                  onClick={handleLogout}
                  className="text-white text-lg font-medium hover:underline decoration-[#E3B65B] decoration-2 underline-offset-4"
                >
                  Logout
                </button>
              ) : (
                // Not logged in - Show Login and Register
                <>
                  <Link
                    href="/auth/login"
                    className="text-white text-lg font-medium hover:underline decoration-[#E3B65B] decoration-2 underline-offset-4"
                  >
                    Login
                  </Link>

                  <Link
                    href="/auth/register"
                    className="px-6 py-2 rounded-md font-bold text-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 inline-block"
                    style={{ backgroundColor: colors.gold, color: colors.teal }}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* --- MOBILE BURGER MENU --- */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            className="text-white"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* --- MOBILE DROPDOWN --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden pt-4 pb-6 border-t border-[#ffffff20] mt-2 space-y-4 animate-in slide-in-from-top-5">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block w-full text-left px-2 text-white text-lg font-medium hover:text-[#E3B65B]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {/* About (mobile) */}
          <div className="px-2 text-white text-lg font-medium">
            <span className="opacity-75 text-sm uppercase tracking-wider mb-2 block">
              About
            </span>
            <div className="pl-4 border-l-2 border-[#E3B65B] space-y-2">
              <Link
                href="/about/jurilingo"
                className="block w-full text-left text-base py-1 hover:text-[#E3B65B]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                JuriLingo
              </Link>
              <Link
                href="/about/founder"
                className="block w-full text-left text-base py-1 hover:text-[#E3B65B]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Founder
              </Link>
            </div>
          </div>

          {/* Admin (mobile) - Only visible to admins */}
          {isAdmin && (
            <div className="px-2 text-white text-lg font-medium">
              <span className="opacity-75 text-sm uppercase tracking-wider mb-2 block">
                Admin
              </span>
              <div className="pl-4 border-l-2 border-[#E3B65B] space-y-2">
                <Link
                  href="/admin/blogs"
                  className="block w-full text-left text-base py-1 hover:text-[#E3B65B]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Manage Blogs
                </Link>
                <Link
                  href="/admin/competitions"
                  className="block w-full text-left text-base py-1 hover:text-[#E3B65B]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Manage Competitions
                </Link>
                <Link
                  href="/admin/podcasts"
                  className="block w-full text-left text-base py-1 hover:text-[#E3B65B]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Manage Podcasts
                </Link>
              </div>
            </div>
          )}

          {/* Auth (mobile) */}
          {!loading && (
            <div className="pt-4 flex flex-col gap-3 px-2">
              {user ? (
                // Logged in - Show Logout
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-white border border-white rounded text-center hover:bg-white/10"
                >
                  Logout
                </button>
              ) : (
                // Not logged in - Show Login and Register
                <>
                  <Link
                    href="/auth/login"
                    className="w-full py-2 text-white border border-white rounded text-center hover:bg-white/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="w-full py-2 font-bold rounded text-center"
                    style={{ backgroundColor: colors.gold, color: colors.teal }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
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