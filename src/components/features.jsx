"use client";

import React from "react";
import { Scale, Award, Users } from "lucide-react";
import Link from "next/link";

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
      title: "Explore the Blog",
      subtitle: "What You'll Find:",
      points: [
        "Thoughtful Explanations",
        "Student-friendly Insights",
        "Contemporary Relevance",
        "Consistent Clarity",
      ],
      cta: "Explore the Blog",
      href: "/blogs",
    },
    {
      icon: Award,
      title: "Tune in to the Podcast",
      subtitle: "What You'll Find:",
      points: [
        "Insightful Interviews",
        "Practical Career Wisdom",
        "Fresh Perspectives",
        "A Bridge to the Industry",
      ],
      cta: "Tune in to the Podcast",
      href: "/podcasts",
    },
    {
      icon: Users,
      title: "Competitions",
      subtitle: "What You'll Find:",
      points: [
        "Regular Practice Rounds",
        "Safe Training Environment",
        "Expert Mentorship & Feedback",
        "Skill-Focused Competitions",
      ],
      cta: "Join a Practice Round",
      href: "/competitions",
    },
  ];

  return (
    <section
      className="w-full py-10 md:py-14"
      style={{ backgroundColor: colors.bgSection }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2
            className="text-2xl md:text-3xl font-bold mb-3 leading-snug"
            style={{ color: colors.teal }}
          >
            JURILINGO is your companion in navigating the world of law – with
            clarity, confidence and curiosity.
          </h2>
          <p className="text-md md:text-lg font-medium text-gray-700">
            Unlock the Language of Justice, ONE STEP at a time!
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {featuresList.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center"
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundColor: colors.bgGold }}
              >
                <feature.icon
                  size={26}
                  strokeWidth={1.5}
                  style={{ color: colors.gold }}
                />
              </div>

              {/* Title */}
              <h3
                className="text-lg font-bold mb-1"
                style={{ color: colors.teal }}
              >
                {feature.title}
              </h3>

              {/* Subtitle */}
              <p className="text-xs font-semibold text-gray-700 mb-2">
                {feature.subtitle}
              </p>

              {/* Bullet Points */}
              <ul className="text-gray-600 leading-relaxed text-xs space-y-1 mb-4">
                {feature.points.map((point, i) => (
                  <li key={i}>• {point}</li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
                href={feature.href}
                className="mt-auto inline-flex justify-center px-3 py-2 rounded-md border text-xs font-semibold shadow-sm hover:shadow-md transition-colors"
                style={{
                  borderColor: colors.teal,
                  color: colors.teal,
                  backgroundColor: "white",
                }}
              >
                {feature.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
