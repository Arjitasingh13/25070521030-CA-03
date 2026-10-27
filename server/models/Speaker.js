const mongoose = require('mongoose');

const speakerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    topic: { type: String, required: true, trim: true },
    bio: { type: String, required: true, trim: true },
    avatar: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

speakerSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('Speaker', speakerSchema);
