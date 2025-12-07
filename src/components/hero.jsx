"use client";

import React from "react";
import Link from "next/link";

const Hero = () => {
  const colors = {
    teal: "#005F63",
    gold: "#E3B65B",
  };

  return (
    <section className="w-full" style={{ backgroundColor: colors.teal }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            The Premier Marketplace for Moot Court Competitions
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed font-light">
            Connect with prestigious competitions, talented judges, and
            passionate competitors in one comprehensive platform.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Browse Moots Button */}
            <Link
              href="/moots"
              className="px-8 py-3 rounded-md font-bold text-lg shadow-sm hover:bg-gray-100 transition-colors duration-200"
              style={{ backgroundColor: "white", color: colors.teal }}
            >
              Browse Moots
            </Link>

            {/* Join JuriLingo Button */}
            <Link
              href="/register"
              className="px-8 py-3 rounded-md font-bold text-lg shadow-sm hover:shadow-md hover:brightness-105 transition-all duration-200"
              style={{ backgroundColor: colors.gold, color: colors.teal }}
            >
              Join JuriLingo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
