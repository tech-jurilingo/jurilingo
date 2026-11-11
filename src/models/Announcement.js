
import mongoose from "mongoose";

const AttachmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      default: "link",
    },
  },
  { _id: false }
);

const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  type: {
    type: String,
    required: true,
  },

  linkUrl: {
    type: String,
    default: "",
  },

  description: {
    type: String,
    default: "",
  },

  buttonText: {
    type: String,
    default: "Read More",
  },

  imageUrl: {
    type: String,
    default: "",
  },

  attachments: {
    type: [AttachmentSchema],
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

export default mongoose.models.Announcement ||
  mongoose.model("Announcement", AnnouncementSchema);
