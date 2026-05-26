const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';

// Attaches req.user when a valid token is provided; never blocks.
const attachUser = async (req, _res, next) => {
  try {
    const header = req.headers['authorization'];
    if (!header) return next();
    const parts = header.split(' ');
    const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : parts[0];
    if (!token) return next();

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id).select('-password');
    const active = user && user.status === 'approved' && (user.role === 'admin' || user.emailVerified);
    if (active) {
      req.user = { id: String(user._id), role: user.role, name: user.name, email: user.email };
    }
    next();
  } catch (err) {
    // Invalid / expired token => treat as anonymous; protected routes will reject.
    next();
  }
};

// Hard guard: 401 if no user.
const requireAuth = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });
  next();
};

// Role guard. Usage: requireRole('admin') or requireRole('admin', 'doctor').
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden: insufficient role' });
  }
  next();
};

module.exports = attachUser;
module.exports.attachUser = attachUser;
module.exports.requireAuth = requireAuth;
module.exports.requireRole = requireRole;
module.exports.JWT_SECRET = JWT_SECRET;
