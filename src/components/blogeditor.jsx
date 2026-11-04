"use client";

import React, { useState } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle, FontSize } from "@tiptap/extension-text-style";
import TiptapLink from "@tiptap/extension-link";
import { Node } from "@tiptap/core";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import {
  Bold,
  Italic,
  Heading as HeadingIcon,
  List as ListIcon,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Save,
  Calendar,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link2,
  Unlink,
  ImagePlus,
} from "lucide-react";

// Keep image content as standard HTML <img> tags so saved blog content
// remains compatible with existing blog records and the public blog renderer.
const BlogImage = Node.create({
  name: "blogImage",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: "" },
      title: { default: null },
    };
  },
  parseHTML() {
    return [{ tag: "img[src]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "img",
      {
        ...HTMLAttributes,
        class: "blog-content-image",
        style: "max-width:100%;height:auto;display:block;margin:1rem auto;",
      },
    ];
  },
});

const isAllowedWebUrl = (value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
};

const BlogEditor = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fontSizeOptions = [
    { label: "Small", value: "14px" },
    { label: "Normal", value: "16px" },
    { label: "Large", value: "18px" },
    { label: "X-Large", value: "20px" },
  ];

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      BulletList,
      OrderedList,
      ListItem,
      TextStyle,
      TiptapLink.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        protocols: ["http", "https"],
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      BlogImage,
      FontSize.configure({ types: ["textStyle"] }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "<p>Start sharing your legal insights...</p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-lg focus:outline-none min-h-[300px] max-w-none text-gray-700 leading-relaxed",
      },
    },
    immediatelyRender: false,
  });

  const handleSubmit = async () => {
    if (!title.trim() || !author.trim()) {
      alert("Please enter both a title and an author for your blog.");
      return;
    }

    if (!editor) return;

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        author: author.trim(),
        content: editor.getHTML(),
      };

      if (publishDate) payload.publishDate = publishDate;

      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(data?.message || "Failed to create blog");
        return;
      }

      alert(data?.message || "Blog created successfully");
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

  const ToolbarButton = ({ onClick, isActive, icon: Icon, label, disabled }) => (
    <button
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-200 transition-colors ${
        isActive ? "text-[#005F63] bg-[#005F63]/10" : "text-gray-600"
      }`}
      title={label}
      aria-label={label}
      type="button"
      disabled={disabled}
    >
      <Icon size={18} />
    </button>
  );

  const setFontSize = (size) => {
    if (!editor) return;
    if (!size) {
      editor.chain().focus().unsetFontSize().run();
    } else {
      editor.chain().focus().setFontSize(size).run();
    }
  };

  const addOrEditLink = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href || "";
    const enteredUrl = window.prompt(
      "Enter the complete website URL for this hyperlink or citation:",
      previousUrl
    );
    if (enteredUrl === null) return;

    const url = enteredUrl.trim();
    if (!url) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    if (!isAllowedWebUrl(url)) {
      alert("Please enter a complete URL beginning with https:// or http://");
      return;
    }

    if (editor.state.selection.empty) {
      const label = window.prompt("Enter the text to display for this link:", url);
      if (!label?.trim()) return;

      editor
        .chain()
        .focus()
        .insertContent({
          type: "text",
          text: label.trim(),
          marks: [
            {
              type: "link",
              attrs: {
                href: url,
                target: "_blank",
                rel: "noopener noreferrer",
              },
            },
          ],
        })
        .run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url, target: "_blank" })
        .run();
    }
  };

  const addImageByUrl = () => {
    if (!editor) return;

    const enteredUrl = window.prompt(
      "Paste a direct image URL (https://...):"
    );
    if (!enteredUrl) return;

    const src = enteredUrl.trim();
    if (!isAllowedWebUrl(src)) {
      alert("Please enter a valid image URL beginning with https:// or http://");
      return;
    }

    const alt = window.prompt("Add a short image description (optional):") || "";
    editor
      .chain()
      .focus()
      .insertContent({
        type: "blogImage",
        attrs: { src, alt: alt.trim() },
      })
      .run();
  };

  const setAlign = (alignment) => {
    if (!editor) return;
    editor.chain().focus().setTextAlign(alignment).run();
  };

  return (
    <div
      className="grow w-full py-12 px-4 md:px-8"
      style={{ backgroundColor: colors.bg }}
    >
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
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

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter your blog title here..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-3xl font-bold text-gray-800 placeholder-gray-300 border-b-2 border-transparent hover:border-gray-100 focus:border-[#E3B65B] focus:outline-none transition-colors py-2"
            />

            <input
              type="text"
              placeholder="Author name..."
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full text-base text-gray-800 placeholder-gray-300 border-b border-gray-200 focus:border-[#E3B65B] focus:outline-none transition-colors py-2"
            />

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

          <div className="flex flex-wrap gap-1 border border-gray-200 rounded-lg p-2 bg-gray-50 sticky top-0 z-10">
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleBold().run()}
              isActive={editor?.isActive("bold")}
              icon={Bold}
              label="Bold"
              disabled={!editor}
            />
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              isActive={editor?.isActive("italic")}
              icon={Italic}
              label="Italic"
              disabled={!editor}
            />
            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor?.isActive("heading", { level: 2 })}
              icon={HeadingIcon}
              label="Heading (H2)"
              disabled={!editor}
            />
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              isActive={editor?.isActive("bulletList")}
              icon={ListIcon}
              label="Bullet List"
              disabled={!editor}
            />
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              isActive={editor?.isActive("orderedList")}
              icon={ListOrdered}
              label="Numbered List"
              disabled={!editor}
            />
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              isActive={editor?.isActive("blockquote")}
              icon={Quote}
              label="Quote"
              disabled={!editor}
            />
            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
            <ToolbarButton
              onClick={addOrEditLink}
              isActive={editor?.isActive("link")}
              icon={Link2}
              label="Add hyperlink or citation"
              disabled={!editor}
            />
            <ToolbarButton
              onClick={() =>
                editor?.chain().focus().extendMarkRange("link").unsetLink().run()
              }
              icon={Unlink}
              label="Remove hyperlink"
              disabled={!editor || !editor.isActive("link")}
            />
            <ToolbarButton
              onClick={addImageByUrl}
              icon={ImagePlus}
              label="Insert image by URL"
              disabled={!editor}
            />
            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
            <ToolbarButton
              onClick={() => setAlign("left")}
              isActive={editor?.isActive({ textAlign: "left" })}
              icon={AlignLeft}
              label="Align Left"
              disabled={!editor}
            />
            <ToolbarButton
              onClick={() => setAlign("center")}
              isActive={editor?.isActive({ textAlign: "center" })}
              icon={AlignCenter}
              label="Align Center"
              disabled={!editor}
            />
            <ToolbarButton
              onClick={() => setAlign("right")}
              isActive={editor?.isActive({ textAlign: "right" })}
              icon={AlignRight}
              label="Align Right"
              disabled={!editor}
            />
            <ToolbarButton
              onClick={() => setAlign("justify")}
              isActive={editor?.isActive({ textAlign: "justify" })}
              icon={AlignJustify}
              label="Justify"
              disabled={!editor}
            />
            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
            <div className="flex items-center gap-1 ml-1">
              <select
                className="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-700"
                onChange={(e) => setFontSize(e.target.value)}
                defaultValue=""
                disabled={!editor}
                aria-label="Font size"
              >
                <option value="">Font size</option>
                {fontSizeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
            <ToolbarButton
              onClick={() => editor?.chain().focus().undo().run()}
              icon={Undo}
              label="Undo"
              disabled={!editor || !editor.can().undo()}
            />
            <ToolbarButton
              onClick={() => editor?.chain().focus().redo().run()}
              icon={Redo}
              label="Redo"
              disabled={!editor || !editor.can().redo()}
            />
          </div>

          <div className="min-h-[400px] border border-gray-100 rounded-lg p-4 focus-within:ring-2 focus-within:ring-[#005F63]/20 transition-all">
            {editor && <EditorContent editor={editor} />}
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
            <NextLink
              href="/"
              className="px-6 py-2 rounded-md font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </NextLink>
            <button
              onClick={handleSubmit}
              className="px-8 py-2 rounded-md font-bold text-[#005F63] shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: colors.gold }}
              type="button"
              disabled={isSubmitting || !editor}
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
