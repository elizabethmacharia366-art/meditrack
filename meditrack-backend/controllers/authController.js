const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Patient = require('../models/Patients');
const Doctor = require('../models/Doctors');
const { JWT_SECRET } = require('../middleware/auth');

const ADMIN_SECRET = process.env.ADMIN_SECRET || '106276';
const TOKEN_TTL = process.env.JWT_TTL || '7d';

const signToken = (user) =>
  jwt.sign({ id: String(user._id), role: user.role }, JWT_SECRET, { expiresIn: TOKEN_TTL });

// Auto-create a profile document linked to the user when they register.
const ensureProfile = async (user) => {
  if (user.role === 'patient') {
    const existing = await Patient.findOne({ userId: user._id });
    if (!existing) await Patient.create({ userId: user._id, fullName: user.name });
  } else if (user.role === 'doctor') {
    const existing = await Doctor.findOne({ userId: user._id });
    if (!existing) await Doctor.create({ userId: user._id, fullName: user.name });
  }
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'patient', provider = 'email', providerId } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    if (provider === 'email' && !password) {
      return res.status(400).json({ error: 'Password required for email signup' });
    }
    // Block self-registering as admin via this endpoint.
    if (role === 'admin') {
      return res.status(403).json({ error: 'Cannot register as admin' });
    }
    if (!['patient', 'doctor'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const user = new User({
      name,
      email,
      password: provider === 'email' ? password : undefined,
      role,
      provider,
      providerId,
    });
    await user.save();
    await ensureProfile(user);

    const token = signToken(user);
    res.status(201).json({ token, ...user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, provider = 'email' } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase(), provider }).select('+password');
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    if (provider === 'email') {
      if (!password) return res.status(401).json({ error: 'Invalid credentials' });
      const ok = await user.comparePassword(password);
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    }

    await ensureProfile(user);
    const token = signToken(user);
    res.json({ token, ...user.toSafeJSON() });
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
    if (password !== ADMIN_SECRET) {
      return res.status(401).json({ error: 'Invalid admin password' });
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = new User({
        name: 'Admin',
        email,
        password: ADMIN_SECRET,
        role: 'admin',
        provider: 'email',
      });
      await user.save();
    } else if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Account is not an admin' });
    }

    const token = signToken(user);
    res.json({ token, ...user.toSafeJSON() });
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
