const mongoose = require('mongoose');

const festivalInfoSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'eventspark' },
    description: { type: String, required: true },
    stats: [{
      value: { type: String, required: true },
      label: { type: String, required: true },
    }],
    highlights: [{
      title: { type: String, required: true },
      description: { type: String, required: true },
      image: { type: String, default: '' },
      label: { type: String, default: '' },
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('FestivalInfo', festivalInfoSchema);
