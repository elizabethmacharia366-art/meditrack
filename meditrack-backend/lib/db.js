const mongoose = require('mongoose');

// Cache the connection across serverless invocations (Vercel reuses the
// Node.js process between requests when warm). Without this cache every
// request would create a brand-new connection, and queries would buffer
// while it is being established -> `users.findOne() buffering timed out`.
let cached = global.__mongooseConn;
if (!cached) {
  cached = global.__mongooseConn = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not set');
  }

  if (!cached.promise) {
    // Disable mongoose's "buffer until connected" behavior so problems
    // surface as real connection errors instead of silent 10s timeouts.
    mongoose.set('bufferCommands', false);

    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        dbName: process.env.MONGO_DB || 'meditrack',
        serverSelectionTimeoutMS: 15000,
      })
      .then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
  return cached.conn;
}

module.exports = connectDB;
