import mongoose from 'mongoose';

const PodcastSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  youtubeUrl: {
    type: String,
    required: true,
  },

  youtubeId: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});


PodcastSchema.pre('validate', function () {
  if (this.youtubeUrl) {
    const match = this.youtubeUrl.match(
      /(?:youtube\.com\/.*v=|youtu\.be\/)([^&#]+)/,
    );
    if (match && match[1]) {
      this.youtubeId = match[1];
    } else {
      this.youtubeId = "";
    }
  }
});

const Podcast =
  mongoose.models.Podcast || mongoose.model('Podcast', PodcastSchema);

export default Podcast;
