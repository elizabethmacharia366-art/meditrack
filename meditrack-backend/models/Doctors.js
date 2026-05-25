const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, sparse: true },
  fullName: { type: String, required: true, trim: true },
  specialty: { type: String, trim: true },
  contact: { type: String, trim: true },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  schedule: [
    { day: String, time: String },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
