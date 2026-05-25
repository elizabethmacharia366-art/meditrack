require('dotenv').config();
const dns = require('dns');
const mongoose = require('mongoose');
const app = require('./app');

// Force Node's DNS resolver to use public DNS servers. This is required when
// the local network blocks/times-out SRV lookups against MongoDB Atlas
// (which the mongodb+srv:// scheme depends on).
const DNS_SERVERS = (process.env.DNS_SERVERS || '1.1.1.1,8.8.8.8')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
try {
  dns.setServers(DNS_SERVERS);
} catch (_) {
  // ignore; Node will fall back to system DNS
}

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB || 'meditrack',
    serverSelectionTimeoutMS: 15000,
  })
  .then(() => {
    console.log('MongoDB Atlas Connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Swagger UI: http://localhost:${PORT}/api/docs`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
