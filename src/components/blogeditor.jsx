"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Heading as HeadingIcon,
  List,
  Quote,
  Undo,
  Redo,
  Save,
  Calendar,
} from "lucide-react";

const BlogEditor = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishDate, setPublishDate] = useState(""); // NEW: publish date field
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editor = useEditor(
    {
      extensions: [StarterKit],
      content: "<p>Start sharing your legal insights...</p>",
      editorProps: {
        attributes: {
          class:
            "prose prose-lg focus:outline-none min-h-[300px] max-w-none text-gray-700 leading-relaxed",
        },
      },
      immediatelyRender: false,
    },
    []
  );

  const handleSubmit = async () => {
    if (!title || !author) {
      alert("Please enter both a title and an author for your blog.");
      return;
    }

    if (!editor) return;

    const content = editor.getHTML();

    setIsSubmitting(true);
    try {
      const payload = {
        title,
        author,
        content,
      };

      // Add publishDate only if provided
      if (publishDate) {
        payload.publishDate = publishDate;
      }

      const res = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(data?.message || "Failed to create blog");
        return;
      }

      alert(data?.message || "Blog created successfully");

      // Reset form
      setTitle("");
      setAuthor("");
      setPublishDate("");
      editor.commands.setContent("<p>Start sharing your legal insights...</p>");
    } catch (err) {
      console.error("Error creating blog:", err);
      alert("Server error while creating blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  const colors = {
    teal: "#005F63",
    gold: "#E3B65B",
    bg: "#F5F5F0",
  };

  const ToolbarButton = ({ onClick, isActive, icon: Icon, label }) => (
    <button
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-200 transition-colors ${
        isActive ? "text-[#005F63] bg-[#005F63]/10" : "text-gray-600"
      }`}
      title={label}
      type="button"
      disabled={!editor}
    >
      <Icon size={18} />
    </button>
  );

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
              Write New Blog
            </h2>
            <p className="text-sm text-gray-500">
              Share your expertise with the community
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

        {/* Editor Container */}
        <div className="p-8 space-y-6">
          {/* Title Input */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter your blog title here..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-3xl font-bold text-gray-800 placeholder-gray-300 border-b-2 border-transparent hover:border-gray-100 focus:border-[#E3B65B] focus:outline-none transition-colors py-2"
            />

            {/* Author Input */}
            <input
              type="text"
              placeholder="Author name..."
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full text-base text-gray-800 placeholder-gray-300 border-b border-gray-200 focus:border-[#E3B65B] focus:outline-none transition-colors py-2"
            />

            {/* NEW: Publish Date Input */}
            <div className="flex items-center gap-2 border-b border-gray-200 focus-within:border-[#E3B65B] transition-colors py-2">
              <Calendar size={18} className="text-gray-400" />
              <input
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="flex-1 text-base text-gray-800 placeholder-gray-300 focus:outline-none"
                placeholder="Publish date (optional)"
              />
              {publishDate && (
                <button
                  onClick={() => setPublishDate("")}
                  className="text-xs text-gray-400 hover:text-gray-600"
                  type="button"
                >
                  Clear
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 -mt-2">
              Leave empty to use current date and time
            </p>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap gap-1 border border-gray-200 rounded-lg p-2 bg-gray-50 sticky top-0 z-10">
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleBold().run()}
              isActive={editor?.isActive("bold")}
              icon={Bold}
              label="Bold"
            />
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              isActive={editor?.isActive("italic")}
              icon={Italic}
              label="Italic"
            />
            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
            <ToolbarButton
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
              isActive={editor?.isActive("heading", { level: 2 })}
              icon={HeadingIcon}
              label="Heading"
            />
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              isActive={editor?.isActive("bulletList")}
              icon={List}
              label="Bullet List"
            />
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              isActive={editor?.isActive("blockquote")}
              icon={Quote}
              label="Quote"
            />
            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
            <ToolbarButton
              onClick={() => editor?.chain().focus().undo().run()}
              icon={Undo}
              label="Undo"
            />
            <ToolbarButton
              onClick={() => editor?.chain().focus().redo().run()}
              icon={Redo}
              label="Redo"
            />
          </div>

          {/* Editor */}
          <div className="min-h-[400px] border border-gray-100 rounded-lg p-4 focus-within:ring-2 focus-within:ring-[#005F63]/20 transition-all">
            {editor && <EditorContent editor={editor} />}
          </div>

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
              className="px-8 py-2 rounded-md font-bold text-[#005F63] shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: colors.gold }}
              type="button"
              disabled={isSubmitting}
            >
              <Save size={18} />
              {isSubmitting ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;