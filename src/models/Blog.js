
import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
    maxlength: 100,
  },

  author: {
    type: String,
    required: [true, "Please provide an author name"],
  },

  content: {
    type: String,
    required: [true, "Please provide content"],
  },

  publishDate: {
    type: Date,
    default: Date.now,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },

  // Registered users who liked this blog
  likes: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    default: [],
  },

  // Comments submitted by registered users
  comments: {
    type: [CommentSchema],
    default: [],
  },
});

export default mongoose.models.Blog ||
  mongoose.model("Blog", BlogSchema);
