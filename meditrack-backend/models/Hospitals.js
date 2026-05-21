const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  departments: [String],
  contact: { type: String },
  hours: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Hospital', hospitalSchema);
