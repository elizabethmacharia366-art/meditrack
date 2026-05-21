const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  specialty: { type: String },
  contact: { type: String },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  schedule: [
    { day: String, time: String }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
