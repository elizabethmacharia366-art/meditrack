const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Patient = require('../models/Patients');
const Doctor = require('../models/Doctors');
const Hospital = require('../models/Hospitals');
const { JWT_SECRET } = require('../middleware/auth');

const TOKEN_TTL = process.env.JWT_TTL || '7d';
const APP_URL = process.env.APP_URL || 'http://localhost:5173';
const SELF_REGISTER_ROLES = ['patient', 'doctor'];

const signToken = (user) =>
  jwt.sign({ id: String(user._id), role: user.role }, JWT_SECRET, { expiresIn: TOKEN_TTL });

// Wire this to SMTP/SendGrid/Resend in production. For local/dev, expose the
// link in logs and non-production responses so the flow is testable.
const sendVerificationEmail = (user, token) => {
  const link = `${APP_URL}/verify-email?token=${token}`;
  // eslint-disable-next-line no-console
  console.log(`[verify-email] ${user.email} -> ${link}`);
  return link;
};

const generateToken = (bytes = 24) => crypto.randomBytes(bytes).toString('hex');

const buildVerification = (provider) => {
  if (provider !== 'email') return { emailVerified: true };

  return {
    emailVerified: false,
    verificationToken: generateToken(),
    verificationExpires: new Date(Date.now() + 1000 * 60 * 60 * 24),
  };
};

const buildRegistrationVerification = () => ({
  emailVerified: false,
  verificationToken: undefined,
  verificationExpires: undefined,
});

const ensureProfile = async (user, body = {}) => {
  if (user.role === 'patient') {
    const existing = await Patient.findOne({ userId: user._id });
    if (!existing) await Patient.create({ userId: user._id, fullName: user.name });
    return;
  }

  if (user.role === 'doctor') {
    const existing = await Doctor.findOne({ userId: user._id });
    if (!existing) {
      await Doctor.create({
        userId: user._id,
        fullName: user.name,
        specialty: body.specialty,
        contact: body.contact,
      });
    }
    return;
  }

  if (user.role === 'hospital') {
    const existing = await Hospital.findOne({ userId: user._id });
    if (!existing) {
      await Hospital.create({
        userId: user._id,
        name: body.hospitalName || body.facilityName || user.name,
        location: body.location,
        description: body.description,
        departments: body.departments,
        contact: body.contact,
        hours: body.hours,
      });
    }
  }
};

const pickProfileUpdates = (body = {}) => {
  const updates = {};
  if (typeof body.name === 'string') updates.name = body.name.trim();
  if (typeof body.email === 'string') updates.email = body.email.toLowerCase().trim();
  return updates;
};

const syncProfileName = async (user) => {
  if (user.role === 'patient') {
    await Patient.findOneAndUpdate({ userId: user._id }, { fullName: user.name });
  } else if (user.role === 'doctor') {
    await Doctor.findOneAndUpdate({ userId: user._id }, { fullName: user.name });
  } else if (user.role === 'hospital') {
    await Hospital.findOneAndUpdate({ userId: user._id }, { name: user.name });
  }
};

exports.register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role = 'patient',
      provider = 'email',
      providerId,
      location,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    if (provider === 'email' && !password) {
      return res.status(400).json({ error: 'Password required for email signup' });
    }
    if (role === 'admin') {
      return res.status(403).json({ error: 'Admins must be created by an existing admin' });
    }
    if (!SELF_REGISTER_ROLES.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    if (role === 'hospital' && !location) {
      return res.status(400).json({ error: 'Hospital registration requires a location' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const status = 'pending';
    const verification = buildRegistrationVerification();

    const user = new User({
      name,
      email: normalizedEmail,
      password: provider === 'email' ? password : undefined,
      role,
      provider,
      providerId,
      status,
      ...verification,
      approvedAt: status === 'approved' ? new Date() : undefined,
    });

    await user.save();
    await ensureProfile(user, req.body);

    return res.status(201).json({
      message: 'Account created and awaiting admin approval.',
      pending: true,
      ...user.toSafeJSON(),
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    res.status(403).json({
      error: 'Accounts are activated by admin approval.',
    });
  } catch (err) {
    next(err);
  }
};

exports.resendVerification = async (req, res, next) => {
  try {
    res.status(403).json({
      error: 'Accounts are activated by admin approval.',
    });
  } catch (err) {
    next(err);
  }
};

const rejectInactive = (user, res) => {
  if (user.status === 'pending') {
    res.status(403).json({
      error: 'Your account is awaiting admin approval.',
      status: 'pending',
    });
    return true;
  }
  if (user.status === 'rejected') {
    res.status(403).json({
      error: user.rejectionReason
        ? `Your account was rejected: ${user.rejectionReason}`
        : 'Your account was rejected.',
      status: 'rejected',
    });
    return true;
  }
  return false;
};

const rejectUnverified = (user, res) => {
  if (user.role !== 'admin' && !user.emailVerified) {
    res.status(403).json({
      error: 'Your account is awaiting admin approval.',
      status: user.status,
    });
    return true;
  }
  return false;
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, provider = 'email', role } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase().trim(), provider }).select(
      '+password',
    );
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (role && role !== user.role) {
      return res.status(403).json({ error: `This account is registered as ${user.role}.` });
    }

    if (provider === 'email') {
      if (!password) return res.status(401).json({ error: 'Invalid credentials' });
      const ok = await user.comparePassword(password);
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (rejectInactive(user, res)) return undefined;
    if (rejectUnverified(user, res)) return undefined;

    const token = signToken(user);
    return res.json({ token, ...user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
};

exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      role: 'admin',
      provider: 'email',
    }).select('+password');
    if (!user) return res.status(401).json({ error: 'Invalid admin credentials' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ error: 'Invalid admin credentials' });

    user.status = 'approved';
    user.emailVerified = true;
    if (!user.approvedAt) user.approvedAt = new Date();
    await user.save();

    const token = signToken(user);
    return res.json({ token, ...user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.toSafeJSON());
  } catch (err) {
    next(err);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });

    const updates = pickProfileUpdates(req.body);
    if ('name' in updates && !updates.name) {
      return res.status(400).json({ error: 'Name cannot be empty' });
    }
    if ('email' in updates && !updates.email) {
      return res.status(400).json({ error: 'Email cannot be empty' });
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No profile fields provided' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (updates.email && updates.email !== user.email) {
      const existing = await User.findOne({ email: updates.email, _id: { $ne: user._id } });
      if (existing) return res.status(409).json({ error: 'Email already registered' });

      user.email = updates.email;
      user.emailVerified = user.status === 'approved';
      user.verificationToken = undefined;
      user.verificationExpires = undefined;
    }

    if (updates.name) user.name = updates.name;

    await user.save();
    if (updates.name) await syncProfileName(user);

    res.json({
      message: 'Profile updated.',
      ...user.toSafeJSON(),
    });
  } catch (err) {
    next(err);
  }
};
