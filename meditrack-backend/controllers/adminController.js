const User = require('../models/User');

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

exports.createAdmin = async (req, res, next) => {
  try {
    const { name = 'Admin', email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: 'admin',
      provider: 'email',
      status: 'approved',
      emailVerified: true,
      approvedAt: new Date(),
      approvedBy: req.user.id,
    });

    res.status(201).json(user.toSafeJSON());
  } catch (err) {
    next(err);
  }
};
