'use client';

import React from 'react';
import { Target, BookOpen, Mic, Gavel } from 'lucide-react';

const AboutJuriLingo = () => {
  const colors = { teal: '#005F63', gold: '#E3B65B', bg: '#F5F5F0' };

  return (
    <div className="grow w-full py-16 px-4 md:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-[#002B36] mb-6">About JuriLingo</h1>
          <p className="text-xl text-[#005F63] font-medium max-w-3xl mx-auto italic">
            &quot;Unlocking the Language of Justice&quot;
          </p>
        </div>

        {/* Mission Section */}
        <div className="flex flex-col md:flex-row gap-12 items-center mb-20">
          <div className="w-full md:w-1/2">
            <div className="p-8 rounded-2xl bg-[#F5F5F0] border-l-4 border-[#E3B65B] shadow-sm">
              <h2 className="text-2xl font-bold text-[#002B36] mb-4 flex items-center gap-2">
                <Target size={28} style={{ color: colors.gold }} />
                Our Mission
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                To make legal learning feel approachable, engaging, and genuinely useful. 
                Built around the belief that the law becomes clearer when explained with intention and curiosity, 
                JuriLingo offers a focused space for students seeking structure in a world full of scattered legal content.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 text-gray-600 leading-relaxed text-lg">
            <p className="mb-4">
              Navigating the legal world can be daunting. We believe that every student deserves a platform that 
              doesn&apos;t just present information, but illuminates it.
            </p>
            <p>
              Every feature of JuriLingo is built around one guiding idea: to help learners navigate the world of law 
              with <strong>clarity, confidence, and curiosity</strong>. The platform invites every student to explore, engage, and grow.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all text-center">
            <div className="w-16 h-16 rounded-full bg-[#005F63]/10 flex items-center justify-center mx-auto mb-6">
              <BookOpen size={32} style={{ color: colors.teal }} />
            </div>
            <h3 className="text-xl font-bold text-[#002B36] mb-3">The Blog</h3>
            <p className="text-gray-600">
              Breaking down legal concepts and contemporary issues into thoughtful, digestible insights.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all text-center">
            <div className="w-16 h-16 rounded-full bg-[#005F63]/10 flex items-center justify-center mx-auto mb-6">
              <Mic size={32} style={{ color: colors.teal }} />
            </div>
            <h3 className="text-xl font-bold text-[#002B36] mb-3">The Podcast</h3>
            <p className="text-gray-600">
              Conversations that add depth and perspective, turning complex themes into relatable discussions.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all text-center">
            <div className="w-16 h-16 rounded-full bg-[#005F63]/10 flex items-center justify-center mx-auto mb-6">
              <Gavel size={32} style={{ color: colors.teal }} />
            </div>
            <h3 className="text-xl font-bold text-[#002B36] mb-3">Mooting Portal</h3>
            <p className="text-gray-600">
              A dedicated space for competitions, especially beneficial for students seeking co-curricular opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutJuriLingo;