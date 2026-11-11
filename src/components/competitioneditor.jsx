
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapLink from '@tiptap/extension-link';

import {
  Trophy,
  Save,
  Bold,
  Italic,
  Heading2,
  List,
  ListOrdered,
  Link2,
  Unlink,
  Quote,
  Undo,
  Redo,
} from 'lucide-react';

const CompetitionEditor = () => {
  const [formData, setFormData] = useState({
    title: '',
    registrationFee: '',
    startDate: '',
    endDate: '',
    registrationStartDate: '',
    registrationEndDate: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const colors = {
    teal: '#005F63',
    gold: '#E3B65B',
    bg: '#F5F5F0',
  };

  // --------------------------------------------------
  // RICH TEXT EDITOR
  // --------------------------------------------------

  const editor = useEditor({
    extensions: [
      StarterKit,

      TiptapLink.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        protocols: ['http', 'https'],
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
          class: 'text-[#005F63] underline',
        },
      }),
    ],

    content: '<p>Enter event description, rules and eligibility criteria...</p>',

    editorProps: {
      attributes: {
        class:
          'prose prose-lg focus:outline-none min-h-[250px] max-w-none text-gray-700 leading-relaxed p-4',
      },
    },

    immediatelyRender: false,
  });

  // --------------------------------------------------
  // FORM INPUT HANDLER
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // URL VALIDATION
  // --------------------------------------------------

  const isAllowedWebUrl = (value) => {
    try {
      const parsed = new URL(value);

      return (
        parsed.protocol === 'https:' ||
        parsed.protocol === 'http:'
      );
    } catch {
      return false;
    }
  };

  // --------------------------------------------------
  // ADD OR EDIT HYPERLINK
  // --------------------------------------------------

  const addOrEditLink = () => {
    if (!editor) return;

    const previousUrl =
      editor.getAttributes('link').href || '';

    const enteredUrl = window.prompt(
      'Enter the registration or reference URL (Google Meet, Microsoft Forms, website, etc.):',
      previousUrl
    );

    if (enteredUrl === null) return;

    const url = enteredUrl.trim();

    if (!url) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .unsetLink()
        .run();

      return;
    }

    if (!isAllowedWebUrl(url)) {
      alert(
        'Please enter a complete URL beginning with https:// or http://'
      );
      return;
    }

    if (editor.state.selection.empty) {
      const label = window.prompt(
        'Enter the text to display for this link:',
        'Register Here'
      );

      if (!label?.trim()) return;

      editor
        .chain()
        .focus()
        .insertContent({
          type: 'text',
          text: label.trim(),
          marks: [
            {
              type: 'link',
              attrs: {
                href: url,
                target: '_blank',
                rel: 'noopener noreferrer',
              },
            },
          ],
        })
        .run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({
          href: url,
          target: '_blank',
          rel: 'noopener noreferrer',
        })
        .run();
    }
  };

  // --------------------------------------------------
  // TOOLBAR BUTTON
  // --------------------------------------------------

  const ToolbarButton = ({
    onClick,
    isActive,
    icon: Icon,
    label,
    disabled,
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`p-2 rounded hover:bg-gray-200 transition-colors ${
        isActive
          ? 'text-[#005F63] bg-[#005F63]/10'
          : 'text-gray-600'
      } disabled:opacity-40`}
    >
      <Icon size={18} />
    </button>
  );

  // --------------------------------------------------
  // CREATE EVENT
  // --------------------------------------------------

  const handleSubmit = async () => {
    if (
      !formData.title.trim() ||
      !formData.startDate ||
      !formData.endDate
    ) {
      alert(
        'Please fill in the required fields: event title, start date and end date.'
      );
      return;
    }

    if (!editor) return;

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      alert('Event end date cannot be earlier than its start date.');
      return;
    }

    if (
      formData.registrationStartDate &&
      formData.registrationEndDate &&
      new Date(formData.registrationEndDate) <
        new Date(formData.registrationStartDate)
    ) {
      alert('Registration end date cannot be earlier than its start date.');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: editor.getHTML(),
      registrationFee:
        formData.registrationFee !== ''
          ? Number(formData.registrationFee)
          : undefined,
      startDate: formData.startDate,
      endDate: formData.endDate,
      registrationStartDate:
        formData.registrationStartDate || undefined,
      registrationEndDate:
        formData.registrationEndDate || undefined,
    };

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/competition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(data?.message || 'Failed to create event.');
        return;
      }

      alert(data?.message || 'Event created successfully!');

      setFormData({
        title: '',
        registrationFee: '',
        startDate: '',
        endDate: '',
        registrationStartDate: '',
        registrationEndDate: '',
      });

      editor.commands.setContent(
        '<p>Enter event description, rules and eligibility criteria...</p>'
      );
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Server error while creating event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------------------------------------------------
  // INPUT FIELD COMPONENT
  // --------------------------------------------------

  const DateField = ({ label, name, required = false }) => (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <input
        type="date"
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required={required}
        className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 focus:border-[#E3B65B] focus:ring-1 focus:ring-[#E3B65B] focus:outline-none transition-all"
      />
    </div>
  );

  // --------------------------------------------------
  // INTERFACE
  // --------------------------------------------------

  return (
    <div
      className="grow w-full py-12 px-4 md:px-8"
      style={{ backgroundColor: colors.bg }}
    >
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">

        {/* HEADER */}

        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="text-[#005F63]" size={24} />

              <h2 className="text-2xl font-bold font-serif text-[#002B36]">
                Create New Event
              </h2>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              Organise competitions, moot courts, conferences and other legal events.
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

        {/* FORM */}

        <div className="p-8 space-y-7">

          {/* EVENT TITLE */}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Event Title <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="title"
              placeholder="E.g., 5th International Humanitarian Law Moot"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full text-xl font-medium text-gray-800 placeholder-gray-300 border border-gray-300 rounded-md px-4 py-3 focus:border-[#E3B65B] focus:ring-1 focus:ring-[#E3B65B] focus:outline-none transition-all"
            />
          </div>

          {/* EVENT DESCRIPTION */}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Event Description, Rules &amp; Eligibility
            </label>

            <div className="border border-gray-300 rounded-lg overflow-hidden">

              {/* RICH TEXT TOOLBAR */}

              <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 p-2 bg-gray-50">

                <ToolbarButton
                  onClick={() =>
                    editor?.chain().focus().toggleBold().run()
                  }
                  isActive={editor?.isActive('bold')}
                  icon={Bold}
                  label="Bold"
                  disabled={!editor}
                />

                <ToolbarButton
                  onClick={() =>
                    editor?.chain().focus().toggleItalic().run()
                  }
                  isActive={editor?.isActive('italic')}
                  icon={Italic}
                  label="Italic"
                  disabled={!editor}
                />

                <div className="w-px h-6 bg-gray-300 mx-1" />

                <ToolbarButton
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  isActive={editor?.isActive('heading', { level: 2 })}
                  icon={Heading2}
                  label="Heading"
                  disabled={!editor}
                />

                <ToolbarButton
                  onClick={() =>
                    editor?.chain().focus().toggleBulletList().run()
                  }
                  isActive={editor?.isActive('bulletList')}
                  icon={List}
                  label="Bullet List"
                  disabled={!editor}
                />

                <ToolbarButton
                  onClick={() =>
                    editor?.chain().focus().toggleOrderedList().run()
                  }
                  isActive={editor?.isActive('orderedList')}
                  icon={ListOrdered}
                  label="Numbered List"
                  disabled={!editor}
                />

                <ToolbarButton
                  onClick={() =>
                    editor?.chain().focus().toggleBlockquote().run()
                  }
                  isActive={editor?.isActive('blockquote')}
                  icon={Quote}
                  label="Quote"
                  disabled={!editor}
                />

                <div className="w-px h-6 bg-gray-300 mx-1" />

                <ToolbarButton
                  onClick={addOrEditLink}
                  isActive={editor?.isActive('link')}
                  icon={Link2}
                  label="Insert hyperlink or registration link"
                  disabled={!editor}
                />

                <ToolbarButton
                  onClick={() =>
                    editor?.chain().focus().extendMarkRange('link').unsetLink().run()
                  }
                  icon={Unlink}
                  label="Remove hyperlink"
                  disabled={!editor || !editor.isActive('link')}
                />

                <div className="w-px h-6 bg-gray-300 mx-1" />

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

              {/* EDITOR CONTENT */}

              <div className="min-h-[280px]">
                {editor && (
                  <EditorContent editor={editor} />
                )}
              </div>

            </div>

            <p className="text-xs text-gray-500 mt-2">
              Select text and click the link icon to attach a URL, or click it without selecting text to insert a new registration link.
            </p>
          </div>

          {/* REGISTRATION FEE */}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Registration Fee (INR)
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 text-sm">
                INR
              </div>

              <input
                type="number"
                name="registrationFee"
                min="0"
                placeholder="0.00"
                value={formData.registrationFee}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md text-gray-800 focus:border-[#E3B65B] focus:ring-1 focus:ring-[#E3B65B] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* REGISTRATION PERIOD */}

          <div>
            <h3 className="text-lg font-bold font-serif text-[#005F63] mb-4">
              Registration Period
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <DateField
                label="Registration Start Date"
                name="registrationStartDate"
              />

              <DateField
                label="Registration End Date"
                name="registrationEndDate"
              />

            </div>
          </div>

          {/* EVENT PERIOD */}

          <div>
            <h3 className="text-lg font-bold font-serif text-[#005F63] mb-4">
              Event Period
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <DateField
                label="Event Start Date"
                name="startDate"
                required
              />

              <DateField
                label="Event End Date"
                name="endDate"
                required
              />

            </div>
          </div>

          {/* ACTIONS */}

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">

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
              disabled={isSubmitting || !editor}
            >
              <Save size={18} />

              {isSubmitting ? 'Creating...' : 'Create Event'}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default CompetitionEditor;
