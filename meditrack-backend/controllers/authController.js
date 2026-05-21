const User = require('../models/User');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, provider = 'email', providerId } = req.body;
    if (provider === 'email' && !password) {
      return res.status(400).json({ error: 'Password required for email signup' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const user = new User({
      name,
      email,
      password: provider === 'email' ? password : undefined,
      role,
      provider,
      providerId,
    });

    await user.save();
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role, provider: user.provider });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, provider = 'email' } = req.body;
    const user = await User.findOne({ email, provider });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    if (provider === 'email') {
      if (!password || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }

    const token = Buffer.from(`${user._id}:${user.role}`).toString('base64');
    res.json({ token, id: user._id, name: user.name, role: user.role, provider: user.provider });
  } catch (err) {
    next(err);
  }
};

exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (password !== '106276') {
      return res.status(401).json({ error: 'Invalid admin password' });
    }
    let user = await User.findOne({ email, role: 'admin' });
    if (!user) {
      user = new User({ name: 'Admin', email, password: '106276', role: 'admin', provider: 'email' });
      await user.save();
    }
    if (user.role !== 'admin') {
      return res.status(401).json({ error: 'Account is not an admin' });
    }
    const token = Buffer.from(`${user._id}:${user.role}`).toString('base64');
    res.json({ token, id: user._id, name: user.name, role: user.role });
  } catch (err) {
    next(err);
  }
};
