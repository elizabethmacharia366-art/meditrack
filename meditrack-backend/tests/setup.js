const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const User = require('../models/User');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.ADMIN_SECRET = 'test-admin-secret';

let mongod;

async function startDB() {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
}

async function stopDB() {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
}

async function clearDB() {
  const { collections } = mongoose.connection;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
}

// Returns the express app. We deliberately do NOT call jest.resetModules() here,
// because doing so creates a fresh mongoose instance that isn't connected to
// the in-memory database started in startDB().
function buildApp() {
  process.env.NODE_ENV = 'test';
  return require('../app');
}

async function ensureTestAdmin(email = 'admin@test.local', password = process.env.ADMIN_SECRET) {
  let admin = await User.findOne({ email });
  if (!admin) {
    admin = await User.create({
      name: 'Test Admin',
      email,
      password,
      role: 'admin',
      provider: 'email',
      status: 'approved',
      emailVerified: true,
      approvedAt: new Date(),
    });
  }
  return admin;
}

async function verifyFromResponse(app, body) {
  if (!body.verificationLink) return;
  const token = new URL(body.verificationLink).searchParams.get('token');
  await request(app).post('/api/auth/verify-email').send({ token });
}

// Register through the public flow, then return { token, user } ready for protected tests.
async function registerUser(app, { name, email, password, role }) {
  const payload = { name, email, password, role };
  if (role === 'hospital') payload.location = 'Test City';

  const res = await request(app).post('/api/auth/register').send(payload);
  if (res.status !== 201) {
    throw new Error(`register failed (${res.status}): ${JSON.stringify(res.body)}`);
  }

  await verifyFromResponse(app, res.body);

  if (res.body.status === 'pending') {
    const adminSession = await adminLogin(app);
    const approval = await request(app)
      .post(`/api/admin/users/${res.body.id}/approve`)
      .set(auth(adminSession.token));
    if (approval.status !== 200) {
      throw new Error(`approval failed (${approval.status}): ${JSON.stringify(approval.body)}`);
    }
  }

  const login = await request(app).post('/api/auth/login').send({ email, password });
  if (login.status !== 200) {
    throw new Error(`login failed (${login.status}): ${JSON.stringify(login.body)}`);
  }

  return { token: login.body.token, user: login.body };
}

async function adminLogin(app, email = 'admin@test.local') {
  await ensureTestAdmin(email);
  const res = await request(app)
    .post('/api/auth/admin-login')
    .send({ email, password: process.env.ADMIN_SECRET });
  if (res.status !== 200) {
    throw new Error(`admin login failed (${res.status}): ${JSON.stringify(res.body)}`);
  }
  return { token: res.body.token, user: res.body };
}

const auth = (token) => ({ Authorization: `Bearer ${token}` });

module.exports = {
  startDB,
  stopDB,
  clearDB,
  buildApp,
  registerUser,
  adminLogin,
  auth,
  request,
};
