"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (!token) {
      setError("Reset token is missing from the URL. Please request a new link.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Failed to reset password.");
        setIsSubmitting(false);
        return;
      }

      setMessage(data?.message || "Your password has been reset successfully!");
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
          Set New Password
        </h2>
        <p className="text-gray-600 max-w-sm">
          Please enter and confirm your new password below.
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
              Sign In Now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {!token && (
              <div className="p-3 bg-yellow-50 text-yellow-800 rounded text-sm mb-4">
                No reset token detected in the URL. Please make sure you used the correct link.
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#005F63] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#005F63] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting || !token}
              className="w-full py-3 rounded font-bold text-white text-lg shadow-sm hover:brightness-110 disabled:opacity-60 transition-all"
              style={{ backgroundColor: colors.teal }}
            >
              {isSubmitting ? "Resetting password..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Remember your password?{" "}
            <Link href="/auth/login" className="font-bold text-[#005F63] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
