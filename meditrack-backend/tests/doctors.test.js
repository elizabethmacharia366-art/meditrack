const {
  startDB, stopDB, clearDB, buildApp, request, registerUser, adminLogin, auth,
} = require('./setup');
const Doctor = require('../models/Doctors');
const Hospital = require('../models/Hospitals');

let app;
let adminToken;
let doctorToken;
let doctorUser;
let patientToken;

beforeAll(async () => {
  await startDB();
  app = buildApp();
});
afterAll(stopDB);

beforeEach(async () => {
  await clearDB();
  ({ token: adminToken } = await adminLogin(app));

  const doc = await registerUser(app, {
    name: 'Dr A', email: 'doc@example.com', password: 'password123', role: 'doctor',
  });
  doctorToken = doc.token;
  doctorUser = doc.user;

  const pat = await registerUser(app, {
    name: 'P', email: 'p@example.com', password: 'password123', role: 'patient',
  });
  patientToken = pat.token;
});

describe('Doctors', () => {
  test('GET /api/doctors requires auth', async () => {
    const res = await request(app).get('/api/doctors');
    expect(res.status).toBe(401);
  });

  test('GET /api/doctors works for any authenticated user', async () => {
    const res = await request(app).get('/api/doctors').set(auth(patientToken));
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1); // doctor auto-profile from register
  });

  test('GET /api/doctors hides pending doctors from patients', async () => {
    const pending = await request(app).post('/api/auth/register').send({
      name: 'Dr Pending',
      email: 'pending-doc@example.com',
      password: 'password123',
      role: 'doctor',
    });
    expect(pending.status).toBe(201);

    const res = await request(app).get('/api/doctors').set(auth(patientToken));
    expect(res.status).toBe(200);
    expect(res.body.some((doctor) => doctor.userId?.email === 'pending-doc@example.com')).toBe(false);
  });

  test('GET /api/doctors/me returns the logged-in doctor profile', async () => {
    const res = await request(app).get('/api/doctors/me').set(auth(doctorToken));
    expect(res.status).toBe(200);
    expect(String(res.body.userId)).toBe(doctorUser.id);
  });

  test('GET /api/doctors/me forbidden for non-doctor', async () => {
    const res = await request(app).get('/api/doctors/me').set(auth(patientToken));
    expect(res.status).toBe(403);
  });

  test('POST /api/doctors only admin can create', async () => {
    const denied = await request(app)
      .post('/api/doctors')
      .set(auth(doctorToken))
      .send({ fullName: 'New Doc' });
    expect(denied.status).toBe(403);

    const ok = await request(app)
      .post('/api/doctors')
      .set(auth(adminToken))
      .send({ fullName: 'New Doc', specialty: 'Surgery' });
    expect(ok.status).toBe(201);
    expect(ok.body.fullName).toBe('New Doc');
  });

  test('PUT /api/doctors/:id - doctor can edit own profile, not someone else\'s', async () => {
    const me = await Doctor.findOne({ userId: doctorUser.id });

    const okSelf = await request(app)
      .put(`/api/doctors/${me._id}`)
      .set(auth(doctorToken))
      .send({ fullName: 'Updated Self', specialty: 'Cardio' });
    expect(okSelf.status).toBe(200);
    expect(okSelf.body.fullName).toBe('Updated Self');

    // Create another doctor via admin
    const otherDoc = await Doctor.create({ fullName: 'Other' });
    const forbidden = await request(app)
      .put(`/api/doctors/${otherDoc._id}`)
      .set(auth(doctorToken))
      .send({ fullName: 'Hijack' });
    expect(forbidden.status).toBe(403);
  });

  test('PUT /api/doctors/:id lets doctor complete hospital contact and specialty profile', async () => {
    const me = await Doctor.findOne({ userId: doctorUser.id });
    const hospital = await Hospital.create({ name: 'City Hospital', location: 'Downtown' });

    const res = await request(app)
      .put(`/api/doctors/${me._id}`)
      .set(auth(doctorToken))
      .send({
        fullName: 'Dr A',
        specialty: 'Cardiology',
        contact: '+1 555 0100',
        hospitalId: hospital._id,
        schedule: [{ day: 'Monday', time: '09:00-13:00' }],
      });

    expect(res.status).toBe(200);
    expect(res.body.specialty).toBe('Cardiology');
    expect(res.body.contact).toBe('+1 555 0100');
    expect(res.body.hospitalId.name).toBe('City Hospital');
    expect(res.body.schedule[0].day).toBe('Monday');
  });

  test('PUT /api/doctors/:id rejects unknown hospital id', async () => {
    const me = await Doctor.findOne({ userId: doctorUser.id });

    const res = await request(app)
      .put(`/api/doctors/${me._id}`)
      .set(auth(doctorToken))
      .send({
        fullName: 'Dr A',
        specialty: 'Cardiology',
        contact: '+1 555 0100',
        hospitalId: '507f1f77bcf86cd799439011',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Hospital not found/);
  });

  test('DELETE /api/doctors/:id admin only', async () => {
    const me = await Doctor.findOne({ userId: doctorUser.id });
    const denied = await request(app)
      .delete(`/api/doctors/${me._id}`)
      .set(auth(doctorToken));
    expect(denied.status).toBe(403);

    const ok = await request(app)
      .delete(`/api/doctors/${me._id}`)
      .set(auth(adminToken));
    expect(ok.status).toBe(200);
  });

  test('GET /api/doctors/:id - 404 for missing', async () => {
    const res = await request(app)
      .get('/api/doctors/507f1f77bcf86cd799439011')
      .set(auth(adminToken));
    expect(res.status).toBe(404);
  });
});
