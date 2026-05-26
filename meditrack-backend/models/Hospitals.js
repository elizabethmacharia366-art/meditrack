const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, sparse: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  departments: [String],
  contact: { type: String },
  hours: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Hospital', hospitalSchema);
