"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Registration = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const colors = {
    teal: "#005F63",
    gold: "#E3B65B",
    bg: "#F5F5F0",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { fullName, email, phone, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          phonenumber: phone,
          email,
          password,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "Registration failed.");
        setIsSubmitting(false);
        return;
      }

      // User registered & auth_token cookie set by API -> go home
      router.push("/");
    } catch (err) {
      console.error("Registration error:", err);
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4"
      style={{ backgroundColor: colors.bg }}
    >
      <div>
        <Image
          src="/logo3.png"
          alt="JuriLingo Logo"
          width={120}
          height={120}
          className="transform group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-[#002B36] mb-2">
          Create your account
        </h2>
        <p className="text-[#C59D5F] font-medium">
          Or{" "}
          <Link href="/auth/login" className="hover:underline">
            sign in if you already have an account
          </Link>
        </p>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h3 className="text-xl font-bold text-[#002B36] mb-6">
          Account Information
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#005F63] focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#005F63] focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#005F63] focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#005F63] focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#005F63] focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded font-bold text-white text-lg mt-4 hover:brightness-110 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: colors.teal }}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 text-center text-sm text-gray-500 border-t pt-6">
          <p>By registering, you agree to our</p>
          <div className="flex justify-center gap-1 mt-1">
            <Link
              href="/terms"
              style={{ color: colors.gold }}
              className="hover:underline"
            >
              Terms of Service
            </Link>
            <span>and</span>
            <Link
              href="/privacy"
              style={{ color: colors.gold }}
              className="hover:underline"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
