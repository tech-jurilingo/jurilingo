
import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    default: '',
  },

  type: {
    type: String,
    enum: ['General', 'Blog', 'Podcast', 'Competition'],
    default: 'General',
  },

  linkUrl: {
    type: String,
    default: '',
  },

  buttonText: {
    type: String,
    default: 'Read More',
  },

  imageUrl: {
    type: String,
    default: '',
  },

  attachments: {
    type: [
      {
        name: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        fileType: {
          type: String,
          default: '',
        },
      },
    ],
    default: [],
  },

  isFeatured: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

AnnouncementSchema.index({ createdAt: -1 });

export default mongoose.models.Announcement ||
  mongoose.model('Announcement', AnnouncementSchema);
