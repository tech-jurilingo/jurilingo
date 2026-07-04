"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const colors = {
    teal: "#005F63",
    gold: "#E3B65B",
    bg: "#F5F5F0",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Failed to process request.");
        setIsSubmitting(false);
        return;
      }

      setMessage(data?.message || "A password reset link has been sent to your email.");
      setIsSubmitting(false);
    } catch {
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
          className="transform hover:scale-110 transition-transform duration-300"
        />
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-[#002B36] mb-2">
          Reset your password
        </h2>
        <p className="text-gray-600 max-w-sm">
          Enter the email address associated with your account, and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        {message ? (
          <div className="text-center">
            <div className="p-4 bg-green-50 text-green-800 rounded mb-6 text-sm font-medium">
              {message}
            </div>
            <Link
              href="/auth/login"
              className="inline-block px-6 py-2 rounded font-bold text-white shadow-sm hover:brightness-110 transition-all"
              style={{ backgroundColor: colors.teal }}
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#005F63] focus:outline-none"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded font-bold text-white text-lg shadow-sm hover:brightness-110 disabled:opacity-60 transition-all"
              style={{ backgroundColor: colors.teal }}
            >
              {isSubmitting ? "Sending link..." : "Send Reset Link"}
            </button>
          </form>
        )}

        {!message && (
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Remember your password?{" "}
              <Link href="/auth/login" className="font-bold text-[#005F63] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
