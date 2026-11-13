
'use client';

import React, { useEffect, useState } from 'react';

const emptyForm = {
  name: '',
  role: '',
  bio: '',
  displayOrder: 0,
};

export default function TeamManagement() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    try {
      setLoading(true);
      const response = await fetch('/api/team', { cache: 'no-store' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not load team members');
      }

      setMembers(data.members || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function startEditing(member) {
    setEditingId(member._id);
    setForm({
      name: member.name || '',
      role: member.role || '',
      bio: member.bio || '',
      displayOrder: member.displayOrder ?? 0,
      imagePath: member.imagePath || '',
    });
    setImage(null);
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setImage(null);
    setMessage('');
  }

  async function uploadImage() {
    const formData = new FormData();
    formData.append('image', image);

    const response = await fetch('/api/team/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Image upload failed');
    }

    return data.imagePath;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      let imagePath = form.imagePath || '';

      if (image) {
        imagePath = await uploadImage();
      }

      if (!imagePath) {
        throw new Error('Please select a profile photo.');
      }

      const payload = {
        name: form.name.trim(),
        role: form.role.trim(),
        bio: form.bio.trim(),
        imagePath,
        displayOrder: Number(form.displayOrder) || 0,
      };

      const url = editingId
        ? `/api/team/${editingId}`
        : '/api/team';

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not save team member');
      }

      setMessage(
        editingId
          ? 'Team member updated successfully.'
          : 'Team member added successfully.'
      );

      resetForm();
      await loadMembers();
    } catch (error) {
      setMessage(error.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this team member?'
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/team/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not delete team member');
      }

      setMessage('Team member deleted successfully.');
      await loadMembers();

      if (editingId === id) resetForm();
    } catch (error) {
      setMessage(error.message || 'Delete failed.');
    }
  }

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-[#002B36]">
          Team Management
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Add, update, remove and arrange members displayed on the About
          the Team page.
        </p>
      </div>

      {message && (
        <div className="mb-4 rounded-lg bg-blue-50 text-blue-800 p-3 text-sm">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <h4 className="font-semibold text-gray-800">
          {editingId ? 'Edit Team Member' : 'Add New Team Member'}
        </h4>

        <div>
          <label className="block text-sm font-medium mb-1">
            Full Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Designation / Role
          </label>
          <input
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
            placeholder="Enter designation"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Biography
          </label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            required
            rows={5}
            className="w-full border rounded-lg p-3"
            placeholder="Write the member's biography"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Profile Photo
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => setImage(event.target.files?.[0] || null)}
            className="w-full border rounded-lg p-3"
            required={!editingId}
          />
          <p className="text-xs text-gray-500 mt-1">
            JPEG, PNG or WebP. Maximum file size: 2 MB.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Display Order
          </label>
          <input
            type="number"
            name="displayOrder"
            value={form.displayOrder}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
          <p className="text-xs text-gray-500 mt-1">
            Lower numbers appear first.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-3 rounded-lg bg-[#005F63] text-white font-semibold hover:bg-[#00494c] disabled:opacity-50"
          >
            {saving
              ? 'Saving...'
              : editingId
                ? 'Update Member'
                : 'Add Member'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-3 rounded-lg bg-gray-100 text-gray-700"
            >
              Cancel Editing
            </button>
          )}
        </div>
      </form>

      <div className="border-t pt-6">
        <h4 className="font-semibold text-gray-800 mb-4">
          Existing Team Members ({members.length})
        </h4>

        {loading ? (
          <p className="text-gray-500">Loading team members...</p>
        ) : members.length === 0 ? (
          <p className="text-gray-500">No team members found.</p>
        ) : (
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member._id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 border rounded-lg p-4"
              >
                <img
                  src={member.imagePath}
                  alt={member.name}
                  className="w-16 h-16 rounded-full object-cover"
                />

                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-[#002B36]">
                    {member.name}
                  </h5>
                  <p className="text-sm text-gray-600">{member.role}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Display order: {member.displayOrder ?? 0}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEditing(member)}
                    className="px-4 py-2 rounded-lg bg-blue-50 text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(member._id)}
                    className="px-4 py-2 rounded-lg bg-red-50 text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
