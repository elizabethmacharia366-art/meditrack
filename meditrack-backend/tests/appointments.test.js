const {
  startDB, stopDB, clearDB, buildApp, request, registerUser, adminLogin, auth,
} = require('./setup');
const Patient = require('../models/Patients');
const Doctor = require('../models/Doctors');

let app;
let adminToken;
let doctorToken;
let doctorUser;
let patientToken;
let patientUser;
let otherPatientToken;
let otherPatientUser;

beforeAll(async () => {
  await startDB();
  app = buildApp();
});
afterAll(stopDB);

beforeEach(async () => {
  await clearDB();
  ({ token: adminToken } = await adminLogin(app));
  ({ token: doctorToken, user: doctorUser } = await registerUser(app, {
    name: 'Doc', email: 'doc@example.com', password: 'password123', role: 'doctor',
  }));
  ({ token: patientToken, user: patientUser } = await registerUser(app, {
    name: 'Jane', email: 'jane@example.com', password: 'password123', role: 'patient',
  }));
  ({ token: otherPatientToken, user: otherPatientUser } = await registerUser(app, {
    name: 'John', email: 'john@example.com', password: 'password123', role: 'patient',
  }));
});

async function getProfiles() {
  const me = await Patient.findOne({ userId: patientUser.id });
  const other = await Patient.findOne({ userId: otherPatientUser.id });
  const doc = await Doctor.findOne({ userId: doctorUser.id });
  return { me, other, doc };
}

describe('Appointments', () => {
  test('Requires auth', async () => {
    const res = await request(app).get('/api/appointments');
    expect(res.status).toBe(401);
  });

  test('Patient can only book for themselves', async () => {
    const { me, other, doc } = await getProfiles();

    const bad = await request(app)
      .post('/api/appointments')
      .set(auth(patientToken))
      .send({ patientId: other._id, doctorId: doc._id, date: new Date().toISOString() });
    expect(bad.status).toBe(403);

    const good = await request(app)
      .post('/api/appointments')
      .set(auth(patientToken))
      .send({ patientId: me._id, doctorId: doc._id, date: new Date().toISOString() });
    expect(good.status).toBe(201);
  });

  test('POST requires patientId, doctorId, date', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set(auth(adminToken))
      .send({});
    expect(res.status).toBe(400);
  });

  test('Doctor cannot create appointments (only patient/admin)', async () => {
    const { me, doc } = await getProfiles();
    const res = await request(app)
      .post('/api/appointments')
      .set(auth(doctorToken))
      .send({ patientId: me._id, doctorId: doc._id, date: new Date().toISOString() });
    expect(res.status).toBe(403);
  });

  test('List is scoped by role', async () => {
    const { me, other, doc } = await getProfiles();
    // Patient1 books with doctor
    await request(app).post('/api/appointments').set(auth(patientToken))
      .send({ patientId: me._id, doctorId: doc._id, date: new Date().toISOString() });
    // Admin books for patient2
    await request(app).post('/api/appointments').set(auth(adminToken))
      .send({ patientId: other._id, doctorId: doc._id, date: new Date().toISOString() });

    const adminList = await request(app).get('/api/appointments').set(auth(adminToken));
    expect(adminList.body).toHaveLength(2);

    const patientList = await request(app).get('/api/appointments').set(auth(patientToken));
    expect(patientList.body).toHaveLength(1);
    expect(String(patientList.body[0].patientId._id)).toBe(String(me._id));

    const otherList = await request(app).get('/api/appointments').set(auth(otherPatientToken));
    expect(otherList.body).toHaveLength(1);
    expect(String(otherList.body[0].patientId._id)).toBe(String(other._id));

    const docList = await request(app).get('/api/appointments').set(auth(doctorToken));
    expect(docList.body).toHaveLength(2);
  });

  test('Patient cannot fetch / cancel another patient\'s appointment', async () => {
    const { other, doc } = await getProfiles();
    const made = await request(app).post('/api/appointments').set(auth(adminToken))
      .send({ patientId: other._id, doctorId: doc._id, date: new Date().toISOString() });
    const id = made.body._id;

    const getDenied = await request(app).get(`/api/appointments/${id}`).set(auth(patientToken));
    expect(getDenied.status).toBe(403);

    const delDenied = await request(app).delete(`/api/appointments/${id}`).set(auth(patientToken));
    expect(delDenied.status).toBe(403);
  });

  test('Doctor can mark Completed; patient cannot set Completed', async () => {
    const { me, doc } = await getProfiles();
    const made = await request(app).post('/api/appointments').set(auth(patientToken))
      .send({ patientId: me._id, doctorId: doc._id, date: new Date().toISOString() });
    const id = made.body._id;

    const docUpdate = await request(app)
      .put(`/api/appointments/${id}`)
      .set(auth(doctorToken))
      .send({ patientId: me._id, doctorId: doc._id, date: new Date().toISOString(), status: 'Completed' });
    expect(docUpdate.status).toBe(200);
    expect(docUpdate.body.status).toBe('Completed');

    const patientForbidden = await request(app)
      .put(`/api/appointments/${id}`)
      .set(auth(patientToken))
      .send({ status: 'Completed' });
    expect(patientForbidden.status).toBe(403);
  });

  test('404 for missing appointment id', async () => {
    const res = await request(app)
      .get('/api/appointments/507f1f77bcf86cd799439011')
      .set(auth(adminToken));
    expect(res.status).toBe(404);
  });
});
