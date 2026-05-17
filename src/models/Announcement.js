import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema);
