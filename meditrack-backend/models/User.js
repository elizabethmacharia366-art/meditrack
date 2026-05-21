const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function () {
      return this.provider === 'email';
    },
  },
  provider: { type: String, enum: ['email', 'google', 'other'], default: 'email' },
  providerId: { type: String },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
