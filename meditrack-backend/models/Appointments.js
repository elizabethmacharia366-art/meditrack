const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Scheduled', 'In Treatment', 'Completed', 'Cancelled'],
    default: 'Scheduled',
  },
  // Patient-reported issue / symptoms used to auto-route to a specialist.
  issue: { type: String, trim: true },
  matchedSpecialty: { type: String, trim: true },
  reminderDate: { type: Date },
  reminderMessage: { type: String },
  reminderSent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
