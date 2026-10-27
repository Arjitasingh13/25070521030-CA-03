const mongoose = require('mongoose');

const scheduleEntrySchema = new mongoose.Schema(
  {
    time: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const scheduleDaySchema = new mongoose.Schema(
  {
    dayNumber: { type: Number, required: true, unique: true },
    label: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    entries: { type: [scheduleEntrySchema], required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ScheduleDay', scheduleDaySchema);
