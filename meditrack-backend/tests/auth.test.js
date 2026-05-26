const { startDB, stopDB, clearDB, buildApp, request, auth, adminLogin } = require('./setup');

let app;

beforeAll(async () => {
  await startDB();
  app = buildApp();
});
afterAll(stopDB);
beforeEach(clearDB);

describe('Auth', () => {
  test('POST /api/auth/register creates an approved patient pending email verification', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Jane',
      email: 'jane@example.com',
      password: 'password123',
      role: 'patient',
    });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeUndefined();
    expect(res.body.role).toBe('patient');
    expect(res.body.status).toBe('approved');
    expect(res.body.emailVerified).toBe(false);
    expect(res.body.verificationLink).toEqual(expect.any(String));
    expect(res.body.email).toBe('jane@example.com');
  });

  test('POST /api/auth/register rejects role=admin', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Hacker',
      email: 'hacker@example.com',
      password: 'password123',
      role: 'admin',
    });
    expect(res.status).toBe(403);
  });

  test('doctor registers pending, waits for admin approval, then can login without email verification', async () => {
    const admin = await adminLogin(app);
    const reg = await request(app).post('/api/auth/register').send({
      name: 'Dr. Pending',
      email: 'doctor@example.com',
      password: 'password123',
      role: 'doctor',
      specialty: 'Cardiology',
    });

    expect(reg.status).toBe(201);
    expect(reg.body.status).toBe('pending');
    expect(reg.body.pending).toBe(true);
    expect(reg.body.token).toBeUndefined();

    let login = await request(app).post('/api/auth/login').send({
      email: 'doctor@example.com',
      password: 'password123',
    });
    expect(login.status).toBe(403);
    expect(login.body.status).toBe('pending');

    const approval = await request(app)
      .post(`/api/admin/users/${reg.body.id}/approve`)
      .set(auth(admin.token));
    expect(approval.status).toBe(200);
    expect(approval.body.status).toBe('approved');
    expect(approval.body.emailVerified).toBe(true);

    login = await request(app).post('/api/auth/login').send({
      email: 'doctor@example.com',
      password: 'password123',
    });
    expect(login.status).toBe(200);
    expect(login.body.token).toEqual(expect.any(String));
  });

  test('hospital registration requires location and waits for admin approval', async () => {
    const missingLocation = await request(app).post('/api/auth/register').send({
      name: 'Metro Hospital',
      email: 'hospital@example.com',
      password: 'password123',
      role: 'hospital',
    });
    expect(missingLocation.status).toBe(400);

    const reg = await request(app).post('/api/auth/register').send({
      name: 'Metro Hospital',
      email: 'hospital@example.com',
      password: 'password123',
      role: 'hospital',
      location: 'Nairobi',
    });
    expect(reg.status).toBe(201);
    expect(reg.body.status).toBe('pending');
  });

  test('admins can reject pending users', async () => {
    const admin = await adminLogin(app);
    const reg = await request(app).post('/api/auth/register').send({
      name: 'Dr. Reject',
      email: 'reject@example.com',
      password: 'password123',
      role: 'doctor',
    });

    const rejection = await request(app)
      .post(`/api/admin/users/${reg.body.id}/reject`)
      .set(auth(admin.token))
      .send({ reason: 'Credentials could not be verified' });
    expect(rejection.status).toBe(200);
    expect(rejection.body.status).toBe('rejected');

    const login = await request(app).post('/api/auth/login').send({
      email: 'reject@example.com',
      password: 'password123',
    });
    expect(login.status).toBe(403);
    expect(login.body.status).toBe('rejected');
  });

  test('POST /api/auth/register rejects missing password', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'NoPass',
      email: 'nopass@example.com',
    });
    expect(res.status).toBe(400);
  });

  test('POST /api/auth/register rejects duplicate email', async () => {
    const body = { name: 'A', email: 'dup@example.com', password: 'password123' };
    await request(app).post('/api/auth/register').send(body);
    const res = await request(app).post('/api/auth/register').send(body);
    expect(res.status).toBe(409);
  });

  test('POST /api/auth/login succeeds after email verification', async () => {
    const reg = await request(app).post('/api/auth/register').send({
      name: 'Lo', email: 'lo@example.com', password: 'password123',
    });
    const token = new URL(reg.body.verificationLink).searchParams.get('token');
    await request(app).post('/api/auth/verify-email').send({ token });
    const res = await request(app).post('/api/auth/login').send({
      email: 'lo@example.com', password: 'password123',
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
  });

  test('POST /api/auth/login rejects selected role mismatch', async () => {
    const reg = await request(app).post('/api/auth/register').send({
      name: 'Role Check', email: 'rolecheck@example.com', password: 'password123', role: 'patient',
    });
    const token = new URL(reg.body.verificationLink).searchParams.get('token');
    await request(app).post('/api/auth/verify-email').send({ token });

    const res = await request(app).post('/api/auth/login').send({
      email: 'rolecheck@example.com',
      password: 'password123',
      role: 'doctor',
    });
    expect(res.status).toBe(403);
  });

  test('POST /api/auth/login fails with wrong password', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Lo', email: 'lo@example.com', password: 'password123',
    });
    const res = await request(app).post('/api/auth/login').send({
      email: 'lo@example.com', password: 'wrong',
    });
    expect(res.status).toBe(401);
  });

  test('POST /api/auth/admin-login authenticates an existing admin', async () => {
    const res = await adminLogin(app, 'admin@example.com');
    expect(res.user.role).toBe('admin');
    expect(res.token).toEqual(expect.any(String));
  });

  test('POST /api/admin/admins lets an existing admin create another admin', async () => {
    const admin = await adminLogin(app);
    const res = await request(app)
      .post('/api/admin/admins')
      .set(auth(admin.token))
      .send({ name: 'Second Admin', email: 'second@example.com', password: 'password123' });
    expect(res.status).toBe(201);
    expect(res.body.role).toBe('admin');
    expect(res.body.status).toBe('approved');
  });

  test('POST /api/auth/admin-login rejects wrong secret', async () => {
    const res = await request(app).post('/api/auth/admin-login').send({
      email: 'admin@example.com', password: 'wrong',
    });
    expect(res.status).toBe(401);
  });

  test('GET /api/auth/me requires auth', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('GET /api/auth/me returns the current user with a valid token', async () => {
    const reg = await request(app).post('/api/auth/register').send({
      name: 'Me', email: 'me@example.com', password: 'password123',
    });
    const token = new URL(reg.body.verificationLink).searchParams.get('token');
    await request(app).post('/api/auth/verify-email').send({ token });
    const login = await request(app).post('/api/auth/login').send({
      email: 'me@example.com', password: 'password123',
    });
    const res = await request(app).get('/api/auth/me').set(auth(login.body.token));
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('me@example.com');
  });

  test('PUT /api/auth/me updates current user profile', async () => {
    const reg = await request(app).post('/api/auth/register').send({
      name: 'Old Name', email: 'oldname@example.com', password: 'password123',
    });
    const verifyToken = new URL(reg.body.verificationLink).searchParams.get('token');
    await request(app).post('/api/auth/verify-email').send({ token: verifyToken });
    const login = await request(app).post('/api/auth/login').send({
      email: 'oldname@example.com', password: 'password123',
    });

    const res = await request(app)
      .put('/api/auth/me')
      .set(auth(login.body.token))
      .send({ name: 'New Name' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('New Name');
  });
});
