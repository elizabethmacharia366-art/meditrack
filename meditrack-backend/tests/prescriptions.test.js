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
  ({ token: otherPatientToken } = await registerUser(app, {
    name: 'John', email: 'john@example.com', password: 'password123', role: 'patient',
  }));
});

describe('Prescriptions', () => {
  test('Patients cannot create a prescription', async () => {
    const me = await Patient.findOne({ userId: patientUser.id });
    const res = await request(app)
      .post('/api/prescriptions')
      .set(auth(patientToken))
      .send({ patientId: me._id, diagnosis: 'flu' });
    expect(res.status).toBe(403);
  });

  test('Doctor creates prescription; doctorId is forced to the requesting doctor', async () => {
    const me = await Patient.findOne({ userId: patientUser.id });
    const docProfile = await Doctor.findOne({ userId: doctorUser.id });

    const res = await request(app)
      .post('/api/prescriptions')
      .set(auth(doctorToken))
      .send({
        patientId: me._id,
        doctorId: '507f1f77bcf86cd799439011', // attempt to spoof
        diagnosis: 'flu',
        medicines: [{ name: 'Paracetamol', dosage: '500mg', frequency: '6h' }],
      });
    expect(res.status).toBe(201);
    expect(String(res.body.doctorId._id || res.body.doctorId)).toBe(String(docProfile._id));
  });

  test('Prescription list is scoped by role', async () => {
    const me = await Patient.findOne({ userId: patientUser.id });
    await request(app).post('/api/prescriptions').set(auth(doctorToken))
      .send({ patientId: me._id, diagnosis: 'flu' });

    const myList = await request(app).get('/api/prescriptions').set(auth(patientToken));
    expect(myList.body).toHaveLength(1);

    const otherList = await request(app).get('/api/prescriptions').set(auth(otherPatientToken));
    expect(otherList.body).toHaveLength(0);

    const docList = await request(app).get('/api/prescriptions').set(auth(doctorToken));
    expect(docList.body).toHaveLength(1);

    const adminList = await request(app).get('/api/prescriptions').set(auth(adminToken));
    expect(adminList.body).toHaveLength(1);
  });

  test('Patient cannot read someone else\'s prescription', async () => {
    const me = await Patient.findOne({ userId: patientUser.id });
    const created = await request(app).post('/api/prescriptions').set(auth(doctorToken))
      .send({ patientId: me._id, diagnosis: 'flu' });

    const res = await request(app)
      .get(`/api/prescriptions/${created.body._id}`)
      .set(auth(otherPatientToken));
    expect(res.status).toBe(403);
  });

  test('Doctor can update / delete own; not someone else\'s', async () => {
    const me = await Patient.findOne({ userId: patientUser.id });
    const created = await request(app).post('/api/prescriptions').set(auth(doctorToken))
      .send({ patientId: me._id, diagnosis: 'flu' });
    const id = created.body._id;

    const upd = await request(app).put(`/api/prescriptions/${id}`)
      .set(auth(doctorToken))
      .send({ patientId: me._id, diagnosis: 'cold' });
    expect(upd.status).toBe(200);
    expect(upd.body.diagnosis).toBe('cold');

    const del = await request(app).delete(`/api/prescriptions/${id}`).set(auth(doctorToken));
    expect(del.status).toBe(200);
  });

  test('Returns 404 for missing prescription', async () => {
    const res = await request(app)
      .get('/api/prescriptions/507f1f77bcf86cd799439011')
      .set(auth(adminToken));
    expect(res.status).toBe(404);
  });
});
