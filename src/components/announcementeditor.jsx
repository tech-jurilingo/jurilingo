
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Save, Megaphone, Plus, Trash2, Paperclip, Image as ImageIcon } from "lucide-react";

const AnnouncementEditor = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("General");
  const [linkUrl, setLinkUrl] = useState("");
  const [buttonText, setButtonText] = useState("Read More");
  const [imageUrl, setImageUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(true);
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colors = {
    teal: "#005F63",
    gold: "#E3B65B",
    bg: "#F5F5F0",
  };

  const addAttachment = () => {
    setAttachments([
      ...attachments,
      { name: "", url: "", fileType: "" },
    ]);
  };

  const updateAttachment = (index, field, value) => {
    setAttachments((previous) =>
      previous.map((file, i) =>
        i === index ? { ...file, [field]: value } : file
      )
    );
  };

  const removeAttachment = (index) => {
    setAttachments((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter an announcement title.");
      return;
    }

    if (linkUrl.trim() && !linkUrl.startsWith("/") &&
        !/^https?:\/\//i.test(linkUrl)) {
      alert("Please enter a valid action URL.");
      return;
    }

    if (imageUrl.trim() && !/^https?:\/\//i.test(imageUrl)) {
      alert("Please enter a valid banner image URL.");
      return;
    }

    const validAttachments = attachments.filter(
      (file) => file.name.trim() && file.url.trim()
    );

    for (const file of validAttachments) {
      if (!/^https?:\/\//i.test(file.url)) {
        alert("Please enter a valid URL for every attachment.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        type,
        linkUrl: linkUrl.trim(),
        buttonText: buttonText.trim() || "Read More",
        imageUrl: imageUrl.trim(),
        isFeatured,
        attachments: validAttachments,
      };

      const response = await fetch("/api/announcement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        alert(data?.message || "Failed to create announcement.");
        return;
      }

      alert("Announcement published successfully!");

      setTitle("");
      setDescription("");
      setType("General");
      setLinkUrl("");
      setButtonText("Read More");
      setImageUrl("");
      setIsFeatured(true);
      setAttachments([]);
    } catch (error) {
      console.error("Announcement error:", error);
      alert("Server error while publishing announcement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full text-base text-gray-800 border border-gray-200 rounded-md p-3 focus:border-[#E3B65B] focus:ring-1 focus:ring-[#E3B65B] focus:outline-none";

  const labelClass = "text-sm font-bold text-[#002B36]";

  return (
    <div
      className="grow w-full py-12 px-4 md:px-8"
      style={{ backgroundColor: colors.bg }}
    >
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">

        {/* Header */}
        <div className="px-8 py-6 flex justify-between items-center bg-[#005F63]">
          <div>
            <h2 className="text-2xl font-bold font-serif text-white flex items-center gap-2">
              <Megaphone className="text-[#E3B65B]" />
              Create Announcement
            </h2>
            <p className="text-sm text-teal-100 mt-1">
              Publish a featured update on JuriLingo
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

        <form onSubmit={handleSubmit} className="p-8 space-y-6">

          {/* Title */}
          <div className="space-y-2">
            <label className={labelClass}>
              Announcement Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter announcement headline"
              required
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className={labelClass}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about this announcement..."
              rows={5}
              className={inputClass + " resize-y"}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className={labelClass}>
              Category
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={inputClass + " bg-white"}
            >
              <option value="General">General Announcement</option>
              <option value="Blog">Blog Update</option>
              <option value="Podcast">Podcast Update</option>
              <option value="Competition">Competition Update</option>
            </select>
          </div>

          {/* Banner image */}
          <div className="space-y-2">
            <label className={labelClass}>
              <ImageIcon size={16} className="inline mr-2" />
              Banner Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/banner.jpg"
              className={inputClass}
            />

            {imageUrl && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">
                  Image preview
                </p>
                <img
                  src={imageUrl}
                  alt="Announcement preview"
                  className="w-full max-h-64 object-cover rounded-lg border"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Action button */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelClass}>
                Action Button Text
              </label>
              <input
                type="text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="Register Now"
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass}>
                Action URL
              </label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com or /events"
                className={inputClass}
              />
            </div>
          </div>

          {/* Featured toggle */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-[#F5F5F0]">
            <input
              id="featured"
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[#005F63]"
            />
            <label htmlFor="featured" className="cursor-pointer">
              <span className="block text-sm font-bold text-[#002B36]">
                Feature this announcement
              </span>
              <span className="block text-xs text-gray-600 mt-1">
                Allow this announcement to appear in the featured popup.
              </span>
            </label>
          </div>

          {/* Attachments */}
          <div className="space-y-4 border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-[#002B36] flex items-center gap-2">
                  <Paperclip size={18} />
                  Supporting Attachments
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Add links to PDFs, Word documents or other files.
                </p>
              </div>

              <button
                type="button"
                onClick={addAttachment}
                className="px-3 py-2 text-sm rounded-md font-semibold flex items-center gap-1"
                style={{ backgroundColor: colors.teal, color: "white" }}
              >
                <Plus size={16} />
                Add File
              </button>
            </div>

            {attachments.map((file, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg space-y-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-700">
                    Attachment {index + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove attachment"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                <input
                  type="text"
                  value={file.name}
                  onChange={(e) =>
                    updateAttachment(index, "name", e.target.value)
                  }
                  placeholder="File name (e.g. Competition Guidelines)"
                  className={inputClass}
                />

                <input
                  type="url"
                  value={file.url}
                  onChange={(e) =>
                    updateAttachment(index, "url", e.target.value)
                  }
                  placeholder="Direct file URL"
                  className={inputClass}
                />

                <select
                  value={file.fileType}
                  onChange={(e) =>
                    updateAttachment(index, "fileType", e.target.value)
                  }
                  className={inputClass + " bg-white"}
                >
                  <option value="">Select file type</option>
                  <option value="PDF">PDF</option>
                  <option value="DOC">Word Document (.doc)</option>
                  <option value="DOCX">Word Document (.docx)</option>
                  <option value="Image">Image</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            ))}

            {attachments.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-5 border border-dashed rounded-lg">
                No attachments added.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <Link
              href="/"
              className="px-6 py-2 rounded-md font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2 rounded-md font-bold text-[#005F63] shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-60"
              style={{ backgroundColor: colors.gold }}
            >
              <Save size={18} />
              {isSubmitting ? "Publishing..." : "Publish Announcement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementEditor;
