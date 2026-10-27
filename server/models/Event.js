const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true, trim: true },
    prizePool: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    rules: { type: String, default: 'Follow campus code of conduct. Teams must check in 30 minutes early.' },
    timings: { type: String, default: '09:00 AM – 06:00 PM' },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    createdByEmail: { type: String, lowercase: true, trim: true, default: null },
    seedKey: { type: String, unique: true, sparse: true, select: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
