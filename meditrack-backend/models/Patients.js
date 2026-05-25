const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, sparse: true },
  fullName: { type: String, required: true, trim: true },
  age: { type: Number, min: 0, max: 150 },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  contact: { type: String, trim: true },
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  medicalHistory: [String],
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
