import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    maxlength: 100,
  },
  author: {
    type: String,
    required: [true, 'Please provide an author name'],
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);