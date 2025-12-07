import React from "react";
import Link from "next/link";

const CTASection = () => {
  const colors = {
    teal: "#005F63",
    gold: "#E3B65B",
  };

  return (
    <section className="w-full py-20" style={{ backgroundColor: colors.gold }}>
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2
          className="text-3xl md:text-4xl font-bold mb-6 font-serif tracking-tight"
          style={{ color: colors.teal }}
        >
          Ready to Elevate Your Moot Court Experience?
        </h2>

        <p
          className="text-lg md:text-xl mb-10 font-medium opacity-90"
          style={{ color: colors.teal }}
        >
          Join thousands of law students, professors, and legal professionals on
          JuriLingo today.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          
          {/* Create Account */}
          <Link
            href="/register"
            className="px-8 py-3 rounded-md font-bold text-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 text-white"
            style={{ backgroundColor: colors.teal }}
          >
            Create Your Account
          </Link>

          {/* Learn More */}
          <Link
            href="/about"
            className="px-8 py-3 rounded-md font-bold text-lg border-2 hover:bg-[#005F63] hover:text-white transition-all duration-200"
            style={{ borderColor: colors.teal, color: colors.teal }}
          >
            Learn More
          </Link>

        </div>
      </div>
    </section>
  );
};

export default CTASection;
