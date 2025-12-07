import mongoose from 'mongoose';

const CompetitionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  
  description: {
    type: String,
    required: true,
  },

  registrationFee: {
    type: Number,
    required: true,
    min: 0,
  },

  date: {
    type: Date,
    default: Date.now,
  },

  registrationStartDate: {
    type: Date,
    required: true,
  },

  registrationEndDate: {
    type: Date,
    required: true,
  },

  startDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,
    required: true,
  },

  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },

  registrationOpen: {
    type: Boolean,
    default: true,
  },

  paymentQrImageUrl: {
    type: String,
    default: '',
  },

  // Approved participants
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ],

  // Waitlist - users pending approval
  waitlist: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      appliedAt: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
      },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Competition || mongoose.model('Competition', CompetitionSchema);