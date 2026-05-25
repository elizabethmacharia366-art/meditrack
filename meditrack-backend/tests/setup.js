const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');

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

// Register + return { token, user, app }.
async function registerUser(app, { name, email, password, role }) {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name, email, password, role });
  if (res.status !== 201) {
    throw new Error(`register failed (${res.status}): ${JSON.stringify(res.body)}`);
  }
  return { token: res.body.token, user: res.body };
}

async function adminLogin(app, email = 'admin@test.local') {
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
