const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    role: { type: String, enum: ['doctor'], required: true },
    email: { type: String, lowercase: true, trim: true },
    note: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    usedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    usedAt: { type: Date },
    expiresAt: { type: Date },
  },
  { timestamps: true },
);

inviteSchema.methods.isUsable = function () {
  if (this.usedBy) return false;
  if (this.expiresAt && this.expiresAt < new Date()) return false;
  return true;
};

module.exports = mongoose.model('Invite', inviteSchema);
