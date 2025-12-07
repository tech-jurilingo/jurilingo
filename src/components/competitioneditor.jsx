"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Trophy, Clock, Save } from "lucide-react";
import Image from "next/image";

const CompetitionEditor = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    registrationFee: "",
    startDate: "",
    endDate: "",
    registrationStartDate: "",
    registrationEndDate: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const colors = {
    teal: "#005F63",
    gold: "#E3B65B",
    bg: "#F5F5F0",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.startDate || !formData.endDate) {
      alert("Please fill in all required fields (title, start and end date).");
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description || "",
      registrationFee:
        formData.registrationFee !== ""
          ? Number(formData.registrationFee)
          : undefined,
      startDate: formData.startDate,
      endDate: formData.endDate,
      registrationStartDate: formData.registrationStartDate || undefined,
      registrationEndDate: formData.registrationEndDate || undefined,
      // status & participants are optional and handled by the backend (status defaults to "active")
    };

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/competition", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(data?.message || "Failed to create competition");
        return;
      }

      alert(data?.message || "Competition created successfully");

      // Reset form
      setFormData({
        title: "",
        description: "",
        registrationFee: "",
        startDate: "",
        endDate: "",
        registrationStartDate: "",
        registrationEndDate: "",
      });
    } catch (error) {
      console.error("Error creating competition:", error);
      alert("Server error while creating competition");
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
              Host New Competition
            </h2>
            <p className="text-sm text-gray-500">
              Organize a moot court and invite participants
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
        <div className="p-8 space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Competition Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="E.g., 5th International Humanitarian Law Moot"
              value={formData.title}
              onChange={handleChange}
              className="w-full text-xl font-medium text-gray-800 placeholder-gray-300 border border-gray-300 rounded-md px-4 py-3 focus:border-[#E3B65B] focus:ring-1 focus:ring-[#E3B65B] focus:outline-none transition-all"
            />
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Description & Rules
            </label>
            <textarea
              name="description"
              placeholder="Describe the case, the rules, and eligibility criteria..."
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="w-full text-base text-gray-700 placeholder-gray-300 border border-gray-300 rounded-md px-4 py-3 focus:border-[#E3B65B] focus:ring-1 focus:ring-[#E3B65B] focus:outline-none transition-all resize-y"
            />
          </div>

          {/* Grid: Registration Fee + Registration Window */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Registration Fee */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Registration Fee (INR)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  INR
                </div>
                <input
                  type="number"
                  name="registrationFee"
                  placeholder="0.00"
                  value={formData.registrationFee}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md text-gray-800 focus:border-[#E3B65B] focus:ring-1 focus:ring-[#E3B65B] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Registration Start Date & Time */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Registration Start Date & Time
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock size={18} className="text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  name="registrationStartDate"
                  value={formData.registrationStartDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md text-gray-800 focus:border-[#E3B65B] focus:ring-1 focus:ring-[#E3B65B] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Registration End Date & Time */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Registration End Date & Time
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock size={18} className="text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  name="registrationEndDate"
                  value={formData.registrationEndDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md text-gray-800 focus:border-[#E3B65B] focus:ring-1 focus:ring-[#E3B65B] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Spacer to keep grid balanced on larger screens */}
            <div className="hidden md:block" />
          </div>

          {/* Grid: Competition Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Competition Start Date & Time
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock size={18} className="text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md text-gray-800 focus:border-[#E3B65B] focus:ring-1 focus:ring-[#E3B65B] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Competition End Date & Time
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock size={18} className="text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md text-gray-800 focus:border-[#E3B65B] focus:ring-1 focus:ring-[#E3B65B] focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100 mt-6">
            {/* Cancel → Home */}
            <Link
              href="/"
              className="px-6 py-2 rounded-md font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </Link>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="px-8 py-2 rounded-md font-bold text-[#005F63] shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: colors.gold }}
              type="button"
              disabled={isSubmitting}
            >
              <Save size={18} />
              {isSubmitting ? "Creating..." : "Create Competition"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionEditor;
