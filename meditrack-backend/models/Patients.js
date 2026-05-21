const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  age: { type: Number },
  gender: { type: String },
  contact: { type: String },
  bloodGroup: { type: String },
  medicalHistory: [String]
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
