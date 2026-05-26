const {
  startDB, stopDB, clearDB, buildApp, request, registerUser, adminLogin, auth,
} = require('./setup');
const Patient = require('../models/Patients');
const User = require('../models/User');

let app;
let adminToken;
let doctorToken;
let patientToken;
let patientUser;

beforeAll(async () => {
  await startDB();
  app = buildApp();
});
afterAll(stopDB);

beforeEach(async () => {
  await clearDB();
  ({ token: adminToken } = await adminLogin(app));
  ({ token: doctorToken } = await registerUser(app, {
    name: 'Doc', email: 'doc@example.com', password: 'password123', role: 'doctor',
  }));
  const pat = await registerUser(app, {
    name: 'Jane', email: 'jane@example.com', password: 'password123', role: 'patient',
  });
  patientToken = pat.token;
  patientUser = pat.user;
});

describe('Patients', () => {
  test('GET /api/patients requires auth', async () => {
    const res = await request(app).get('/api/patients');
    expect(res.status).toBe(401);
  });

  test('GET /api/patients forbidden for patient role', async () => {
    const res = await request(app).get('/api/patients').set(auth(patientToken));
    expect(res.status).toBe(403);
  });

  test('GET /api/patients allowed for admin and doctor', async () => {
    const adminRes = await request(app).get('/api/patients').set(auth(adminToken));
    expect(adminRes.status).toBe(200);
    expect(Array.isArray(adminRes.body)).toBe(true);

    const docRes = await request(app).get('/api/patients').set(auth(doctorToken));
    expect(docRes.status).toBe(200);
  });

  test('GET /api/patients/me returns the patient profile', async () => {
    const res = await request(app).get('/api/patients/me').set(auth(patientToken));
    expect(res.status).toBe(200);
    expect(String(res.body.userId)).toBe(patientUser.id);
  });

  test('Patient can view & update own record but not someone else\'s', async () => {
    const mine = await Patient.findOne({ userId: patientUser.id });

    const ok = await request(app)
      .get(`/api/patients/${mine._id}`)
      .set(auth(patientToken));
    expect(ok.status).toBe(200);

    const updated = await request(app)
      .put(`/api/patients/${mine._id}`)
      .set(auth(patientToken))
      .send({ fullName: 'Jane Doe Updated', age: 30 });
    expect(updated.status).toBe(200);
    expect(updated.body.fullName).toBe('Jane Doe Updated');
    const syncedUser = await User.findById(patientUser.id);
    expect(syncedUser.name).toBe('Jane Doe Updated');

    const other = await Patient.create({ fullName: 'Other Patient' });
    const denied = await request(app)
      .get(`/api/patients/${other._id}`)
      .set(auth(patientToken));
    expect(denied.status).toBe(403);
  });

  test('DELETE /api/patients/:id admin only', async () => {
    const mine = await Patient.findOne({ userId: patientUser.id });
    const denied = await request(app)
      .delete(`/api/patients/${mine._id}`)
      .set(auth(patientToken));
    expect(denied.status).toBe(403);

    const ok = await request(app)
      .delete(`/api/patients/${mine._id}`)
      .set(auth(adminToken));
    expect(ok.status).toBe(200);
  });
});
