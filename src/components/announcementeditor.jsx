"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Save, Megaphone } from "lucide-react";

const AnnouncementEditor = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("General");
  const [linkUrl, setLinkUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colors = {
    teal: "#005F63",
    gold: "#E3B65B",
    bg: "#F5F5F0",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      alert("Please enter a title for the announcement.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title,
        type,
        linkUrl,
      };

      const res = await fetch("/api/announcement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(data?.message || "Failed to create announcement");
        return;
      }

      alert(data?.message || "Announcement created successfully");

      setTitle("");
      setType("General");
      setLinkUrl("");
    } catch (err) {
      console.error("Error creating announcement:", err);
      alert("Server error while creating announcement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="grow w-full py-12 px-4 md:px-8"
      style={{ backgroundColor: colors.bg }}
    >
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col min-h-[60vh]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-[#005F63]">
          <div>
            <h2 className="text-2xl font-bold font-serif text-white flex items-center gap-2">
              <Megaphone className="text-[#E3B65B]" /> Post Announcement
            </h2>
            <p className="text-sm text-teal-100">
              Publish a new announcement to the home page ticker
            </p>
          </div>
          <div className="hidden sm:block">
            <Image
              src="/logo.png"
              alt="JuriLingo Logo"
              width={60}
              height={60}
              priority
              className="brightness-0 invert"
            />
          </div>
        </div>

        {/* Form Container */}
        <div className="p-8 grow flex flex-col">
          <form onSubmit={handleSubmit} className="space-y-6 grow flex flex-col">
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#002B36]">
                Announcement Text <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="E.g., Registrations are now open for the National Moot Court Competition!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                rows={3}
                required
                className="w-full text-base text-gray-800 border border-gray-200 rounded-md p-3 focus:border-[#E3B65B] focus:ring-1 focus:ring-[#E3B65B] focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#002B36]">
                Category
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full text-base text-gray-800 border border-gray-200 rounded-md p-3 focus:border-[#E3B65B] focus:ring-1 focus:ring-[#E3B65B] focus:outline-none transition-colors bg-white"
              >
                <option value="General">General Announcement</option>
                <option value="Blog">Blog Update</option>
                <option value="Podcast">Podcast Update</option>
                <option value="Competition">Competition Update</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#002B36]">
                Link URL (Optional)
              </label>
              <input
                type="text"
                placeholder="E.g., /competitions or https://..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full text-base text-gray-800 border border-gray-200 rounded-md p-3 focus:border-[#E3B65B] focus:ring-1 focus:ring-[#E3B65B] focus:outline-none transition-colors"
              />
              <p className="text-xs text-gray-500">
                If provided, clicking the announcement will redirect to this link.
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 mt-auto">
              <Link
                href="/"
                className="px-6 py-2 rounded-md font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2 rounded-md font-bold text-[#005F63] shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: colors.gold }}
              >
                <Save size={18} />
                {isSubmitting ? "Publishing..." : "Publish Announcement"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementEditor;
