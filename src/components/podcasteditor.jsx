"use client";

import React, { useState } from "react";
import { Link as LinkIcon, PlayCircle, Save } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const PodcastEditor = () => {
  const [title, setTitle] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [previewId, setPreviewId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const colors = {
    teal: "#005F63",
    gold: "#E3B65B",
    bg: "#F5F5F0",
  };

  // Extract YouTube ID for preview only (not sent to backend)
  const handleLinkChange = (e) => {
    const url = e.target.value;
    setYoutubeLink(url);
    setError("");
    setSuccessMessage("");

    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      setPreviewId(match[2]);
    } else {
      setPreviewId(null);
    }
  };

  const handleSubmit = async () => {
    setError("");
    setSuccessMessage("");

    if (!title || !youtubeLink) {
      setError("Please enter a title and a YouTube link.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/podcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          youtubeUrl: youtubeLink, // ✅ only these two go to DB
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "Failed to create podcast.");
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage(data?.message || "Podcast created successfully.");

      // Optional: reset form
      setTitle("");
      setYoutubeLink("");
      setPreviewId(null);
    } catch (err) {
      console.error("Error creating podcast:", err);
      setError("Server error while creating podcast.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="grow w-full py-12 px-4 md:px-8"
      style={{ backgroundColor: colors.bg }}
    >
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold font-serif text-[#002B36]">
              Post New Podcast
            </h2>
            <p className="text-sm text-gray-500">
              Share a moot court recording or legal discussion
            </p>
          </div>
            <div className="hidden sm:block">
              <Image
                src="/logo.png"
                alt="JuriLingo Logo"
                width={80}
                height={80}
                priority
              />
            </div>
        </div>

        {/* Form Container */}
        <div className="p-8 space-y-8">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Podcast Title
            </label>
            <input
              type="text"
              placeholder="E.g., The Future of International Law"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError("");
                setSuccessMessage("");
              }}
              className="w-full text-xl font-medium text-gray-800 placeholder-gray-300 border border-gray-300 rounded-md px-4 py-3 focus:border-[#E3B65B] focus:ring-1 focus:ring-[#E3B65B] focus:outline-none transition-all"
            />
          </div>

          {/* YouTube Link Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              YouTube Video Link
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon size={20} className="text-gray-400" />
              </div>
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeLink}
                onChange={handleLinkChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md text-gray-800 placeholder-gray-300 focus:border-[#E3B65B] focus:ring-1 focus:ring-[#E3B65B] focus:outline-none transition-all"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Paste a valid YouTube URL to see a preview.
            </p>
          </div>

          {/* Error / Success */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
              {error}
            </p>
          )}
          {successMessage && (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-3 py-2">
              {successMessage}
            </p>
          )}

          {/* Video Preview Area */}
          {previewId ? (
            <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <PlayCircle size={16} className="text-[#005F63]" />
                Video Preview
              </h3>
              <div className="aspect-video w-full rounded-md overflow-hidden bg-black shadow-sm">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${previewId}`}
                  title="YouTube video preview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ) : (
            <div className="mt-4 h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
              <span className="text-sm">Video preview will appear here</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
            <Link
              href="/"
              className="px-6 py-2 rounded-md font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-2 rounded-md font-bold text-[#005F63] shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: colors.gold }}
            >
              <Save size={18} />
              {isSubmitting ? "Posting..." : "Post Podcast"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastEditor;
