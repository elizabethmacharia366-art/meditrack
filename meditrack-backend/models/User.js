const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
  },
  password: {
    type: String,
    required: function () {
      return this.provider === 'email';
    },
    select: false,
  },
  provider: { type: String, enum: ['email', 'google', 'other'], default: 'email' },
  providerId: { type: String },
  role: { type: String, enum: ['patient', 'doctor', 'nurse', 'technician', 'hospital', 'admin'], default: 'patient' },
  department: { type: String, trim: true },
  ward: { type: String, trim: true },

  // Approval workflow.
  // - patient/doctor/hospital: 'pending' until an admin reviews and approves
  // - admin:  always 'approved' and created only by an existing admin
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: function () {
      return this.role === 'admin' ? 'approved' : 'pending';
    },
  },
  rejectionReason: { type: String, trim: true },
  approvedAt: { type: Date },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Email verification.
  emailVerified: { type: Boolean, default: false },
  verificationToken: { type: String, select: false },
  verificationExpires: { type: Date, select: false },

}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = function (candidate) {
  if (!this.password) return Promise.resolve(false);
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeJSON = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    provider: this.provider,
    status: this.status,
    emailVerified: this.emailVerified,
    department: this.department,
    ward: this.ward,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model('User', userSchema);
