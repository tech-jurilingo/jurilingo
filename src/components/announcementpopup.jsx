
"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Paperclip,
  Calendar,
  Megaphone,
} from "lucide-react";

const AnnouncementPopup = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchAnnouncements = async () => {
      try {
        const response = await fetch("/api/announcement?limit=all");
        const data = await response.json();

        if (!response.ok || !data.success || cancelled) return;

        const featured = (data.announcements || []).filter(
          (item) => item.isFeatured
        );

        if (featured.length === 0) return;

        setAnnouncements(featured);

        // Show once per browser session
        if (!sessionStorage.getItem("jl-announcement-popup-shown")) {
          setIsOpen(true);
          sessionStorage.setItem("jl-announcement-popup-shown", "true");
        }
      } catch (error) {
        console.error("Announcement popup error:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAnnouncements();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (loading || !isOpen || announcements.length === 0) {
    return null;
  }

  const current = announcements[activeIndex];

  const previous = () => {
    setActiveIndex((index) =>
      index === 0 ? announcements.length - 1 : index - 1
    );
  };

  const next = () => {
    setActiveIndex((index) =>
      index === announcements.length - 1 ? 0 : index + 1
    );
  };

  const formattedDate = current.createdAt
    ? new Date(current.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setIsOpen(false);
      }}
      role="presentation"
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#141414] shadow-2xl border border-white/10 animate-[fadeIn_0.3s_ease-out]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="announcement-popup-title"
      >
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-20 bg-black/70 hover:bg-black text-white rounded-full p-2 transition"
          aria-label="Close announcement"
        >
          <X size={22} />
        </button>

        {/* Banner */}
        <div className="relative w-full aspect-video bg-gradient-to-br from-[#005F63] to-[#002B36]">
          {current.imageUrl ? (
            <img
              src={current.imageUrl}
              alt={current.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Megaphone size={80} className="text-[#E3B65B]" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/10 to-transparent" />

          <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-9">
            <span className="inline-block bg-[#E3B65B] text-[#002B36] text-xs font-extrabold tracking-widest uppercase px-3 py-1 rounded mb-3">
              {current.type || "Announcement"}
            </span>

            <h2
              id="announcement-popup-title"
              className="text-white text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg"
            >
              {current.title}
            </h2>
          </div>
        </div>

        {/* Announcement details */}
        <div className="px-5 py-6 sm:px-9 sm:py-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-5">
            {formattedDate && (
              <span className="flex items-center gap-2">
                <Calendar size={15} />
                {formattedDate}
              </span>
            )}

            <span className="text-[#E3B65B] font-semibold">
              JuriLingo Updates
            </span>
          </div>

          {current.description && (
            <p className="text-gray-200 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-6">
              {current.description}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {current.linkUrl && (
              <a
                href={current.linkUrl}
                target={
                  current.linkUrl.startsWith("http") ? "_blank" : "_self"
                }
                rel={
                  current.linkUrl.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="inline-flex items-center gap-2 bg-[#E3B65B] hover:bg-[#f0c873] text-[#002B36] font-bold px-6 py-3 rounded-lg transition"
              >
                {current.buttonText || "Read More"}
                <ExternalLink size={17} />
              </a>
            )}

            <button
              onClick={() => setIsOpen(false)}
              className="px-6 py-3 rounded-lg border border-white/30 text-white hover:bg-white/10 font-semibold transition"
            >
              Close
            </button>
          </div>

          {/* Attachments */}
          {current.attachments?.length > 0 && (
            <div className="border-t border-white/10 pt-5">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <Paperclip size={17} className="text-[#E3B65B]" />
                Attachments
              </h3>

              <div className="flex flex-col gap-2">
                {current.attachments.map((file, index) => (
                  <a
                    key={`${file.url}-${index}`}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition"
                  >
                    <span className="text-gray-200 text-sm break-all">
                      {file.name}
                      {file.fileType && (
                        <span className="ml-2 text-xs text-gray-500">
                          {file.fileType}
                        </span>
                      )}
                    </span>

                    <ExternalLink
                      size={16}
                      className="text-[#E3B65B] shrink-0"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          {announcements.length > 1 && (
            <div className="flex justify-between items-center border-t border-white/10 mt-6 pt-5">
              <span className="text-gray-500 text-sm">
                {activeIndex + 1} of {announcements.length} announcements
              </span>

              <div className="flex gap-2">
                <button
                  onClick={previous}
                  className="p-2 rounded-full border border-white/20 text-white hover:bg-white/10"
                  aria-label="Previous announcement"
                >
                  <ChevronLeft size={21} />
                </button>

                <button
                  onClick={next}
                  className="p-2 rounded-full border border-white/20 text-white hover:bg-white/10"
                  aria-label="Next announcement"
                >
                  <ChevronRight size={21} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.97);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default AnnouncementPopup;
