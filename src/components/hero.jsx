"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const Hero = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const colors = {
    teal: "#005F63",
    gold: "#E3B65B",
  };

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

  return (
    <section className="w-full" style={{ backgroundColor: colors.teal }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            Learn the law. Speak the law. Live the law
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed font-light">
            Because understanding the law should feel human, not intimidating.
          </p>

          {/* Buttons - Only show if user is not logged in */}
          {!loading && !user && (
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Join JuriLingo Button */}
              <Link
                href="/auth/register"
                className="px-8 py-3 rounded-md font-bold text-lg shadow-sm hover:shadow-md hover:brightness-105 transition-all duration-200"
                style={{ backgroundColor: colors.gold, color: colors.teal }}
              >
                Join JuriLingo
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
