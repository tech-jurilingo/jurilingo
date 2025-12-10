'use client';

import React from 'react';
import { GraduationCap, Lightbulb } from 'lucide-react';

const AboutFounder = () => {
  const colors = { teal: '#005F63', gold: '#E3B65B', bg: '#F5F5F0' };

  return (
    <div className="grow w-full py-16 px-4 md:px-8" style={{ backgroundColor: colors.bg }}>
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Column: Image/Profile Area */}
          <div className="w-full md:w-1/3 bg-[#005F63] p-10 flex flex-col items-center text-center justify-center text-white">
            <div className="w-40 h-40 rounded-full bg-white/20 flex items-center justify-center mb-6 border-4 border-[#E3B65B] overflow-hidden">
              <img
                src="/founder.jpeg"
                alt="Founder"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <h2 className="text-2xl font-bold font-serif mb-2">Ananya Konur</h2>
            <p className="text-[#E3B65B] font-medium mb-6">Founder, JuriLingo</p>

            <div className="space-y-3 text-sm opacity-90">
              <div className="flex items-center justify-center gap-2">
                <GraduationCap size={16} />
                <span>BBA LL.B. (Hons.) Student</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Lightbulb size={16} />
                <span>IP Law Enthusiast</span>
              </div>
            </div>
          </div>

          {/* Right Column: Bio */}
          <div className="w-full md:w-2/3 p-10 md:p-12">
            <h3 className="text-3xl font-bold text-[#002B36] mb-6 font-serif">About the Founder</h3>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                Ananya Konur is a dedicated law student and emerging IP enthusiast, currently in the penultimate year of her BBA LL.B. (Hons.) program with a specialization in Intellectual Property Law.
              </p>

              <p>
                As a first-generation lawyer, Ananya has navigated the legal field without the advantage of legacy or established networks. This personal journey has shaped her belief that <strong>access, clarity, and opportunity should not be privileges but essentials for every law student.</strong>
              </p>

              <p>
                She launched JuriLingo in May 2023 with this conviction at its core. What began as a space to share her reflections on legal developments has grown into a platform built around inclusivity, intellectual growth, and practical exposure. Her own experiences of finding her way, seeking guidance, and building confidence inform the platform&apos;s mission to support students.
              </p>

              <div className="p-6 bg-[#F5F5F0] rounded-xl border-l-4 border-[#005F63] italic text-gray-800">
                &quot;Through JuriLingo, I hope to create the kind of environment I once looked for: one that breaks down complex ideas, encourages critical thinking, and opens doors to opportunities that shape future lawyers.&quot;
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutFounder;
