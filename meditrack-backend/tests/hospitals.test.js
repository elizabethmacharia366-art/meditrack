const {
  startDB, stopDB, clearDB, buildApp, request, registerUser, adminLogin, auth,
} = require('./setup');

let app;
let adminToken;
let patientToken;

beforeAll(async () => {
  await startDB();
  app = buildApp();
});
afterAll(stopDB);

beforeEach(async () => {
  await clearDB();
  ({ token: adminToken } = await adminLogin(app));
  ({ token: patientToken } = await registerUser(app, {
    name: 'P', email: 'p@example.com', password: 'password123', role: 'patient',
  }));
});

describe('Hospitals', () => {
  const sample = { name: 'Test Hospital', location: 'Nairobi', departments: ['ER'] };

  test('GET /api/hospitals is public and returns an array', async () => {
    const res = await request(app).get('/api/hospitals');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/hospitals requires auth', async () => {
    const res = await request(app).post('/api/hospitals').send(sample);
    expect(res.status).toBe(401);
  });

  test('POST /api/hospitals forbidden for non-admin', async () => {
    const res = await request(app)
      .post('/api/hospitals')
      .set(auth(patientToken))
      .send(sample);
    expect(res.status).toBe(403);
  });

  test('Admin can full CRUD a hospital', async () => {
    // Create
    const created = await request(app)
      .post('/api/hospitals')
      .set(auth(adminToken))
      .send(sample);
    expect(created.status).toBe(201);
    const id = created.body._id;

    // Read one (public)
    const one = await request(app).get(`/api/hospitals/${id}`);
    expect(one.status).toBe(200);
    expect(one.body.name).toBe(sample.name);

    // Update
    const upd = await request(app)
      .put(`/api/hospitals/${id}`)
      .set(auth(adminToken))
      .send({ ...sample, name: 'Renamed' });
    expect(upd.status).toBe(200);
    expect(upd.body.name).toBe('Renamed');

    // Delete
    const del = await request(app)
      .delete(`/api/hospitals/${id}`)
      .set(auth(adminToken));
    expect(del.status).toBe(200);

    const after = await request(app).get(`/api/hospitals/${id}`);
    expect(after.status).toBe(404);
  });

  test('GET /api/hospitals/:id with invalid id returns 400', async () => {
    const res = await request(app).get('/api/hospitals/not-an-id');
    expect(res.status).toBe(400);
  });

  test('GET /api/hospitals/:id for missing id returns 404', async () => {
    const res = await request(app).get('/api/hospitals/507f1f77bcf86cd799439011');
    expect(res.status).toBe(404);
  });
});
