const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Patient = require('../models/Patients');
const Doctor = require('../models/Doctors');
const Invite = require('../models/Invite');
const { JWT_SECRET } = require('../middleware/auth');

const ADMIN_SECRET = process.env.ADMIN_SECRET || '106276';
const TOKEN_TTL = process.env.JWT_TTL || '7d';
const APP_URL = process.env.APP_URL || 'http://localhost:5173';

const signToken = (user) =>
  jwt.sign({ id: String(user._id), role: user.role }, JWT_SECRET, { expiresIn: TOKEN_TTL });

// In a real deployment this would send an email via SMTP / SendGrid / Resend.
// For now we log the link so admins/devs can copy it from the server console.
const sendVerificationEmail = (user, token) => {
  const link = `${APP_URL}/verify-email?token=${token}`;
  // eslint-disable-next-line no-console
  console.log(`[verify-email] ${user.email} -> ${link}`);
  return link;
};

const generateToken = (bytes = 24) => crypto.randomBytes(bytes).toString('hex');

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
    const {
      name,
      email,
      password,
      role = 'patient',
      provider = 'email',
      providerId,
      inviteCode,
    } = req.body;

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

    // Resolve invite (doctor flow). If a valid invite is provided we auto-approve.
    let invite = null;
    if (role === 'doctor' && inviteCode) {
      invite = await Invite.findOne({ code: String(inviteCode).trim().toUpperCase() });
      if (!invite || !invite.isUsable() || invite.role !== 'doctor') {
        return res.status(400).json({ error: 'Invalid or expired invite code' });
      }
      if (invite.email && invite.email !== email.toLowerCase()) {
        return res.status(400).json({ error: 'This invite is for a different email address' });
      }
    }

    // Determine status:
    // - patient: auto-approved
    // - doctor with valid invite: auto-approved
    // - doctor without invite: pending admin approval
    const status =
      role === 'patient' || invite ? 'approved' : 'pending';

    // Verification token (email link). Provider !== 'email' implies trusted OAuth.
    let verificationToken;
    let verificationExpires;
    let emailVerified = false;
    if (provider === 'email') {
      verificationToken = generateToken();
      verificationExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h
    } else {
      emailVerified = true;
    }

    const user = new User({
      name,
      email,
      password: provider === 'email' ? password : undefined,
      role,
      provider,
      providerId,
      status,
      emailVerified,
      verificationToken,
      verificationExpires,
      inviteCode: invite?.code,
      approvedAt: status === 'approved' ? new Date() : undefined,
    });
    await user.save();
    await ensureProfile(user);

    if (invite) {
      invite.usedBy = user._id;
      invite.usedAt = new Date();
      await invite.save();
    }

    // Log the verification link (until SMTP is wired up).
    let verificationLink;
    if (verificationToken) {
      verificationLink = sendVerificationEmail(user, verificationToken);
    }

    // For doctors awaiting approval, do NOT return a session token.
    if (status === 'pending') {
      return res.status(201).json({
        message:
          'Your account has been created and is awaiting admin approval. Please verify your email using the link sent to your inbox.',
        pending: true,
        ...user.toSafeJSON(),
        // Exposed only in non-production so devs can copy from the response.
        verificationLink: process.env.NODE_ENV === 'production' ? undefined : verificationLink,
      });
    }

    // Approved (patient or invited doctor) — issue a session immediately.
    const token = signToken(user);
    return res.status(201).json({
      token,
      ...user.toSafeJSON(),
      verificationLink: process.env.NODE_ENV === 'production' ? undefined : verificationLink,
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const token = req.query.token || req.body.token;
    if (!token) return res.status(400).json({ error: 'Verification token is required' });

    const user = await User.findOne({ verificationToken: token }).select(
      '+verificationToken +verificationExpires',
    );
    if (!user) return res.status(400).json({ error: 'Invalid or expired verification link' });
    if (user.verificationExpires && user.verificationExpires < new Date()) {
      return res.status(400).json({ error: 'Verification link has expired' });
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified', ...user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
};

exports.resendVerification = async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').toLowerCase().trim();
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email });
    // Always respond 200 to avoid leaking which emails exist.
    if (!user || user.emailVerified) return res.json({ message: 'If the account exists and is unverified, a new link was sent.' });

    user.verificationToken = generateToken();
    user.verificationExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);
    await user.save();
    sendVerificationEmail(user, user.verificationToken);

    res.json({ message: 'Verification link sent.' });
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

    // Gate by approval status.
    if (user.status === 'pending') {
      return res.status(403).json({
        error:
          'Your account is awaiting admin approval. You will be notified once approved.',
        status: 'pending',
      });
    }
    if (user.status === 'rejected') {
      return res.status(403).json({
        error:
          user.rejectionReason
            ? `Your account was rejected: ${user.rejectionReason}`
            : 'Your account was rejected.',
        status: 'rejected',
      });
    }

    // Gate by email verification (skip for admins so they can always recover access).
    if (user.role !== 'admin' && !user.emailVerified) {
      return res.status(403).json({
        error:
          'Please verify your email address before signing in. Check your inbox for the verification link.',
        emailVerified: false,
      });
    }
  status: 'approved',
        emailVerified: true,
        approvedAt: new Date(),
      });
      await user.save();
    } else if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Account is not an admin' });
    } else if (user.status !== 'approved' || !user.emailVerified) {
      // Heal pre-existing admin accounts so the bootstrap login still works.
      user.status = 'approved';
      user.emailVerified = true;
      if (!user.approvedAt) user.approvedAt = new Date();
      await user.save(
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
