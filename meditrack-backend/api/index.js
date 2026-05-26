// Vercel serverless entrypoint.
// Vercel ignores `server.js` (it never calls app.listen). It loads this file
// per request, so we must ensure Mongo is connected before Express handles it.
require('dotenv').config();
const app = require('../app');
const connectDB = require('../lib/db');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('DB connection failed:', err.message);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Database connection failed' }));
  }
  return app(req, res);
};
