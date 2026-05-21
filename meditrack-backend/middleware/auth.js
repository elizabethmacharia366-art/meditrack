const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const auth = req.headers['authorization'];
    if (!auth) return next();
    const parts = auth.split(' ');
    const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : parts[0];
    if (!token) return next();
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const [id, role] = decoded.split(':');
    const user = await User.findById(id).select('-password');
    if (user) {
      req.user = { id: user._id, role: user.role, name: user.name };
    }
    next();
  } catch (err) {
    next();
  }
};
