const mongoose = require('mongoose');

const labResultSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  type: { type: String, required: true, trim: true },
  date: { type: Date, default: Date.now },
  summary: { type: String, trim: true },
  abnormal: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Cancelled'],
    default: 'Completed',
  },
  fileUrl: { type: String, trim: true },
  details: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

module.exports = mongoose.model('LabResult', labResultSchema);
