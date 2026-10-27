const mongoose = require('mongoose');

const sponsorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    tier: {
      type: String,
      required: true,
      enum: ['Title Sponsor', 'Tech Partner', 'Media Partner', 'Community Partner'],
    },
    description: { type: String, required: true, trim: true },
    website: { type: String, required: true, trim: true },
    logoUrl: { type: String, default: '' },
    logoText: { type: String, required: true, trim: true, maxlength: 4 },
    brandColor: { type: String, default: '#67e8f9', match: /^#[0-9a-fA-F]{6}$/ },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isSample: { type: Boolean, default: true },
  },
  { timestamps: true }
);

sponsorSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('Sponsor', sponsorSchema);
