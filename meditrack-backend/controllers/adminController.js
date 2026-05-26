const crypto = require('crypto');
const User = require('../models/User');
const Invite = require('../models/Invite');

const generateCode = () =>
  // Short, human-friendly 10-char code, e.g. "K4Q8XJ2P9M"
  crypto.randomBytes(6).toString('base64').replace(/[+/=]/g, '').slice(0, 10).toUpperCase();

exports.listUsers = async (req, res, next) => {
  try {
    const { status, role } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (role) filter.role = role;
    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json(users.map((u) => u.toSafeJSON()));
  } catch (err) {
    next(err);
  }
};

exports.approveUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role === 'admin') {
      return res.status(400).json({ error: 'Admins do not need approval' });
    }
    user.status = 'approved';
    user.rejectionReason = undefined;
    user.approvedAt = new Date();
    user.approvedBy = req.user.id;
    await user.save();
    res.json(user.toSafeJSON());
  } catch (err) {
    next(err);
  }
};

exports.rejectUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role === 'admin') {
      return res.status(400).json({ error: 'Cannot reject an admin' });
    }
    user.status = 'rejected';
    user.rejectionReason = (req.body?.reason || '').trim() || undefined;
    await user.save();
    res.json(user.toSafeJSON());
  } catch (err) {
    next(err);
  }
};

exports.listInvites = async (_req, res, next) => {
  try {
    const invites = await Invite.find()
      .populate('createdBy', 'name email')
      .populate('usedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(invites);
  } catch (err) {
    next(err);
  }
};

exports.createInvite = async (req, res, next) => {
  try {
    const { role = 'doctor', email, note, expiresInDays } = req.body || {};
    if (role !== 'doctor') {
      return res.status(400).json({ error: 'Only doctor invites are supported' });
    }

    // Ensure uniqueness — try a few times in case of collision.
    let code;
    for (let i = 0; i < 5; i++) {
      const candidate = generateCode();
      // eslint-disable-next-line no-await-in-loop
      const dup = await Invite.findOne({ code: candidate });
      if (!dup) {
        code = candidate;
        break;
      }
    }
    if (!code) return res.status(500).json({ error: 'Failed to generate invite code' });

    const expiresAt = expiresInDays
      ? new Date(Date.now() + Number(expiresInDays) * 24 * 60 * 60 * 1000)
      : undefined;

    const invite = await Invite.create({
      code,
      role,
      email: email ? String(email).toLowerCase().trim() : undefined,
      note: note?.trim() || undefined,
      createdBy: req.user.id,
      expiresAt,
    });
    res.status(201).json(invite);
  } catch (err) {
    next(err);
  }
};

exports.revokeInvite = async (req, res, next) => {
  try {
    const invite = await Invite.findById(req.params.id);
    if (!invite) return res.status(404).json({ error: 'Invite not found' });
    if (invite.usedBy) {
      return res.status(400).json({ error: 'Cannot revoke an invite that has been used' });
    }
    await invite.deleteOne();
    res.json({ message: 'Invite revoked' });
  } catch (err) {
    next(err);
  }
};
