// src/components/Features.jsx
"use client";

import React from "react";
import { Scale, Award, Users, Calendar } from "lucide-react";

const Features = () => {
  const colors = {
    teal: "#005F63",
    gold: "#C59D5F",
    bgGold: "#F3EAD8",
    bgSection: "#F5F5F0",
  };

  const featuresList = [
    {
      icon: Scale,
      title: "Find Moots",
      description:
        "Discover and apply to prestigious moot court competitions around the world.",
    },
    {
      icon: Award,
      title: "Showcase Talent",
      description:
        "Build your profile and showcase your legal advocacy skills to potential employers.",
    },
    {
      icon: Users,
      title: "Connect with Experts",
      description:
        "Network with judges, professors, and legal professionals in your field of interest.",
    },
    {
      icon: Calendar,
      title: "Organize Events",
      description:
        "Powerful tools to create, manage, and promote your moot court competitions.",
    },
  ];

  return (
    <section
      className="w-full py-16 md:py-24"
      style={{ backgroundColor: colors.bgSection }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: colors.teal }}
          >
            Everything You Need for Moot Court Success
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Whether you're a competitor, judge, or organizer, JuriLingo provides
            the tools and connections you need.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuresList.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center group"
            >
              {/* Icon */}
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: colors.bgGold }}
              >
                <feature.icon
                  size={32}
                  strokeWidth={1.5}
                  style={{ color: colors.gold }}
                />
              </div>

              {/* Title & Description */}
              <h3
                className="text-xl font-bold mb-3"
                style={{ color: colors.teal }}
              >
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
